import React, {useEffect, useState, useRef, useMemo, useContext} from 'react';
import { JSX } from 'react/jsx-runtime';
import { GridContainer } from './details-map-grid-container';
import Slider from '@mui/material/Slider'
import { Classes, ClassType } from '../../data-classes/class-data';
import { WeaponDataType } from '../../data-classes/weapon-data';
import { DatabaseContext, BattlesTableContext, MissionsTableContext, MapContext, Dictionary } from '../../../context';
import { MapIcons, SpriteRotator } from '../../data-classes/map-icon-data';
import { CSSProperties } from '@mui/material';
import { ItemType } from '../../data-classes/item-data';
import { MRT_RowSelectionState } from 'material-react-table';

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
    markings : svg_MarkingsType[];
    player : svg_PlayerType[];
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

export interface svg_PlayerType {
    coords : CoordinateType,
    allegiance : string;
    "tile-type" : string;
    "fixed-unit" ?: UnitDataType[];
    note ?: string;
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
    playerTile ?: svg_PlayerType;
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
    appearAndDisappear : [number[],boolean][];
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
    const [svgProps, setSvgProps] = useContext(MapContext).svg!;
    const [gridData, setGridData] = useContext(MapContext).tileData!;
    const [gridCords, setGridCords] = useState<CoordinateType | null>(null);
    const [missionData, setMissionData] = useState<MissionDataType>({strongholds:[],bases:[],gates:[],markings:[],units:{}})
    const [mapZoomExpanded, setMapZoomExpanded] = useState<boolean>(false);
    const scrollElement = useRef(null);
    const [scrollElementScrollbarOn, setScrollElementScrollbarOn] = useState(false);
    const [mapZoom, setMapZoom] = useState<number>(100);
    // const maps = useContext(DatabaseContext).map;

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

        async function asyncFetch() {
            console.log(`${process.env.PUBLIC_URL}/db/maps/${key}.json`)
            let response = await fetch(`${process.env.PUBLIC_URL}/db/maps/${key}.json`);

            if (!response.ok) setSvgProps(undefined)
            
            let json;
            try {
                json = await response.json();
                setSvgProps(json);
            }
            catch { 
                console.log('No data found for battle.');
                setSvgProps(undefined);
            }
        }

