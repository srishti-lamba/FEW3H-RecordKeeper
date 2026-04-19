import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Tooltip } from "react-tooltip";
import { memo, useContext } from "react";
import { GridCellDataType, CoordinateType, StrongholdDataType, PotDataType, UnitDataType, MissionDataType, BaseDataType, svg_ChestType, selectedMissionPassed, svg_PlayerType } from "./details-map";
import { CategoryType, WeaponDataType, Weapons } from "../../data-classes/weapon-data";
import { Classes } from "../../data-classes/class-data";
import { BattlesTableContext, MissionsTableContext } from "../../../context";
import { initializeMissionTextRef } from "../missions-table";
import { MapIcons, SpriteRotator } from "../../data-classes/map-icon-data";
import { ItemType } from "../../data-classes/item-data";
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
    // --- Player Tile ---
    // -------------------
    var playerTile : svg_PlayerType|undefined = (data.playerTile === undefined) ? undefined : data.playerTile;
    if ( playerTile !== undefined ) {
        // Units
        let players : [boolean, UnitDataType|UnitDataType[]][] = [];
        let shezIndex : number = -1;
        if (playerTile["fixed-unit"] !== undefined) 
            (playerTile["fixed-unit"]).forEach( (player, index : number) => {
                if (player instanceof String !== true) {
                    if (player.name == "Shez") {
                        if (shezIndex == -1)
                            shezIndex = index;
                        else {
                            let prevShez = players[shezIndex][1]
                            players[shezIndex][0] = true;
                            players[shezIndex][1] = [prevShez, player] as UnitDataType|UnitDataType[]
                            return
                        }
                    }
                    players.push([false, player as UnitDataType])
                }
            })
        var playerElements = []
        
        playerElements.push(players.map( ([double, unit] : [boolean, UnitDataType|UnitDataType[]]) => {
            return (
                <span className="map-tooltip-subcategory-row">
                    <span className="map-tooltip-subcategory-row-info">
                        {
                            (double == true) ?
                            // Double Gendered Units
                            <>
                                <SpriteRotator 
                                    svgProps={undefined} missionData={missionData} 
                                    tileSize={0} yZoom={0} 
                                    units={unit as UnitDataType[]} tooltip={true} 
                                />
                                {(unit as UnitDataType[])[0].name}
                            </> :
                            // Single Gendered Units
                            <>
                                <img
                                    className="map-tooltip-subcategory-row-icon"
                                    src={(unit as UnitDataType).class.sprite?.url as string}
                                    style={{height: "1.25em"}}
                                />
                                {(unit as UnitDataType).name}
                            </>
                        }
                    </span>
                </span>
            )
        }))

        if (playerElements.length == 0)
            playerElements.push(
                <span className="map-tooltip-subcategory-row">
                    <span className="map-tooltip-subcategory-row-info">
                        Any unit
                    </span>
                </span>
        )

        children.push(
            <span className="map-tooltip-row">
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <span className="map-tooltip-category-icon">{MapIcons.playerTile[playerTile["tile-type"]].svg}</span>
                        <span className="map-tooltip-category-title">{(playerTile["tile-type"] == "circle") ? "Direct Control" : "Indirect Control"}</span>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className="map-tooltip-playerTile">
                            <span className="map-tooltip-subcategory map-tooltip-stronghold-captains ">
                                <span className="map-tooltip-subcategory-header header-brown-underlined">Characters</span>
                                {playerElements}
                            </span>
                            {
                                (playerTile.note !== undefined) &&
                                <span className="map-tooltip-subcategory map-tooltip-stronghold-details">
                                    <span className="map-tooltip-subcategory-header header-brown-underlined">Notes</span>
                                    <span className="map-tooltip-subcategory-info">{playerTile.note}</span>
                                </span> 
                            }
                        </div>
                    </AccordionDetails>
                </Accordion>
            </span>
        )
    }

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
        let captains : (UnitDataType)[] = [];
        (stronghold.captain).forEach( (captain) => {
            if (captain instanceof String !== true)
                captains.push(captain as UnitDataType)
        })
        var captainElements = []
        captainElements.push(captains.map( (unit : UnitDataType) => {
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
        var players : (UnitDataType)[] = [];
        (base.captain).forEach( (captain) => {
            if (captain instanceof String !== true)
                players.push(captain as UnitDataType)
        })
        var captainElements = []
        captainElements.push(players.map( (unit : UnitDataType) => {
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

            let coords = (missionData.units[key] !== undefined) ? missionData.units[key].coords : {x:0,y:0};

            let mainID : string = (
                `tile-${coords.x}-${coords.y}-` + 
                `unit-${unit.allegiance}-${unit.name.toLowerCase().replaceAll(" ", "")}`
            )

            // ---------------
            // --- Faction ---
            // ---------------
            var factionRow = <></>
            if (unit.faction!==undefined || unit.allegiance!==undefined) {
                let factionClass = "map-tooltip-unit-details-faction";
                let faction = (unit.faction!==undefined) ? unit.faction : unit.allegiance;
                var factionRow = (
                    <span className={factionClass}>
                        <img 
                            src={
                                `${process.env.PUBLIC_URL}/images/icons/factions/${faction}.png`}
                            alt={`Faction: ${makeFirstLetterCapital(faction)}`}
                        />
                    </span>
                )
            }

            // -------------
            // --- Level ---
            // -------------
            var levelRow = <></>
            if (level!==undefined) {
                let levelClass = "map-tooltip-unit-details-level";
                var levelRow = (
                    <span
                        className={levelClass}
                        key={`${mainID}-level`}
                    >
                        {`Lv ${level}`}
                    </span>
                )
            }

            // ------------
            // --- Type ---
            // ------------
            var typeRow = <></>
            if (unit.class.data !== undefined) {
                let typeClass = "map-tooltip-unit-details-type";
                typeRow = (
                    <span
                        className={typeClass}
                        key={`${mainID}-type`}
                    >
                        {
                            unit.class.data.types.map( (type : CategoryType) => {
                                let typeID : string = `${mainID}-${type.nameLower}Type`;
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
                )}

            // -------------
            // --- Class ---
            // -------------
            let classData = unit.class
            var classRow = <></>
            if (classData!==undefined) {
                let classClass = "map-tooltip-unit-details-class";
                let classID = `${mainID}-${classData.nameLower!}Class`
                var classRow = (
                    <>
                        <img 
                            className={`${classClass}-icon`} 
                            src={unit.class.sprite.url as string} 
                            key={`${classID}-img`}
                        />
                        <span 
                            id={classID}
                            key={`${classID}-name`}
                            className={`${classClass}-name${
                                // Make text smaller if content overflows
                                (classData.name==="Wild Demon Beast") ? " wdb" : ""
                            }`}
                        >
                            {unit.class.name}
                        </span>
                        <Tooltip
                            anchorSelect={`#${classID}`}
                            content={classData.data?.description}
                            key={`${classID}-tooltip`}
                            place="bottom"
                        />
                    </>
                )
            }

            // ---------------
            // --- Monster ---
            // ---------------
            let monsterData = unit.monster
            var monsterRow = <></>
            if (monsterData!==undefined) {
                let monsterClass = "map-tooltip-unit-details-monsterHP";
                let monsterID = `${mainID}-monster`
                var monsterRow = (
                    <>
                        <img
                            className={monsterClass} 
                            id={monsterID}
                            key={monsterID}
                            src={`${process.env.PUBLIC_URL}/images/icons/monsters/hp/${monsterData.hpGauges}.png`}
                        />
                        <Tooltip
                            anchorSelect={`#${monsterID}`}
                            content={`${monsterData.hpGauges} HP Gauge${(monsterData.hpGauges>1)?"s":""}`}
                            key={`${monsterID}-tooltip`}
                            place="bottom"
                        />
                    </>
                )
            }

            // --------------
            // --- Weapon ---
            // --------------
            let weaponData : WeaponDataType|undefined = Weapons.getData(unit.weapon.name);
            var weaponRow = <></>
            if (weaponData !== null) {
                let weaponClass = "map-tooltip-unit-details-weapon"
                let weaponID : string = `${mainID}-${weaponData!.nameLower}Weapon`
                let smallClass = ({
                    "Cracked Crest Stone": "stone",
                    "Crescent Sickle": "cresic",
                    })[unit.weapon.name] || "";
                weaponRow = (
                    <span 
                        className={`${weaponClass}Row row-black-background`}
                        id={weaponID}
                        key={weaponID}
                    >
                        <img src={weaponData?.icon} />
                        <span className={smallClass} >
                            {unit.weapon.name}
                        </span>
                        <Tooltip
                            anchorSelect={`#${weaponID}`}
                            content={weaponData?.description}
                            key={`${weaponID}-tooltip`}
                            place="bottom"
                        />
                    </span>
                )
            }

            // ------------------------------------
            // --- Advantages and Disadvantages ---
            // ------------------------------------
            var advantagesBox = <></>
            let displayWeaponAdvantage = ( (category : CategoryType, categoryID : string, advantage : boolean) => {
                let advantageTxt : string = `${(!advantage)?"dis":""}advantage`
                return (
                    <>
                        <img 
                            src={`${process.env.PUBLIC_URL}/images/icons/advantages/${advantageTxt}-weapon.png`}
                            alt={`Weapon ${makeFirstLetterCapital(advantageTxt)} Icon`} 
                            id={`${categoryID}-${advantageTxt}`}
                        />
                        { 
                            (unit.allegiance == "red" || unit.allegiance == "yellow") &&
                            <Tooltip
                                anchorSelect={`#${categoryID}-${advantageTxt}`}
                                children={
                                    <span className="map-tooltip-unit-details-info-weapon-description">
                                        {`${(advantage) ? "Do not u" : "U"}se ${(category.nameLower === "gauntlets") ? category.nameLower : category.nameLower + "s"} against this enemy`}
                                    </span>
                                }
                                key={`${categoryID}-${advantageTxt}-tooltip`}
                                place="bottom"
                            />
                        }
                    </>
                )
            })
            if (weaponData !== null) {
                let advantagesClass = "map-tooltip-unit-advantages"
                let advantagesId : string = `${mainID}-advantages`
                advantagesBox = (
                    <span
                        className={`map-tooltip-unit-box ${advantagesClass}Box`}
                        key={advantagesId}
                    >
                        <span className={`${advantagesClass}-row`}>
                            {
                                Object.values(Weapons.categories).map( (category : CategoryType) => {
                                    // Skip Stone
                                    if (category === Weapons.categories.STONE)
                                        return <></>

                                    let categoryID = `${advantagesId}-${category.nameLower}`
                                    return (
                                    <span className={`${advantagesClass}-col`}>
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
                        <span className={`${advantagesClass}-row`}>
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
                                        <span className={`${advantagesClass}-col`}>
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

            // -------------
            // --- Stats ---
            // -------------
            let statData : UnitDataType["stats"] = unit.stats;
            var statBox = <></>
            if (statData !== undefined && statData !== null) {
                let statClass = "map-tooltip-unit-stat"
                let statId : string = `${mainID}-stats`
                const getStatElements = ([title, text, value, description] : [string, string, number|undefined, string]) => {
                    if (value === undefined)
                        return <></>
                    let curStatId = statId + text.toLowerCase();
                    return (
                        <>
                            <span
                                key={`${curStatId}`}
                                className={`row-black-background ${statClass}-row`}
                            >
                                <span id={`${curStatId}`}>{text}</span>
                                <span>{value}</span>
                            </span>
                            <Tooltip
                                anchorSelect={`#${curStatId}`}
                                children=
                                    <span>
                                        <div className="header-white-underlined">{title}</div>
                                        <div>{description}</div>
                                    </span>
                                key={`${curStatId}-tooltip`}
                                place="bottom"
                            />
                        </>
                    )
                }
                statBox = (
                    <span 
                        className={`map-tooltip-unit-box ${statClass}Box`}
                        key={statId}
                    >
                        <span className={`${statClass}-col`}>
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
                        <span className={`${statClass}-col`}>
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

            // -----------------
            // --- Inventory ---
            // -----------------
            var inventoryBox = <></>
            if (weaponData !== undefined) {
                let inventoryClass = "map-tooltip-unit-inventory"
                let inventoryID : string = `${mainID}-inventory`
                let weaponSmall : string = (weaponData.might!>=100 && weaponData.durability!>=100) ? "small" : ""
                inventoryBox = (
                    <span 
                        className={`map-tooltip-unit-box ${inventoryClass}Box`}
                        key={inventoryID}
                    >
                        {
                            // Weapon
                            (weaponData!==undefined) &&
                            <span className={`${inventoryClass}-weapon`}>
                                <div 
                                    className={`${inventoryClass}-weapon-main row-black-background`}
                                    id={`${inventoryID}-weapon-main`}
                                >
                                    <img 
                                        src={unit.weapon.data!.icon}
                                        alt={unit.weapon.name}
                                        className={`${inventoryClass}-weapon-icon`}
                                    />
                                    <span className={`${inventoryClass}-weapon-name`}>{unit.weapon.name}</span>
                                    <Tooltip
                                        anchorSelect={`#${inventoryID}-weapon-main`}
                                        content={unit.weapon.data!.description}
                                        key={`${inventoryID}-weapon-main-tooltip`}
                                        place="top"
                                    />
                                </div>
                                <div className={`${inventoryClass}-weapon-grid`}>
                                    <span className={`${inventoryClass}-weapon-info row-black-background`}>
                                        <span className={weaponSmall}>Might</span>
                                        <span>{weaponData!.might}</span>
                                    </span>
                                    <span className={`${inventoryClass}-weapon-info row-black-background`}>
                                        <span className={weaponSmall}>Durability</span>
                                        <span>{weaponData!.durability}</span>
                                    </span>
                                    {
                                        (weaponData!.attributes !== undefined) &&
                                        weaponData!.attributes.map( (attribute) => {
                                            let attributeID = `${inventoryID}-weapon-attribute-${attribute.name.toLowerCase().replaceAll(" ", "")}`
                                            return (
                                            <span 
                                                id={`${attributeID}`}
                                                className={`${inventoryClass}-weapon-attribute row-black-background`}
                                            >
                                                <span >
                                                    {attribute.name}
                                                </span>
                                                <Tooltip
                                                    anchorSelect={`#${attributeID}`}
                                                    content={attribute.description}
                                                    key={`${attributeID}-tooltip`}
                                                    place="top"
                                                />
                                            </span>
                                        )})
                                    }
                                </div>
                            </span>
                        }
                    </span>
                )
            }
            
            // --------------
            // --- Crests ---
            // -------------- 
            var crestBox = <></>
            if (unit.crest !== undefined && unit.crest.length>0) {
                let crestClass = "map-tooltip-unit-crests"
                let crestID : string = `${mainID}-crests`
                crestBox = ( 
                    <span 
                        className={`map-tooltip-unit-box ${crestClass}Box`}
                        key={crestID}
                    >
                        {
                            (unit.crest.map(data => {
                                let crestData = Crests.crest[data.name];
                                if (crestData===undefined) return <></>
                                let crest = (data.type==="major") ? crestData.major : crestData.minor;
                                let curCrestID = (
                                    `${crestID}-${data.name}-${data.type}-${data.level}`)
                                return (
                                <div 
                                    id={curCrestID}
                                    key={curCrestID}
                                    className={`${crestClass}-row row-black-background`}
                                >
                                    <img
                                        src={crest.icon}
                                        alt={crest.name}
                                    />
                                    {crest.name}
                                    <Tooltip
                                        anchorSelect={`#${curCrestID}`}
                                        children= <span>
                                                <div className="header-white-underlined">{crest.name + " Lv " + data.level}</div>
                                                <div>{crest.description}</div>
                                                <br/>
                                                <div>{crest.effect[data.level-1]}</div>
                                            </span>
                                        key={`${curCrestID}-tooltip`}
                                        place="top"
                                    />
                                </div>)
                            }))
                        }
                    </span>
                )
            }

            // -----------------
            // --- Abilities ---
            // -----------------
            let abilitiesData = {
                class : unit.class.data!.abilities
            };
            var abilitiesBox = <></>
            if (abilitiesData.class !== undefined) {
                let abilitiesClass = "map-tooltip-unit-abilities"
                let abilitiesID : string = `${mainID}-ability`
                abilitiesBox = (
                    <span 
                        className={`map-tooltip-unit-box ${abilitiesClass}Box`}
                        key={abilitiesID}
                    >
                        <span className={`${abilitiesClass}-abilities`}>
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
                                                                <div className="header-white-underlined">{ability.name}</div>
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
                    </span>
                )
            }

            // ------------
            // --- Misc ---
            // ------------
            var miscRow = <></>
            // Add Mission data if it doesn't exist
            var getRowFromMission = (mission : number[]) => missionTable.current?.getRow(mission.join("-"))!;
            var addMissionTextData = (mission : number[]) => {
                let row = getRowFromMission(mission);
                initializeMissionTextRef(row, missionText)
            }
            var getMissionTypeClass = (mission: number[]) => {
                let row = getRowFromMission(mission);
                return `type-${row.original.type}`
            }
            var getMissionDiv = (spawnArr ?: [number[], boolean], moveArr ?: [number[], CoordinateType], starting : boolean = false) => {
                let mission : number[]|undefined = undefined;
                let spawn : boolean|undefined = undefined;
                let move : CoordinateType|undefined = undefined;
                if (spawnArr !== undefined)
                    [mission, spawn] = spawnArr;
                else if (moveArr !== undefined)
                    [mission, move] = moveArr;

                if (
                    ( mission === undefined || mission === null || mission.length === 0 ) ||
                    ( spawn === undefined && move === undefined )
                )
                    return <></>

                if (!starting && missionText.current[mission.join("-")] === undefined)
                    addMissionTextData(mission)
                return (
                    <span className="map-tooltip-unit-miscRow-mission">
                        <span>
                            {
                                (starting && move!==undefined) 
                                ? `Initial location:` 
                                : (move!==undefined) 
                                    ? `Move to (${move.x}, ${move.y}) condition:` 
                                    : (spawn) 
                                        ? "Spawn condition:" 
                                        : "Despawn condition:"
                            }
                        <br/></span>
                        <div className="row-black-background">
                            {(!starting) && <div className={`map-tooltip-unit-miscRow-mission-icon ${getMissionTypeClass(mission)}`}></div>}
                            <span>
                                {
                                    (starting) 
                                    ? `The unit starts at (${move!.x}, ${move!.y}).`
                                    : missionText.current[mission.join("-")].main
                                }
                            </span>
                        </div>
                    </span>
                )
            }
            var getSpawnAndMoveConditions = () => {
                let spawnArr : [number[], boolean][] = (unit.appearAndDisappear===undefined) ? [] : unit.appearAndDisappear;
                let moveArr : [number[], CoordinateType][] = (unit.coords===undefined) ? [] : unit.coords;

                let spawnIndex = 0;
                let moveIndex = 0;

                let result = [];

                while (spawnIndex < spawnArr.length && moveIndex < moveArr.length) {
                    let [spawnMission, spawnCoords] = spawnArr[spawnIndex];
                    let [moveMission, moveCoords] = moveArr[moveIndex];
                    
                    // If spawnMission[0] is -1, skip
                    if (spawnMission[0] == -1) {
                        spawnIndex += 1;
                        continue;
                    }

                    // If moveMission[0] is -1, ...
                    if (moveMission[0] == -1) {
                        // If other moves exist, keep
                        if (moveArr.length > 1) 
                            result.push(getMissionDiv(undefined, [moveMission, moveCoords], true))
                        moveIndex += 1;
                        continue;
                    }

                    // Add whichever comes first
                    let spawnComesFirst = selectedMissionPassed(spawnMission, true, moveMission)
                    if (spawnComesFirst) {
                        result.push(getMissionDiv([spawnMission, spawnCoords]))
                        result.push(getMissionDiv(undefined, [moveMission, moveCoords]))
                    }
                    else {
                        result.push(getMissionDiv(undefined, [moveMission, moveCoords]))
                        result.push(getMissionDiv([spawnMission, spawnCoords]))
                    }
                    spawnIndex += 1;
                    moveIndex += 1;
                }

                // Fill remaining spawn
                while (spawnIndex < spawnArr.length) {
                    let [spawnMission, spawnCoords] = spawnArr[spawnIndex];
                    if (spawnMission[0] == -1) { // If spawnMission[0] is -1, skip
                        spawnIndex += 1;
                        continue;
                    }
                    result.push(getMissionDiv([spawnMission, spawnCoords]))
                    spawnIndex += 1;
                }

                // Fill remaining move
                while (moveIndex < moveArr.length) {
                    let [moveMission, moveCoords] = moveArr[moveIndex];
                    if (moveMission[0] == -1) { // If moveMission[0] is -1, ...
                        if (moveArr.length > 1) // If other moves exist, keep
                            result.push(getMissionDiv(undefined, [moveMission, moveCoords], true))
                        moveIndex += 1;
                        continue;
                    }
                    result.push(getMissionDiv(undefined, [moveMission, moveCoords]))
                    moveIndex += 1;
                }
                return result
            }
            if ( 
                ( (unit.appearAndDisappear!==undefined) && ( (unit.appearAndDisappear.length > 1) || ( unit.appearAndDisappear[0][0][0] != -1 ) ) )
                || unit.notes!==undefined
            )
                miscRow = (
                    <span className="map-tooltip-unit-box map-tooltip-unit-miscRow" >
                        <span className="header-brown-underlined">Other Information</span>
                        <>{getSpawnAndMoveConditions()}</>
                        {
                            (unit.notes !== undefined) && 
                            <span className="map-tooltip-unit-miscRow-notes">{unit.notes}</span>
                        }
                    </span>
                )

            // --------------
            // --- Helper ---
            // --------------

            function makeFirstLetterCapital(text:string){
                return text.slice(0,1).toUpperCase() + text.slice(1)
            }

            // --------------------
            // --- All together ---
            // --------------------
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
                                <span className="map-tooltip-unit-details map-tooltip-unit-box">
                                    <span
                                        className="map-tooltip-unit-details-profile"
                                    >
                                        <img src={unit.class.profile.url as string} />
                                    </span>
                                    <span className="map-tooltip-unit-details-info">
                                        <span className="map-tooltip-unit-details-info-levelClassRows">
                                            {factionRow}
                                            {levelRow}
                                            {typeRow}
                                            {classRow}
                                            {monsterRow}
                                        </span>
                                        {weaponRow}
                                    </span> {/* .map-tooltip-unit-details-info */}
                                </span>
                                {advantagesBox}
                                {statBox}
                                {crestBox}
                                {inventoryBox}
                                {abilitiesBox}
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