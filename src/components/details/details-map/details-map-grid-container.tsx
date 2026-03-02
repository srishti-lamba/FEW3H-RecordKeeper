import React, { JSX, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GridCellType, GridCellDataType, PotDataType, SvgPropsType, FillsType, CoordinateType, size_SpecificType } from "./details-map";
import { Grid } from "@mui/material";
import { GridCell } from "./details-map-grid-cell";
import { Tooltip } from "react-tooltip";

interface GridContainerProps {
    svgProps : SvgPropsType;
    fills : FillsType;
    getPotFill : any;
    gridCells : React.RefObject<GridCellType[]>;
    setGridCords : any;
}

export function GridContainer({svgProps, fills, getPotFill, gridCells, setGridCords} : GridContainerProps) {

    // const [tileID, setTileID] = useState<string|null>(null);
    const [tileCoords, setTileCoords] = useState<CoordinateType|null>(null);
    const prevTileCoords = useRef<(CoordinateType|null)[]>([null, null]);
    const tileID = useRef<string|null>(null);

    const calculateIndex = (col : number, row : number ) => {
        return ((row-1) * svgProps.size.squares.width) + col
    }

    const handleTileClick = useCallback((coords : CoordinateType|null, tileCoords : CoordinateType|null) => {

        console.log(`Tile clicked! [Coords: ${coords}] [ID: ${tileID}] [TileCoords: ${tileCoords?.x},${tileCoords?.y}]`)

        if (coords == null) {
            console.log("   Coords null, making null")
            // setTileID(null);
            setTileCoords(null);
        }
        else if (tileCoords !== null ) {
            console.log("   ID not null, making null")
            // setTileID(null);
            setTileCoords(null);
        }
        else {
            console.log("   Making ID")
            // setTileID(`mapTile-${coords.x}-${coords.y}`)
            setTileCoords(coords);
        }

        // if (coords === null || (tileCoords !== null && coords.x == tileCoords.x && coords.y == tileCoords.y) ) {
        //     setTileCoords(null);
        // }
        // else
        //     setTileCoords(coords)

        // var id = `mapTile-${coords.x}-${coords.y}`;
        // if (tileID === id)
        //     setTileID(null)
        // else
        //     setTileID(id)

        // if (coords.x === tileCoords?.x && coords.y === tileCoords?.y)
        //     setTileCoords(null);
        // else
        //     setTileCoords
    }, [])

    useEffect(() => {
        console.log("TileCoords changed")
        console.log(tileCoords)

        prevTileCoords.current[0] = prevTileCoords.current[1]
        prevTileCoords.current[1] = tileCoords;

        if (tileCoords === null) {
            // tileID.current = null;
            // prevTileCoords.current[0] = prevTileCoords.current[1]
            // prevTileCoords.current[1] = tileCoords;
            // setTileID(null)
        }
        else {
            // let id = `mapTile-${tileCoords.x}-${tileCoords.y}`;
            // tileID.current = `mapTile-${tileCoords.x}-${tileCoords.y}`;
            // setTileID(id)

            // // Update that component
            // let index = calculateIndex(tileCoords.x, tileCoords.y)
            // // var oldTile = gridCells.current[index].gridCell;
            // // var newTile = createTile(tileCoords.x, tileCoords.y, gridCells.current[index].data)
            // var row = document.querySelector(`#mapGridRow-${tileCoords.y}`)
            // if (row !== null) {
            //     var oldTile = row.querySelector(`#${id}`)
            //     // if (oldTile !== null)
            //         // oldTile.getAttribute()
            //         // oldTile?.replaceWith(newTile)
            //     // var children = row.childNodes;
            //     // row.replaceChild(newTile, oldTile)

            //     // row.replaceChild()
            //     // // children[tileCoords.x-1] = newTile;
            //     // console.log(newTile);
            // }
            // // console.log(row?.children);
        }

    }, [tileCoords])
    useEffect(() => {
        console.log(`Tile ID Changed! ${tileID.current}`)
    }, [tileID])

    const createData = () => {
        var data : GridCellDataType[] = [];

        // Pots
        svgProps.paths.pots.forEach( (pot) => {
            var potData : PotDataType = {icon:undefined, title:"", description:""};
            switch (pot.colour) {
                case "blue": 
                    potData.title = "Blue Tonic";
                    potData.description = "Restores Awakening Gauge";
                    break;
                case "green": 
                    potData.title = "Green Tonic";
                    potData.description = "Restores HP Gauge";
                    break;
                case "purple": 
                    potData.title = "Purple Crystals";
                    potData.description = "Restores Weapon Durability";
                    break;
                case "red": 
                    potData.title = "Red Tonic";
                    potData.description = "Gives 150G";
                    break;
                case "yellow": 
                    potData.title = "Yellow Tonic";
                    potData.description = "Restores Warrior Gauge";
                    break;
            };
            potData.icon = (
                <svg
                    xmlns="http://www.w3.org/2000/svg"  
                    viewBox="0 0 48 48" 
                    preserveAspectRatio="xMidYMid meet"
                >
                    <path 
                        fill={getPotFill(pot.colour)}
                        stroke="black" stroke-width="3" stroke-linecap="round"
                        d="M 0 0 c 3.199 6.3981 3.199 7.4644 0.5332 10.1303 c -12.2631 10.1303 -10.1304 34.6564 15.462 34.6564 c 22.3934 0 27.7252 -24.5261 15.4621 -34.6564 c -2.6659 -2.6659 -2.6659 -3.7322 0.5332 -10.1303 z"
                    />
                    <path
                        fill={fills.pot.label}
                        d={"M -2.5 27.5 c 0 8 3 8 8 8 l 19 0 c 5 0 8 0 8 -8 z"}
                    />
                </svg>
            );
            var index = calculateIndex(pot.coords.x, pot.coords.y);
            if (data[index] == undefined)
                data[index] = {
                    stronghold: null,
                    pot: potData
                };
            else
                data[index].pot = potData;
        })

        return data;
    }

    // const createTile = (col : number, row : number, data : GridCellDataType|null) => {
    //     // let index = calculateIndex(col, row);
    //     var dataVar : GridCellDataType|null = (data == undefined ? null : data)

    //     var tile : React.ReactNode = (
    //         <MemoizedGridCellTile 
    //             data={dataVar} 
    //             setGridCords={setGridCords} coords={{x:col,y:row}} tileCoords={tileCoords}
    //             handleClick={handleTileClick} 
    //         />
    //     )
    //     // Update reference
    //     // if (gridCells.current[index] === undefined) 
    //     //     gridCells.current[index] = {gridCell: tile, data: dataVar};
    //     // else
    //     //     gridCells.current[index].gridCell = tile;

    //     return tile;
    // }

    // const createGrid = (data : GridCellDataType[]) => {
    //     var rows = [];

    //     for (let row : number = 1 ; row <= svgProps.size.squares.height ; row++ ) {
    //         var cells = []
    //         for (let col : number = 1 ; col <= svgProps.size.squares.width ; col++) {
    //             let index = calculateIndex(col, row);
    //             var tile = createTile(col, row, data[index])

    //             cells.push(tile)
    //         }

    //         rows.push(
    //             <div 
    //                 className="map-grid-row-container"
    //                 id={`mapGridRow-${row}`}
    //                 key={`mapGridRow-${row}`}
    //             >
    //                 {cells}
    //             </div>
    //         )   
    //     }
    //     return rows;
    // }

    // const createGridContainer = useMemo(() => {
    //     console.log("Grid Container rerendered")

    //     if (svgProps === null || svgProps === undefined)
    //         return;

    //     var data : GridCellDataType[] = createData();
    //     var rows = createGrid(data);

    //     console.log("Grid Cells:")
    //     console.log(gridCells)
    //     return rows;
    // },[svgProps])

    const createGridContainer2 = () => {

        console.log("Grid Container rerendered")

        if (svgProps === null || svgProps === undefined)
            return;

        var data : GridCellDataType[] = createData();
        // var rows = createGrid(data);

        var rows = [];

        for (let row : number = 1 ; row <= svgProps.size.squares.height ; row++ ) {

            rows.push(
                <MemoizedGridRow 
                    data={data} 
                    svgSquares={svgProps.size.squares} setGridCords={setGridCords} 
                    row={row} 
                    calculateIndex={calculateIndex} tileCoords={tileCoords} setTileCoords={setTileCoords} prevTileCoords={prevTileCoords} tileID={tileID}
                    handleClick={handleTileClick}
                />
            )

            // var cells = []
            // for (let col : number = 1 ; col <= svgProps.size.squares.width ; col++) {
            //     let index = calculateIndex(col, row);
            //     var tile = createTile(col, row, data[index])

            //     cells.push(tile)
            // }

            // rows.push(
            //     <div 
            //         className="map-grid-row-container"
            //         id={`mapGridRow-${row}`}
            //         key={`mapGridRow-${row}`}
            //     >
            //         {cells}
            //     </div>
            // )   
        }

        // console.log("Grid Cells:")
        // console.log(gridCells)
        return rows;

        // MemoizedGridRow
    }

    console.log(`rerender, tileID: ${tileID.current}`)
    return (
        <div 
            className="map-grid-container" 
            key="map-grid-container"
        >
            {createGridContainer2()}
            <Tooltip
                // anchorSelect={tileCoords === null ? "" : `#mapTile-${tileCoords?.x}-${tileCoords?.y}`}
                anchorSelect={`#${tileID.current}`}
                content="TEST test TEST"
                openOnClick={true}
                isOpen={tileCoords !== null}       
                key={`mapTooltip`}
                clickable
            />
        </div>
    )
}

