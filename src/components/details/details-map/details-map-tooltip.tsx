import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { memo } from "react";
import { GridCellDataType, CoordinateType, StrongholdDataType, UnitDataSummaryType, PotDataType, UnitDataType } from "./details-map";
import { WeaponDataType, Weapons } from "../weapon-data";
import { LanguageVariant } from "typescript";

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
    var base : StrongholdDataType|undefined = data.stronghold;
    if ( base != undefined ) {
        
        // Captains                             // Proof Stronghold Weapon Type can change (look at text under map): https://youtu.be/rT5Wo1qZMVs?si=tAzSfQjecAHuon8q&t=2683
        var captains : UnitDataSummaryType[] = [];
        if (base!.captain.blue !== undefined) captains.push(base!.captain.blue)
        if (base!.captain.green !== undefined) captains.push(base!.captain.green)
        if (base!.captain.red !== undefined) captains.push(base!.captain.red)
        if (base!.captain.yellow !== undefined) captains.push(base!.captain.yellow)
        var captainElements = []
        captainElements.push(captains.map( (unit : UnitDataSummaryType) => {
            var weapon : WeaponDataType|null = Weapons.getData(unit.weapon)
            return (
                <span className="map-tooltip-subcategory-row">
                    <span className="map-tooltip-subcategory-row-info">
                        <img
                            className="map-tooltip-subcategory-row-icon"
                            src={unit.icon as string} 
                        />
                        {unit.class}
                    </span>
                    {
                        (weapon !== null) &&
                        <span className="map-tooltip-subcategory-row-info">
                            <img
                                className="map-tooltip-subcategory-row-icon"
                                src={weapon.icon as string} 
                            />
                            {unit.weapon}
                        </span>  
                    }
                    
                </span>
            )
        }))

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
    var pot : PotDataType|undefined = data.pot;
    if ( pot !== undefined ) {
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
                            <span className="map-tooltip-subcategory-info">{pot.description}</span>
                        </span>
                    </AccordionDetails>
            </Accordion>
        )
    }

    // -------------
    // --- Units ---
    // -------------
    var unit : UnitDataType|undefined = data.unit;
    if ( unit !== undefined ) {
        children.push(
            <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <img 
                            className="map-tooltip-category-icon"
                            src={unit.sprite as string}
                        />
                        <span className="map-tooltip-category-title">{unit.class}</span>
                    </AccordionSummary>
                    <AccordionDetails>
                        <span className={`map-tooltip-unit ${unit.allegiance}`}>
                            <span className="map-tooltip-unit-name">
                                <span>{unit.name}</span>
                            </span>
                            <span className="map-tooltip-unit-details">
                                <span className="map-tooltip-unit-details-basic">
                                    <img
                                        className="map-tooltip-unit-details-basic-profile"
                                        src={unit.profile.url as string}
                                    />
                                    <span className="map-tooltip-unit-details-level">Lv. ???</span>
                                </span>
                                
                            </span>
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