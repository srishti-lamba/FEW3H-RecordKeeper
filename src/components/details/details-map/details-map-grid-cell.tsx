import { useEffect, useMemo, useState } from "react";
import { GridCellDataType, CoordinateType, GridCellType } from "./details-map";
import { Tooltip } from "react-tooltip";

interface GridCellProps {
    data: GridCellDataType|null;
    gridCells : React.RefObject<GridCellType[]>;
    setGridCords : any;
    coords: CoordinateType;
    calculateIndex : any;
}


export function GridCell({data, gridCells, setGridCords, coords, calculateIndex} : GridCellProps) {
    const [show, setShow] = useState<boolean>(true);

    const index : number = calculateIndex(coords.x, coords.y)

    const toggleShow = () => {
        console.log("Show toggled!")
        setShow(false)
    }

    const generateTooltipID = () => {
        return "mapCellTooltip-" + coords.x + "-" + coords.y
    }

    const createGridCell = useMemo(() => {
        // let index : number = calculateIndex(coords.x, coords.y)

        // if (gridCells.current[index] !== undefined) {
        //     if (data === null) 
        //     return (
        //         <>
        //             {gridCell}
        //         </>
        //     )
        // }

        var gridCell = (
            <div
                className={`map-grid-cell-container${data == null ? '' : ' has-data'}`}
                data-row = {coords.y}
                data-col = {coords.x}
                onMouseEnter={() => setGridCords(coords)}
                onMouseLeave={() => setGridCords(null)}
                onClick={() => {(data == null) ? undefined : toggleShow()}}
                ref={element => {
                    if (element != null) {
                        if (gridCells.current[index] === undefined) 
                            gridCells.current[index] = {gridCell: element, tooltipCell: null, data: data};
                        else
                            gridCells.current[index].gridCell = element;
                    }
                }}
                data-tooltip-id={generateTooltipID()}
                key={"mapCell-" + coords.x + "-" + coords.y}
            />
        )

        if (data === null) 
            return (
                <>
                    {gridCell}
                </>
            )
        
        var tooltipCell = (
            <Tooltip 
                id={generateTooltipID()}
                content="TEST test TEST"
                ref={ element => {
                    if (element != null) {
                        if (gridCells.current[index] === undefined) 
                            gridCells.current[index] = {gridCell: null, tooltipCell: element, data: data};
                        else
                            gridCells.current[index].tooltipCell = element;
                    }
                }}
                // openOnClick={true}
                isOpen={show}
                // setIsOpen={toggleShow}
                clickable
            />
        )

        // return null;

        // // return (
        // //     <>
        // //         {gridCell}
        // //         {tooltipCell}
        // //     </>
        // )
        
    },[data])

    // const createGridCell = () => {

    //     console.log("CreateGridCell rerendered")

    //     // if (gridCells == undefined)
    //     //     return;

    //     if (gridCells.current[index] !== undefined) {
    //         if (data === null) 
    //             return (
    //                 <>
    //                     {gridCells.current[index].gridCell}
    //                 </>
    //             )
    //         else
    //             return (
    //                 <>
    //                     {gridCells.current[index].gridCell}
    //                     {gridCells.current[index].tooltipCell}
    //                 </>
    //         )
    //     }

    //     var gridCell = (
    //         <div
    //             className={`map-grid-cell-container${data == null ? '' : ' has-data'}`}
    //             data-row = {coords.y}
    //             data-col = {coords.x}
    //             onMouseEnter={() => setGridCords(coords)}
    //             onMouseLeave={() => setGridCords(null)}
    //             onClick={() => {(data == null) ? undefined : toggleShow()}}
    //             ref={element => {
    //                 if (element != null) {
    //                     if (gridCells.current[index] === undefined) 
    //                         gridCells.current[index] = {gridCell: element, tooltipCell: null, data: data};
    //                     else
    //                         gridCells.current[index].gridCell = element;
    //                 }
    //             }}
    //             data-tooltip-id={generateTooltipID()}
    //             key={"mapCell-" + coords.x + "-" + coords.y}
    //         />
    //     )

    //     if (data === null) 
    //         return (
    //             <>
    //                 {gridCell}
    //             </>
    //         )
        
    //     var tooltipCell = (
    //         <Tooltip 
    //             id={generateTooltipID()}
    //             content="TEST test TEST"
    //             ref={ element => {
    //                 if (element != null) {
    //                     if (gridCells.current[index] === undefined) 
    //                         gridCells.current[index] = {gridCell: null, tooltipCell: element, data: data};
    //                     else
    //                         gridCells.current[index].tooltipCell = element;
    //                 }
    //             }}
    //             openOnClick={true}
    //             isOpen={show}
    //             // setIsOpen={toggleShow}
    //             clickable
    //         />
    //     )

    //     return (
    //         <>
    //             {gridCell}
    //             {tooltipCell}
    //         </>
    //     )
        
    // }

    // Run once
    // useEffect(() => {
    //     createGridCell;
    // }, [])

    // if (gridCells === undefined || gridCells.current[index] === undefined)
    //     return <></>

    return (
        <>
            {createGridCell}
        </>
        // <>
        //     { (gridCells.current[index].gridCell !== null && gridCells.current[index].gridCell !== undefined) && gridCells.current[index].gridCell }
        //     { data !== null && gridCells.current[index].tooltipCell }
        // </>
    )

}