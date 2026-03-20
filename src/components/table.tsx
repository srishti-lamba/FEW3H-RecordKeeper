import React, {useEffect, useState, useRef, useContext} from 'react';
import { RouteChapters, Chapter } from './settings/settings-chapters';

import {
  MaterialReactTable,
  useMaterialReactTable,
  createMRTColumnHelper,
} from 'material-react-table';
import { DifficultyContext, DatabaseContext, BattlesTableContext } from '../context';
import { MissionRow } from './details/missions-table';

export interface BattleRow {
  id : number;
  route : string;
  chapter : string;
  level : number | undefined;
  mission : string;
  type: number;
}

export interface Battle {
  general : { 
    route : number;
    chapter : number;
    name : string;
    type : number;
    level : {
      easy: number,
      normal: number,
      hard: number,
      maddening?: number,
    };
    deploy: number,
    territory: string,
    description: string,
    victory: any[],
    defeat: any[],
    restriction: string,
    strategy: any[],
    missions: MissionRow[],
    notes: string
  };
  "s-rank" : {
    time : number,
    defeat : number,
    damage : number
  };
}

interface TableProps {}

export default function Table( {} : TableProps) {

  const [ data, setData ] = useState<BattleRow[]>([])
  const allBattles = useContext(DatabaseContext).battles;
  const allChapters = useContext(DatabaseContext).chapters;
  const difficulty = useContext(DifficultyContext)[0];
  const table = useContext(BattlesTableContext).table!;
  const [selectedRow, setSelectedRow] = useContext(BattlesTableContext).selectedRow!;
  
  // const selectedRowData = 
  // (
  //   useContext(BattlesTableContext).table?.current !== undefined && 
  //   Object.keys(useContext(BattlesTableContext).table!.current!.getState().rowSelection).length > 0 
  // ) 
  //   ? useContext(BattlesTableContext).table!.current!.getRow()
  //   : undefined
  // const [[selectedRow, setSelectedRow], selectedRowData] = useContext(BattlesTableContext)!;

  // -------------------
  // --- Create Data ---
  // -------------------
  function createData() : void {
    console.log("Starting Create Table Data");

    if (data.length !== 0)
      return;

    let rows : BattleRow[] = [];

    allBattles?.forEach( (entry, index) => {
      // Skip first entry
      // if (index == 0)
      //   return;

      let row : BattleRow = {id:0,route:"",chapter:"",level:0,mission:"",type:0};

      // ID
      try { row.id = index; }
      catch (e: unknown) { caughtError(e); row.id = -1; }

      // Route
      try { row.route = allChapters![entry.general.route].route; }
      catch (e: unknown) { caughtError(e); row.route = "-"; }
      
      // Chapter
      try {
        let ch : Chapter = allChapters![entry.general.route].chapters[entry.general.chapter]
        row.chapter = String(ch.number).padStart(2, "0") + ": " + ch.name; 
      }
      catch (e: unknown) { caughtError(e); row.chapter = "-"; }

      // Level
      try { 
        switch (difficulty) {
          case 0: row.level = entry.general.level.easy; break;
          case 1: row.level = entry.general.level.normal; break;
          case 2: row.level = entry.general.level.hard; break;
          case 3:
            if (entry.general.level.maddening == null)
              row.level =  entry.general.level.normal + 100;
            else
              row.level =  entry.general.level.maddening;
            break;
             
        }
      }
      catch (e: unknown) { caughtError(e); row.level = 999; }

      // Mission
      try { row.mission = entry.general.name }
      catch (e: unknown) { caughtError(e); row.mission = "-"; }

      // Type
      try { row.type = entry.general.type }
      catch (e: unknown) { caughtError(e); row.type = 0; }

      rows.push(row);

    })

    console.log("Table Data: ")
    console.log(rows)
    setData(rows);
    
  }

  // ---------------------
  // --- Update Levels ---
  // ---------------------
  function updateLevels() {

    // console.log("Started Update Levels");

    if (data.length == 0)
      return;

    let rows : BattleRow[] = Array.from(data);

    rows.forEach( (row : BattleRow) => {
      try { 
        switch (difficulty) {
          case 0: row.level = allBattles![row.id].general.level.easy; break;
          case 1: row.level = allBattles![row.id].general.level.normal; break;
          case 2: row.level = allBattles![row.id].general.level.hard; break;
          case 3: 
            if (allBattles![row.id].general.level.maddening == undefined)
              row.level =  allBattles![row.id].general.level.normal + 100;
            else
              row.level =  allBattles![row.id].general.level.maddening;
            break;
        }
      }
      catch (e: unknown) { caughtError(e); row.level = 999; }
    })

    setData(rows);

  }

  // ---------------
  // --- Columns ---
  // ---------------

  const columnHelper = createMRTColumnHelper<BattleRow>();

  const columns = [
  columnHelper.accessor(
    // === Route ===
    'route', 
    {
      header: 'Route',
      filterVariant: 'multi-select',
      filterSelectOptions: [allChapters![0].route, allChapters![1].route, allChapters![2].route, allChapters![3].route],
      Cell: ( {row} ) => {
        let src : string = "";
        switch (row.original.route) {
          case allChapters![0].route: src = "https://static.wikia.nocookie.net/fireemblem/images/6/64/Resistance_crest.png"; break;
          case allChapters![1].route: src = "https://static.wikia.nocookie.net/fireemblem/images/0/08/Adrestian_crest.png"; break;
          case allChapters![2].route: src = "https://static.wikia.nocookie.net/fireemblem/images/a/ac/Faerghus_crest.png"; break;
          case allChapters![3].route: src = "https://static.wikia.nocookie.net/fireemblem/images/b/b1/Leicester_crest.png"; break;
        }
        return(
          <>
            <img 
              alt={row.original.route}
              src={src}
             />
            <span>{row.original.route}</span>
          </>
        )
      }
    }
  ),
  // === Chapter ===
  columnHelper.accessor('chapter', 
    {
      header: 'Chapter',
      size: 220,
    }
  ),
  // === Level ===
  columnHelper.accessor((row : BattleRow) => Number(row.level), 
    {
      id: "level", 
      header: 'Level',
      size: 110,
      filterVariant: 'range-slider',
      filterFn: 'betweenInclusive', // default (or between)
        muiFilterSliderProps: {
          marks: false,
          step: 1,
        }, 
      muiTableBodyCellProps: {
        align: 'center',
      },
    }
  ),
  // === Mission ===
  columnHelper.accessor('mission', {header: 'Mission'}),
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
    enableColumnOrdering: true,
    enableColumnResizing: true,
    layoutMode: 'grid-no-grow',
    enableFacetedValues: true,
    initialState: { density: 'compact' },
    muiTablePaperProps: ({ table }) => ({
      className: 'battles-table'
    }),
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () =>
        setSelectedRow((prev : any) => {
          // Row was selected previously
          if (prev[row.id] !== undefined) {
            // selectedRowData.current = undefined;
            return {};
          }
          // Row not selected previously
          else {
            // selectedRowData.current = row;
            return {[row.id]: true};
          }
        }),
      selected: selectedRow[row.id],
      className: row.original.type == 0 ? "side-mission" : "main-mission",
      sx: {
        cursor: 'pointer',
      },
    }),
    enableRowSelection: false,
    enableMultiRowSelection: false,
    positionToolbarAlertBanner: 'none',
    onRowSelectionChange: setSelectedRow,
    state: { rowSelection: selectedRow },
  });

  // Run once
  useEffect(() => {
    createData()
  }, [])

  useEffect(() => {
    updateLevels()
  }, [difficulty])

  // useEffect(() => {
  //   console.log("Selected row changed");
  //   console.log(selectedRow);
  // }, [selectedRow])

  function caughtError( e : unknown ) : void {
    if (typeof e === "string") { 
      console.log(e.toUpperCase())
    } else if (e instanceof Error) {
      console.log(e.message)
    }
  }

  return (
    <div id="left-pane-contents">
      <MaterialReactTable table={table.current} />
    </div>
  )
}
