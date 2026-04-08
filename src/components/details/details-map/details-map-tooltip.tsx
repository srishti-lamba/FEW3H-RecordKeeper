import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Tooltip } from "react-tooltip";
import { CSSProperties, memo, useContext } from "react";
import { GridCellDataType, CoordinateType, StrongholdDataType, PotDataType, UnitDataType, MissionDataType, BaseDataType, svg_ChestType } from "./details-map";
import { CategoryType, WeaponDataType, Weapons } from "../../data-classes/weapon-data";
import { Classes } from "../../data-classes/class-data";
import { BattlesTableContext, MissionsTableContext } from "../../../context";
import { formatText, initializeMissionTextRef, title } from "../missions-table";
import { MapIcons } from "../../data-classes/map-icon-data";
import { ItemType } from "../../data-classes/item-data";
import { stringify } from "querystring";
import { Crests } from "../../data-classes/crest-data";

interface TooltipContentProps {
    data : GridCellDataType[][];
    tileCoords : CoordinateType|null;
    missionData : MissionDataType;
    // selectedRowData : React.RefObject<BattleRow|null>;
    // tileID: any;
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
    var stronghold : StrongholdDataType|undefined = (data.stronghold === undefined) ? undefined : data.stronghold[1];
    breakStronghold: if ( stronghold !== undefined ) {
        let index = data.stronghold![0]

        // Make sure Stronghold should be shown
        let show = missionData.strongholds[index].appear;
        if (show === undefined || show === false)
            break breakStronghold;
        
        // Captains
        var captains : (UnitDataType)[] = [];
        (stronghold.captain).forEach( (captain) => {
            console.log(captain)
            if (captain instanceof String !== true)
                captains.push(captain as UnitDataType)
        })
        var captainElements = []
        captainElements.push(captains.map( (unit : UnitDataType) => {
            console.log(unit)
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

        children.push(
            <span className="map-tooltip-stronghold map-tooltip-row">
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <span className="map-tooltip-category-icon">{stronghold.icon}</span>
                        <span className="map-tooltip-category-title">{stronghold.name}</span>
                    </AccordionSummary>
                    <AccordionDetails>
                        <span className="map-tooltip-subcategory map-tooltip-stronghold-details">
                            <span className="map-tooltip-subcategory-header header-brown-underlined">Details</span>
                            <span className="map-tooltip-subcategory-row">Capture Required: <b>{(stronghold.captureRequired) ? "True" : "False"}</b></span>
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

    // -------------
    // --- Bases ---
    // -------------
    var base : BaseDataType|undefined = (data.base === undefined) ? undefined : data.base[1];
    breakBase: if ( base !== undefined ) {
        let index = data.base![0]

        // Make sure base should be shown
        let show = missionData.bases[index].appear;
        if (show === undefined || show === false)
            break breakBase;
        let allegiance = missionData.bases[index].allegiance;
        
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
            <span className="map-tooltip-base map-tooltip-row">
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <span className="map-tooltip-category-icon">
                            <span className="map-tooltip-category-icon-background" />
                            {MapIcons.base[allegiance].svg}
                        </span>
                        <span className="map-tooltip-category-title">Base</span>
                    </AccordionSummary>
                    <AccordionDetails>
                        <span className="map-tooltip-subcategory map-tooltip-base-captains ">
                            <span className="map-tooltip-subcategory-header header-brown-underlined">Captains</span>
                            {captainElements}
                        </span>
                    </AccordionDetails>
                </Accordion>
            </span>
        )
    }

    // ---------------
    // --- Chests ---
    // ---------------
    var chest : svg_ChestType|undefined = data.chest;
    if ( chest !== undefined ) {
        let chestID = `tile-${chest.icon.coords.x}-${chest.icon.coords.y}-chest`;
        children.push(
            <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <span className="map-tooltip-category-icon">{MapIcons.chest.svg}</span>
                        <span className="map-tooltip-category-title">Chest</span>
                    </AccordionSummary>
                    <AccordionDetails>
                        <span className="map-tooltip-subcategory map-tooltip-chest">
                            <span className="map-tooltip-subcategory-header header-brown-underlined">First-Time Loot</span>
                            {
                                (chest.item === undefined || (chest.item as any).name === undefined) ?

                                <span className="map-tooltip-subcategory-info row-black-background">No item defined</span> :
                                
                                <>
                                    <span className="map-tooltip-subcategory-info row-black-background" id={chestID}>
                                        <img
                                            className="map-tooltip-subcategory-row-icon"
                                            src={(chest.item as ItemType).icon}
                                        />
                                        {(chest.item as ItemType).name}
                                    </span>
                                    <Tooltip
                                        anchorSelect={`#${chestID}`}
                                        content={`${(chest.item as ItemType).description!}`}
                                        key={`${chestID}-tooltip`}
                                        place="bottom"
                                    />
                                </>
                            }
                        </span>
                    </AccordionDetails>
            </Accordion>
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
            if (unit.class.data !== undefined) {
                let faction = (unit.faction!==undefined) ? unit.faction : unit.allegiance;
                levelTypeRow = (
                    // <span className="map-tooltip-unit-details-info-leveltypeRow">
                    <>
                        {/* === Faction === */}
                        <span className="map-tooltip-unit-details-info-faction">
                            <img 
                                src={
                                    `${process.env.PUBLIC_URL}/images/icons/factions/${faction}.png`}
                                alt={`Faction: ${faction.slice(0,1).toUpperCase() + faction.slice(1)}`}
                            />
                        </span>
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
                    </>
                    // </span>
                )}

            // ClassRow
            let classData = unit.class
            let classID = `tile-${
                unit.coords.x}-${unit.coords.y}-unit-${unit.allegiance}-${
                classData.nameLower?.replaceAll(" ","")}Class`
            var classRow = (
                <>
                    <img 
                        className="map-tooltip-unit-details-info-class-icon" 
                        src={unit.class.sprite.url as string} 
                    />
                    <span 
                        id={classID}
                        className="map-tooltip-unit-details-info-class-name" 
                    >
                        {unit.class.name}
                    </span>
                    {
                        (unit.monster!==undefined) &&
                        <>
                            <img
                                className="map-tooltip-unit-details-info-monsterHP" 
                                id={`${classID}-hp`}
                                src={`${process.env.PUBLIC_URL}/images/icons/monsters/hp/${unit.monster.hpGauges}.png`}
                            />
                            <Tooltip
                                anchorSelect={`#${classID}-hp`}
                                content={`${unit.monster.hpGauges} HP Gauge${(unit.monster.hpGauges>1)?"s":""}`}
                                key={`${classID}-hp-tooltip`}
                                place="bottom"
                            />
                        </>
                    }
                    <Tooltip
                        anchorSelect={`#${classID}`}
                        content={classData.data?.description}
                        key={`${classID}-tooltip`}
                        place="bottom"
                    />
                </>
            )

            // WeaponRow
            let weaponData : WeaponDataType|undefined = Weapons.getData(unit.weapon.name);
            var weaponRow = <></>
            if (weaponData !== null) {
                let weaponID : string = `tile-${
                    unit?.coords.x}-${unit?.coords.y}-unit-${unit.allegiance}-${
                    unit.weapon.name.toLowerCase().replaceAll(" ","").replaceAll("'","")}Weapon`
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
            let displayWeaponAdvantage = ( (category : CategoryType, categoryID : string, advantage : boolean) => (
                <>
                    <img 
                        src={`${process.env.PUBLIC_URL}/images/icons/advantages/${(!advantage)?"dis":""}advantage-weapon.png`}
                        alt={`Weapon ${(advantage) ? "A" : "Disa"}dvantage Icon`} 
                        id={`${categoryID}-${(!advantage)?"dis":""}advantage`}
                    />
                    { 
                        (unit.allegiance == "red" || unit.allegiance == "yellow") &&
                        <Tooltip
                            anchorSelect={`#${categoryID}-${(!advantage)?"dis":""}advantage`}
                            children={
                                <span className="map-tooltip-unit-details-info-weapon-description">
                                    {`${(advantage) ? "Do not u" : "U"}se ${(category.nameLower === "gauntlets") ? category.nameLower : category.nameLower + "s"} against this enemy`}
                                </span>
                            }
                            key={`${categoryID}-${(!advantage)?"dis":""}advantage-tooltip`}
                            place="bottom"
                        />
                    }
                </>
            ))
            if (weaponData !== null) {
                advantagesRows = (
                    <span className="map-tooltip-unit-box map-tooltip-unit-weapon-advantages">
                        <span className="map-tooltip-unit-weapon-advantageRow">
                            {
                                Object.values(Weapons.categories).map( (category : CategoryType) => {
                                    // Skip Stone
                                    if (category === Weapons.categories.STONE)
                                        return <></>

                                    let categoryID = `map-tooltip-info-weapon-advantageCol-${unit.allegiance}-${category.nameLower}`
                                    return (
                                    <span className="map-tooltip-unit-weapon-advantageCol">
                                        <img src={category.icon} />
                                        {
                                            ( weaponData?.advantage !== undefined && weaponData.advantage.has(category) ) &&
                                            displayWeaponAdvantage(category, categoryID, true)
                                        }
                                        {
                                            ( weaponData?.disadvantage !== undefined && weaponData.disadvantage.has(category) ) && 
                                            displayWeaponAdvantage(category, categoryID, false)
                                        }
                                    </span>
                                )})
                            }
                        </span>
                        <span className="map-tooltip-unit-weapon-advantageRow">
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
                                        <span className="map-tooltip-unit-weapon-advantageCol">
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

            // StatRow
            let statData : UnitDataType["stats"] = unit.stats;
            var statRow = <></>
            if (statData !== undefined && statData !== null) {
                let statId : string = `tile-${unit.coords.x}-${unit.coords.y}-unit-${unit.allegiance}-${
                    unit.name.toLowerCase().replaceAll(" ", "")
                }-stats`
                const getStatElements = ([title, text, value, description] : [string, string, number|undefined, string]) => {
                    if (value === undefined)
                        return <></>
                    let curStatId = statId + text.toLowerCase();
                    return (
                        <>
                            <span
                                key={`${curStatId}`}
                                className="row-black-background map-tooltip-unit-stat"
                            >
                                <span id={`${curStatId}`}>{text}</span>
                                <span>{value}</span>
                            </span>
                            <Tooltip
                                anchorSelect={`#${curStatId}`}
                                children=
                                    <span className="stat-content">
                                        <span className="title"><b><u>{title}</u></b></span>
                                        <span className="description">{description}</span>
                                    </span>
                                key={`${curStatId}-tooltip`}
                                place="bottom"
                            />
                        </>
                    )
                }
                statRow = (
                    <span className="map-tooltip-unit-box map-tooltip-unit-statRow">
                        <span className="map-tooltip-unit-stat-col">
                            {
                                ([
                                    ["Hit Points", "HP",  statData.hp,  "A unit's max HP. HP depletes with damage. When it reaches zero, a unit will retreat or fall in battle."],
                                    ["Strength", "Str", statData.str, "Affects the attack power of physical attacks."],
                                    ["Magic", "Mag", statData.mag, "Affects the attack power of magic attacks."],
                                    ["Dexterity", "Dex", statData.dex, "Affects the attack power of critical rushes, as well as critical hit rate."],
                                    ["Speed", "Spd", statData.spd, "Affects the duration of the Awakened state and recharge time for combat arts and magic."],
                                ] as [string, string, number, string][]).map( ( arr ) => getStatElements(arr) )
                            }
                        </span>
                        <span className="map-tooltip-unit-stat-col">
                            {
                                ([
                                    ["Movement", "Move",  statData.move,  "-"],
                                    ["Luck", "Lck", statData.lck, "Affects the appearance rate of recovery items."],
                                    ["Defense", "Def", statData.def, "Affects defense against physical attacks."],
                                    ["Resistance", "Res", statData.res, "Affects defense against magic attacks."],
                                    ["Charm", "Cha", statData.spd, "Affects drain rate of a battalion's endurance."],
                                ] as [string, string, number, string][]).map( ( arr ) => getStatElements(arr) )
                            }
                        </span>
                    </span>
                )
            }

            // Abilities
            let abilitiesData = {
                class : unit.class.data!.abilities
            };
            var abilitiesRow = <></>
            if (abilitiesData.class !== undefined) {
                let abilitiesClass = "map-tooltip-unit-abilities"
                let abilitiesID : string = `tile-${
                    unit?.coords.x}-${unit?.coords.y}-unit-${unit.allegiance}-ability`
                abilitiesRow = (
                    <span 
                        className={`map-tooltip-unit-box ${abilitiesClass}Row`}
                        key={abilitiesID}
                    >
                        {/* Crests */}
                        {
                            (unit.crest!==undefined && unit.crest.length>0) &&
                            <span className={`${abilitiesClass}-crests`}>
                                {
                                    (unit.crest.map(data => {
                                        let crestData = Crests.crest[data.name];
                                        if (crestData===undefined) return <></>
                                        let crest = (data.type==="major") ? crestData.major : crestData.minor;
                                        let crestID = (
                                            `tile-${unit?.coords.x}-${unit?.coords.y}-unit-${unit.allegiance}-` + 
                                            `crest-${data.name}-${data.type}-${data.level}`)
                                        return (<>
                                            <img
                                                src={crest.icon}
                                                alt={crest.name}
                                                id={crestID}
                                                key={crestID}
                                            />
                                            <Tooltip
                                                anchorSelect={`#${crestID}`}
                                                children= <span>
                                                        <div><b><u>{crest.name + " Lv " + data.level}</u></b></div>
                                                        <div>{crest.description}</div>
                                                        <br/>
                                                        <div>{crest.effect[data.level-1]}</div>
                                                    </span>
                                                key={`${crestID}-tooltip`}
                                                place="top"
                                            />
                                        </>)
                                    }))
                                }
                            </span>
                        }
                        {/* Class Abilities */}
                        {
                            (abilitiesData.class !== undefined) &&
                            <span className={`${abilitiesClass}-class`}>
                                <div className={`${abilitiesClass}-class-title`}>Class Abilities</div>
                                <div className={`${abilitiesClass}-class-icons`}>
                                    {
                                        abilitiesData.class.map( (ability) => (
                                            <>
                                                <img 
                                                    src={ability.icon} 
                                                    alt={ability.name}
                                                    id={`${abilitiesID}-${ability.nameFile}`}
                                                />
                                                <Tooltip
                                                    anchorSelect={`#${abilitiesID}-${ability.nameFile}`}
                                                    children= <span>
                                                            <div><b><u>{ability.name}</u></b></div>
                                                            <span>{ability.description}</span>
                                                        </span>
                                                    key={`${abilitiesID}-${ability.nameFile}-tooltip`}
                                                    place="top"
                                                />
                                            </>
                                        ))
                                    }
                                </div>
                            </span>
                        }
                    </span>
                )
            }

            // Misc
            var miscRow = <></> 
            // Add Mission data if it doesn't exist
            let addMissionTextData = (mission : number[]) => {
                let row = missionTable.current?.getRow(mission.join("."))!
                initializeMissionTextRef(row, missionText)
            }
            let getMissionTypeClass = (mission: number[]) => {
                let row = missionTable.current?.getRow(mission.join("."))!
                return `type-${row.original.type}`
            }
            let getSpawnCondition = ([mission, spawn] : [number[], boolean]) => (
                <span className="map-tooltip-unit-miscRow-mission">
                    <span>{(spawn) ? "Spawn condition:" : "Despawn condition:"}<br/></span>
                    <div className="row-black-background">
                        <div className={`map-tooltip-unit-miscRow-mission-icon ${getMissionTypeClass(mission)}`}></div>
                        <span>{missionText.current[mission.join("-")].main}</span>
                    </div>
                </span>
            )
            if ( 
                ( (unit.appearAndDisappear!==undefined) && ( (unit.appearAndDisappear.length > 1) || ( unit.appearAndDisappear[0][0][0] != -1 ) ) )
                || unit.notes!==undefined
            )
                miscRow = (
                    <span className="map-tooltip-unit-box map-tooltip-unit-miscRow" >
                        <span className="header-brown-underlined">Other Information</span>
                        { (unit.appearAndDisappear !== undefined) &&
                            (unit.appearAndDisappear).map( ([mission, show] : [number[], boolean] ) => {
                                if (mission[0] == -1) return <></>;
                                if (missionText.current[mission.join("-")] === undefined)
                                    addMissionTextData(mission)
                                return getSpawnCondition([mission, show])
                            })
                        }
                        {
                            (unit.notes !== undefined) && 
                            <span className="map-tooltip-unit-miscRow-notes">{unit.notes}</span>
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
                                        <span className="map-tooltip-unit-details-info-levelClassRows">
                                            {levelTypeRow}
                                            {classRow}
                                        </span>
                                        {weaponRow}
                                    </span> {/* .map-tooltip-unit-details-info */}
                                </span>
                                {advantagesRows}
                                {statRow}
                                {abilitiesRow}
                                {miscRow}
                            </span>
                        </AccordionDetails>
                </Accordion>
            )
        })

    // No children
    if (children.length == 0)
        children.push(<span className="map-tooltip-nodata">There is no data to display for this tile during this mission!<br/>Try selecting another mission.</span>)

    console.log("Top offset")
    // console.log(topOffset?.activeAnchor?.offsetTop)
    // console.log(document.getElementById(`${topOffset}`))

    return (
        <div 
            id="map-tooltip-content"
            // style={{"--top": `${document.getElementById(`${topOffset}`)?.offsetTop}px`} as CSSProperties}
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