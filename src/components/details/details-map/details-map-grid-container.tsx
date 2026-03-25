import React, { JSX, memo, useEffect, useMemo, useRef, useState } from "react";
import { GridCellDataType, PotDataType, SvgPropsType, FillsType, CoordinateType, size_SpecificType, StrongholdDataType, UnitDataType, MissionDataType, svg_StrongholdType } from "./details-map";
import { Tooltip, TooltipRefProps } from "react-tooltip";
import { MemoizedTooptipContent } from "./details-map-tooltip";
// import { BattleRow } from "../../table";
import { Classes } from "../../data-classes/class-data";
import { Weapons } from "../../data-classes/weapon-data";

interface GridContainerProps {
    svgProps : SvgPropsType;
    fills : FillsType;
    setGridCords : any;
    missionData : MissionDataType;
}

export function GridContainer({svgProps, fills, setGridCords, missionData} : GridContainerProps) {

    const [tileCoords, setTileCoords] = useState<CoordinateType|null>(null);
    const prevTileCoords = useRef<(CoordinateType|null)[]>([null, null]);
    const tileID = useRef<string|null>(null);
    const [data, setData] = useState<(GridCellDataType)[][]>([]);

    const tooltip = useRef<TooltipRefProps|null>(null);

    // const calculateIndex = (col : number, row : number ) => {
    //     return ((row-1) * svgProps.size.squares.width) + col
    // }

    useEffect(() => {
        // console.log("TileCoords changed")
        // console.log(tileCoords)

        prevTileCoords.current[0] = prevTileCoords.current[1]
        prevTileCoords.current[1] = tileCoords;

    }, [tileCoords])

    const createData = useMemo(() => {
        // console.log("Called createData")
        var data : GridCellDataType[][] = new Array(svgProps.size.squares.width+1)
                            .fill(null).map( 
                                () => new Array(svgProps.size.squares.height+1).fill(undefined) 
                            )
        // === Stronghold ===
        svgProps.paths.strongholds.forEach ( (base, index:number) => {
            if (base.data == undefined || base.icon == undefined)
                return;

            var baseData : StrongholdDataType = base.data;

            // Mission
            var mission = missionData.strongholds[index]
            let allegiance = (mission !== undefined) ? mission.allegiance : "red"
            
            baseData.icon = createStrongholdIcon(allegiance);

            // Fill in captain icons
            (base.data.captain).forEach(
                (c : any, index : number) => {
                    // Make sure it's string
                    // if (typeof c !== 'string' || (c as any) instanceof String !== true)
                    if (c.name === undefined)
                        baseData.captain[index] = svgProps.paths.units[c as any];
                }
            )

            if (data[base.icon!.coords.x][base.icon!.coords.y] == undefined)
                data[base.icon!.coords.x][base.icon!.coords.y] = {stronghold: [index, baseData]};
            else
                data[base.icon!.coords.x][base.icon!.coords.y].stronghold = [index, baseData];
        })

        // === Pots ===
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
                    height="100%"
                    viewBox="-8.5 -2 48 48.5" 
                    preserveAspectRatio="xMidYMid meet"
                >
                    <path 
                        fill={fills.pot[pot.colour]} 
                        stroke="black" stroke-width="3" stroke-linecap="round"
                        d="M 0 0 c 3.199 6.3981 3.199 7.4644 0.5332 10.1303 c -12.2631 10.1303 -10.1304 34.6564 15.462 34.6564 c 22.3934 0 27.7252 -24.5261 15.4621 -34.6564 c -2.6659 -2.6659 -2.6659 -3.7322 0.5332 -10.1303 z"
                    />
                    <path
                        fill={fills.pot.label}
                        d={"M -2.25 27.5 c 0 8 3 8 8 8 l 19 0 c 5 0 8 0 8 -8 z"}

                    />
                </svg>
            );
            if (data[pot.coords.x][pot.coords.y] == undefined)
                data[pot.coords.x][pot.coords.y] = {pot: potData};
            else
                data[pot.coords.x][pot.coords.y].pot = potData;
        })

        // === Units ===
        Object.entries(svgProps.paths.units).forEach(
            ([key, unit]) => {
                // Make sure it's not dummy entry
                if (unit.coords.x === -1 && unit.coords.y === -1)
                    return;

                var unitData : UnitDataType = unit;

                // Make sure gender and alleigance are lowercase
                if (unit.gender) unitData.gender = unit.gender.toLowerCase();
                if (unit.allegiance) unitData.allegiance = unit.allegiance.toLowerCase();

                // Fill Class and Weapon data
                unitData.class = Classes.getClassData(unitData.class, unitData.allegiance, unitData.gender)
                unitData.weapon.data = Weapons.getData(unitData.weapon.name)
                
                if (data[unit.coords.x][unit.coords.y] == undefined)
                    data[unit.coords.x][unit.coords.y] = {unit: {[key]: unitData}};
                else {
                    if (data[unit.coords.x][unit.coords.y].unit === undefined)
                        data[unit.coords.x][unit.coords.y].unit = { [key] : unitData }
                    else
                        data[unit.coords.x][unit.coords.y].unit![key] = unitData;
                }
            }
        )

        // console.log(data)
        setData(data)
        return data;
    }, [svgProps])

    const createGridContainer = () => {
        // console.log("Grid Container rerendered")

        if (svgProps === null || svgProps === undefined)
            return;

        let _ = createData;
        var rows = [];

        for (let row : number = 1 ; row <= svgProps.size.squares.height ; row++ ) {
            rows.push(
                <MemoizedGridRow 
                    data={data}
                    svgSquares={svgProps.size.squares} setGridCords={setGridCords} row={row}
                    tileCoords={tileCoords} setTileCoords={setTileCoords} prevTileCoords={prevTileCoords}
                    tileID={tileID}
                />
            )
        }

        return rows;
    }

    function createStrongholdIcon(allegiance : string) {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="100%"
                viewBox="0 0 28 28" 
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Background */}
                <rect
                    width="28" height="28" 
                    x="0" y="0" rx="2.5" ry="2.5" 
                    fill={fills.stronghold[allegiance].icon.outer}
                />
                {/* Castle */}
                <path
                    fill={fills.stronghold[allegiance].icon.inner}
                    d=" M 3 3 v 17 l 5 5 h 12 l 5 -5 v -17 h -6 v 5.5 h -2 v -5.5 h -6 v 5.5 h -2 v -5.5 z 
                        m 14 14 v 5 h -6 v -5 l 3 -3 z"
                />
            </svg>
        );
    }

    useEffect(() => {
        // Update stronghold icons when Mission changes
        if (missionData.strongholds === undefined 
            || missionData.strongholds.length === 0 
            || data === undefined)
            return

        var newData = new Array(...data);

        svgProps.paths.strongholds.forEach ( (base : svg_StrongholdType, index:number) => {
            if (base.data == undefined || base.icon == undefined) 
                return;
            var baseData = data[base.icon!.coords.x][base.icon!.coords.y]
            if (baseData == undefined || baseData.stronghold == undefined)
                return;

            // Mission
            var mission = missionData.strongholds[index]
            let allegiance = (mission !== undefined) ? mission.allegiance : "red"

            newData[base.icon!.coords.x][base.icon!.coords.y].stronghold![1].icon = createStrongholdIcon(allegiance);
        })

        setData(newData);

    }, [missionData])

    // --------------
    // --- Return ---
    // --------------

    // console.log(`Map Grid Container rerender`)
    return (
        <div 
            className="map-grid-container" 
            key="map-grid-container"
        >
            {createGridContainer()}
            <Tooltip
                anchorSelect={`#${tileID.current}`}
                ref={tooltip}
                children={ (
                    < MemoizedTooptipContent 
                        data={data} 
                        tileCoords={tileCoords}
                        missionData={missionData}
                        // tileID={tileID.current}
                    />
                )}
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
    data : GridCellDataType[][];
    svgSquares : size_SpecificType;
    setGridCords : any;
    row : number;
    tileCoords : CoordinateType|null;
    setTileCoords : any;
    prevTileCoords : React.RefObject<(CoordinateType|null)[]>;
    tileID : React.RefObject<string|null>;
}

