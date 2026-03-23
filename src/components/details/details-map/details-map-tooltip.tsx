import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Tooltip } from "react-tooltip";
import { memo, useContext } from "react";
import { GridCellDataType, CoordinateType, StrongholdDataType, PotDataType, UnitDataType, MissionDataType } from "./details-map";
import { CategoryType, WeaponDataType, Weapons } from "../../data-classes/weapon-data";
import { Classes } from "../../data-classes/class-data";
import { BattlesTableContext, MissionsTableContext } from "../../../context";
import { formatText, title } from "../missions-table";

interface TooltipContentProps {
    data : GridCellDataType[][];
    tileCoords : CoordinateType|null;
    missionData : MissionDataType;
    // selectedRowData : React.RefObject<BattleRow|null>;
}

function TooltipContent({data: dataAll, tileCoords, missionData} : TooltipContentProps) {

    // console.log("[[[ Tooltip rerender ]]]")

    // Hooks
    let battleTable = useContext(BattlesTableContext).table
    let missionTable = useContext(MissionsTableContext).table!
    let missionText = useContext(MissionsTableContext).text!

    if (tileCoords === null)
        return <></>

    var data : GridCellDataType = dataAll[tileCoords.x][tileCoords.y]
    var children = []
    
    // -------------------
    // --- Strongholds ---
    // -------------------
    var base : StrongholdDataType|undefined = (data.stronghold === undefined) ? undefined : data.stronghold[1];
    breakBase: if ( base !== undefined ) {
        let index = data.stronghold![0]

        // Make sure Stronghold should be shown
        let show = missionData.strongholds[index].appear;
        if (show === undefined || show === false)
            break breakBase;
        
        // Captains
        var captains : (UnitDataType)[] = [];
        (base.captain).forEach( (captain) => {
            if (captain instanceof String !== true)
                captains.push(captain as UnitDataType)
        })
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
                            <span className="map-tooltip-subcategory-info row-black-background">{pot.description}</span>
                        </span>
                    </AccordionDetails>
            </Accordion>
        )
    }

    // -------------
    // --- Units ---
    // -------------
    let level = 0;
    if (battleTable?.current !== undefined) {
        level = battleTable!.current!.getRow(Object.keys(battleTable!.current!.getState().rowSelection)![0])!.original.level!;
    }
    if (data.unit !== undefined)
        Object.entries(data.unit)?.map( ([key, unit]) => {
            // Check if unit should be shown
            let show = (missionData.units[key] === undefined) ? undefined : missionData.units[key].show;
            if (show === undefined || show === false)
                return;

            // LevelTypeRow
            var levelTypeRow = <></>
            if (unit.class.data !== undefined)
                // let lvl = (useContext(DatabaseContext)[1] as MRT_Row<BattleRow>).original.level
                levelTypeRow = (
                    <span className="map-tooltip-unit-details-info-leveltypeRow">
                        {/* === Level === */}
                        <span className="map-tooltip-unit-details-info-level">
                            {`Lv ${level}`}
                        </span>
                        {/* === Class Type === */}
                        <span className="map-tooltip-unit-details-info-type">
                            {
                                unit.class.data.types.map( (type : CategoryType) => {
                                    let typeID : string = `tile-${unit?.coords.x}-${unit?.coords.y}-unit-${unit.allegiance}-${type.nameLower}Type`;
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
            let classData = unit.class
            let classID = `tile-${
                unit.coords.x}-${unit.coords.y}-unit-${unit.allegiance}-${
                classData.nameLower?.replace(" ","")}Class`
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
                let weaponID : string = `tile-${
                    unit?.coords.x}-${unit?.coords.y}-unit-${unit.allegiance}-${
                    unit.weapon.name.toLowerCase().replace(" ","").replace("'","")}Weapon`
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
            // Add Mission data if it doesn't exist
            let addMissionTextData = (mission : number[]) => {
                let row = missionTable.current?.getRow(mission.join("."))!
                console.log(row)
                let idStr : string = mission.join("-")
                let curText = missionText.current[idStr]
                if (curText === undefined)
                    curText = {
                        title : title[row.original.type],
                        main : formatText(row.original.text)
                    }
                missionText.current[idStr] = curText
            }
            let getMissionTypeClass = (mission: number[]) => {
                let row = missionTable.current?.getRow(mission.join("."))!
                return `type-${row.original.type}`
            }
            if (unit.appear !== undefined && unit.appear[0] !== -1 && missionText.current[unit.appear.join("-")] === undefined)
                addMissionTextData(unit.appear);
            if (unit.disappear !== undefined && unit.disappear[0] !== -1 && missionText.current[unit.disappear.join("-")] === undefined)
                addMissionTextData(unit.disappear);
            if ( (unit.appear!==undefined && unit.appear[0] !== -1 ) || (unit.disappear!==undefined && unit.disappear[0] !== -1) || unit.notes!==undefined)
                miscRow = (
                    <span className="map-tooltip-unit-details-info-miscRow" >
                        <span className="header-brown-underlined">Other Information</span>
                        {
                            (unit.appear !== undefined && unit.appear[0] !== -1) && 
                            <span className="map-tooltip-unit-details-info-miscRow-mission">
                                <span>Spawn condition:<br/></span>
                                <div className="row-black-background">
                                    <div className={`map-tooltip-unit-details-info-miscRow-mission-icon ${getMissionTypeClass(unit.appear)}`}></div>
                                    <span>{missionText.current[unit.appear.join("-")].main}</span>
                                </div>
                            </span>
                           
                        }
                        {
                            (unit.disappear !== undefined && unit.disappear[0] !== -1) &&
                                <span className="map-tooltip-unit-details-info-miscRow-mission">
                                    <span>Despawn condition:<br/></span>
                                    <div className="row-black-background">
                                        <div className={`map-tooltip-unit-details-info-miscRow-mission-icon ${getMissionTypeClass(unit.disappear)}`}></div>
                                        <span>{missionText.current[unit.disappear.join("-")].main}</span>
                                    </div>
                                </span>
                        }
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

    // No children
    if (children.length == 0)
        children.push(<span className="map-tooltip-nodata">There is no data to display for this tile during this mission!<br/>Try selecting another mission.</span>)

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
            // Data is different
            ( prevProps.data !== nextProps.data ) ||
            (
                // tileCoords !== null (prevents tooltip shrinking right before close)
                ( nextProps.tileCoords !== null ) &&
                // tileCoords are different
                ( ( prevProps.tileCoords?.x !== nextProps.tileCoords?.x ) || 
                ( prevProps.tileCoords?.y !== nextProps.tileCoords?.y )    )
            )
        )
    }
)