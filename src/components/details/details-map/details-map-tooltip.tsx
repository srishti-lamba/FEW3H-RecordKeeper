import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Tooltip } from "react-tooltip";
import { ClassType, memo } from "react";
import { GridCellDataType, CoordinateType, StrongholdDataType, UnitDataSummaryType, PotDataType, UnitDataType } from "./details-map";
import { WeaponDataType, Weapons } from "../weapon-data";
import { Row } from "../../table";
import { Classes } from "../class-data";

interface TooltipContentProps {
    data : GridCellDataType[][];
    tileCoords : CoordinateType|null;
    selectedRowData : React.RefObject<Row|null>;
}

function TooltipContent({data: dataAll, tileCoords, selectedRowData} : TooltipContentProps) {

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

        // LevelTypeRow
        var levelTypeRow = (
            <span className="map-tooltip-unit-details-info-leveltypeRow">
                {/* === Level === */}
                <span className="map-tooltip-unit-details-info-level">
                    {`Lv ${selectedRowData.current?.level}`}
                </span>
                {/* === Class Type === */}
                <span className="map-tooltip-unit-details-info-type">
                    {
                        Classes.class[unit.class].types.map( (type : string) => {
                            let typeLower : string = type.toLowerCase();
                            let typeID : string = `tile-${unit?.coords.x}-${unit?.coords.y}-unit-${typeLower}Type`;
                            let icon : string = `${process.env.PUBLIC_URL}/images/icons/class-types/${typeLower}.png`;
                            return (<>
                                <img
                                    id={typeID}
                                    src={icon}
                                />
                                <Tooltip
                                    anchorSelect={`#${typeID}`}
                                    content={`${type}`}
                                    key={`${typeID}-tooltip`}
                                    place="bottom"
                                />
                            </>)
                        })
                    }
                </span>
            </span>
        )

        // ClassRow
        let classData = Classes.class[unit.class];
        let classLower = unit.class.toLowerCase();
        let classID = `tile-${unit.coords.x}-${unit.coords.y}-unit-${classLower}Class`
        var classRow = (
            <span className="map-tooltip-unit-details-info-classRow">
                <img src={unit.sprite as string} />
                <span id={classID}>
                    {unit.class}
                </span>
                <Tooltip
                    anchorSelect={`#${classID}`}
                    content={classData.description}
                    key={`${classID}-tooltip`}
                    place="bottom"
                />
            </span>
        )

        // WeaponRow
        let weaponData : WeaponDataType|null = Weapons.getData(unit.weapon);
        var weaponRow = <></>
        if (weaponData !== null) {
            console.log("WeaponData")
            console.log(weaponData)
            let weaponID : string = `tile-${unit?.coords.x}-${unit?.coords.y}-unit-weapon`
            weaponRow = (
                <span 
                    className="map-tooltip-unit-details-info-weaponRow" 
                    id={weaponID}
                >
                    <img src={weaponData.icon} />
                    <span >
                        {unit.weapon}
                    </span>
                    <Tooltip
                        anchorSelect={`#${weaponID}`}
                        children={
                            <>
                                <span>
                                    Advantage: {
                                        (weaponData.advantage !== undefined) && 
                                        Array.from(weaponData.advantage).map( (weapon) => (
                                        <img src={Weapons.getIcon(weapon, Weapons.type.REGULAR)} />
                                    ))}
                                </span>
                                <span>
                                    Disadvantage: {
                                        (weaponData.disadvantage !== undefined) && 
                                        Array.from(weaponData.disadvantage).map( (weapon) => (
                                        <img src={Weapons.getIcon(weapon, Weapons.type.REGULAR)} />
                                    ))}
                                </span>
                            </>
                        }
                        key={`${weaponID}-tooltip`}
                        place="bottom"
                    />
                </span>
            )
        }

        // All together
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
                                <span
                                    className="map-tooltip-unit-details-profile"
                                >
                                    {/* === Profile === */}
                                    <img src={unit.profile.url as string} />
                                </span>
                                <span className="map-tooltip-unit-details-info">
                                    {levelTypeRow}
                                    {classRow}
                                    {weaponRow}
                                </span> {/* .map-tooltip-unit-details-info */}
                                
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