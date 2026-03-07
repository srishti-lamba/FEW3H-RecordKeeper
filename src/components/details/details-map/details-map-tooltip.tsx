import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { memo } from "react";
import { GridCellDataType, CoordinateType, StrongholdDataType, EnemyDataType, PotDataType } from "./details-map";

interface TooltipContentProps {
    data : GridCellDataType[][];
    tileCoords : CoordinateType|null;
}

function TooltipContent({data: dataAll, tileCoords} : TooltipContentProps) {

    console.log("[[[ Tooltip rerender ]]]")

    if (tileCoords === null)
        return <></>

    var data : GridCellDataType = dataAll[tileCoords.x][tileCoords.y]
    var children = []
    
    // -------------------
    // --- Strongholds ---
    // -------------------
    var base : StrongholdDataType|null = data.stronghold;
    if ( base != null ) {
        
        // Captains
        var captains : EnemyDataType[] = [];
        if (base!.captain.blue !== undefined) captains.push(base!.captain.blue)
        if (base!.captain.green !== undefined) captains.push(base!.captain.green)
        if (base!.captain.red !== undefined) captains.push(base!.captain.red)
        if (base!.captain.yellow !== undefined) captains.push(base!.captain.yellow)
        var captainElements = []
        captainElements.push(captains.map( (unit : EnemyDataType) => (
            <span className="map-tooltip-subcategory-row">
                <img
                    className="map-tooltip-subcategory-row-icon"
                    src={unit.icon as string} 
                />
                {unit.class}
            </span>
        )))

        // Result
        children.push(
            <span className="map-tooltip-stronghold map-tooltip-row">
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <span className="map-tooltip-category-icon">{base.icon}</span>
                        <span className="map-tooltip-category-title">{base.name}</span>
                    </AccordionSummary>
                    <AccordionDetails>
                        <span className="map-tooltip-subcategory map-tooltip-stronghold-details">
                            <span className="map-tooltip-subcategory-header">Details</span>
                            <span className="map-tooltip-subcategory-row">Capture Required: <b>{(base.captureRequired) ? "True" : "False"}</b></span>
                        </span>
                        <span className="map-tooltip-subcategory map-tooltip-stronghold-captains ">
                            <span className="map-tooltip-subcategory-header">Captains</span>
                            {captainElements}
                        </span>
                    </AccordionDetails>
                </Accordion>
            </span>
        )
    }

    // ------------
    // --- Pots ---
    // ------------
    var pot : PotDataType|null = data.pot;
    if ( pot !== null ) {
        children.push(
            <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <span className="map-tooltip-category-icon">{pot.icon}</span>
                        <span className="map-tooltip-category-title">{pot.title}</span>
                    </AccordionSummary>
                    <AccordionDetails>
                        <span className="map-tooltip-subcategory">
                            <span className="map-tooltip-subcategory-header">{pot.description}</span>
                        </span>
                    </AccordionDetails>
            </Accordion>
        )
    }

    return (
        <div 
            id="map-tooltip-content"
        >
            {children}
        </div>
    )
}

export const MemoizedTooptipContent = memo( 
    TooltipContent, 
    (prevProps: Readonly<TooltipContentProps>, nextProps: Readonly<TooltipContentProps>) => {
        return !(
            // tileCoords !== null (prevents tooltip shrinking right before close)
            ( nextProps.tileCoords !== null ) &&
            // tileCoords are different
            ( ( prevProps.tileCoords?.x !== nextProps.tileCoords?.x ) || 
              ( prevProps.tileCoords?.y !== nextProps.tileCoords?.y )    )
        )
    }
)