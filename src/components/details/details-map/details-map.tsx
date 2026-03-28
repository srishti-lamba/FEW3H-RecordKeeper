import React, {useEffect, useState, useRef, useMemo, useContext} from 'react';
import { JSX } from 'react/jsx-runtime';
import { GridContainer } from './details-map-grid-container';
import Slider from '@mui/material/Slider'
import { ClassType } from '../../data-classes/class-data';
import { WeaponDataType } from '../../data-classes/weapon-data';
import { DatabaseContext, BattlesTableContext, MissionsTableContext, MapContext, Dictionary } from '../../../context';
import { MapIcons } from '../../data-classes/map-icon-data';

/* 
    Websites
    https://www.photopea.com/
    https://www.freeconvert.com/png-to-svg
*/

// // === Fills ===

// export interface FillsType {
//     base : string;
//     stronghold : Dictionary<fill_StrongholdType>;
//     gate : string;
//     pot : Dictionary<string>;
// }

// interface fill_StrongholdType {
//     ground : string;
//     icon : {
//         outer : string;
//         inner: string;
//     }
// }

// === Map Objects ===

interface svg_PathType {
    full : svg_GroundType;
    strongholds : svg_StrongholdType[];
    bases : BaseDataType[];
    gates : svg_GateType[];
    pots : svg_PotType[];
    units : Dictionary<UnitDataType>;
}

interface svg_GroundType { // Base ground path
    transform : string;
    d : string;
}

export interface svg_StrongholdType {
    transform : string;
    d : string;
    icon ?: {
        transform : string;
        coords : CoordinateType;
    }
    data ?: StrongholdDataType | undefined;
    fill ?: string;
}

interface svg_GateType {
    transform ?: string;
    d ?: string;
    fill ?: string;
    appear ?: number[];
    disappear ?: number[];
}

interface svg_PotType {
    colour : string;
    m : CoordinateType;
    coords : CoordinateType;
    fill ?: string;
}

// === Map Size ===

export interface SvgPropsType {
    size : size_CategoryType;
    paths : svg_PathType;
}

export interface CoordinateType {
    x : number;
    y : number;
}

export interface size_SpecificType {
    width: number;
    height: number;
}

interface size_CategoryType {
    pixels : size_SpecificType;
    squares : size_SpecificType;
}

// === Grid Cell Reference ===
export interface GridCellType {
    gridCell: Node | React.ReactNode | JSX.Element | null;
    data: GridCellDataType | null;
}

export interface GridCellDataType {
    stronghold ?: [number, StrongholdDataType];
    base ?: [number, BaseDataType];
    pot ?: PotDataType;
    unit ?: Dictionary<UnitDataType>;
}

export interface PotDataType {
    icon: JSX.Element | undefined;
    title: string;
    description: string;
}

export interface StrongholdDataType {
    name: string;
    icon?: JSX.Element | undefined;
    captureRequired: boolean;
    appear ?: {
        text : string;
        mission : number[]
    };
    disappear ?: {
        text : string;
        mission : number[]
    };
    captain: (string|UnitDataType)[];
    colour : [number[], string][];
}

export interface BaseDataType {
    icon : {
        transform : string;
        coords : CoordinateType;
    };
    colour : [number[], string][];
    captain: (string|UnitDataType)[];
}

export interface UnitDataType {
    name : string;
    gender ?: string;
    class : ClassType;
    weapon : {
        name : string;
        data ?: WeaponDataType;
    };
    allegiance: string;
    appearAndDisappear ?: [number[],boolean][];
    coords : CoordinateType;
    notes ?: string;
}

// === Mission Data ===
export interface MissionDataType {
    strongholds : {appear: boolean, allegiance: string}[];
    bases : {appear: boolean, allegiance: string}[];
    gates : {appear: boolean}[];
    units : Dictionary<{show : boolean}>;
}

// === Class Props ===

interface MapProps {
    shouldSetHeight : React.RefObject<boolean>,
    setHeight : any
}