        asyncFetch();
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
                    gates[index] = {appear: (show as boolean)}
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
        let hasAppeared = selectedMissionPassed_calcSelected(appear, true, selectedMissionRow)
        let hasDisappeared = selectedMissionPassed_calcSelected(disappear, false, selectedMissionRow)
        return (hasAppeared && !hasDisappeared)
    }

    function calculateShow_multipleTriggers(appearAndDisappear : [number[],boolean][]|undefined, noMissionDefault ?: boolean) : boolean {
        if (appearAndDisappear === undefined)
            return true;

        let show : boolean = false;

        // If there is no mission selected, then show
        let keys = Object.keys(selectedMissionRow) as unknown as Array<string>
        if (keys.length == 0)
            return (noMissionDefault === undefined) ? true : noMissionDefault;
        let selected : number[] = keys[0].split('-').map(x=>Number(x));

        for (let index = 0; index < appearAndDisappear.length; index++) {
            let [mission, appear] : [number[],boolean] = appearAndDisappear[index]
            // If mission passed, update show
            if (selectedMissionPassed(mission, true, selected))
                show = appear
            // If not passed, break
            // else
            //     break;
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
        let selected : number[] = keys[0].split('-').map(x=>Number(x));

        for (let index = 0; index < missionCoords.length; index++) {
            let [mission, coords] : [number[],CoordinateType] = missionCoords[index]
            // If mission passed, update coords
            if (selectedMissionPassed(mission, true, selected))
                resCoords = coords
            // If not passed, break
            // else
            //     break;
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
        let selected : number[] = keys[0].split('-').map(x=>Number(x));

        for (let index = 0; index < colours.length; index++) {
            let [mission, colour] : [number[],string] = colours[index]
            // If mission passed, update allegiance
            if (selectedMissionPassed(mission, true, selected))
                allegiance = colour
            // If not passed, break
            // else
            //     break;
        }
        return allegiance;        
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
                    transform={(path.translate !== undefined) ? `translate(${path.translate.x},${path.translate.y})` : ""}
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
    function getAllMarkings(animated : boolean = false) : JSX.Element {
        var markings : React.SVGProps<SVGGElement>[] = []

        // Colours
        let colours : Dictionary<[string, string]>= {
            "green" : ["#50AB30", "#76eb5f"],
            "red" : ["#5a0609", "#a61518"]
        };

        svgProps!.paths.markings.forEach( (marking : svg_MarkingsType, index : number) => {
            let show = (missionData.markings[index] !== undefined) ? missionData.markings[index].appear : false;
            if (!show)
                return <></>

            switch (marking.type) {
                case "rect" : 
                    if (animated) return <></>;
                    
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
                    if (!animated) return <></>;

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
                    if (animated) return <></>;

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
                    if (animated) return <></>;

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
            </g>
        )
    }

    // === Player ===
    function getAllPlayerTiles() {
        var playerTiles : React.SVGProps<SVGGElement>[] = []

        svgProps!.paths.player.forEach( (tile : svg_PlayerType, index : number) => {
            let unitElement : any = <></>;
            if (tile['fixed-unit'] !== undefined || tile['fixed-unit']!.length === 0) {
                if (tile['fixed-unit']!.length === 1) {
                    let unit = tile['fixed-unit']![0]
                    unitElement = getUnitSprite(svgProps, missionData, tileSize, yZoom, undefined, unit, true)
                }
                else {
                    unitElement = (
                        <SpriteRotator 
                            svgProps={svgProps} 
                            missionData={missionData} 
                            tileSize={tileSize} yZoom={yZoom} 
                            units={tile['fixed-unit']!}
                        />
                    )
                }
            }
            playerTiles.push(
                <g
                    data-col={tile.coords.x}
                    data-row={tile.coords.y}
                    key={"mapPlayer-" + index}
                    transform={`translate(${(tile.coords.x-1)*tileSize},${(tile.coords.y-1)*tileSize})`}
                >
                    <use xlinkHref={`#map-playerTile-${tile['tile-type']}`} transform={`translate(-0.5,-0.5) scale(${tileSize}, ${tileSize})`} />
                    {unitElement}
                </g> 
            )
        })

        return (
            <g id="map-playerTile-container">
                <defs key="map-playerTile-defs">
                    <linearGradient id="map-playerTile-blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="rgb(152, 213, 255)"/>
                        <stop offset="15%" stop-color="rgb(210, 255, 255)"/>
                        <stop offset="30%" stop-color="rgb(122, 193, 225)"/>
                        <stop offset="45%" stop-color="rgb(168, 239, 255)"/>
                        <stop offset="60%" stop-color="rgb(210, 255, 255)"/>
                        <stop offset="75%" stop-color="rgb(122, 193, 225)"/>
                        <stop offset="100%" stop-color="rgb(152, 213, 255)"/>
                    </linearGradient>
                    {MapIcons.playerTile["circle"].g}
                    {MapIcons.playerTile["diamond"].g}
                </defs>
                <>{playerTiles}</>
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

    // === Units ===
    function getAllUnits() {
        let units = (
            Object.entries(svgProps!.paths.units)
                .map( 
                    ([key, unit] : [string,UnitDataType]) => getUnitSprite(svgProps, missionData, tileSize, yZoom, key)
                )
            )
        
        return <>{units}</>
    }

    // === Weapon ADvantages ===
    function getAllWeaponAdvantages() {

        let icons : React.SVGProps<SVGGElement>[] = [];

        gridData.forEach( (colArr, xIndex) => {
            colArr.forEach( (tile, yIndex) => {
                if (tile.unit === undefined)
                    return

                let hasAdvantage = false;
                let hasDisadvantage = false;

                Object.entries(tile.unit).forEach( ([key, unit]) => {
                    // If allied, skip
                    if (unit.allegiance === "blue" || unit.allegiance === "green")
                        return;

                    let show = (missionData.units[key] !== undefined) ? missionData.units[key].show : true;
                    let coords = (missionData.units[key] !== undefined) ? missionData.units[key].coords : {x:0,y:0};

                    // If not visible or coord is not there
                    if (!show || !(coords.x == xIndex && coords.y == yIndex ) )
                        return

                    // Check if advantage or not
                    
                })
            })
        })

        return <>{icons}</>
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
                            {getAllPlayerTiles()}
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
                            {getAllUnits()}
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

// RowSelectionState

/**
 * Compares the currently selected mission to the target.
 * Returns true if the selected mission is at, or has passed the target.
 * 
 * @param target: When your object appears/dissappears.
 * @param appear: True if you're using the appear data. False if you're using the dissapear data.
 * @param selectedState: Mission's row selected state. Used to calculate seleced mission.
 */
export function selectedMissionPassed_calcSelected(target : number[]|undefined, appear : boolean, selectedState : MRT_RowSelectionState) {

    // If target is invalid, return true if appear, false if disappear
    if (target === undefined || target === null || target!.length === 0)
        return appear
    
    let keys = Object.keys(selectedState) as unknown as Array<string>
    // If no mission is selected, return true if appear, false if disappear
    if (keys.length === 0) return appear;
    let selected = keys[0].split('-').map(x=>Number(x));

    return selectedMissionPassed(target, appear, selected)
}

/**
 * Compares the currently selected mission to the target.
 * Returns true if the selected mission is at, or has passed the target.
 * 
 * @param target: When your object appears/dissappears.
 * @param appear: True if you're using the appear data. False if you're using the dissapear data.
 * @param selected: Selected Mission's id.
 */
export function selectedMissionPassed(target : number[]|undefined, appear : boolean, selected : number[]) {

    // If target is invalid, return true if appear, false if disappear
    if (target === undefined || target === null || target!.length === 0)
        return appear
    
    // If selected is invalid, return true if appear, false if disappear
    if (selected === undefined || selected === null || selected.length === 0)
        return appear;

    let isDecimal = (num : number) => num % 1 !== 0;

    let tIndex = 0;
    let sIndex = 0;

    while (tIndex <= target.length && sIndex <= selected.length) {

        let tNum = target[tIndex];
        let sNum = selected[sIndex];

        // Exists?
        if ( (tNum === undefined) && (sNum === undefined) ) {return true;}  // Both do not exist, then reached end without a false, so true
        else if (sNum === undefined) {return false}                         // If t and !s, false
        else if (tNum === undefined)  {return true}                         // If !t and s, true
        else {}                                                             // If both exist, compare

        // Decimal?
        let tDecimal = isDecimal(tNum);
        let sDecimal = isDecimal(sNum);
        if (tDecimal && sDecimal) {             // If both are decimal,
            if (tNum !== sNum ) {return false}  //    and decimal is different, false
            else {                              //    and decimal is same, continue
                tIndex +=1; 
                sIndex +=1;
                continue;
            }
        }
        else if ( tDecimal !== sDecimal ) {     // If one is decimal and the other is not, round both down and then compare
            tNum = Math.floor(target[tIndex])
            sNum = Math.floor(selected[sIndex])
        }                                       // If both are not decimal, compare

        // Compare?
        if (tNum > sNum) {return false} // If t > s, false
        if (tNum < sNum) {return true}  // If t < s, true
        else {                          // If t = s, continue
            tIndex +=1; 
            sIndex +=1;
            continue;
        }
    }
}

export /**
     * Finds and returns an SVG representation of a speficied unit's sprite.
     * 
     * @param svgProps The current map svg data for the selected battle.
     * @param missionData The current Mission Data reference.
     * @tileSize The tileSize of the map.
     * @yZoom The calculated y variable of the map's zoom.
     * @param key Optional. Unit's key. If this is not declared, the unit has to be declared and key will be generated.
     * @param unit Optional. Unit's key. If this is not declared, the key has to be declared.
     * @param singleTile Optional. If the sprite's translate should account for the whole map, or one tile. Default is false.
     * @returns An SVG object representing the specified unit's sprite.
     */
// === Unit Sprite ===
function getUnitSprite(
        svgProps : SvgPropsType|null|undefined, missionData : MissionDataType, 
        tileSize : number, yZoom : number,
        key ?: string, unit ?: UnitDataType, 
        singleTile : boolean = false) : JSX.Element {
    
    if (
        (svgProps === null || svgProps === undefined) ||
        // At least one needs to be declared
        ( (key === undefined || key.length === 0) && unit === undefined)
    )
        return <></>

    if (key === undefined)
        key = `${unit!.coords[0][1].x}-` +
              `${unit!.coords[0][1].y}-` + 
              `${unit!.name.replaceAll(" ", "").toLowerCase()}-` +
              `${unit?.allegiance}`
    
    if ( (key === "-") || ( (unit === undefined) && (svgProps?.paths.units[key] === undefined) ) )
        return <></>

    if (unit === undefined)
        unit = svgProps?.paths.units[key]

    let show = (missionData.units[key] !== undefined) ? missionData.units[key].show : true;
    let coords = (missionData.units[key] !== undefined) ? missionData.units[key].coords : {x:0,y:0};
    
    if (!show)
        return <></>

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

    let transform = ""
    if (singleTile)
        transform = `translate(${ (tileSize*0.5) + centerX },${ (tileSize*0.5) + centerY }) `
    else
        transform = `translate(${ ((coords.x-0.5)*tileSize) + centerX },${ ((coords.y-0.5)*tileSize) + centerY }) `
    transform = transform + 
        `translate(${-centerX},${-centerY})` +
        `scale(${yZoom},${yZoom}) ` +
        `translate(${-centerX},${-centerY})`

    if (unit.class.sprite.show === true)
        return (
            <use
                data-col={coords.x}
                data-row={coords.y}
                key={"mapUnit-" + key}
                xlinkHref={unit.class.sprite.url}
                style={{ transformOrigin: '"center"' }}
                transform={transform}
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