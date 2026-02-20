import { JSX, useMemo } from "react";
import { SvgPropsType } from "./details-map";

interface GridContainerProps {
    svgProps : SvgPropsType;
    gridCells : React.RefObject<HTMLDivElement[]>;
    setGridCords : any;
}

export function GridContainer({svgProps, gridCells, setGridCords} : GridContainerProps) {

    const createGridContainer = useMemo(() => {
        console.log("Grid Container rerendered")

        if (svgProps === null || svgProps === undefined)
            return;

        var rows = [];

        for (let row : number = 1 ; row <= svgProps.size.squares.height ; row++ ) {
            var cells = []
            for (let col : number = 1 ; col <= svgProps.size.squares.width ; col++) {
                cells.push(
                    <div
                        className="map-grid-cell-container"
                        data-row = {row}
                        data-col = {col}
                        onMouseEnter={() => setGridCords({x:col,y:row})}
                        onMouseLeave={() => setGridCords(null)}
                        ref={element => {
                            if (element != null) 
                                gridCells.current[((row-1) * svgProps.size.squares.width) + col] = element
                        }}
                        key={"mapGridCell-" + row + "-" + col}
                    ></div>
                )
            }

            rows.push(
                <div 
                    className="map-grid-row-container"
                    key={"mapGridRow-" + row}
                >
                    {cells}
                </div>
            )   
        }

        console.log(gridCells)
        return rows;
    },[svgProps])

    return (
        <div 
            className="map-grid-container" 
            key="map-grid-container"
        >
            {createGridContainer}
        </div>
    )
}