// ----------------
// --- Grid Row ---
// ----------------

interface GridRowProps {
    data : GridCellDataType[];
    svgSquares : size_SpecificType;
    setGridCords : any;
    row : number;
    calculateIndex : any;
    tileCoords : CoordinateType|null;
    setTileCoords : any;
    prevTileCoords : React.RefObject<(CoordinateType|null)[]>;
    tileID : React.RefObject<string|null>;
    handleClick : any;
}

function GridRow({data, svgSquares, setGridCords, row, calculateIndex, tileCoords, prevTileCoords, tileID, setTileCoords, handleClick} : GridRowProps) {

    console.log(`[[[ Row rerendered: ${row } tileCoords: ${tileCoords?.x},${tileCoords?.y} ]]]`)
    console.log(prevTileCoords)

    // const [childrenCells, setChildrenCells] = useState<JSX.Element[]>([]);
    const childrenRef = useRef<HTMLDivElement[]>([]);
    const childrenArray = useRef<JSX.Element[]>([]);

    const createTile = (col : number) => {
        let index = calculateIndex(col, row);
        var dataVar : GridCellDataType|null = (data[index] == undefined ? null : data[index])

        var tile = (
            <MemoizedGridCellTile 
                data={dataVar} 
                setGridCords={setGridCords} coords={{x:col,y:row}} tileCoords={tileCoords} setTileCoords={setTileCoords} prevTileCoords={prevTileCoords} tileID={tileID}
                handleClick={handleClick}
                parentChildren={childrenRef}
            />
        )
        childrenArray.current[col] = tile;
        console.log(tile)
        return tile;

        // return (
        //     <MemoizedGridCellTile 
        //         data={dataVar} 
        //         setGridCords={setGridCords} coords={{x:col,y:row}} tileCoords={tileCoords} setTileCoords={setTileCoords}
        //         handleClick={handleClick} 
        //     />
        // )
    }

    // Runs once
    // useEffect(() => {
    //     // var cells = []
    //     for (let col : number = 1 ; col <= svgSquares.width ; col++) {
    //         var tile = createTile(col);
    //         // cells.push(tile)
    //         childrenCells.current.push(tile)
    //     }
    //     // setChildrenCells(cells);
    // }, [])

    if (childrenRef.current.length === 0) {
        for (let col : number = 1 ; col <= svgSquares.width ; col++)
            // childrenCells.current[col] = createTile(col)
            createTile(col)
    }

    // if (tileCoords !== null) {
    if (tileCoords?.y === row) {
        console.log(`   [Updating childrenCells ref, col: ${tileCoords.x}]`)
        createTile(tileCoords.x);
    }
    if (prevTileCoords.current[1]?.y === row) {
        console.log(`   [Updating childrenCells ref, col: ${prevTileCoords.current[1].x}]`)
        createTile(prevTileCoords.current[1].x);
    }


    return (
        <div 
            className="map-grid-row-container"
            id={`mapGridRow-${row}`}
            key={`mapGridRow-${row}`}
        >
            {/* {childrenCells.current.map( (tile) => <>{tile}</>)} */}
            {childrenArray.current}
        </div>
    )
}

