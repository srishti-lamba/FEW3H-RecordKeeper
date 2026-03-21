import React, {useEffect, useState, useRef, useMemo, useContext} from 'react';
import { JSX } from 'react/jsx-runtime';
import { GridContainer } from './details-map-grid-container';
import Slider from '@mui/material/Slider'
import { ClassType } from '../../data-classes/class-data';
import { WeaponDataType } from '../../data-classes/weapon-data';
import { DatabaseContext, BattlesTableContext, MissionsTableContext, MapContext } from '../../../context';

/* 
    Websites
    https://www.photopea.com/
    https://www.freeconvert.com/png-to-svg
*/

interface Dictionary<T> {
    [key: string]: T;
}

// === Fills ===

export interface FillsType {
    base : string;
    stronghold : Dictionary<fill_StrongholdType>;
    gate : string;
    pot : Dictionary<string>;
}

// interface fill_StrongholdAllType {
//     blue : fill_StrongholdType;
//     green : fill_StrongholdType;
//     red : fill_StrongholdType;
//     yellow : fill_StrongholdType;
// }

interface fill_StrongholdType {
    ground : string;
    icon : {
        outer : string;
        inner: string;
    }
}

// === Map Objects ===

interface svg_PathType {
    full : svg_GroundType;
    strongholds : svg_StrongholdType[];
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
    stronghold ?: StrongholdDataType;
    pot ?: PotDataType;
    unit ?: UnitDataType[];
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

export interface UnitDataSummaryAllType {
    blue ?: UnitDataSummaryType;
    green ?: UnitDataSummaryType;
    red ?: UnitDataSummaryType;
    yellow ?: UnitDataSummaryType;
}

export interface UnitDataSummaryType {
    name : string;
    icon ?: string|JSX.Element;
    class : string;
    weapon : string;
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
    appear ?: string;
    disappear ?: string;
    coords : CoordinateType;
    notes ?: string;
}

// === Mission Data ===
export interface MissionDataType {
    stronghold : {appear: boolean, allegiance: string}[];
    gates : {appear: boolean}[];
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
    const [missionData, setMissionData] = useState<MissionDataType>({stronghold:[],gates:[]})
    const [mapZoomExpanded, setMapZoomExpanded] = useState<boolean>(false);
    const scrollElement = useRef(null);
    const [scrollElementScrollbarOn, setScrollElementScrollbarOn] = useState(false);
    const [mapZoom, setMapZoom] = useState<number>(200);
    const maps = useContext(DatabaseContext).map;

    const fills : FillsType = {
        base: "#928A7D",
        stronghold: {
            blue: {
                ground: "rgb(120, 120, 165)",
                icon: {
                    outer: "#2E71E6",
                    inner: "#CDD5F4"
                }
            },
            green: {
                ground: "rgb(120, 165, 120)",
                icon: {
                    outer: "#5FBF4C",
                    inner: "#D3E8D0"
                }
            },
            red: {
                ground: "#AE7A6C",
                icon: {
                    outer: "#E63E2D",
                    inner: "#F4CECD"
                }
            },
            yellow: {
                ground: "rgb(175, 175, 110)",
                icon: {
                    outer: "#E6A82E",
                    inner: "#F6E1CD"
                }
            }
        },
        gate: "#d146d1",
        pot: {
            blue: "#0580f4",
            green: "#3FAF00",
            purple: "#BD3AD3",
            red: "#E04834",
            yellow: "#CDBA08",
            label: "#d0cb7b"
        }
    }

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

            var stronghold : MissionDataType["stronghold"] = [];
            var gates : MissionDataType["gates"] = [];

            // Strongholds
            if (svgProps.paths.strongholds !== undefined) {
                (svgProps.paths.strongholds).forEach( (base:svg_StrongholdType, index:number) => {
                    let baseData = base.data
                    if (baseData === undefined)
                        return

                    // Show
                    let hasAppeared = selectedMissionPassed(baseData.appear?.mission, true)
                    let hasDisappeared = selectedMissionPassed(baseData.disappear?.mission, false)
                    let show = (hasAppeared && !hasDisappeared)

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
                    
                    stronghold[index] = {appear: show, allegiance: allegiance}
                })
            }

