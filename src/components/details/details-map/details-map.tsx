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
import { url } from 'inspector';

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
    markings : {appear: boolean}[];
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
                    let show = calculateShow_multipleTriggers(unit.appearAndDisappear)
                    units[key] = {show: show}
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

        svgProps!.paths.markings.forEach( (marking : svg_MarkingsType, index : number) => {
            let show = (missionData.markings[index] !== undefined) ? missionData.markings[index].appear : true;
            if (!show)
                return <></>

            let fill = "";
            switch (marking.type) {
                case "rect" : 
                    if (animated) return;
                    switch (marking.colour) {
                        case "green" : fill="url(#map-green-shine-animation)"
                    }
                    markings.push(
                        <rect
                            key={"mapMarking-" + index}
                            x={marking.x} y={marking.y}
                            width={marking.width} height={marking.height}
                            fill="none"
                            stroke={fill} stroke-width="3" stroke-linecap="round" vector-effect="non-scaling-stroke"
                        />
                    )
                    break;
                case "cross" : 
                    if (!animated) return;
                    switch (marking.colour) {
                        case "green" : fill="url(#map-green-shine-animation)"
                    }
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
                                    fill={fill}
                                />
                            </g>
                            {/* Solid portion */}
                            <use
                                xlinkHref="#map-cross-icon"
                                x={marking.x} y={marking.y}
                                fill={fill}
                            />
                        </g>
                    )
                    break;
                case "unit-circle" : 
                    if (animated) return;
                    switch (marking.colour) {
                        case "green" : fill="url(#map-green-shine-animation)"
                    }
                    markings.push(
                        <circle
                            key={"mapMarking-" + index}
                            cx={(marking.x!-0.5)*tileSize} cy={(marking.y!-0.5)*tileSize}
                            r={tileSize*0.25*yZoom}
                            fill="none"
                            stroke={fill} stroke-width="3" stroke-linecap="round" vector-effect="non-scaling-stroke"
                        />
                    )
                    break;
                case "unit-point-arrow" : 
                    if (!animated) return;
                    switch (marking.colour) {
                        case "green" : fill="url(#map-green-shine-animation)"
                    }
                    let x1 = (marking.xOne!-0.5)*tileSize;
                    let y1 = (marking.yOne!-0.5)*tileSize;
                    let x2 = marking.xTwo!;
                    let y2 = marking.yTwo!;
                    let length = Math.sqrt( ((x2-x1)**2) + ((y2-y1)**2) );
                    // console.log(`Math.sqrt( ((${x2}-${x1})**2) + ((${y2}-${y1})**2) )`)
                    // console.log(`Math.sqrt( ((${x2-x1})**2) + ((${y2-y1})**2) )`)
                    // console.log(`Math.sqrt( (${(x2-x1)**2}) + (${(y2-y1)**2}) )`)
                    // console.log(`Math.sqrt( ${((x2-x1)**2) + ((y2-y1)**2)} )`)
                    // console.log(`${Math.sqrt( ((x2-x1)**2) + ((y2-y1)**2) )} `)
                    let height =  yZoom * 8;
                    markings.push(
                        <g fill="url(#map-arrow-pattern-green)">

                            <rect 
                                x={x1} y={y1} 
                                width={length} height={height} 
                                fill="rgba(255, 125, 125, 0.5)" 
                            />
                            <rect 
                                x={0} y={height/2} 
                                width={length} height={height} 
                                // fill="url(#map-arrow-pattern-green)" 
                            />
                            <rect 
                                x={0} y={height/2} 
                                width={length} height={height} 
                                fill="rgba(255, 0, 0, 0.3)" 
                            />
                            <path 
                                d={`M 0 0 L ${height} ${height} L 0 ${height*2} z`} 
                                transform={`translate(${length},0)`}
                            />
                            <path 
                                d={`M 0 0 L ${height} ${height} L 0 ${height*2} z`} 
                                transform={`translate(${length},0)`}
                                fill="rgba(255, 0, 0, 0.3)"
                            />
                            {/* <line 
                                x1={0} y1={yZoom*25} 
                                x2={x1+length} y2={yZoom*25} 
                                stroke="url(#map-arrow-pattern-green)" stroke-width={yZoom*10} stroke-linecap="round" vector-effect="non-scaling-stroke"
                                marker-end="url(#map-arrowhead-marker)"
                            /> */}
                            {/* <rect 
                                x={x1} y={y1} 
                                width={length} height={height} 
                                fill="url(#map-arrow-pattern-green)" 
                            /> */}

                        {/* <line 
                            x1={x1} y1={y1} 
                            x2={x1+length} y2={y1} 
                            stroke="url(#map-arrow-pattern-green)" stroke-width="10" stroke-linecap="round" vector-effect="non-scaling-stroke"
                            marker-end="url(#map-arrowhead-marker)" 

                            stroke-opacity="0"
                        /> */}
                        </g>
                        // <circle
                        //     key={"mapMarking-" + index}
                        //     cx={(marking.x!-0.5)*tileSize} cy={(marking.y!-0.5)*tileSize}
                        //     r={tileSize*0.25*yZoom}
                        //     fill="none"
                        //     stroke={fill} stroke-width="3" stroke-linecap="round" vector-effect="non-scaling-stroke"
                        // />
                    )
                    break;
            }
        })
        return (
            <g id={`map-marking-container${(animated)?"-animated":""}`}>
                <defs>
                    <linearGradient id="map-green-shine-animation" x1="-100%" y1="100%" x2="400%" y2="-400%" >
                        <stop offset="0" stop-color="#50AB30">
                            <animate attributeName="offset" values="0;0.9" dur="2s" repeatCount="indefinite"  /> 
                        </stop>
                        <stop offset="0" stop-color="#76eb5f">
                            <animate attributeName="offset" values="0;0.9" dur="2s" repeatCount="indefinite"  /> 
                        </stop>
                        <stop offset="0.1" stop-color="#76eb5f">
                            <animate attributeName="offset" values="0.1;1" dur="2s" repeatCount="indefinite"  /> 
                        </stop>
                        <stop offset="0.1" stop-color="#50AB30">
                            <animate attributeName="offset" values="0.1;1" dur="2s" repeatCount="indefinite"  /> 
                        </stop>
                    </linearGradient>
                    <marker
                        id="map-arrowhead-marker"
                        viewBox="0 0 10 10"
                        refX="0"
                        refY="5"
                        markerWidth="3"
                        markerHeight="3"
                        orient="auto">
                        <path d="M 0 0 L 5 5 L 0 10 z" fill="context-stroke" />
                    </marker>
                    {/* <pattern
                        //id="map-arrow-pattern-green"
                        // x="0" y="0" width="10" height="10" 
                        // patternUnits="userSpaceOnUse"
                        // x="0" y="0" width="0.1" height="0.1"
                        // patternUnits="objectBoundingBox"
                        // patternContentUnits="objectBoundingBox"
                        // patternTransform="translate(0,0)"
                    // > */}
                    <pattern
                        id="map-arrow-pattern-green"
                        patternUnits="userSpaceOnUse" 
                        y={((yZoom*10)/2)/100} 
                        width="20" height={yZoom * 10}>
      {/* <!-- Right-pointing chevron scaled to pattern height --> */}
      <path 
        d={`M 0 0 L 10 ${(yZoom*10)/2} L 0 ${yZoom*10}`} 
        stroke="#007BFF" stroke-width="1.5" fill="none" 
    />
      <animateTransform
        attributeName="patternTransform"
        type="translate"
        from="0,0"
        to="20,0"
        dur="2s"
        repeatCount="indefinite"/>

        {/* <pattern
            id="map-arrow-pattern-green"
            patternUnits="objectBoundingBox" 
            y={((yZoom*10)/2)/100} 
            width="0.02" height={1}>
      <path d={`M0,0 L10,${(yZoom*10)/2}L0,${yZoom*10}`} stroke="#007BFF" stroke-width="1.5" fill="none" /> */}


                    </pattern>
                </defs>
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
                                    if (unit.coords.x === -1 && unit.coords.y === -1)
                                        return <></>

                                    let show = (missionData.units[key] !== undefined) ? missionData.units[key].show : true;

                                    let mapIconSprite = unit.class.name + ((unit.gender===undefined)?"":"-f")
                                    let centerX = MapIcons.unitSprite[mapIconSprite].width/2;
                                    let centerY = MapIcons.unitSprite[mapIconSprite].height/2;
                                    if (show) {
                                        if (unit.class.sprite.show === true)
                                            return (

                                                <use
                                                    data-col={unit.coords.x}
                                                    data-row={unit.coords.y}
                                                    key={"mapUnit-" + key}
                                                    xlinkHref={unit.class.sprite.url}
                                                    style={{ transformOrigin: '"center"' }}
                                                    transform={
                                                        `translate(${ ((unit.coords.x-0.5)*tileSize) + centerX },${ ((unit.coords.y-0.5)*tileSize) + centerY }) ` +
                                                        `translate(${-centerX},${-centerY})` +
                                                        `scale(${yZoom},${yZoom}) ` +
                                                        `translate(${-centerX},${-centerY})`}
                                                />
                                            )
                                        else {
                                            let scale = 0.5;
                                            return (
                                                <g 
                                                    transform={`translate(${-5*scale},${-5*scale}) translate(${((unit.coords.x-0.5)*tileSize)},${((unit.coords.y-0.5)*tileSize)}) scale(${scale},${scale})`}
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