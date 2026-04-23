import React, {useEffect, useState, useRef, useContext} from 'react';
import { GridCellDataType, Map, SvgPropsType } from './details-map/details-map'
import { MRT_TableInstance } from 'material-react-table';
import { MissionRow, Missions } from './missions-table';
import { MapContext, MissionsTableContext } from '../../context';
import { WeaponTriangle } from './weapon-triangle';
// import { BattleRow } from '../table';

interface DetailsProps {
    // selectedRow : MRT_RowSelectionState
    // selectedRowData : React.RefObject<BattleRow|null>;
}

export function Details( {/*selectedRow, selectedRowData*/} : DetailsProps ) {

    const rightPaneRef = useRef<HTMLDivElement|null>(null);
    const rightPanelWidth = useRef<number>(0);

    const mapRef = useRef<HTMLDivElement|null>(null);
    const mapSize = useRef<ResizeObserverEntry|undefined>(undefined)

    const missionsTable = useRef<MRT_TableInstance<MissionRow>>(undefined);
    const missionsShouldSetHeight = useRef<boolean>(true)
    const [missionsHeight, setMissionsHeight] = useState<string>("auto")

    console.log("Details rerendered")

    // -----------------------
    // --- Resize Observer ---
    // -----------------------
    useEffect(() => {
        // console.log(`[Right Panel Ref Changed]`)
        let callbackFunc = (entry : ResizeObserverEntry) => {
            rightPanelWidth.current = entry.borderBoxSize[0].inlineSize
            console.log(`[Right Panel Width: ${rightPanelWidth.current}]`)
        }
        addResizeObserver(rightPaneRef, callbackFunc)
    }, [rightPaneRef.current])
    useEffect(() => {
        console.log(`[Map Ref Changed]`)
        let callbackFunc = (entry : ResizeObserverEntry) => {
                mapSize.current = entry
                console.log(`[Map Height: ${entry.borderBoxSize[0].blockSize}]`)
                updateMissionHeight();
            };
            addResizeObserver(mapRef, callbackFunc)
    }, [mapRef.current])
    useEffect(() => {
        console.log("[MissionTable Ref Changed]")
        console.log(missionsTable.current)
        let callbackFunc = (entry : ResizeObserverEntry) => {
            console.log("*** Starting MissionTable Ref Callback")
            if (mapSize.current === undefined)
                return
            let paddingLeft = Number(document.defaultView?.getComputedStyle(
                document.getElementById("right-pane-contents")!, null)
                .getPropertyValue('padding-left').replace("px", ""))
            let missionsWidthPercent = entry.borderBoxSize[0].inlineSize / (rightPanelWidth.current - paddingLeft)
            if (missionsWidthPercent === 1) {
                // missionsTable.current?.refs.tablePaperRef.current?.className;
                // missionsShouldSetHeight.current = false
                console.log(`Setting missionHeight: -`)
                setMissionsHeight(`-`)
            }
            else {
                console.log(`Setting missionHeight: ${mapSize.current.borderBoxSize[0].blockSize}px`)
                updateMissionHeight();
                // missionsShouldSetHeight.current = true
            }
        }
        addResizeObserver(missionsTable.current!.refs.tablePaperRef, callbackFunc)
    }, [missionsTable.current!.refs.tablePaperRef])
    function addResizeObserver( ref : React.RefObject<any>, callbackFunc : any) {
        if (ref.current) {
            const observer = new ResizeObserver((entries) => entries.forEach(callbackFunc));
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
        setMissionsHeight(`${mapSize.current.borderBoxSize[0].blockSize}px`)
    }

    // console.log("Details rerendered")

    return (
        <div id="right-pane-contents" ref={rightPaneRef}>

            <MapContext
                value={{
                    scrollElement: mapRef,
                    size: mapSize,
                    svg: useState<SvgPropsType|undefined|null>(undefined),
                    tileData: useState<(GridCellDataType)[][]>([]),
                    selectedWeapon: useState("")
                }}
            >
            <MissionsTableContext value={{
                table: missionsTable,
                selectedRow: useState({}),
                text : useRef({})
            }}>

                <WeaponTriangle />

                <div id="map-mission-container">
                    <Map 
                        shouldSetHeight={missionsShouldSetHeight}
                        setHeight={setMissionsHeight} 
                    />
                    <Missions 
                        tableHeight={missionsHeight}
                    />
                </div>

            </MissionsTableContext>
            </MapContext>

        </div>
    )
}