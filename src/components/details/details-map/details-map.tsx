import React, {useEffect, useState, useRef, useMemo, useContext} from 'react';
import { JSX } from 'react/jsx-runtime';
import { GridContainer } from './details-map-grid-container';
import Slider from '@mui/material/Slider'
import { ClassType } from '../../data-classes/class-data';
import { WeaponDataType } from '../../data-classes/weapon-data';
import { DatabaseContext, BattlesTableContext, MissionsTableContext, MapContext, Dictionary } from '../../../context';
import { MapIcons } from '../../data-classes/map-icon-data';
import { CSSProperties } from '@mui/material';
import { ItemType } from '../../data-classes/item-data';

/* 
    Websites
    https://www.photopea.com/
    https://www.freeconvert.com/png-to-svg
*/

// === Map Objects ===

interface svg_PathType {
    full : svg_GroundType;
    strongholds : svg_StrongholdType[];
    bases : svg_BaseType[];
    gates : svg_GateType[];
    chests : svg_ChestType[];
    pots : svg_PotType[];
    markings: svg_MarkingsType[];
    units : Dictionary<UnitDataType>;
}

interface svg_GroundType { // Base ground path
    transform : string;
    d : string;
}

export interface svg_StrongholdType {
    translate : CoordinateType;
    d : string;
    icon ?: {
        translate : CoordinateType;
        coords : CoordinateType;
    }
    data ?: StrongholdDataType | undefined;
    fill ?: string;
}

export interface svg_BaseType {
    icon : {
        translate : CoordinateType;
        coords : CoordinateType;
    };
    data : BaseDataType;
    fill ?: string;
}

interface svg_GateType {
    transform ?: string;
    d ?: string;
    fill ?: string;
    appear ?: number[];
    disappear ?: number[];
}

export interface svg_ChestType {
    icon : {
        translate : CoordinateType;
        coords : CoordinateType;
    };
    item ?: string|ItemType;
}

interface svg_PotType {
    colour : string;
    m : CoordinateType;
    coords : CoordinateType;
    fill ?: string;
}

interface svg_MarkingsType {
    type : string;
    appearAndDisappear : [number[],boolean][];
    colour ?: string;
    x ?: number;
    y ?: number;
    width ?: number;
    height ?: number;

    xOne ?: number;
    yOne ?: number;
    xTwo ?: number;
    yTwo ?: number;
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
    chest ?: svg_ChestType;
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
    appearAndDisappear ?: [number[],boolean][];
    captain: (string|UnitDataType)[];
    colour : [number[], string][];
}

export interface BaseDataType {
    icon : {
        transform : string;
        coords : CoordinateType;
    };
    appearAndDisappear ?: [number[],boolean][];
    colour : [number[], string][];
    captain: (string|UnitDataType)[];
    fill ?: string;
}

export interface UnitDataType {
    name : string;
    gender ?: string;
    named ?: {
        timeskip ?: string;
    };
    monster ?: {
        sprite : string;
        hpGauges : number;
        barriers : [string, string, string, string];
    };
    crest ?: {name: string, type: string, level: number}[];
    class : ClassType;
    weapon : {
        name : string;
        data ?: WeaponDataType;
    };
    allegiance : string;
    faction ?: string;
    appearAndDisappear ?: [number[],boolean][];
    coords : [ number[], CoordinateType][];
    stats ?: {
        hp : number,
        move ?: number,
        str : number,
        mag : number,
        dex : number,
        spd : number,
        lck : number,
        def : number,
        res : number,
        cha : number
    }
    notes ?: string;
}

// === Mission Data ===
export interface MissionDataType {
    strongholds : {appear: boolean, allegiance: string}[];
    bases : {appear: boolean, allegiance: string}[];
    gates : {appear: boolean}[];
    markings : {appear: boolean}[];
    units : Dictionary<{show : boolean, coords : CoordinateType}>;
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
    const [missionData, setMissionData] = useState<MissionDataType>({strongholds:[],bases:[],gates:[],markings:[],units:{}})
    const [mapZoomExpanded, setMapZoomExpanded] = useState<boolean>(false);
    const scrollElement = useRef(null);
    const [scrollElementScrollbarOn, setScrollElementScrollbarOn] = useState(false);
    const [mapZoom, setMapZoom] = useState<number>(100);
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
            var markings : MissionDataType["markings"] = [];
            var units : MissionDataType["units"] = {};