function GridRow({data, svgSquares, setGridCords, row, tileCoords, prevTileCoords, tileID, setTileCoords} : GridRowProps) {
    // console.log(`[[[ Row rerendered: ${row } tileCoords: (${tileCoords?.x},${tileCoords?.y}) prevTileCoords: (${prevTileCoords.current[1]?.x},${prevTileCoords.current[1]?.y}) ]]]`)
    // console.log(prevTileCoords)

    const childrenRef = useRef<(HTMLDivElement|undefined)[]>([]);
    const childrenArray = useRef<JSX.Element[]>([]);

    const createTile = (col : number) => {
        var tile = (
            <MemoizedGridCellTile 
                data={data[col][row]} 
                setGridCords={setGridCords} coords={{x:col,y:row}}
                tileCoords={tileCoords} setTileCoords={setTileCoords} prevTileCoords={prevTileCoords}
                tileID={tileID}
                parentChildren={childrenRef}
            />
        )
        childrenArray.current[col] = tile;
        return tile;
    }

    if (childrenRef.current.length === 0) {
        for (let col : number = 1 ; col <= svgSquares.width ; col++)
            createTile(col)
    }

    // Update if current tile coords are correct row
    if (tileCoords?.y === row) 
        createTile(tileCoords.x);
    
    // Update if previous tile coords are same
    if (prevTileCoords.current[1]?.y === row) 
        createTile(prevTileCoords.current[1].x);

    return (
        <div 
            className="map-grid-row-container"
            id={`mapGridRow-${row}`}
            key={`mapGridRow-${row}`}
        >
            {childrenArray.current}
        </div>
    )
}