export function Map({ shouldSetHeight, setHeight } : MapProps) {

    const selectedBattleRow = useContext(BattlesTableContext).selectedRow![0];
    const selectedMissionRow = useContext(MissionsTableContext).selectedRow![0]
    const scollElementSize = useContext(MapContext).size!;
    const [svgProps, setSvgProps] = useState<SvgPropsType | undefined | null>(undefined);
    const [gridCords, setGridCords] = useState<CoordinateType | null>(null);
    const [missionData, setMissionData] = useState<MissionDataType>({strongholds:[],bases:[],gates:[],units:{}})
    const [mapZoomExpanded, setMapZoomExpanded] = useState<boolean>(false);
    const scrollElement = useRef(null);
    const [scrollElementScrollbarOn, setScrollElementScrollbarOn] = useState(false);
    const [mapZoom, setMapZoom] = useState<number>(200);
    const maps = useContext(DatabaseContext).map;

    // Run once
    useEffect(() => {
    }, [])

    useEffect(() => {
        if (scrollElement.current) {
            const observer = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    scollElementSize.current = entry
                    if (shouldSetHeight.current)
                        setHeight(`${entry.borderBoxSize[0].blockSize}px`)
                    setScrollElementScrollbarOn(
                        entry.borderBoxSize[0].inlineSize !== entry.contentBoxSize[0].inlineSize ||
                        entry.borderBoxSize[0].blockSize !== entry.contentBoxSize[0].blockSize
                    )
                }
            });
            observer.observe(scrollElement.current);

            // Cleanup function
            return () => {
                observer.disconnect();
            };
        }
    }, [scrollElement.current])

    // -----------------------
    // --- Fetch SVG Props ---
    // -----------------------
    useEffect(() => {
        let keys = Object.keys(selectedBattleRow) as Array<string>
        if (keys.length == 0) { // No selection
            setSvgProps(null);
            return;
        }
        let key = (keys[0] as unknown) as number
        if (maps!.length > key) // Map data exists
            setSvgProps(maps![key]);
        else
            setSvgProps(undefined); // Map data does not exist
    }, [selectedBattleRow])


    // --------------------
    // --- Mission Data ---
    // --------------------
    useEffect(() => {
        async function recalculateMissionData() {
            if (svgProps === undefined || svgProps === null)
                return

            var strongholds : MissionDataType["strongholds"] = [];
            var bases : MissionDataType["bases"] = [];
            var gates : MissionDataType["gates"] = [];
            var units : MissionDataType["units"] = {};

            // Strongholds
            if (svgProps.paths.strongholds !== undefined) {
                (svgProps.paths.strongholds).forEach( (base:svg_StrongholdType, index:number) => {
                    let baseData = base.data
                    if (baseData === undefined)
                        return

                    // Show
                    let show = calculateShow(baseData.appear?.mission, baseData.disappear?.mission)

                    // Colour
                    let allegiance = "red";
                    if (Object.keys(selectedMissionRow).length === 0) { // No mission selected
                        let c = baseData.colour[0][1]; // Select first colour
                        if (c !== undefined)
                            allegiance = c;
                    }
                    else {
                        let stopFlag = false;
                        (baseData.colour).forEach( ([mission, colour]:[number[],string]) => {
                            if (stopFlag) 
                                return;
                            // If selected mission has passed requirements, make it that allegiance
                            if (selectedMissionPassed(mission, true))
                                allegiance = colour;
                            else
                                stopFlag = true
                        })
                    }
                    
                    strongholds[index] = {appear: show, allegiance: allegiance}
                })
            }

            // Bases
            // TO-DO

            // Gates
            if (svgProps.paths.gates !== undefined) {
                (svgProps.paths.gates).forEach( (gate:svg_GateType, index:number) => {
                    let show = calculateShow(gate.appear, gate.disappear)
                    gates[index] = {appear: show}
                    // if (index == 0)
                    //     console.log(`Gate [hasAppeared: ${hasAppeared}] [hasDisappeaered: ${hasDisappeared}]`)
                })
            }

            // Units
            if (svgProps.paths.units !== undefined) {
                Object.entries(svgProps.paths.units).forEach( ([key,unit] : [string,UnitDataType]) => {
                    let show = false;
                    // If has a 0-2 triggers
                    show = calculateShow_multipleTriggers(unit.appearAndDisappear)
                    units[key] = {show: show}
                })
            }

            setMissionData({strongholds:strongholds,bases,gates:gates,units:units})
        };
        recalculateMissionData();
    }, [selectedMissionRow, svgProps])

    // ------------------------
    // --- Helper Functions ---
    // ------------------------

    const toggleDisplayZoom = () => {
        setMapZoomExpanded(!mapZoomExpanded);
    }

    const changeZoom = (event: Event, newValue: number) => {
        setMapZoom(newValue);
    }

    function calculateShow(appear : number[]|undefined, disappear : number[]|undefined) {
        let hasAppeared = selectedMissionPassed(appear, true)
        let hasDisappeared = selectedMissionPassed(disappear, false)
        return (hasAppeared && !hasDisappeared)
    }

    function calculateShow_multipleTriggers(appearAndDisappear : [number[],boolean][]|undefined) {
        if (appearAndDisappear === undefined)
            return true;

        let show = false;

        // If there is no mission selected, then show
        let keys = Object.keys(selectedMissionRow) as unknown as Array<string>
        if (keys.length == 0)
            return true;
        let selected : number[] = keys[0].split('.').map(x=>Number(x));

        for (let index = 0; index < appearAndDisappear.length; index++) {
            let [mission, appear] : [number[],boolean] = appearAndDisappear[index]
            // Has mission passed yet?
            let missionPassed = selectedMissionPassed(mission, true, selected)
            // If passed, update show
            if (missionPassed)
                show = appear
            // If not passed, break
            else
                break;
        }
        return show;
    }

    /**
     * Compares the currently selected mission to the target.
     * Returns true if the selected mission is at, or has passed the target.
     * 
     * @param target: When your object appears/dissappears.
     * @param appear: True if you're using the appear data. False if you're using the dissapear data.
     * @param selected: Optional. Selected Mission's id. If already calculated, won't calculate again.
     */
    function selectedMissionPassed(target : number[]|undefined, appear : boolean, selected ?: number[]) {
        // If no specified appear time, return true if appear, false if disappear
        if (target === undefined || target === null)
            return appear

        if (selected == undefined) {
            let keys = Object.keys(selectedMissionRow) as unknown as Array<string>
            // If no mission is selected, return true if appear, false if disappear
            if (keys.length == 0)
                return appear;
            selected = keys[0].split('.').map(x=>Number(x));
        }

        // Compare first rows
        if (selected[0] < target[0])
            return false
        else if (selected[0] > target[0])
            return true
        else { // First row is equal.
            // If both don't have a second row, pass
            if (selected.length === 1 && target.length === 1)
                return true
            // If one doesn't have a second row
            if (target.length === 1)
                return true
            if (selected.length === 1)
                return false
            // Both have second rows
            if (selected[1] < target[1])
                return false
            // If selected[1] is >= target[1]
            return true
        }
    }

    // console.log(`Details-Map rerendered`)

    if (svgProps === undefined) {
        return <>No data for this chapter yet...</>;
    }

    if (svgProps === null) {
        return <>Select a chapter.</>;
    }

    // --------------
    // --- Return ---
    // --------------

    return (
        <div className="map-container-wrapper">
            <div className="map-container">                
                <div className="map-actions-container">
                    <div className="map-zoom-container">
                        <button 
                            className="zoom-btn"
                            onClick={() => toggleDisplayZoom()}
                        />
                        {
                            mapZoomExpanded && (
                                <div className="map-zoom-slider-wrapper">
                                    <Slider
                                        orientation="vertical"
                                        valueLabelDisplay="auto"
                                        value={mapZoom}
                                        onChange={changeZoom}
                                        min={100} max={500} step={10}
                                        size="small"
                                        valueLabelFormat={(value:number, index:number) => `${value}%`}
                                    />
                                </div>
                            )
                        }
                    </div>
                    {
                        gridCords && (
                            <div className="map-coordinates-container">
                                {"( " + gridCords.x + " , " + gridCords.y + " )"}
                            </div>
                        )
                    }
                </div>
                <div 
                    id="map-svg-grid-scroll-container"
                    ref={scrollElement}
                    className={scrollElementScrollbarOn ? "scrollbarOn" : ""}
                >
                    <div className="map-svg-grid-container" style={{"width" : `${mapZoom}%`}}>
                        <svg 
                            version="1.1" 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox={"0 0 " + svgProps.size.pixels.width + " " + svgProps.size.pixels.height}
                        >
                            {/* Full */}
                            <path 
                                fill={MapIcons.fills.base} 
                                transform={svgProps.paths.full.transform} 
                                d={svgProps.paths.full.d} 
                            />
                            {
                                // Strongholds
                                svgProps.paths.strongholds.map( (path : svg_StrongholdType, index : number) => {
                                    let show = (missionData.strongholds[index] !== undefined) ? missionData.strongholds[index].appear : true;
                                    if (!show)
                                        return <></>

                                    let allegiance = (missionData.strongholds[index] !== undefined) ? missionData.strongholds[index].allegiance : "red";
                                    return (<>
                                        <path 
                                            fill={(path.fill !== undefined) ? path.fill : MapIcons.fills.stronghold[allegiance].ground} 
                                            transform={path.transform} 
                                            d={path.d}
                                            key={"mapStronghold-" + index}
                                        />
                                        {/* Icon */}
                                        {
                                            (path.icon != null) && (
                                                <g
                                                    transform={path.icon?.transform}
                                                >
                                                    {MapIcons.stronghold[allegiance]}
                                                    {/* Background
                                                    <rect
                                                        width="28" height="28" 
                                                        x="0" y="0" rx="2.5" ry="2.5" 
                                                        fill={MapIcons.fills.stronghold[allegiance].icon.outer}
                                                    />
                                                    <path
                                                        fill={MapIcons.fills.stronghold[allegiance].icon.inner}
                                                        d=" M 3 3 v 17 l 5 5 h 12 l 5 -5 v -17 h -6 v 5.5 h -2 v -5.5 h -6 v 5.5 h -2 v -5.5 z 
                                                            m 14 14 v 5 h -6 v -5 l 3 -3 z"
                                                    /> */}
                                                </g>
                                            )
                                        }
                                    </>)
                                })
                            }
                            {
                                // Gates
                                svgProps.paths.gates.map( (path : svg_GateType, index : number) => {
                                    let show = (missionData.gates[index] !== undefined) ? missionData.gates[index].appear : true;
                                    let d = (path.d !== undefined) 
                                        ? path.d 
                                        : "M 0 0 l -5.4 5.6 l 21 20.9 l -21 21.1 l 5.6 5.4 l 20.9 -21 l 21.1 21 l 5.4 -5.6 l -21 -20.9 l 21 -21.1 l -5.6 -5.4 l -20.9 21 Z"
                                    if (show)
                                        return (
                                            <path 
                                                fill={(path.fill !== undefined) ? path.fill : MapIcons.fills.gate} 
                                                transform={path.transform} 
                                                d={d}
                                                key={"mapGate-" + index}
                                            />
                                        )
                                    else
                                        return <></>
                                })
                            }
                            {
                                // Pots
                                svgProps.paths.pots.map( (path : svg_PotType, index : number) => (
                                    <g
                                        data-col={path.coords.x}
                                        data-row={path.coords.y}
                                        key={"mapPot-" + index}
                                        transform={`translate(${path.m.x},${path.m.y}) scale(0.3125,0.3125)`}
                                    >
                                        <path 
                                            fill={MapIcons.fills.pot[path.colour]} 
                                            stroke="black" stroke-width="3" stroke-linecap="round"
                                            d={"M 0 0 c 3.199 6.3981 3.199 7.4644 0.5332 10.1303 c -12.2631 10.1303 -10.1304 34.6564 15.462 34.6564 c 22.3934 0 27.7252 -24.5261 15.4621 -34.6564 c -2.6659 -2.6659 -2.6659 -3.7322 0.5332 -10.1303 z"}
                                        />
                                        <path
                                            fill={MapIcons.fills.pot.label}
                                            d={"M -2.25 27.5 c 0 8 3 8 8 8 l 19 0 c 5 0 8 0 8 -8 z"}
                                        />
                                    </g>
                                ))
                            }
                            {
                                // Units
                                Object.entries(svgProps.paths.units).map( ([key, unit] : [string,UnitDataType]) => {
                                    // Make sure it's not dummy entry
                                    if (unit.coords.x === -1 && unit.coords.y === -1)
                                        return <></>

                                    let show = (missionData.units[key] !== undefined) ? missionData.units[key].show : true;
                                    if (show) {
                                        let tileWidth : number = svgProps.size.pixels.width / svgProps.size.squares.width;

                                        return (
                                            <use 
                                                style={{ "--transformX": (unit.coords.x-0.5)*tileWidth , "--transformY" : (unit.coords.y-0.5)*tileWidth } as React.CSSProperties}
                                                className="map-grid-tile-unit-sprite"
                                                xlinkHref={unit.class.sprite.url} 
                                            />
                                        )
                                    }
                                    else
                                        return <></>
                                })
                            }
                        </svg>
                        <GridContainer 
                            svgProps={svgProps} 
                            setGridCords={setGridCords} 
                            missionData={missionData}
                        />
                    </div> {/* map-svg-grid-container */}
                </div> { /* map-svg-grid-scroll-container */}
            </div>
        </div>
    )
    
}