            // Strongholds
            if (svgProps.paths.strongholds !== undefined) {
                (svgProps.paths.strongholds).forEach( (base:svg_StrongholdType, index:number) => {
                    let baseData = base.data
                    if (baseData === undefined)
                        return

                    // Show
                    let show = calculateShow_multipleTriggers(baseData.appearAndDisappear)

                    // Colour
                    let allegiance = (show) ? calculateAllegiance(baseData.colour) : "red"
                    
                    strongholds[index] = {appear: show, allegiance: allegiance}
                })
            }

            // Bases
            if (svgProps.paths.bases !== undefined) {
                (svgProps.paths.bases).forEach( (base:svg_BaseType, index:number) => {
                    let baseData = base.data
                    if (baseData === undefined)
                        return

                    // Show
                    let show = calculateShow_multipleTriggers(baseData.appearAndDisappear)

                    // Colour
                    let allegiance = (show) ? calculateAllegiance(baseData.colour) : "red"
                    
                    bases[index] = {appear: show, allegiance: allegiance}
                })
            }

            // Gates
            if (svgProps.paths.gates !== undefined) {
                (svgProps.paths.gates).forEach( (gate:svg_GateType, index:number) => {
                    let show = calculateShow(gate.appear, gate.disappear)
                    gates[index] = {appear: show}
                })
            }

            // Markings
            if (svgProps.paths.markings !== undefined) {
                (svgProps.paths.markings).forEach( (marking:svg_MarkingsType, index:number) => {
                    let show = calculateShow_multipleTriggers(marking.appearAndDisappear, false)
                    markings[index] = {appear: show}
                })
            }

            // Units
            if (svgProps.paths.units !== undefined) {
                Object.entries(svgProps.paths.units).forEach( ([key,unit] : [string,UnitDataType]) => {
                    let show = calculateShow_multipleTriggers(unit.appearAndDisappear);
                    let coords = calculateCoords_multipleTriggers(unit.coords);
                    units[key] = {show: show, coords: coords}
                })
            }

            setMissionData({strongholds:strongholds,bases:bases,markings:markings,gates:gates,units:units})
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

    function calculateShow_multipleTriggers(appearAndDisappear : [number[],boolean][]|undefined, noMissionDefault ?: boolean) {
        if (appearAndDisappear === undefined)
            return true;

        let show = false;

        // If there is no mission selected, then show
        let keys = Object.keys(selectedMissionRow) as unknown as Array<string>
        if (keys.length == 0)
            return (noMissionDefault === undefined) ? true : noMissionDefault;
        let selected : number[] = keys[0].split('.').map(x=>Number(x));

        for (let index = 0; index < appearAndDisappear.length; index++) {
            let [mission, appear] : [number[],boolean] = appearAndDisappear[index]
            // If mission passed, update show
            if (selectedMissionPassed(mission, true, selected))
                show = appear
            // If not passed, break
            else
                break;
        }
        return show;
    }

    function calculateCoords_multipleTriggers(missionCoords : [number[],CoordinateType][]) : CoordinateType {
        let resCoords = {x:0,y:0};

        // No coord data on mapobject
        if (missionCoords === undefined || missionCoords.length === 0)
            return resCoords;

        // If there is no mission selected, then give first coords
        let keys = Object.keys(selectedMissionRow) as unknown as Array<string>
        if (keys.length == 0)
            return missionCoords[0][1];
        let selected : number[] = keys[0].split('.').map(x=>Number(x));

        for (let index = 0; index < missionCoords.length; index++) {
            let [mission, coords] : [number[],CoordinateType] = missionCoords[index]
            // If mission passed, update coords
            if (selectedMissionPassed(mission, true, selected))
                resCoords = coords
            // If not passed, break
            else
                break;
        }
        return resCoords;
    }

