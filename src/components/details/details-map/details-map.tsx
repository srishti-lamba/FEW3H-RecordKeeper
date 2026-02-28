import React, {useEffect, useState, useRef, useMemo} from 'react';
import { MRT_RowSelectionState } from 'material-react-table';
import mapPath from '../../../db/map-path.json';
import { JSX } from 'react/jsx-runtime';
import { GridContainer } from './details-map-grid-container';
import Slider from '@mui/material/Slider'
import { TooltipRefProps } from 'react-tooltip';

/* 
    Websites
    https://www.photopea.com/
    https://www.freeconvert.com/png-to-svg
*/

// === Fills ===

export interface FillsType {
    base : string;
    strongholdAllied : string;
    strongholdRed : string;
    strongholdYellow : string;
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

// === Map Objects ===

interface svg_PathType {
    full : svg_GroundType;
    strongholds : svg_StrongholdType[];
    gates : svg_GateType[];
    pots : svg_PotType[];
}

interface svg_GroundType { // Base ground path
    transform : string;
    d : string;
}

interface svg_StrongholdType {
    name : string;
    transform : string;
    d : string;
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

interface size_SpecificType {
    width: number;
    height: number;
}

interface size_CategoryType {
    pixels : size_SpecificType;
    squares : size_SpecificType;
}

// === Grid Cell Reference ===
export interface GridCellType {
    gridCell: JSX.Element | null;
    tooltipCell: TooltipRefProps | null;
    data: GridCellDataType | null;
}

export interface GridCellDataType {
    stronghold: StrongholdDataType | null;
    pot: PotDataType | null;
}

export interface PotDataType {
    icon: JSX.Element | undefined;
    title: string;
    description: string;
}

interface StrongholdDataType {
    name: string;
    captureRequired: boolean;
    appear: string | null;
    disappear: string | null;
    captain: {
        allied: string | null;
        enemy: string[] | null;
    }
}

// === Class Props ===

interface MapProps {
    selectedRow : MRT_RowSelectionState;
}

export function Map({selectedRow} : MapProps) {

    const [svgProps, setSvgProps] = useState<SvgPropsType | undefined | null>(undefined);
    const [gridCords, setGridCords] = useState<CoordinateType | null>(null);
    const [mapZoomExpanded, setMapZoomExpanded] = useState<boolean>(false);
    const scrollElement = useRef(null);
    const [scrollElementScrollbarOn, setScrollElementScrollbarOn] = useState(false);
    const [mapZoom, setMapZoom] = useState<number>(100);
    const gridCells = useRef<GridCellType[]>([]);
    
    const fills : FillsType = {
        base: "#928A7D",
        strongholdAllied: "",
        strongholdRed: "#AE7A6C",
        strongholdYellow: "",
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

    useEffect(() => {
        let keys = Object.keys(selectedRow) as Array<string>
        if (keys.length == 0) { // Only happens when page just loads
            setSvgProps(null);
            return;
        }
        let key = (keys[0] as unknown) as number
        if (selectedRow[key] == false) { // Row was unselected
            setSvgProps(null);
            return;
        }
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
                                    <path 
                                        fill={(path.fill !== undefined) ? path.fill : fills.strongholdRed} 
                                        transform={path.transform} 
                                        d={path.d}
                                        key={"mapStronghold-" + index}
                                    />
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
                                            d={"M -2.5 27.5 c 0 8 3 8 8 8 l 19 0 c 5 0 8 0 8 -8 z"}
                                        />
                                    </g>
                                ))
                            }
                        </svg>
                        <GridContainer 
                            svgProps={svgProps} 
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