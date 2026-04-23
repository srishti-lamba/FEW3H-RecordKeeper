import React, { JSX, memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import { GridCellDataType, PotDataType, SvgPropsType, CoordinateType, size_SpecificType, StrongholdDataType, UnitDataType, MissionDataType, svg_StrongholdType, BaseDataType, svg_BaseType, svg_ChestType, svg_PlayerType } from "./details-map";
import { Tooltip, TooltipRefProps } from "react-tooltip";
import { MemoizedTooptipContent } from "./details-map-tooltip";
// import { BattleRow } from "../../table";
import { Classes } from "../../data-classes/class-data";
import { Weapons } from "../../data-classes/weapon-data";
import { MapIcons } from "../../data-classes/map-icon-data";
import { Items } from "../../data-classes/item-data";
import { MapContext } from "../../../context";

interface GridContainerProps {
    svgProps : SvgPropsType;
    setGridCords : any;
    missionData : MissionDataType;
}

export function GridContainer({svgProps, setGridCords, missionData} : GridContainerProps) {

    const [tileCoords, setTileCoords] = useState<CoordinateType|null>(null);
    const prevTileCoords = useRef<(CoordinateType|null)[]>([null, null]);
    const tileID = useRef<string|null>(null);
    const [data, setData] = useContext(MapContext).tileData!;
    // const [data, setData] = useState<(GridCellDataType)[][]>([]);

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
        svgProps.paths.strongholds.forEach ( (stronghold, index:number) => {
            if (stronghold.data == undefined || stronghold.icon == undefined)
                return;

            var baseData : StrongholdDataType = stronghold.data;

            // Mission
            var mission = missionData.strongholds[index]
            let allegiance = (mission !== undefined) ? mission.allegiance : "red"
            
            baseData.icon = MapIcons.stronghold[allegiance].svg;

            // Fill in captain icons
            (stronghold.data.captain).forEach(
                (c : any, index : number) => {
                    // Make sure it's string
                    if (c.name === undefined)
                        baseData.captain[index] = svgProps.paths.units[c as any];
                }
            )

            if (data[stronghold.icon!.coords.x][stronghold.icon!.coords.y] == undefined)
                data[stronghold.icon!.coords.x][stronghold.icon!.coords.y] = {stronghold: [index, baseData]};
            else
                data[stronghold.icon!.coords.x][stronghold.icon!.coords.y].stronghold = [index, baseData];
        });

        // === Base ===
        svgProps.paths.bases.forEach ( (base, index:number) => {

            var baseData : BaseDataType = base.data;

            // Fill in captain icons
            (base.data.captain).forEach(
                (c : any, index : number) => {
                    // Make sure it's string
                    if (c.name === undefined)
                        baseData.captain[index] = svgProps.paths.units[c as any];
                }
            )

            if (data[base.icon!.coords.x][base.icon!.coords.y] == undefined)
                data[base.icon!.coords.x][base.icon!.coords.y] = {base: [index, baseData]};
            else
                data[base.icon!.coords.x][base.icon!.coords.y].base = [index, baseData];

        });

        // === Chest ===
        svgProps.paths.chests.forEach( (chest) => {

            // Fill in item
            if (chest.item === undefined)
                return;
            // Make sure it's string
            if ( (chest.item as any).name === undefined) 
                chest.item = Items.getItem(chest.item as string)

            if (data[chest.icon.coords.x][chest.icon.coords.y] == undefined)
                data[chest.icon.coords.x][chest.icon.coords.y] = {chest: chest};
            else
                data[chest.icon.coords.x][chest.icon.coords.y].chest = chest;
        });

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
            potData.icon = MapIcons.pot[pot.colour].svg;

            if (data[pot.coords.x][pot.coords.y] == undefined)
                data[pot.coords.x][pot.coords.y] = {pot: potData};
            else
                data[pot.coords.x][pot.coords.y].pot = potData;
        });
        
        // === Player Tiles ===
        (svgProps.paths.player).forEach(
            (tile : svg_PlayerType) => {
                let units = (tile["fixed-unit"] !== undefined) ? tile["fixed-unit"] : []
                units.forEach( (unit) => unit.class = Classes.getClassData(unit) )
                
            if (data[tile.coords.x][tile.coords.y] == undefined)
                data[tile.coords.x][tile.coords.y] = {playerTile: tile};
            else
                data[tile.coords.x][tile.coords.y].playerTile = tile;
        })

        // === Units ===
        Object.entries(svgProps.paths.units).forEach(
            ([key, unit]) => {
                // console.log(key)
                // console.log(unit)
                // Make sure it's not dummy entry
                if (key === "-")
                    return;

                var unitData : UnitDataType = unit;

                // Make sure gender and alleigance are lowercase
                if (unit.gender) unitData.gender = unit.gender.toLowerCase();
                if (unit.allegiance) unitData.allegiance = unit.allegiance.toLowerCase();

                // Fill Class and Weapon data
                unitData.class = Classes.getClassData(unitData)
                unitData.weapon.data = Weapons.getData(unitData.weapon.name)

                // Add to all coords
                unit.coords.forEach( ( [mission, coords] : [number[], CoordinateType], index : number ) => {
                    if (data[coords.x][coords.y] == undefined)
                        data[coords.x][coords.y] = {unit: {[key]: unitData}};
                    else {
                        if (data[coords.x][coords.y].unit === undefined)
                            data[coords.x][coords.y].unit = { [key] : unitData }
                        else
                            data[coords.x][coords.y].unit![key] = unitData;
                    }
                })
            }
        );

        // console.log(data)
        setData(data)
        return data;
    }, [svgProps])

    const createGridContainer = () => {
        // console.log("Grid Container rerendered")

        if (svgProps === null || svgProps === undefined)
            return;

        let newData = createData;
        var rows = [];

        for (let row : number = 1 ; row <= svgProps.size.squares.height ; row++ ) {
            rows.push(
                <MemoizedGridRow 
                    data={newData}
                    svgSquares={svgProps.size.squares} setGridCords={setGridCords} row={row}
                    tileCoords={tileCoords} setTileCoords={setTileCoords} prevTileCoords={prevTileCoords}
                    tileID={tileID}
                />
            )
        }

        return rows;
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

            newData[base.icon!.coords.x][base.icon!.coords.y].stronghold![1].icon = MapIcons.stronghold[allegiance].svg;
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
                // variant="light"
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
        if (data[col] === undefined)
            return <></>
        
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