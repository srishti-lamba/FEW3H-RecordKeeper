import React, {useEffect, useState, useRef, useContext} from 'react';
import { Map } from './details-map/details-map'
import { MRT_RowSelectionState, MRT_TableInstance } from 'material-react-table';
import { MissionRow, Missions } from './missions-table';
import { MapContext, MissionsTableContext } from '../../context';
// import { BattleRow } from '../table';

interface DetailsProps {
    // selectedRow : MRT_RowSelectionState
    // selectedRowData : React.RefObject<BattleRow|null>;
}

export function Details( {/*selectedRow, selectedRowData*/} : DetailsProps ) {

    const rightPaneRef = useRef<HTMLDivElement|null>(null);
    const rightPanelWidth = useRef<number>(0);
    const mapSize = useRef<ResizeObserverEntry|undefined>(undefined)
    const missionsTable = useRef<MRT_TableInstance<MissionRow>>(undefined);
    const [missionsWidthFull, setMissionsWidthFull] = useState(false)
    const missionsShouldSetHeight = useRef<boolean>(false)
    const [missionsHeight, setMissionsHeight] = useState<string>("auto")

    // -----------------------
    // --- Resize Observer ---
    // -----------------------
    useEffect(() => {
        // console.log(`[Right Panel Ref Changed]`)
        let callbackFunc = (entry : ResizeObserverEntry) => {
            rightPanelWidth.current = entry.borderBoxSize[0].inlineSize
            // console.log(`[Right Panel Width: ${rightPanelWidth.current}]`)
        }
        addResizeObserver(rightPaneRef, callbackFunc)
    }, [rightPaneRef.current])
    useEffect(() => {
        let callbackFunc = (entry : ResizeObserverEntry) => {
            let paddingLeft = Number(document.defaultView?.getComputedStyle(
                document.getElementById("right-pane-contents")!, null)
                .getPropertyValue('padding-left').replace("px", ""))
            let missionsWidthPercent = entry.borderBoxSize[0].inlineSize / (rightPanelWidth.current - paddingLeft)
            if ((missionsWidthPercent === 1) || (missionsTable.current?.getState().isFullScreen)) {
                setMissionsWidthFull(true)
                missionsShouldSetHeight.current = false
            }
            else {
                setMissionsWidthFull(false)
                missionsShouldSetHeight.current = true
            }
        }
        addResizeObserver(missionsTable.current!.refs.tablePaperRef, callbackFunc)
    }, [missionsTable.current])
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

    // console.log("Details rerendered")

    return (
        <div id="right-pane-contents" ref={rightPaneRef}>

            <MapContext value={{size: mapSize}} >
            <MissionsTableContext value={{
                table: missionsTable,
                selectedRow: useState<MRT_RowSelectionState>({})
            }}>

                <div id="map-mission-container">
                    <Map 
                        shouldSetHeight={missionsShouldSetHeight}
                        setHeight={setMissionsHeight} 
                    />
                    <Missions 
                        isTableWidthFull={missionsWidthFull}
                        tableHeight={missionsHeight}
                    />
                </div>
                <div className="test"></div>
                <div className="test2"></div>
                {/* <img src={process.env.PUBLIC_URL + "/images/ui-background/test.svg"} width="100%" height="100px" /> */}

            </MissionsTableContext>
            </MapContext>

        </div>
    )
}