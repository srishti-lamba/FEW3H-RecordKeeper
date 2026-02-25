import { JSX, useMemo, useState } from "react";
import { GridCellType, GridCellDataType, PotDataType, SvgPropsType, FillsType } from "./details-map";

interface GridContainerProps {
    svgProps : SvgPropsType;
    fills : FillsType;
    getPotFill : any;
    gridCells : React.RefObject<GridCellType[]>;
    setGridCords : any;
}

export function GridContainer({svgProps, fills, getPotFill, gridCells, setGridCords} : GridContainerProps) {

    const [gridCellsRefState, setGridCellsRefState] = useState<React.RefObject<GridCellType[]> | undefined>(undefined)

    const calculateIndex = (row : number, col : number ) => {
        return ((row-1) * svgProps.size.squares.width) + col
    }

    const createGrid = () => {
        var rows = [];

        for (let row : number = 1 ; row <= svgProps.size.squares.height ; row++ ) {
            var cells = []
            for (let col : number = 1 ; col <= svgProps.size.squares.width ; col++) {

                let index = calculateIndex(row, col);

                cells.push(
                    <div
                        className={`map-grid-cell-container${(gridCells.current[index] == undefined || gridCells.current[index].data == null) ? '' : ' has-data'}`}
                        // className={`map-grid-cell-container${(gridCellsRefState?.current[index] == undefined || gridCellsRefState.current[index].data == null) ? '' : ' has-data'}`}
                        data-row = {row}
                        data-col = {col}
                        onMouseEnter={() => setGridCords({x:col,y:row})}
                        onMouseLeave={() => setGridCords(null)}
                        ref={element => {
                            if (element != null) {
                                if (gridCells.current[index] === undefined)
                                    gridCells.current[index] = {gridCell: element, data: null};
                                else
                                    gridCells.current[index].gridCell = element;
                            }
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
        return rows;
    }

    const createData = () => {
        // Pots
        svgProps.paths.pots.forEach( (pot) => {
            var potData : PotDataType = {icon:undefined, title:"", description:""};
            switch (pot.colour) {
                case "blue": 
                    potData.title = "Blue Tonic";
                    potData.description = "Restores Awakening Gauge";
                    break;
                case "green": 
                    potData.title = "Green Tonic";
                    potData.description = "Restores HP Gauge";
                    break;
                case "purple": 
                    potData.title = "Purple Crystals";
                    potData.description = "Restores Weapon Durability";
                    break;
                case "red": 
                    potData.title = "Red Tonic";
                    potData.description = "Gives 150G";
                    break;
                case "yellow": 
                    potData.title = "Yellow Tonic";
                    potData.description = "Restores Warrior Gauge";
                    break;
            };
            potData.icon = (
                <svg
                    xmlns="http://www.w3.org/2000/svg"  
                    viewBox="0 0 48 48" 
                    preserveAspectRatio="xMidYMid meet"
                >
                    <path 
                        fill={getPotFill(pot.colour)}
                        stroke="black" stroke-width="3" stroke-linecap="round"
                        d="M 0 0 c 3.199 6.3981 3.199 7.4644 0.5332 10.1303 c -12.2631 10.1303 -10.1304 34.6564 15.462 34.6564 c 22.3934 0 27.7252 -24.5261 15.4621 -34.6564 c -2.6659 -2.6659 -2.6659 -3.7322 0.5332 -10.1303 z"
                    />
                    <path
                        fill={fills.pot.label}
                        d={"M -2.5 27.5 c 0 8 3 8 8 8 l 19 0 c 5 0 8 0 8 -8 z"}
                    />
                </svg>
            );
            var index = calculateIndex(pot.coords.x, pot.coords.y);
            let newData : GridCellDataType = {
                stronghold: null,
                pot: potData
            }
            if (gridCells.current[index] == undefined)
                gridCells.current[index] = {gridCell:null, data:newData};
            else if (gridCells.current[index].data == null)
                gridCells.current[index].data = newData;
            else if (gridCells.current[index].data?.pot == null)
                gridCells.current[index].data!.pot = potData;
        })
    }

    const createGridContainer = useMemo(() => {
        console.log("Grid Container rerendered")

        if (svgProps === null || svgProps === undefined)
            return;

        createData();
        var rows = createGrid();
        // setGridCellsRefState(gridCells);

        console.log("Grid Cells:")
        console.log(gridCells)
        return rows;
    },[svgProps, gridCellsRefState])

    return (
        <div 
            className="map-grid-container" 
            key="map-grid-container"
        >
            {createGridContainer}
        </div>
    )
}