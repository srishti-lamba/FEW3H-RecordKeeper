// 0: Main Mission Start
// 1: Main Mission Updated
// 2: Main Mission Completed
// 3: Side Mission Start
// 4: Side Mission Completed
// 5: Report! (Blue)
// 6: Report! (Yellow)
// 7: Warning!

import { JSX, useContext, useEffect, useRef, useState } from "react";
import { DatabaseContext, BattlesTableContext, MissionsTableContext, Dictionary } from "../../context";
import {
    MaterialReactTable,
    useMaterialReactTable,
    createMRTColumnHelper,
    MRT_DisplayColumnDef,
    MRT_Row,
} from 'material-react-table';

export interface MissionRow {
    id?: string;
    type: string|null;
    text: string;
    prereq?: string;
    notes?: string;
    subRows?: MissionRow[];
}

export interface TextRefType {
    title ?: string;
    main ?: (string | JSX.Element)[];
    prereq ?: (string | JSX.Element)[];
    notes ?: (string | JSX.Element)[];
    mainPlain ?: string;
}

interface MissionsProps { 
    isTableWidthFull : boolean;
    tableHeight : string;
}

export function Missions({ isTableWidthFull: tableWidthFull, tableHeight }: MissionsProps) {

    const allBattles = useContext(DatabaseContext).battles
    const selectedBattleRow = useContext(BattlesTableContext).selectedRow![0];

    const table = useContext(MissionsTableContext).table!;
    const [selectedMissionRow, setSelectedMissionRow] = useContext(MissionsTableContext).selectedRow!;
    const textRef = useContext(MissionsTableContext).text!;

    const [data, setData] = useState<MissionRow[]>([]);

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

        const recursive = ( row: MissionRow, index: number, parentID: string|undefined, ) => {
            row.id = `${parentID}${(parentID!=="")?"-":""}${index}`

            if (row.subRows !== undefined) {
                let subIndex : number = 0.0;
                row.subRows.forEach( 
                    (subRow : MissionRow) => {
                        // If subRow is group
                        if (subRow.type === null) {
                            subIndex = Math.round((subIndex + 0.1) * 1e12) / 1e12;
                            recursive(subRow, subIndex, row.id)
                        }
                        else {
                            recursive(subRow, subIndex, row.id)
                            subIndex = Math.round((subIndex + 1.0) * 1e12) / 1e12;
                        }
                        // Next subRows
                        
                    }
                )
            }
        }

        data.forEach( (row : MissionRow, index : number) => {
            recursive(row, index, "");
        } )
        console.log(data);
        return data;
    }

    const getClassName = (row : MRT_Row<MissionRow>) => {
        let levels = row.id.split("-").length;
        if (levels == 1) return "main-row"
        else return `sub-row-${levels}`
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
                filterSelectOptions: Array.from(new Set(Object.values(title))),
                enableColumnFilter: true,
                filterFn: (row, id, filterValue: string[]) => {
                    if (filterValue.length == 0)
                        return true
                    if (row.original.type === null)
                        return false
                    // console.log(`[filterValue: [${filterValue}]] [type: ${title[row.original.type]}]`)
                    let equals = false
                    filterValue.forEach((filter: string) => {
                        if (title[row.original.type!] === filter)
                            equals = true
                    })
                    return equals
                },
                Cell: ({ row }) => {
                    let curText = initializeMissionTextRef(row, textRef)
                    if (curText === undefined) return;
                    if (row.getIsSelected()) {
                        if (row.original.prereq !== undefined && curText.prereq === undefined)
                            curText.prereq = formatText(row.original.prereq)
                        if (row.original.notes !== undefined && curText.notes === undefined)
                            curText.notes = formatText(row.original.notes)
                    }
                    return (
                        <div className={`mission-table-row type-${row.original.type}`}>
                            <div className="mission-table-row-main-wrapper">
                                <div className="mission-table-row-main">
                                    <div
                                        className="mission-table-row-main-title"
                                    >
                                        {curText.title}
                                    </div>
                                    <div
                                        className="mission-table-row-main-text"
                                    >
                                        {
                                            (
                                                table.current?.getState().globalFilter !== undefined &&
                                                table.current?.getState().globalFilter.length !== 0
                                            ) &&
                                            getSearchedText(curText.mainPlain, table.current?.getState().globalFilter)
                                        }
                                        <span className="mission-table-row-main-text-display">
                                            {curText.main}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {
                                // Show details only if has details
                                (
                                    row.original.prereq !== undefined ||
                                    row.original.notes !== undefined
                                ) &&
                                <div 
                                    className="mission-table-row-details-wrapper"
                                    key={`mission-table-row-details-wrapper-${row.original.id}`}
                                    style={{
                                        maxHeight: (row.getIsSelected() ? "500px" : "0"),
                                        padding: (row.getIsSelected() ? "var(--padding)" : "0"),
                                        marginTop: (row.getIsSelected() ? "calc(var(--gap) / 2)" : "0")
                                    }}
                                    onClick={(event) => { // Prevent clicking this div causing row to be unselected
                                        event.stopPropagation();
                                        event.preventDefault();
                                    }}
                                >
                                    <div className="mission-table-row-details">
                                        {
                                            (row.original.prereq !== undefined) &&
                                            <div className="mission-table-row-details-row">
                                                <span className="header-brown-underlined">Prerequisites</span>
                                                <span className="mission-table-row-details-row-info">{curText.prereq}</span>
                                            </div>
                                        }
                                        {
                                            (row.original.notes !== undefined) &&
                                            <div className="mission-table-row-details-row">
                                                <span className="header-brown-underlined">Notes</span>
                                                <span className="mission-table-row-details-row-info">{curText.notes}</span>
                                            </div>
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    )
                }
            }
        ),
    ];

    // -------------
    // --- Table ---
    // -------------

    table.current = useMaterialReactTable({
        columns,
        data,
        enablePagination: false,
        enableBottomToolbar: false,
        enableDensityToggle: false,
        enableColumnResizing: false,
        enableHiding: false,
        layoutMode: 'semantic',
        enableFacetedValues: true,
        initialState: { 
            density: 'compact',
        },
        muiTablePaperProps: ({ table }) => ({
            id: "missions-table",
            className: (table.getState().isFullScreen) ? "full-screen" : "",
            sx: {
                "overflow-y" : (tableWidthFull) ? "visible" : "scroll",
                "max-height" : (tableWidthFull) ? "auto" : tableHeight,
            }
        }),
        getRowId: (originalRow: MissionRow, index: number, parent?: MRT_Row<MissionRow>) => originalRow.id!,
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () =>
                setSelectedMissionRow((prev : any) => {
                // Row was selected previously
                if (prev[row.id!] !== undefined) {
                    return {};
                }
                // Row not selected previously
                else {
                    return {[row.id!]: true};
                }
                }),
            selected: selectedMissionRow[row.id],
            // className: getClassName(row),
            className: row.parentId === undefined ? "main-row" : "sub-row",
            id: `missionTable-row-${row.id}`,
            sx: {
                cursor: 'pointer',
                "--level" : row.id.split("-").length
            },
        }),
        enableRowSelection: false,
        enableMultiRowSelection: false,
        positionToolbarAlertBanner: 'none',
        onRowSelectionChange: setSelectedMissionRow,
        state: { rowSelection: selectedMissionRow },
        displayColumnDefOptions: {
            'mrt-row-expand': {
                minSize: 1,
                size: 1,
                maxSize: 1,
                grow: false,
            } as Partial<MRT_DisplayColumnDef<MissionRow, unknown>>,
        },
        filterFromLeafRows: true,
        enableExpanding: true,
        enableExpandAll: true,
        getRowCanExpand: (row) => row.original.subRows !== undefined,
        getSubRows: (row) => row.subRows, 
        enableGlobalFilter: true,
        filterFns: {
            searchMainText: (row, id, filterValue) => {
                let txt : TextRefType|undefined = textRef.current[row.original.id]
                if (txt === undefined)
                    txt = initializeMissionTextRef(row, textRef)
                let plainText = txt!.mainPlain
                if (plainText === undefined) return false;
                return plainText.toLowerCase().includes(filterValue);
            }
        },
        globalFilterFn: 'searchMainText',
        enableKeyboardShortcuts: false,
    });

    if ((Object.keys(selectedBattleRow).length == 0) || (data.length == 0))
        return <></>

    console.log(table.current.getState())

    return (
        <MaterialReactTable table={table.current} />
    )

}

