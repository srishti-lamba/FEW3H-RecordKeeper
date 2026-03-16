import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Tooltip } from "react-tooltip";
import { ClassType, memo, useContext } from "react";
import { GridCellDataType, CoordinateType, StrongholdDataType, UnitDataSummaryType, PotDataType, UnitDataType } from "./details-map";
import { CategoryType, WeaponDataType, Weapons } from "../weapon-data";
// import { BattleRow } from "../../table";
import { Classes } from "../class-data";
import { DatabaseContext, SelectedBattleRowContext } from "../../../context";
import { MRT_Row } from "material-react-table";
import { BattleRow } from "../../table";

interface TooltipContentProps {
    data : GridCellDataType[][];
    tileCoords : CoordinateType|null;
    // selectedRowData : React.RefObject<BattleRow|null>;
}

function TooltipContent({data: dataAll, tileCoords/*, selectedRowData*/} : TooltipContentProps) {

    // console.log("[[[ Tooltip rerender ]]]")

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
        var captains : (UnitDataType)[] = [];
        (base.captain).forEach( (captain) => {
            if (captain instanceof String !== true)
                captains.push(captain as UnitDataType)
        })
        // if (base!.captain.blue !== undefined) captains.push(base!.captain.blue)
        // if (base!.captain.green !== undefined) captains.push(base!.captain.green)
        // if (base!.captain.red !== undefined) captains.push(base!.captain.red)
        // if (base!.captain.yellow !== undefined) captains.push(base!.captain.yellow)
        var captainElements = []
        captainElements.push(captains.map( (unit : UnitDataType) => {
            // var weapon : WeaponDataType|undefined = unit.weapon.
            return (
                <span className="map-tooltip-subcategory-row">
                    <span className="map-tooltip-subcategory-row-info">
                        <img
                            className="map-tooltip-subcategory-row-icon"
                            src={unit.class.sprite?.url as string} 
                        />
                        {unit.class.name}
                    </span>
                    {
                        <span className="map-tooltip-subcategory-row-info">
                            <img
                                className="map-tooltip-subcategory-row-icon"
                                src={unit.weapon.data?.icon} 
                            />
                            {unit.weapon.name}
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
                            <span className="map-tooltip-subcategory-header header-brown-underlined">Details</span>
                            <span className="map-tooltip-subcategory-row">Capture Required: <b>{(base.captureRequired) ? "True" : "False"}</b></span>
                        </span>
                        <span className="map-tooltip-subcategory map-tooltip-stronghold-captains ">
                            <span className="map-tooltip-subcategory-header header-brown-underlined">Captains</span>
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
    (data.unit)?.map( (unit : UnitDataType) => {
        // var unit : UnitDataType|undefined = data.unit;

        // LevelTypeRow
        var levelTypeRow = <></>
        if (unit.class.data !== undefined)
            // let lvl = (useContext(DatabaseContext)[1] as MRT_Row<BattleRow>).original.level
            levelTypeRow = (
                <span className="map-tooltip-unit-details-info-leveltypeRow">
                    {/* === Level === */}
                    <span className="map-tooltip-unit-details-info-level">
                        {`Lv ${(useContext(SelectedBattleRowContext)![1].current as MRT_Row<BattleRow>).original.level}`}
                    </span>
                    {/* === Class Type === */}
                    <span className="map-tooltip-unit-details-info-type">
                        {
                            unit.class.data.types.map( (type : CategoryType) => {
                                let typeID : string = `tile-${unit?.coords.x}-${unit?.coords.y}-unit-${type.nameLower}Type`;
                                return (<>
                                    <img
                                        id={typeID}
                                        src={type.icon}
                                    />
                                    <Tooltip
                                        anchorSelect={`#${typeID}`}
                                        content={`${type.name}`}
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
        // let classData = Classes.class[unit.class];
        let classData = Classes.getClassData(unit.class, unit.allegiance)
        let classID = `tile-${unit.coords.x}-${unit.coords.y}-unit-${classData.nameLower}Class`
        var classRow = (
            <span className="map-tooltip-unit-details-info-classRow">
                <img src={unit.class.sprite.url as string} />
                <span id={classID}>
                    {unit.class.name}
                </span>
                <Tooltip
                    anchorSelect={`#${classID}`}
                    content={classData.data?.description}
                    key={`${classID}-tooltip`}
                    place="bottom"
                />
            </span>
        )

        // WeaponRow
        let weaponData : WeaponDataType|undefined = Weapons.getData(unit.weapon.name);
        var weaponRow = <></>
        if (weaponData !== null) {
            let weaponID : string = `tile-${unit?.coords.x}-${unit?.coords.y}-unit-weapon`
            weaponRow = (
                <span 
                    className="map-tooltip-unit-details-info-weaponRow" 
                    id={weaponID}
                >
                    <img src={weaponData?.icon} />
                    <span >
                        {unit.weapon.name}
                    </span>
                    <Tooltip
                        anchorSelect={`#${weaponID}`}
                        children={
                            <span className="map-tooltip-unit-details-info-weapon-description">{weaponData?.description}</span>
                        }
                        key={`${weaponID}-tooltip`}
                        place="bottom"
                    />
                </span>
            )
        }

        // Advantages and Disadvantages
        var advantagesRows = <></>
        if (weaponData !== null) {
            advantagesRows = (
                <span className="map-tooltip-unit-details-info-weapon-advantages">
                    <span className="map-tooltip-unit-details-info-weapon-advantageRow">
                        {
                            Object.values(Weapons.categories).map( (category : CategoryType) => (
                                <span className="map-tooltip-unit-details-info-weapon-advantageCol">
                                    <img src={category.icon} />
                                    {
                                        ( weaponData?.advantage !== undefined && weaponData.advantage.has(category) ) &&
                                        <img src={`${process.env.PUBLIC_URL}/images/icons/advantages/advantage-weapon.png`} />
                                    }
                                    {
                                        ( weaponData?.disadvantage !== undefined && weaponData.disadvantage.has(category) ) &&
                                        <img src={`${process.env.PUBLIC_URL}/images/icons/advantages/disadvantage-weapon.png`} />
                                    }
                                </span>
                            ))
                        }
                    </span>
                    <span className="map-tooltip-unit-details-info-weapon-advantageRow">
                        {
                            Object.values(Classes.types).map( (type : CategoryType) => {
                                var advantage = 0;
                                if (type !== Classes.types.INFANTRY) { // Skip infantry
                                    if ( (weaponData?.advantage !== undefined) && (weaponData.advantage.has(type)) )
                                            advantage = 1;
                                    if ( (classData.data?.types !== undefined) && (classData.data.types.includes(type)) )
                                            advantage = advantage - 2;
                                }
                                var advantageSrc = `${process.env.PUBLIC_URL}/images/icons/advantages/`;
                                switch (advantage) {
                                    case 0: advantageSrc = ""; break;
                                    case 1: advantageSrc = advantageSrc.concat("advantage-type.png"); break;
                                    case -1: advantageSrc = advantageSrc.concat("opposite-type.png"); break;
                                    case -2: advantageSrc = advantageSrc.concat("disadvantage-type.png"); break;
                                }
                                return (
                                    <span className="map-tooltip-unit-details-info-weapon-advantageCol">
                                        <img src={type.icon} />
                                        {
                                            ( advantage !== 0 ) && 
                                            <img src={advantageSrc} />
                                        }
                                    </span>
                                )
                            })
                        }
                    </span>
                </span>
            )
        }

        // Misc
        var miscRow = <></> 
        if (unit.appear!==undefined || unit.disappear!==undefined || unit.notes!==undefined)
            miscRow = (
                <span className="map-tooltip-unit-details-info-miscRow" >
                    <span className="header-brown-underlined">Other Information</span>
                    {(unit.appear !== undefined) && <span>{`Spawn condition: ${unit.appear}`}</span>}
                    {(unit.disappear !== undefined) && <span>{`Despawn condition: ${unit.appear}`}</span>}
                    {
                        (unit.notes !== undefined) && 
                        <span className="map-tooltip-unit-details-info-miscRow-notes">{unit.notes}</span>
                    }
                </span>
            )

        // All together
        children.push(
            <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <img 
                            className="map-tooltip-category-icon"
                            src={unit.class.sprite.url as string}
                        />
                        <span className="map-tooltip-category-title">{unit.name}</span>
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
                                    <img src={unit.class.profile.url as string} />
                                </span>
                                <span className="map-tooltip-unit-details-info">
                                    {levelTypeRow}
                                    {classRow}
                                    {weaponRow}
                                </span> {/* .map-tooltip-unit-details-info */}
                            </span>
                            {advantagesRows}
                            {miscRow}
                        </span>
                    </AccordionDetails>
            </Accordion>
        )
    })

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