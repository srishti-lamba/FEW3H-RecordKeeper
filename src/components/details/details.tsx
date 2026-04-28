import React, {useEffect, useState, useRef, JSX} from 'react';
import { CoordinateType, GridCellDataType, Map, SvgPropsType } from './details-map/details-map'
import { MRT_TableInstance } from 'material-react-table';
import { MissionRow, Missions } from './missions-table';
import { MapContext, MissionsTableContext } from '../../context';
import { WeaponTriangle } from './weapon-triangle';
import debounce from 'lodash/debounce'
import { TooltipRefProps } from 'react-tooltip';

interface DetailsProps {}

export function Details( {/*selectedRow, selectedRowData*/} : DetailsProps ) {

    const rightPaneRef = useRef<HTMLDivElement|null>(null);
    const rightPanelWidth = useRef<number>(0);

    const mapRef = useRef<HTMLDivElement|null>(null);
    const mapSize = useRef<ResizeObserverEntry|undefined>(undefined)

    const missionsTable = useRef<MRT_TableInstance<MissionRow>>(undefined);
    const missionsTableSize = useRef<ResizeObserverEntry|undefined>(undefined)
    const [missionsHeight, setMissionsHeight] = useState<string>("auto")

    const tooltip = useRef<TooltipRefProps|null>(null)
    const tooltipSize = useRef<ResizeObserverEntry|undefined>(undefined)
    const [tileID, setTileID] = useState<string|null>(null)

    // -----------------------
    // --- Resize Observer ---
    // -----------------------

    useEffect(() => {
        // console.log(`[Right Panel Ref Changed]`)
        let callbackFunc = (entry : ResizeObserverEntry) => {
            rightPanelWidth.current = entry.borderBoxSize[0].inlineSize
            // console.log(`[Right Panel Width: ${rightPanelWidth.current}]`)
            updateMissionHeight();
        }
        addResizeObserver(rightPaneRef, callbackFunc)
    }, [rightPaneRef.current])

    useEffect(() => {
        // console.log(`[Map Ref Changed]`)
        let callbackFunc = (entry : ResizeObserverEntry) => {
            mapSize.current = entry
            // console.log(`[Map Height: ${entry.borderBoxSize[0].blockSize}]`)
            updateMissionHeight();
        };
        addResizeObserver(mapRef, callbackFunc)
    }, [mapRef.current])

    // useEffect(() => {
    //     if (tooltip.current === undefined || tooltip.current === null)
    //         return
    //     let tooltipElement : HTMLElement|null = document.getElementById("map-tooltip")

    //     let callbackFunc = (entry : ResizeObserverEntry) => {
    //         console.log(`[Tooltip resize]`)
    //         tooltipSize.current = entry
    //     };

    //     if (tooltipElement) {
    //         const observer = new ResizeObserver(debounce((entries) => entries.forEach(callbackFunc)));
    //         observer.observe(tooltipElement);
    //         return () => observer.disconnect();
    //     }
    // }, [tooltip.current])

    useEffect(() => {
        // console.log("[MissionTable Ref Changed]")
        if (missionsTable.current === undefined || missionsTable.current.refs.tablePaperRef.current === undefined)
            return

        let FULL_PANEL = "full-panel"

        let callbackFunc = (entry : ResizeObserverEntry) => {
            // console.log("[[[***]]] Starting MissionTable Ref Callback")
            missionsTableSize.current = entry;
            if (mapSize.current === undefined)
                return
            let paddingLeft = Number(document.defaultView?.getComputedStyle(
                document.getElementById("right-pane-contents")!, null)
                .getPropertyValue('padding-left').replace("px", ""))
            let missionsWidthPercent = entry.borderBoxSize[0].inlineSize / (rightPanelWidth.current - paddingLeft)
            if (missionsWidthPercent === 1) {
                missionsTable.current?.refs.tablePaperRef.current?.classList.add(FULL_PANEL);
                setMissionsHeight("-")
            }
            else {
                missionsTable.current?.refs.tablePaperRef.current?.classList.remove(FULL_PANEL);
                updateMissionHeight();
            }
        }
        addResizeObserver(missionsTable.current.refs.tablePaperRef, callbackFunc)
    }, [missionsTable.current?.refs.tablePaperRef])

    function addResizeObserver( ref : React.RefObject<any>, callbackFunc : any) {
        if (ref.current) {
            const observer = new ResizeObserver(debounce((entries) => entries.forEach(callbackFunc)));
            observer.observe(ref.current);

            // Cleanup function
            return () => {
                observer.disconnect();
            };
        }
    }

    function updateMissionHeight() { 
        if (mapSize.current === undefined)
            return
        // console.log(`Setting missionHeight: ${mapSize.current!.borderBoxSize[0].blockSize}px`)
        setMissionsHeight(`${mapSize.current.borderBoxSize[0].blockSize}px`)
    }

    // console.log("Details rerender")

    // --------------
    // --- Render ---
    // --------------

    return (
        <div id="right-pane-contents" ref={rightPaneRef}>

            <MapContext
                value={{
                    scrollElement: mapRef,
                    size: mapSize,
                    svg: useState<SvgPropsType|undefined|null>(undefined),
                    tileData: useState<(GridCellDataType)[][]>([]),
                    selectedWeapon: useState(""),
                    tooltip: tooltip,
                    tileID: [tileID, setTileID],
                }}
            >
            <MissionsTableContext value={{
                table: missionsTable,
                size: missionsTableSize,
                selectedRow: useState({}),
                text : useRef({})
            }}>

                <WeaponTriangle />

                <div id="map-mission-container">
                    <Map />
                    <Missions 
                        tableHeight={missionsHeight}
                    />
                </div>

            </MissionsTableContext>
            </MapContext>

        </div>
    )
}