const MemoizedGridRow = memo( 
    GridRow, 
    (prevProps: Readonly<GridRowProps>, nextProps: Readonly<GridRowProps>) => {
        return !(
            // The current or previous y equals row
            (prevProps.tileCoords?.y === prevProps.row || nextProps.tileCoords?.y === nextProps.row) &&
            // The current and previous are different
            (prevProps.tileCoords?.x !== nextProps.tileCoords?.x && prevProps.tileCoords?.y !== nextProps.tileCoords?.y)
        )
    }
)

// -----------------
// --- Grid Tile ---
// -----------------

interface GridCellTileProps {
    data : GridCellDataType|undefined;
    setGridCords : any;
    coords : CoordinateType;
    tileCoords : CoordinateType|null;
    setTileCoords : any;
    prevTileCoords : React.RefObject<(CoordinateType|null)[]>;
    tileID : React.RefObject<string|null>;
    parentChildren : React.RefObject<(HTMLDivElement|undefined)[]>;
}

function GridCellTile({data, setGridCords, coords, tileCoords, setTileCoords, prevTileCoords, tileID, parentChildren} : GridCellTileProps) {
    // console.log(`[[[ Tile rerendered: (${coords.x},${coords.y}) ]]]`)

    const handleClickNoData = () => {
        // console.log(`Tile clicked! [Coords: ${coords.x},${coords.y}] [TileCoords: ${tileCoords?.x},${tileCoords?.y}]`)
        tileID.current = null;
        setTileCoords(null);
    }

    const handleClickYesData = () => {
        // console.log(`Tile clicked! [Coords: ${coords.x},${coords.y}] [TileCoords: ${tileCoords?.x},${tileCoords?.y}]`)

        // If coords same, then make null
        if ( (coords?.x == prevTileCoords.current[1]?.x) && (coords?.y == prevTileCoords.current[1]?.y) ) {
            setTileCoords(null);
            tileID.current = null;
        }
        // If coords different, set new coords
        else {
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
            onClick={ () => (data === undefined) ? handleClickNoData() : handleClickYesData() }
            key={`mapTile-${coords.x}-${coords.y}`}
            ref={element => {
                if (element == null)
                    parentChildren.current[coords.x] = undefined
                else
                    parentChildren.current[coords.x] = element
            }}
        >
            {/* {
                ((data !== undefined) && (data.unit !== undefined) && (data.unit.showSprite === true) && (data.unit.sprite !== undefined)) && 
                <img 
                    className="map-grid-tile-unit-sprite"
                    src={data.unit.sprite as string} 
                /> //Height on map is 27px, height of image is 20px, height of tile is 48px
            } */}
        </div>
    )
}

const MemoizedGridCellTile = memo( 
    GridCellTile, 
    (prevProps: Readonly<GridCellTileProps>, nextProps: Readonly<GridCellTileProps>) => {
        // console.log(`   Tile [${nextProps.coords.x},${nextProps.coords.y}] checked for rerender. tileCoords: [${nextProps.tileCoords?.x},${nextProps.tileCoords?.y}]`)
        return !(
            // The current or previous equals coords
            ( (prevProps.tileCoords?.y === prevProps.coords.y && prevProps.tileCoords?.x === prevProps.coords.x) || 
              (nextProps.tileCoords?.y === nextProps.coords.y && nextProps.tileCoords?.x === nextProps.coords.x)    ) &&
            // The current and previous are different
            (prevProps.tileCoords?.x !== nextProps.tileCoords?.x && prevProps.tileCoords?.y !== nextProps.tileCoords?.y)
        )
    }
)