const MemoizedGridRow = memo( 
    GridRow, 
    (prevProps: Readonly<GridRowProps>, nextProps: Readonly<GridRowProps>) => {
        // console.log("nextProps row coords: ");
        // console.log(nextProps.tileCoords)
        return !(
            // The current or previous y equals row
            (prevProps.tileCoords?.y === prevProps.row || nextProps.tileCoords?.y === nextProps.row) &&
            // The current and previous are different
            (prevProps.tileCoords?.x !== nextProps.tileCoords?.x && prevProps.tileCoords?.y !== nextProps.tileCoords?.y)
        )
        // return !(
        //     nextProps.tileCoords !== null &&
        //     (prevProps.tileCoords === null || prevProps.tileCoords.y !== nextProps.tileCoords.y) &&
        //     nextProps.tileCoords.y === nextProps.row
        // )
    }
)

// -----------------
// --- Grid Tile ---
// -----------------

interface GridCellTileProps {
    data : GridCellDataType|null;
    setGridCords : any;
    coords : CoordinateType;
    tileCoords : CoordinateType|null;
    setTileCoords : any;
    prevTileCoords : React.RefObject<(CoordinateType|null)[]>;
    tileID : React.RefObject<string|null>;
    handleClick : any;
    parentChildren : React.RefObject<HTMLDivElement[]>;
}

