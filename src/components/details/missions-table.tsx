// 0: Main Mission Start
// 1: Main Mission Updated
// 2: Main Mission Completed
// 3: Side Mission Start
// 4: Side Mission Completed
// 5: Report! (Blue)
// 6: Report! (Yellow)
// 7: Warning!

import { useContext, useEffect, useState } from "react";
import { DatabaseContext, SelectedBattleRowContext } from "../../context";
import {
  MaterialReactTable,
  useMaterialReactTable,
  createMRTColumnHelper,
  MRT_RowSelectionState
} from 'material-react-table';

interface Dictionary<T> {
    [key: string]: T;
}

export interface MissionRow {
  id ?: number;
  type : string;
  text : string;
  prereq ?: string;
  notes ?: string;
  subRows?: MissionRow[];
}

interface MissionsProps {}

export function Missions( {} : MissionsProps ) {

  const allBattles = useContext(DatabaseContext).battles
  const selectedBattleRow = useContext(SelectedBattleRowContext)![0][0];
  const [ selectedMissionRow, setSelectedMissionRow ] = useState<MRT_RowSelectionState>({});
  const [ data, setData ] = useState<MissionRow[]>([]);
  const title : Dictionary<string> = {
    "ms" : "Main Mission Start",
    "mu" : "Main Mission Updated",
    "mc" : "Main Mission Completed",
    "ss" : "Side Mission Start",
    "sc" : "Side Mission Completed",
    "rb" : "Report!",
    "ry" : "Report!",
    "w" : "Warning!"
  };

  console.log("Missions Start")

  useEffect(() => {
    // No battleRow selected
    if (Object.keys(selectedBattleRow).length == 0)
      return
    // battleRow is selected
    let index = Number(Object.keys(selectedBattleRow)[0]);
    setData(allBattles![index].general.missions)
  }, [selectedBattleRow])

  useEffect(() => {
    console.log("Missions")
    console.log(data)
  }, [data])

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
      enableResizing: false,
      Cell: ( {row} ) => {
        return(
          <div className="mission-table-row">
            <div
              className="mission-table-row-title"
            >
              {title[row.original.type]}
            </div>
            <div
              className="mission-table-row-text"
            >
              {row.original.text}
            </div>
          </div>
        )
      }
    }
  ),
  // // === Chapter ===
  // columnHelper.accessor('chapter', 
  //   {
  //     header: 'Chapter',
  //     size: 220,
  //   }
  // ),
  // // === Level ===
  // columnHelper.accessor((row : BattleRow) => Number(row.level), 
  //   {
  //     id: "level", 
  //     header: 'Level',
  //     size: 110,
  //     filterVariant: 'range-slider',
  //     filterFn: 'betweenInclusive', // default (or between)
  //       muiFilterSliderProps: {
  //         marks: false,
  //         step: 1,
  //       }, 
  //     muiTableBodyCellProps: {
  //       align: 'center',
  //     },
  //   }
  // ),
  // // === Mission ===
  // columnHelper.accessor('mission', {header: 'Mission'}),
  ];

  // -------------
  // --- Table ---
  // -------------
  
  const table = useMaterialReactTable({
    columns,
    data,
    enablePagination: false,
    enableBottomToolbar: false,
    enableDensityToggle: false,
    enableColumnResizing: true,
    layoutMode: 'semantic',
    enableFacetedValues: true,
    initialState: { density: 'compact' },
    muiTablePaperProps: ({ table }) => ({
      className: 'missions-table'
    }),
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {},
      selected: selectedMissionRow[row.id],
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
        enableResizing: true,
        minSize: 5,
        size: 5,
      },
    },
    enableExpanding: true,
    enableExpandAll: true,
    getSubRows: (row) => row.subRows,
  });

  if (Object.keys(selectedBattleRow).length == 0)
    return <></>

  return (
    <MaterialReactTable table={table} />
  )

}