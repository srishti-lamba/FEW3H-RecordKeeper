// 0: Main Mission Start
// 1: Main Mission Updated
// 2: Main Mission Completed
// 3: Side Mission Start
// 4: Side Mission Completed
// 5: Report! (Blue)
// 6: Report! (Yellow)
// 7: Warning!

import React, {useEffect, useState, useRef} from 'react';
import { RouteChapters, Chapter } from './settings-chapters';

import {
  MaterialReactTable,
  useMaterialReactTable,
  createMRTColumnHelper,
  MRT_RowSelectionState,
} from 'material-react-table';

interface Row {
  id : number;
  route : string;
  chapter : string;
  level : number | undefined;
  mission : string;
}

interface Mission {
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
    log: any[],
    notes: string
  };
  "s-rank" : {
    time : number,
    defeat : number,
    damage : number
  };
}

interface TableProps {
  allMissions : Mission[]
  allChapters : RouteChapters[];
  difficulty : number;
}

export default function Table( {allMissions, allChapters, difficulty} : TableProps) {

  const [ data, setData ] = useState<Row[]>([])
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  
  function createData() : void {
    console.log("Starting Create Table Data");

    if (data.length !== 0)
      return;

    let rows : Row[] = [];

    allMissions.forEach( (entry, index) => {
      // Skip first entry
      if (index == 0)
        return;

      let row : Row = {id:0,route:"",chapter:"",level:0,mission:""};

      // ID
      try { row.id = index; }
      catch (e: unknown) { caughtError(e); row.id = -1; }

      // Route
      try { row.route = allChapters[entry.general.route].route; }
      catch (e: unknown) { caughtError(e); row.route = "-"; }
      
      // Chapter
      try {
        let ch : Chapter = allChapters[entry.general.route].chapters[entry.general.chapter]
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

      rows.push(row);

    })

    console.log("Table Data: ")
    console.log(rows)
    setData(rows);
    
  }

  function updateLevels() {

    // console.log("Started Update Levels");

    if (data.length == 0)
      return;

    let rows : Row[] = Array.from(data);

    rows.forEach( (row : Row) => {
      try { 
        switch (difficulty) {
          case 0: row.level = allMissions[row.id].general.level.easy; break;
          case 1: row.level = allMissions[row.id].general.level.normal; break;
          case 2: row.level = allMissions[row.id].general.level.hard; break;
          case 3: 
            if (allMissions[row.id].general.level.maddening == undefined)
              row.level =  allMissions[row.id].general.level.normal + 100;
            else
              row.level =  allMissions[row.id].general.level.maddening;
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

  const columnHelper = createMRTColumnHelper<Row>();

  const columns = [
  columnHelper.accessor(
    // === Route ===
    'route', 
    {
      header: 'Route',
      filterVariant: 'multi-select',
      filterSelectOptions: [allChapters[0].route, allChapters[1].route, allChapters[2].route, allChapters[3].route],
      Cell: ( {row} ) => {
        let src : string = "";
        switch (row.original.route) {
          case allChapters[0].route: src = "https://static.wikia.nocookie.net/fireemblem/images/6/64/Resistance_crest.png"; break;
          case allChapters[1].route: src = "https://static.wikia.nocookie.net/fireemblem/images/0/08/Adrestian_crest.png"; break;
          case allChapters[2].route: src = "https://static.wikia.nocookie.net/fireemblem/images/a/ac/Faerghus_crest.png"; break;
          case allChapters[3].route: src = "https://static.wikia.nocookie.net/fireemblem/images/b/b1/Leicester_crest.png"; break;
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
  columnHelper.accessor((row : Row) => Number(row.level), 
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

const table = useMaterialReactTable({
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
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () =>
        setRowSelection((prev) => {
          let blankState : MRT_RowSelectionState = {};
          return(
          {
          ...blankState,
          [row.id]: !prev[row.id],
        })}),
      selected: rowSelection[row.id],
      sx: {
        cursor: 'pointer',
      },
    }),
    enableRowSelection: false,
    enableMultiRowSelection: false,
    positionToolbarAlertBanner: 'none',
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    // muiTableHeadCellProps: {
    //   sx: {
    //     '&[data-index="2"]': { //Level
    //       color: "red",
    //       "width": "min-content",
    //       "min-width": "min-content"
    //     }
    //   }
    // },
    // muiTableBodyCellProps: { // Level
    //   sx: {
    //     color: "blue",
    //     '&.MuiTableRow-root': {
    //       color: "red",
    //     }   
    //     '&[data-index="2"]': {
    //       color: "red",
    //       "width": "min-content",
    //       "min-width": "min-content"
    //     }
    //   }
    //   }
    // }
 
  });

  // Run once
  useEffect(() => {
    createData()
  }, [])

  useEffect(() => {
    updateLevels()
  }, [difficulty])

  function caughtError( e : unknown ) : void {
    if (typeof e === "string") { 
      console.log(e.toUpperCase())
    } else if (e instanceof Error) {
      console.log(e.message)
    }
  }

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  )
}