// ------------------------
// --- Helper Functions ---
// ------------------------

export const title: Dictionary<string> = {
    "ms": "Main Mission Start",
    "mc": "Main Mission Changed",
    "me": "Main Mission Successful",
    "ss": "Side Mission Start",
    "se": "Side Mission Successful",
    "rb": "Report!",
    "ry": "Report!",
    "w": "Warning!"
};

export const initializeMissionTextRef = (row : any, ref : React.RefObject<Dictionary<TextRefType>>) => {
    let idStr = row.original.id;
    // if (mission === undefined)
    //     return;
    // let idStr : string = mission.join("-")
    let curText = ref.current[idStr]
    if (curText === undefined)
        curText = {
            title : title[row.original.type],
            main : formatText(row.original.text),
            mainPlain : row.original.text.replaceAll(/(\[blue]|\[\/blue]|\[green]|\[\/green]|\[red]|\[\/red]|\[yellow]|\[\/yellow]|<\/ul>|<ul>|\<\/li>|\<li>)/g, "")
        }
    ref.current[idStr] = curText
    return curText;
}

export const formatText = (text: string) => {
    let result: [boolean, string | JSX.Element][] = [[true, text]];
    let colourFormattings = ["blue", "green", "red", "yellow"];

    let changedThisLoop = true;

    // Colours
    while (changedThisLoop) {
        changedThisLoop = false;

        colourFormattings.forEach((keyword: string) => {
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
            }) // result forEach
        }) // colourFormattings forEach
    } // changedThisLoop while

    // Lists
    changedThisLoop = true;
    let ulStart = `<ul>`;
    let ulEnd = `</ul>`;
    let startUlIndex = -1;
    let endUlIndex = -1;

    let liStart = `<li>`;
    let liEnd = `</li>`;
    let startLiIndex = -1;
    let endLiIndex = -1;

    for (let index = 0; index < result.length; index++) {
        var [isString, val] = result[index];
        if (!isString)
            continue;
        let txt = String(val)

        // Find List Item end
        if (startLiIndex !== -1 && endLiIndex === -1) {
            let endLiIndex_s = txt.indexOf(liEnd)
            if (endLiIndex_s !== -1) {
                result = textFormatterHelper_listResultModifyElement(
                    "li", result, txt, startLiIndex, index, endLiIndex_s);
                index = startLiIndex;
                startLiIndex = -1;
                endLiIndex = -1;
                continue;
            }
        }

        // Find Unordered List end
        if (startUlIndex !== -1 && endUlIndex === -1) {
            let endUlIndex_s = txt.indexOf(ulEnd)
            if (endUlIndex_s !== -1) {
                result = textFormatterHelper_listResultModifyElement(
                    "ul", result, txt, startUlIndex, index, endUlIndex_s);
                index = startUlIndex;
                startUlIndex = -1;
                endUlIndex = -1;
                continue;
            }
        }

        // Find Unordered List start
        if (startUlIndex === -1) {
            let startUlIndex_s = txt.indexOf(ulStart)
            if (startUlIndex_s !== -1) {
                // Unordered List start found
                [result, index, startUlIndex] = textFormatterHelper_listResultModifyText(
                    ulStart, result, index, txt, startUlIndex_s);
                continue;
            }
        }

        // Find List Item start
        if (startLiIndex === -1) {
            let startLiIndex_s = txt.indexOf(liStart)
            if (startLiIndex_s !== -1) {
                // List Item start found
                [result, index, startLiIndex] = textFormatterHelper_listResultModifyText(
                    liStart, result, index, txt, startLiIndex_s);
                continue;
            }
        }
    } // for
    return result.map(val=>val[1]);
}

