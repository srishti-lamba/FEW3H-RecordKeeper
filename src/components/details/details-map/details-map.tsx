import React, {useEffect, useState, useRef, useMemo} from 'react';
import { MRT_RowSelectionState } from 'material-react-table';
import mapPath from '../../../db/map-path.json';
import { JSX } from 'react/jsx-runtime';
import { GridContainer } from './details-map-grid-container';
import Slider from '@mui/material/Slider'
import { Row } from '../../table';
import { Classes, ClassType } from '../class-data';
import { WeaponDataType } from '../weapon-data';

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
    stronghold : fill_StrongholdAllType;
    gate : string;
    pot : fill_PotsType;
}

interface fill_PotsType {
    blue: string;
    green: string;
    purple : string;
    red : string;
    yellow : string;
    label : string;
}

interface fill_StrongholdAllType {
    blue : fill_StrongholdType;
    green : fill_StrongholdType;
    red : fill_StrongholdType;
    yellow : fill_StrongholdType;
}

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

interface svg_StrongholdType {
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
    transform : string;
    d : string;
    fill ?: string;
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
    appear: string | null;
    disappear: string | null;
    captain: (string|UnitDataType)[];
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

// === Class Props ===

interface MapProps {
    selectedRow : MRT_RowSelectionState;
    selectedRowData : React.RefObject<Row|null>;
}

export function Map({selectedRow, selectedRowData} : MapProps) {

    const [svgProps, setSvgProps] = useState<SvgPropsType | undefined | null>(undefined);
    const [gridCords, setGridCords] = useState<CoordinateType | null>(null);
    const [mapZoomExpanded, setMapZoomExpanded] = useState<boolean>(false);
    const scrollElement = useRef(null);
    const [scrollElementScrollbarOn, setScrollElementScrollbarOn] = useState(false);
    const [mapZoom, setMapZoom] = useState<number>(500);
    const gridCells = useRef<GridCellType[]>([]);
    
    const fills : FillsType = {
        base: "#928A7D",
        stronghold: {
            blue: {
                ground: "",
                icon: {
                    outer: "#2E71E6",
                    inner: "#CDD5F4"
                }
            },
            green: {
                ground: "",
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
                ground: "",
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

        // Find out of scrollElement has a scrollbar active
        if (scrollElement.current) {
            const observer = new ResizeObserver((entries) => {
                for (let entry of entries) {
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
        let keys = Object.keys(selectedRow) as Array<string>
        if (keys.length == 0) { // No selection
            setSvgProps(null);
            return;
        }
        let key = (keys[0] as unknown) as number
        if (mapPath.length > key) // Map data exists
            setSvgProps(mapPath[key]);
        else
            setSvgProps(undefined); // Map data does not exist
    }, [selectedRow])

    useEffect(() => {
        // console.log("SVG Props:")
        // console.log(setSvgProps)
    }, [svgProps])

    const getPotFill = (pot : svg_PotType) => {
        if (pot.fill !== undefined)
            return (pot.fill as unknown) as string;
        switch (pot.colour) {
            case "blue": return fills.pot.blue; break;
            case "green": return fills.pot.green; break;
            case "purple": return fills.pot.purple; break;
            case "red": return fills.pot.red; break;
            case "yellow": return fills.pot.yellow; break;
        };
        return fills.pot.label;
    }

    const toggleDisplayZoom = () => {
        setMapZoomExpanded(!mapZoomExpanded);
    }

    const changeZoom = (event: Event, newValue: number) => {
        setMapZoom(newValue);
    }

    if (svgProps === undefined) {
        return <>No data for this chapter yet...</>;
    }

    if (svgProps === null) {
        return <>Select a chapter.</>;
    }

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
                                svgProps.paths.strongholds.map( (path : svg_StrongholdType, index : number) => (
                                    (<>
                                        <path 
                                            fill={(path.fill !== undefined) ? path.fill : fills.stronghold.red.ground} 
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
                                                        fill={fills.stronghold.red.icon.outer}
                                                    />
                                                    {/* Castle */}
                                                    <path
                                                        fill={fills.stronghold.red.icon.inner}
                                                        d=" M 3 3 v 17 l 5 5 h 12 l 5 -5 v -17 h -6 v 5.5 h -2 v -5.5 h -6 v 5.5 h -2 v -5.5 z 
                                                            m 14 14 v 5 h -6 v -5 l 3 -3 z"
                                                    />
                                                </g>
                                            )
                                        }
                                    </>)
                                ))
                            }
                            {
                                // Gates
                                svgProps.paths.gates.map( (path : svg_GateType, index : number) => (
                                    <path 
                                        fill={(path.fill !== undefined) ? path.fill : fills.gate} 
                                        transform={path.transform} 
                                        d={path.d}
                                        key={"mapGate-" + index}
                                    />
                                ))
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
                                            fill={getPotFill(path)} 
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
                                            // style={`--transformX: ${ (unit.coords.x-0.75)*tileWidth }; transformY: ${ (unit.coords.y-0.75)*tileWidth }`}
                                            style={{ "--transformX": (unit.coords.x-1)*tileWidth , "--transformY" : (unit.coords.y-1)*tileWidth } as React.CSSProperties}
                                            // style={{"--transfromX": (unit.coords.x-0.75)*tileWidth }}
                                            className="map-grid-tile-unit-sprite"
                                            // transform={`translate(${ (unit.coords.x-0.75)*tileWidth },${ (unit.coords.y-0.75)*tileWidth })`}
                                            xlinkHref={unit.class.sprite.url} 
                                        />
                                )})
                            }
                        </svg>
                        <GridContainer 
                            svgProps={svgProps} 
                            selectedRowData={selectedRowData}
                            fills={fills} 
                            getPotFill={getPotFill}
                            gridCells={gridCells} 
                            setGridCords={setGridCords} 
                        />
                    </div> {/* map-svg-grid-container */}
                </div> { /* map-svg-grid-scroll-container */}
            </div>
        </div>
    )
    
}