            // Gates
            if (svgProps.paths.gates !== undefined) {
                (svgProps.paths.gates).forEach( (gate:svg_GateType, index:number) => {
                    let hasAppeared = selectedMissionPassed(gate.appear, true)
                    let hasDisappeared = selectedMissionPassed(gate.disappear, false)
                    let show = (hasAppeared && !hasDisappeared)
                    gates[index] = {appear: show}
                    // if (index == 0)
                    //     console.log(`Gate [hasAppeared: ${hasAppeared}] [hasDisappeaered: ${hasDisappeared}]`)
                })
            }
            setMissionData({stronghold:stronghold,gates:gates})
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

    /**
     * Compares the currently selected mission to the target.
     * Returns true if the selected mission is at, or has passed the target.
     * 
     * @param target: When your object appears/dissappears.
     * @param appear: True if you're using the appear data. 
     * False if you're using the dissapear data.
     */
    function selectedMissionPassed(target : number[]|undefined, appear : boolean) {
        // If no specified appear time, return true if appear, false if disappear
        if (target === undefined || target === null)
            return appear

        let keys = Object.keys(selectedMissionRow) as unknown as Array<string>
        // If no mission is selected, return true if appear, false if disappear
        if (keys.length == 0)
            return appear;
        let selected : number[] = keys[0].split('.').map(x=>Number(x));

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
                                fill={fills.base} 
                                transform={svgProps.paths.full.transform} 
                                d={svgProps.paths.full.d} 
                            />
                            {
                                // Strongholds
                                svgProps.paths.strongholds.map( (path : svg_StrongholdType, index : number) => {
                                    let show = (missionData.stronghold[index] !== undefined) ? missionData.stronghold[index].appear : true;
                                    if (!show)
                                        return <></>

                                    let allegiance = (missionData.stronghold[index] !== undefined) ? missionData.stronghold[index].allegiance : "red";
                                    return (<>
                                        <path 
                                            fill={(path.fill !== undefined) ? path.fill : fills.stronghold[allegiance].ground} 
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
                                                fill={(path.fill !== undefined) ? path.fill : fills.gate} 
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
                                            fill={fills.pot[path.colour]} 
                                            stroke="black" stroke-width="3" stroke-linecap="round"
                                            d={"M 0 0 c 3.199 6.3981 3.199 7.4644 0.5332 10.1303 c -12.2631 10.1303 -10.1304 34.6564 15.462 34.6564 c 22.3934 0 27.7252 -24.5261 15.4621 -34.6564 c -2.6659 -2.6659 -2.6659 -3.7322 0.5332 -10.1303 z"}
                                        />
                                        <path
                                            fill={fills.pot.label}
                                            d={"M -2.25 27.5 c 0 8 3 8 8 8 l 19 0 c 5 0 8 0 8 -8 z"}
                                        />
                                    </g>
                                ))
                            }
                            {
                                // Units
                                Object.values(svgProps.paths.units).map( (unit) => {
                                    // Make sure it's not dummy entry
                                    if (unit.coords.x === -1 && unit.coords.y === -1)
                                        return <></>

                                    let tileWidth : number = svgProps.size.pixels.width / svgProps.size.squares.width;

                                    return (
                                        <use 
                                            style={{ "--transformX": (unit.coords.x-0.5)*tileWidth , "--transformY" : (unit.coords.y-0.5)*tileWidth } as React.CSSProperties}
                                            className="map-grid-tile-unit-sprite"
                                            xlinkHref={unit.class.sprite.url} 
                                        />
                                )})
                            }
                        </svg>
                        <GridContainer 
                            svgProps={svgProps} 
                            fills={fills} 
                            setGridCords={setGridCords} 
                            missionData={missionData}
                        />
                    </div> {/* map-svg-grid-container */}
                </div> { /* map-svg-grid-scroll-container */}
            </div>
        </div>
    )
    
}