    function calculateAllegiance(colours: [number[],string][]) {
        let allegiance = "red";

        // Default to red if no colours specified
        if (colours === undefined || colours.length == 0)
            return allegiance;

        // If there is no mission selected, then return first colour
        let keys = Object.keys(selectedMissionRow) as unknown as Array<string>
        if (keys.length == 0)
            return colours[0][1];
        let selected : number[] = keys[0].split('.').map(x=>Number(x));

        for (let index = 0; index < colours.length; index++) {
            let [mission, colour] : [number[],string] = colours[index]
            // If mission passed, update allegiance
            if (selectedMissionPassed(mission, true, selected))
                allegiance = colour
            // If not passed, break
            else
                break;
        }
        return allegiance;        
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
        // TESTING! REMOVE BELOW LINE ONCE DONE
        return appear;
        
        /*
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
        */

        /* 
        MISSION             3-0         | 3 - 0
            GROUP           3?1.1       | 3 ? 1.1
                MISSION     3?1.1-0     | 3 ? 1.1 - 0
                MISSION     3?1.1-1     | 3 ? 1.1 - 1
            GROUP           3?1.2       | 3 ? 1.2
                MISSION     3?1.2-0     | 3 ? 1.2 - 0
                MISSION     3?1.2-1     | 3 ? 1.2 - 1
                MISSION     3?1.2-2     | 3 ? 1.2 - 2
                GROUP       3?1.2?3.1   | 3 ? 1.2 ? 3.1
                    MISSION 3?1.2?3.1-0 | 3 ? 1.2 ? 3.1 - 0
                GROUP       3?1.2?3.2   | 3 ? 1.2 ? 3.2
                    MISSION 3?1.2?3.2-0 | 3 ? 1.2 ? 3.2 - 0
                MISSION     3?1.2-4     | 3 ? 1.2 - 4
                GROUP       3?1.2?5.1   | 3 ? 1.2 ? 5.1
                    MISSION 3?1.2?5.1-0 | 3 ? 1.2 ? 5.1 - 0

            From the algorithm below, the "?" and "-" don't really matter, so they can all just be "-".
            However, they cannot be "." since those do matter.
        */

        /* 
            Go through them one by one

            Exists?
                If !t and !s, true (reached end without a false)
                If t and !s, false
                If !t and s, true
                If both exist, continue

            Decimal?
                If both are decimal,
                    and decimal is different, false
                    and decimal is same, continue
                If one is decimal and the other is not, round both down and then compare
                If both are not decimal, compare

            Compare?
                If t > s, false
                If t < s, true
                If t = s, continue
        */
    }

    // console.log(`Details-Map rerendered`)

    if (svgProps === undefined) {
        return <>No data for this chapter yet...</>;
    }

    if (svgProps === null) {
        return <>Select a chapter.</>;
    }

    // ---------------------
    // --- Return Helper ---
    // ---------------------

    let tileSize : number = svgProps.size.pixels.width / svgProps.size.squares.width;
    let xZoom = (600-mapZoom)/100;
    let yZoom = (0.125*(xZoom**2)) - (0.125*xZoom) + 1

    // === Strongholds ===
    function getAllStrongholds() {
        var strongholds : React.SVGProps<SVGGElement>[] = []

        let center = MapIcons.strongholdSize/2;
        let tileRatio = (tileSize*(28/48))/MapIcons.strongholdSize
        let size = tileRatio * yZoom

        svgProps!.paths.strongholds.forEach( (path : svg_StrongholdType, index : number) => {
            let show = (missionData.strongholds[index] !== undefined) ? missionData.strongholds[index].appear : true;
            if (!show)
                return <></>

            let allegiance = (missionData.strongholds[index] !== undefined) ? missionData.strongholds[index].allegiance : "red";
            strongholds.push(<>
                <path 
                    fill={(path.fill !== undefined) ? path.fill : MapIcons.fills.stronghold[allegiance].ground} 
                    transform={`translate(${path.translate.x},${path.translate.y})`} 
                    d={path.d}
                    key={"mapStronghold-" + index}
                />
                {/* Icon */}
                {
                    (path.icon != null) && (
                        <g
                            transform={
                                `translate(${ path.icon?.translate.x + center },${ path.icon?.translate.y + center })
                                scale(${size},${size})
                                translate(${-center},${-center})`
                            }
                        >
                            {MapIcons.stronghold[allegiance].g}
                        </g>
                    )
                }
            </>)
        })

        return (
            <g id="map-stronghold-container">
                <defs>
                    {["blue", "green", "red", "yellow"].map( 
                        (colour) => 
                        <>{MapIcons.stronghold[colour].g}</>
                    )}
                </defs>
                <>{strongholds}</>
            </g>)
    }

