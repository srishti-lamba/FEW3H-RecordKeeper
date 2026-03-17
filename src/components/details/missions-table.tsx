// 0: Main Mission Start
// 1: Main Mission Updated
// 2: Main Mission Completed
// 3: Side Mission Start
// 4: Side Mission Completed
// 5: Report! (Blue)
// 6: Report! (Yellow)
// 7: Warning!

import { JSX, useContext, useEffect, useState } from "react";
import { DatabaseContext, SelectedBattleRowContext } from "../../context";
import {
    MaterialReactTable,
    useMaterialReactTable,
    createMRTColumnHelper,
    MRT_RowSelectionState,
    MRT_DisplayColumnDef,
    MRT_Row,
} from 'material-react-table';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandMore';

interface Dictionary<T> {
    [key: string]: T;
}

export interface MissionRow {
    id?: string;
    type: string;
    text: string;
    prereq?: string;
    notes?: string;
    subRows?: MissionRow[];
}

interface MissionsProps { }

export function Missions({ }: MissionsProps) {

    const allBattles = useContext(DatabaseContext).battles
    const selectedBattleRow = useContext(SelectedBattleRowContext)![0][0];
    const [selectedMissionRow, setSelectedMissionRow] = useState<MRT_RowSelectionState>({});
    const [data, setData] = useState<MissionRow[]>([]);
    const title: Dictionary<string> = {
        "ms": "Main Mission Start",
        "mu": "Main Mission Updated",
        "mc": "Main Mission Completed",
        "ss": "Side Mission Start",
        "sc": "Side Mission Completed",
        "rb": "Report!",
        "ry": "Report!",
        "w": "Warning!"
    };

    console.log("Missions Start")

    useEffect(() => {
        // No battleRow selected
        if (Object.keys(selectedBattleRow).length == 0)
            return
        // battleRow is selected
        let index = Number(Object.keys(selectedBattleRow)[0]);
        setData(addDataIDs(allBattles![index].general.missions))
    }, [selectedBattleRow])

    useEffect(() => {
        console.log("Missions")
        console.log(data)
    }, [data])

    // ------------------------
    // --- Helper Functions ---
    // ------------------------

    const addDataIDs = ( data : MissionRow[] ) => {
        data.forEach( (row : MissionRow, index : number) => {
            // Main rows
            row.id = `${index}`;
            
            // Sub rows
            if (row.subRows !== undefined)
                row.subRows.forEach( 
                    (subRow : MissionRow, subIndex : number) => subRow.id = `${index}-${subIndex}` 
                )
        } )
        return data;
    }

    const formatText = (text: string) => {
        let result: [boolean, string | JSX.Element][] = [[true, text]];
        let formattings = ["blue", "green", "red", "yellow"];

        let changedThisLoop = true;

        while (changedThisLoop) {
            changedThisLoop = false;

            formattings.forEach((keyword: string) => {
                let start = `[${keyword}]`;
                let end = `[/${keyword}]`;

                result.forEach(([isString, val], index) => {
                    if (!isString)
                        return
                    let txt = String(val)
                    // Find keywords
                    let startIndex_s = txt.indexOf(start)
                    if (startIndex_s === -1)
                        return
                    let endIndex_s = txt.indexOf(end)
                    if (endIndex_s === -1)
                        return
                    // Found
                    changedThisLoop = true;
                    let startIndex_e = startIndex_s + start.length;
                    let endIndex_e = endIndex_s + end.length

                    // Parts
                    let before = txt.substring(0, startIndex_s);
                    let middle = txt.substring(startIndex_e, endIndex_s);
                    let after = txt.substring(endIndex_e, txt.length);

                    result = [
                        ...result.slice(0, index),
                        [true, before],
                        [
                            false,
                            (
                                <span className={`mission-table-row-text-${keyword}`}>
                                    {middle}
                                </span>
                            )
                        ],
                        [true, after],
                        ...result.slice(index + 1),
                    ]

                    // console.log(`[keyword: "${keyword}"] [before: "${txt.substring(0, startIndex_s)}"] [start: "${txt.substring(startIndex_s, startIndex_e)}"] [middle: "${txt.substring(startIndex_e, endIndex_s)}"] [end: "${txt.substring(endIndex_s, endIndex_e)}"] [after: "${txt.substring(endIndex_e, txt.length)}"]`)

                }) // result forEach
            }) // formattings forEach
        } // changedThisLoop while
        return result;
    }

    // ---------------
    // --- Columns ---
    // ---------------

    const columnHelper = createMRTColumnHelper<MissionRow>();

    const columns = [
        columnHelper.accessor(
            // === Missions ===
            'type',
            {
                header: 'Missions',
                filterVariant: 'multi-select',
                filterSelectOptions: Object.values(title),
                filterFn: (row, id, filterValue: string[]) => {
                    if (filterValue.length == 0)
                        return true
                    // console.log(filterValue)
                    console.log(`[filterValue: [${filterValue}]] [type: ${title[row.original.type]}]`)
                    let equals = false
                    filterValue.forEach((filter: string) => {
                        // console.log(`   [filter: ${filter}] [result: ${title[row.original.type] === filter}]`)
                        if (title[row.original.type] === filter)
                            equals = true
                    })
                    return equals
                },
                enableResizing: false,
                Cell: ({ row }) => {
                    // formatText(row.original.text);
                    return (
                        <div className="mission-table-row">
                            <div
                                className="mission-table-row-title"
                            >
                                {title[row.original.type]}
                            </div>
                            <div
                                className="mission-table-row-text"
                            >
                                {/* {row.original.text} */}
                                {formatText(row.original.text)}
                            </div>
                        </div>
                    )
                }
            }
        ),
    ];

    // -------------
    // --- Table ---
    // -------------

    const table = useMaterialReactTable({
        columns,
        data,
        icons: {
            // ExpandMoreIcon: (props: any) =>  null
        },
        enablePagination: false,
        enableBottomToolbar: false,
        enableDensityToggle: false,
        enableColumnResizing: false,
        layoutMode: 'semantic',
        enableFacetedValues: true,
        initialState: { 
            density: 'compact',
            // columnVisibility: {
            //     "mrt-row-expand": false,
            // },
        },
        muiTablePaperProps: ({ table }) => ({
            className: 'missions-table'
        }),
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => { },
            selected: selectedMissionRow[row.id],
            className: row.parentId === undefined ? "main-row" : "sub-row",
            // className: row.original.type == 0 ? "side-mission" : "main-mission",
            sx: {
                cursor: 'pointer',
            },
        }),
        enableRowSelection: false,
        enableMultiRowSelection: false,
        positionToolbarAlertBanner: 'none',
        onRowSelectionChange: setSelectedMissionRow,
        state: { rowSelection: selectedMissionRow },
        displayColumnDefOptions: {
            'mrt-row-expand': {
                enableResizing: false,
                minSize: 20,
                size: 20,
                maxSize: 20,
                grow: false,
                // icons : (row: MRT_Row<MissionRow>) => (row.original.subRows === undefined || row.original.subRows.length === 0) ? undefined : (row.getIsExpanded()) ? <ExpandMoreIcon /> : <ExpandLessIcon />,
                // Cell: (props) => (props.row.original.subRows === undefined || props.row.original.subRows.length === 0) ? undefined : (props.row.getIsExpanded()) ? <ExpandMoreIcon onClick={() => {props.row.toggleExpanded(true)}} /> : <ExpandLessIcon />,
            } as Partial<MRT_DisplayColumnDef<MissionRow, unknown>>,
        },
        enableExpanding: true,
        enableExpandAll: true,
        getRowCanExpand: (row) => row.original.subRows !== undefined,
        getSubRows: (row) => row.subRows,
        // muiExpandButtonProps : ({ row, staticRowIndex, table }) => ({
        //     children: (row.original.subRows === undefined) ? ExpandMoreIcon : undefined
        // })
    });

    if (Object.keys(selectedBattleRow).length == 0)
        return <></>

    return (
        <MaterialReactTable table={table} />
    )

}