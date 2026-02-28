import { useMemo, useState } from "react";
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

    const index : number = useMemo(() => {return calculateIndex(coords.x, coords.y)}, [coords])
    const gridCellID : string = useMemo(() => {return "mapCell-" + coords.x + "-" + coords.y}, [coords])

    const toggleShow = () => {
        setShow(!show)
    }

    const createGridCell = () => {
        // console.log("Grid Cell rerendered")

        var gridCell = 
        (
            <GridCellTile 
                data={data} 
                setGridCords={setGridCords} coords={coords} 
                gridCellID={gridCellID} toggleShow={toggleShow} 
            />
        )

        // Adding gridCell reference
        if (gridCells.current[index] === undefined) 
            gridCells.current[index] = {gridCell: gridCell, tooltipCell: null, data: data};
        else
            gridCells.current[index].gridCell = gridCell;

        return (
            <>
                {gridCell}
            </>
        );
        
    }

    // Run once
    // useEffect(() => {
    // }, [])

    return (
        <>
            {createGridCell()}
            {data !== null && (
                <Tooltip
                    anchorSelect={`#${gridCellID}`}
                    content="TEST test TEST"
                    openOnClick={true}
                    isOpen={show}       
                    key={`mapTooltip-${coords.x}-${coords.y}`}
                    ref={element => {
                        if (element != null) {
                            if (gridCells.current[index] === undefined) 
                                gridCells.current[index] = {gridCell: null, tooltipCell: element, data: data};
                            else
                                gridCells.current[index].tooltipCell = element;
                        }
                    }}
                    clickable
                />
            )}
        </>
    )

}

interface GridCellTileProps {
    data: GridCellDataType|null;
    setGridCords : any;
    coords: CoordinateType;
    gridCellID : string;
    toggleShow : any;
}

function GridCellTile({data, setGridCords, coords, gridCellID, toggleShow} : GridCellTileProps) {
    return (
        <div
            id={gridCellID}
            className={`map-grid-cell-container${data == null ? '' : ' has-data'}`}
            data-row = {coords.y}
            data-col = {coords.x}
            onMouseEnter={() => setGridCords(coords)}
            onMouseLeave={() => setGridCords(null)}
            onClick={toggleShow}
            key={`mapTile-${coords.x}-${coords.y}`}
        />
    )
}