    // === Bases ===
    function getAllBases() {
        var bases : React.SVGProps<SVGGElement>[] = []

        let centerX = MapIcons.baseWidth/4;
        let centerY = MapIcons.baseHeight/4;
        let tileRatioX = (tileSize*(12.375/48))/MapIcons.baseWidth
        let tileRatioY = (tileSize*(22/48))/MapIcons.baseHeight
        let sizeX = tileRatioX * yZoom
        let sizeY = tileRatioY * yZoom

        svgProps!.paths.bases.forEach( (path : svg_BaseType, index : number) => {
            let show = (missionData.bases[index] !== undefined) ? missionData.bases[index].appear : true;
            if (!show)
                return <></>

            let allegiance = (missionData.bases[index] !== undefined) ? missionData.bases[index].allegiance : "red";
            
            bases.push(<>
                {
                    (path.icon != null) && (
                        <g
                            transform={
                                `translate(${ path.icon?.translate.x + centerX},${ path.icon?.translate.y + centerY }) 
                                scale(${sizeX},${sizeY})
                                translate(${-centerX},${-centerY})`
                            }
                            fill={(path.fill !== undefined) ? path.fill : ""} 
                        >
                            {MapIcons.base[allegiance].g}
                        </g>
                    )
                }
            </>)
        })

        return (
            <g id="map-base-container">
                <defs>
                    {["blue", "green", "red", "yellow"].map( 
                        (colour) => 
                        <>{MapIcons.base[colour].g}</>
                    )}
                </defs>
                <>{bases}</>
            </g>)
    }