function GridCellTile({data, setGridCords, coords, tileCoords, setTileCoords, prevTileCoords, tileID, handleClick, parentChildren} : GridCellTileProps) {
    console.log("[[[ Tile rerendered: ]]]")
    console.log(tileCoords)
    console.log(coords)

    const handleClickNoData = () => {
        console.log(`Tile clicked! [Coords: ${coords.x},${coords.y}] [TileCoords: ${tileCoords?.x},${tileCoords?.y}]`)
        console.log('   Setting TileCoords to null')
        setTileCoords(null);
    }

    const handleClickYesData = () => {
        console.log(`Tile clicked! [Coords: ${coords.x},${coords.y}] [TileCoords: ${tileCoords?.x},${tileCoords?.y}]`)
        console.log(prevTileCoords.current);

        // if ( tileCoords !== null && (coords.x === tileCoords.x && coords.y === tileCoords.y) ) {
        // if ( (tileCoords?.x == prevTileCoords.current[1]?.x) && (tileCoords?.y == prevTileCoords.current[1]?.y) ) {
        if ( (coords?.x == prevTileCoords.current[1]?.x) && (coords?.y == prevTileCoords.current[1]?.y) ) {
            console.log("   ID same, making null")
            // setTileID(null);
            setTileCoords(null);
            tileID.current = null;
        }
        else {
            console.log("   Making ID")
            // setTileID(`mapTile-${coords.x}-${coords.y}`)
            setTileCoords(coords);
            tileID.current = `mapTile-${coords?.x}-${coords?.y}`;
        }
    }

    return (
        <div
            id={`mapTile-${coords.x}-${coords.y}`}
            className={`map-grid-cell-container${data == null ? '' : ' has-data'}`}
            data-row = {coords.y}
            data-col = {coords.x}
            onMouseEnter={() => setGridCords(coords)}
            onMouseLeave={() => setGridCords(null)}
            onClick={
                () => (data === null) ? 
                handleClickNoData()
                : 
                handleClickYesData()
            }
            key={`mapTile-${coords.x}-${coords.y}`}
            ref={element => {
                if (element == null)
                    parentChildren.current[coords.x] == undefined
                else
                    parentChildren.current[coords.x] = element
            }}
        />
    )
}

const MemoizedGridCellTile = memo( 
    GridCellTile, 
    (prevProps: Readonly<GridCellTileProps>, nextProps: Readonly<GridCellTileProps>) => {
        // console.log("    nextProps tile coords: ");
        // console.log(nextProps.tileCoords)
        console.log(`   Tile [${nextProps.coords.x},${nextProps.coords.y}] checked for rerender. tileCoords: [${nextProps.tileCoords?.x},${nextProps.tileCoords?.y}]. Return ${nextProps.tileCoords !== null} and ${nextProps.tileCoords?.x == nextProps.coords.x} and ${nextProps.tileCoords?.y == nextProps.coords.y}`)
        if (nextProps.coords.x === 6 && nextProps.coords.y === 5) {
            console.log("   Tile [6,5] checked for rerender.")
        }

        return !(
            // The current or previous equals coords
            ( (prevProps.tileCoords?.y === prevProps.coords.y && prevProps.tileCoords?.x === prevProps.coords.x) || 
              (nextProps.tileCoords?.y === nextProps.coords.y && nextProps.tileCoords?.x === nextProps.coords.x)    ) &&
            // The current and previous are different
            (prevProps.tileCoords?.x !== nextProps.tileCoords?.x && prevProps.tileCoords?.y !== nextProps.tileCoords?.y)
        )

        // return !(
        //     nextProps.tileCoords !== null &&
        //     nextProps.tileCoords.x == nextProps.coords.x &&
        //     nextProps.tileCoords.y == nextProps.coords.y
        // )
    }
)