const textFormatterHelper_listResultModifyText = 
(
    keyword : string,
    result: [boolean, string | JSX.Element][], 
    index : number, txt : string, 
    index_s : number
) => {
    let startIndex = index
    if (index_s !== 0)
        startIndex = index+1;
    let index_e = index_s + keyword.length;

    let before = txt.substring(0, index_s);
    let after = txt.substring(index_e, txt.length);

    let newResult : [boolean, string | JSX.Element][] = [...result.slice(0, index)];
    if (before.length > 0)
        newResult.push([true, before])
    if (after.length > 0)
        newResult.push([true, after])
    newResult = [...newResult, ...result.slice(index + 1)]

    return [newResult, index, startIndex] as [[boolean, string | JSX.Element][], number, number]; 
}

const textFormatterHelper_listResultModifyElement = 
(
    element : string,
    result : [boolean, string | JSX.Element][], 
    txt : string,
    startIndex : number, endIndex : number,
    index_s : number
) => {
    let index_e = index_s + element.length + 3;

    let before = txt.substring(0, index_s);
    let after = txt.substring(index_e, txt.length);

    let middleChildren = result.slice(startIndex, endIndex).map(val=>val[1]);
    if (before.length > 0)
        middleChildren.push(before)

    let middle : JSX.Element|undefined = undefined;
    if (element === "li")
        middle = <li>{middleChildren}</li>
    if (element === "ul")
        middle = <ul>{middleChildren}</ul>

    let newResult : [boolean, string | JSX.Element][] = [
        ...result.slice(0, startIndex),
        [false, middle as JSX.Element]
    ];
    if (after.length > 0)
        newResult.push([true, after])
    newResult = [ ...newResult, ...result.slice(endIndex + 1) ]

    return newResult
}

const getSearchedText = (text : string|undefined, search : string|undefined) => {
    if (text === undefined || search === undefined)
        return <></>

    let start = text.toLowerCase().indexOf(search);
    if (start === -1) return <></>

    let end = start + search.length;

    return (
        <span className="mission-table-row-main-text-searched">
            {text.substring(0, start)}
            <span className="found">{text.substring(start, end)}</span>
        </span>
    )
}