    // === Markings ===
    function getAllMarkings(animated : boolean = false) {
        var markings : React.SVGProps<SVGGElement>[] = []

        // Colours
        let colours : Dictionary<[string, string]>= {
            "green" : ["#50AB30", "#76eb5f"],
            "red" : ["#5a0609", "#a61518"]
        };

        svgProps!.paths.markings.forEach( (marking : svg_MarkingsType, index : number) => {
            let show = (missionData.markings[index] !== undefined) ? missionData.markings[index].appear : true;
            if (!show)
                return <></>

            switch (marking.type) {
                case "rect" : 
                    if (animated) return;
                    
                    markings.push(
                        <rect
                            key={"mapMarking-" + index}
                            x={marking.x} y={marking.y}
                            width={marking.width} height={marking.height}
                            fill="none"
                            stroke={`url(#map-${marking.colour}-shine-animation)`} stroke-width="3" stroke-linecap="round" vector-effect="non-scaling-stroke"
                        />
                    )
                    break;
                case "cross" : 
                    if (!animated) return;

                    markings.push(
                        <g key={"mapMarking-" + index}>
                            {/* Black Cross creating outline */}
                            <g  className="map-cross-icon-pulse" style={{filter: "blur(5px)"}}>
                                <use
                                    xlinkHref="#map-cross-icon"
                                    x={marking.x} y={marking.y}
                                    fill="rgb(0,0,0,0.5)"
                                />
                            </g>
                            {/* Blurred Circle Shadow */}
                            <g className="map-cross-shadow-icon-pulse">
                                <circle
                                    cx={marking.x!+(MapIcons.crossSize/2)} cy={marking.y!+(MapIcons.crossSize/2)}
                                    r={MapIcons.crossSize}
                                    fill="white"
                                />
                            </g>
                            {/* Expanding portion (lower opacity) */}
                            <g  className="map-cross-icon-pulse">
                                <use
                                    xlinkHref="#map-cross-icon"
                                    x={marking.x} y={marking.y}
                                    fill={`url(#map-${marking.colour}-shine-animation)`}
                                />
                            </g>
                            {/* Solid portion */}
                            <use
                                xlinkHref="#map-cross-icon"
                                x={marking.x} y={marking.y}
                                fill={`url(#map-${marking.colour}-shine-animation)`}
                                stroke="rgba(0,0,0,0.7)" stroke-width="1" stroke-linecap="round" vector-effect="non-scaling-stroke"
                            />
                        </g>
                    )
                    break;
                case "unit-circle" : 
                    if (animated) return;

                    markings.push(
                        <circle
                            key={"mapMarking-" + index}
                            cx={(marking.x!-0.5)*tileSize} cy={(marking.y!-0.5)*tileSize}
                            r={tileSize*0.25*yZoom}
                            fill="none"
                            stroke={`url(#map-${marking.colour}-shine-animation)`} stroke-width="3" stroke-linecap="round" vector-effect="non-scaling-stroke"
                        />
                    )
                    break;
                case "unit-point-arrow" : 
                    if (animated) return;

                    let [rgbDark, rgbLight] = colours[marking.colour!]

                    let x1 = (marking.xOne!-0.5)*tileSize;
                    let y1 = (marking.yOne!-0.5)*tileSize;
                    let x2 = marking.xTwo!;
                    let y2 = marking.yTwo!;
                    let rotation = Math.atan2(y1-y2, x2-x1) * (180/Math.PI);
                    let totalLength = Math.sqrt( ((x2-x1)**2) + ((y2-y1)**2) );
                    let rectHeight =  yZoom * 8;
                    let totalHeight = rectHeight * 2;
                    let midHeight = totalHeight/2;
                    let arrowLength = midHeight;
                    let rectLength = totalLength - arrowLength;
                    let rectY = midHeight - (rectHeight/2)
                    let outlineOffset = yZoom * 1.1;
                    
                    markings.push(
                        <g 
                            key={"mapMarking-" + index}
                            fill={`url(#map-arrow-pattern-${marking.colour})`}
                            transform={`translate(${x1},${y1}) rotate(${-rotation}) translate(0,${-midHeight})`}
                        >
                            {/* Background */}
                            <rect 
                                x={0} y={rectY} 
                                width={rectLength} height={rectHeight} 
                                fill={rgbDark+"80"}
                            />
                            <path 
                                d={`M ${rectLength} 0 L ${totalLength} ${midHeight} L ${rectLength} ${totalHeight} z`}
                                fill={rgbDark+"80"}
                            />
                            {/* Pattern */}
                            <rect 
                                x={0} y={rectY} 
                                width={rectLength} height={rectHeight} 
                            />
                            <path 
                                d={`M ${rectLength} 0 L ${totalLength} ${midHeight} L ${rectLength} ${totalHeight} z`}
                            />
                            {/* Outlines */}
                            <path
                                d={
                                    `M ${0+outlineOffset} ${rectY+outlineOffset} L ${rectLength+outlineOffset} ${rectY+outlineOffset}` +
                                    `L ${rectLength+outlineOffset} ${0+(outlineOffset*2)} L ${totalLength-(outlineOffset*1.5)} ${midHeight} L ${rectLength+outlineOffset} ${totalHeight-(outlineOffset*2)} L ${rectLength+outlineOffset} ${rectY+rectHeight-outlineOffset}` +
                                    `L ${0-outlineOffset} ${rectY+rectHeight-outlineOffset}`
                                }
                                stroke={rgbLight} stroke-width="1.5" vector-effect="non-scaling-stroke" fill="none"
                            />
                            <path
                                d={
                                    `M 0 ${rectY} L ${rectLength} ${rectY}` +
                                    `L ${rectLength} 0 L ${totalLength} ${midHeight} L ${rectLength} ${totalHeight} L ${rectLength} ${rectY+rectHeight}` +
                                    `L 0 ${rectY+rectHeight}`
                                }
                                stroke="rgba(0,0,0,0.7)" stroke-width="1" vector-effect="non-scaling-stroke" fill="none" 
                            />                           
                        </g>
                    )
                    break;
            }
        })

        // Arrow Pattern numbers
        let arrowTotalHeight = (yZoom*8) * 2;

        return (
            <g id={`map-marking-container${(animated)?"-animated":""}`}>
                {   
                    (!animated) &&
                    <defs>
                        {Object.entries(colours).map(([text, [rgbDark, rgbLight]]) => (
                            <linearGradient 
                                id={`map-${text}-shine-animation`} key={`map-${text}-shine-animation`} 
                                x1="-100%" y1="100%" x2="400%" y2="-400%" 
                            >
                                <stop offset="0" stop-color={rgbDark}>
                                    <animate attributeName="offset" values="0;0.9" dur="2s" repeatCount="indefinite"  /> 
                                </stop>
                                <stop offset="0" stop-color={rgbLight}>
                                    <animate attributeName="offset" values="0;0.9" dur="2s" repeatCount="indefinite"  /> 
                                </stop>
                                <stop offset="0.1" stop-color={rgbLight}>
                                    <animate attributeName="offset" values="0.1;1" dur="2s" repeatCount="indefinite"  /> 
                                </stop>
                                <stop offset="0.1" stop-color={rgbDark}>
                                    <animate attributeName="offset" values="0.1;1" dur="2s" repeatCount="indefinite"  /> 
                                </stop>
                            </linearGradient>
                        ))}
                        
                        {Object.entries(colours).map(([text, [_, rgb]]) => (
                            <pattern
                                id={`map-arrow-pattern-${text}`} key={`map-arrow-pattern-${text}`}
                                patternUnits="userSpaceOnUse" 
                                y="0" 
                                width={arrowTotalHeight/2} height={arrowTotalHeight}
                                stroke={rgb}
                            >
                                <path 
                                    d={`M 0 0 L ${arrowTotalHeight/2} ${arrowTotalHeight/2} L 0 ${arrowTotalHeight}`} 
                                    stroke-width="1.5" vector-effect="non-scaling-stroke" fill="none" 
                                />
                                <animateTransform
                                    attributeName="patternTransform" type="translate"
                                    from="0,0" to={`${arrowTotalHeight},0`}
                                    dur="2s" repeatCount="indefinite"
                                />
                            </pattern>
                        ))}                        
                    </defs>
                }
                <>{markings}</>
            </g>)
    }

    // === Chests ===
    function getAllChests() {
        var chests : React.SVGProps<SVGGElement>[] = []

        let center = MapIcons.chestSize/2;
        let tileRatio = (tileSize*(20/48))/MapIcons.chestSize
        let size = tileRatio * yZoom

        svgProps!.paths.chests.forEach( (path : svg_ChestType, index : number) => {
            chests.push(
                <use
                    data-col={path.icon.coords.x}
                    data-row={path.icon.coords.y}
                    key={"mapChest-" + index}
                    xlinkHref={`#map-chest-icon`}
                    style={{ transformOrigin: '"center"' }}
                    transform={
                        `translate(${ path.icon.translate.x + center },${ path.icon.translate.y + center }) ` +
                        `scale(${size},${size}) ` +
                        `translate(${-center},${-center})`}
                />
            )
        })
        return (
            <g id="map-chest-container">
                <defs>{MapIcons.chest.g}</defs>
                <>{chests}</>
            </g>)
    }

    // === Pots ===
    function getAllPots() {
        var pots : React.SVGProps<SVGGElement>[] = []

        let centerX = MapIcons.potWidth/2;
        let centerY = MapIcons.potHeight/2;
        let tileRatioX = (tileSize*(14/48))/MapIcons.potWidth
        let tileRatioY = (tileSize*(13.855670103/48))/MapIcons.potHeight
        let sizeX = tileRatioX * yZoom
        let sizeY = tileRatioY * yZoom

        svgProps!.paths.pots.forEach( (path : svg_PotType, index : number) => {
            pots.push(
                <g
                    data-col={path.coords.x}
                    data-row={path.coords.y}
                    key={"mapPot-" + index}
                    style={{
                        "--x":path.m.x-centerX, "--y":path.m.y-centerY
                    } as CSSProperties}
                    className="map-scaleable-icon-wrapper"
                >
                    <use
                        xlinkHref={`#map-pot-icon-${path.colour}`}
                        style={{
                            "--x":centerX, "--y":centerY,
                            "--scaleX":sizeX, "--scaleY":sizeY,
                        } as CSSProperties}
                        className="map-scaleable-icon"
                    />
                </g>
            )
        })

        return (
            <g id="map-pot-container">
                <defs>
                    {["blue", "green", "purple", "red", "yellow"].map( 
                        (colour) => 
                        <>{MapIcons.pot[colour].g}</>
                    )}
                </defs>
                <>{pots}</>
            </g>)
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
                            <g id="map-ground-container">
                                <path 
                                    fill={MapIcons.fills.base} 
                                    transform={svgProps.paths.full.transform} 
                                    d={svgProps.paths.full.d} 
                                />
                            </g>
                            {getAllStrongholds()}
                            {getAllBases()}
                            <g id="map-gate-container">
                                <defs>{MapIcons.cross.g}</defs>
                                {
                                    // Gates
                                    svgProps.paths.gates.map( (path : svg_GateType, index : number) => {
                                        let show = (missionData.gates[index] !== undefined) ? missionData.gates[index].appear : true;
                                        if (!show)
                                            return <></>

                                        return (
                                            <g
                                                fill={(path.fill !== undefined) ? path.fill : MapIcons.fills.gate} 
                                                transform={path.transform} 
                                                key={"mapGate-" + index}
                                            >
                                                {
                                                    (path.d !== undefined) 
                                                    ? <path d={path.d} />
                                                    :  <use  xlinkHref="#map-cross-icon" />
                                                }
                                            </g>
                                        )
                                    })
                                }
                            </g>
                            {getAllChests()}
                            {getAllPots()}
                            {getAllMarkings(false)}
                            {
                                // Units
                                Object.entries(svgProps.paths.units).map( ([key, unit] : [string,UnitDataType]) => {
                                    // Make sure it's not dummy entry
                                    if (key === "-")
                                        return <></>

                                    let show = (missionData.units[key] !== undefined) ? missionData.units[key].show : true;
                                    let coords = (missionData.units[key] !== undefined) ? missionData.units[key].coords : {x:0,y:0};

                                    let mapIconSprite = 
                                        (unit.named!== undefined) 
                                        ? 
                                            unit.name + "-" + 
                                            (
                                                (unit.class.nameLower!==undefined)
                                                ? unit.class.nameLower
                                                : unit.class.name.toLowerCase()
                                            ) + 
                                            (
                                                (unit.named.timeskip!==undefined)
                                                ? "-" + unit.named.timeskip
                                                : ""
                                            )
                                        : (unit.class.name + ((unit.gender===undefined)?"":"-f"));
                                    let centerX = MapIcons.unitSprite[mapIconSprite].width/2;
                                    let centerY = MapIcons.unitSprite[mapIconSprite].height/2;
                                    if (show) {
                                        if (unit.class.sprite.show === true)
                                            return (

                                                <use
                                                    data-col={coords.x}
                                                    data-row={coords.y}
                                                    key={"mapUnit-" + key}
                                                    xlinkHref={unit.class.sprite.url}
                                                    style={{ transformOrigin: '"center"' }}
                                                    transform={
                                                        `translate(${ ((coords.x-0.5)*tileSize) + centerX },${ ((coords.y-0.5)*tileSize) + centerY }) ` +
                                                        `translate(${-centerX},${-centerY})` +
                                                        `scale(${yZoom},${yZoom}) ` +
                                                        `translate(${-centerX},${-centerY})`}
                                                />
                                            )
                                        else {
                                            let scale = 0.5;
                                            return (
                                                <g 
                                                    transform={`translate(${-5*scale},${-5*scale}) translate(${((coords.x-0.5)*tileSize)},${((coords.y-0.5)*tileSize)}) scale(${scale},${scale})`}
                                                    className="map-grid-tile-unit-dot"
                                                >
                                                    {MapIcons.unitDot[unit.allegiance].g}
                                                </g>
                                            )
                                        }
                                    }
                                    else
                                        return <></>
                                })
                            }
                            {getAllMarkings(true)} {/* Animated needs to be at end to avoid blur on elements appearing after */}
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