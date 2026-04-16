import { Dictionary } from "../../context";
import { UnitDataType } from "../details/details-map/details-map";
import { CategoryType } from "./weapon-data";

// Strings datamine: https://hopes.fedatamine.com/en-us/debug/strings
// Class descriptions: https://hopes.fedatamine.com/en-us/debug/strings/52/

interface TypeListType {
    INFANTRY : CategoryType;
    FLYING : CategoryType;
    ARMOURED : CategoryType;
    CALVARY : CategoryType;
    MONSTER : CategoryType;
}

export interface ClassType {
    name : string;
    nameLower ?: string;
    data ?: ClassDataType;
    sprite : {
        url ?: string;
        show : boolean; 
    };
    profile : {
        file : string;
        url ?: string;
    };
}

interface ClassDataType {
    description: string;
    types : CategoryType[];
    abilities : AbilityDataType[];
}

interface AbilityDataType {
    name : string;
    nameFile ?: string;
    icon ?: string;
    description ?: string;
}

export class Classes {

    public static createData() {

        async function createDataAsync() {
            // -----------------
            // --- Abilities ---
            // -----------------
            // Names:        https://hopes.fedatamine.com/en-us/debug/strings/77/
            // Descriptions: https://hopes.fedatamine.com/en-us/debug/strings/76/

            let abilities : Dictionary<AbilityDataType> = {};
            // Weapon Busters
            ((
                [ ["Sword",5],["Lance",5],["Axe",5],["Bow",4],["Gauntlet",5],["Tome",5] ]
            ) as [string,number][]).forEach( 
                ([weapon,maxLvl] : [string,number]) => {
                    // Mimics python's "range(maxLvl)"
                    let arr : number[] = Array.from( { length: maxLvl }, (value, index) => index );
                    arr.forEach( 
                        (level : number) => { 
                            let nameNoLevel = weapon + " Buster"
                            let name = nameNoLevel + " Lv " + level
                            let nameFile = nameNoLevel.toLowerCase().replaceAll(" ", "") + "-" + level;
                            let icon = `${process.env.PUBLIC_URL}/images/icons/abilities/${nameFile}.png`
                            abilities[name] = {
                                name : name, nameFile : nameFile, icon : icon, 
                                description : 
                                    `Grants one tier greater advantage against enemies equipped with ${weapon.toLowerCase()}s.` +
                                    `Increases damage to them by ${75+(level*5)}%.`
                            }
                        }
                    )
                }
            );
            // Calvary Buster
            ([3,4]).forEach( 
            (level : number) => { 
                let nameNoLevel = "Cavalry Buster"
                let name = nameNoLevel + " Lv " + level
                let nameFile = nameNoLevel.toLowerCase().replaceAll(" ", "") + "-" + level;
                let icon = `${process.env.PUBLIC_URL}/images/icons/abilities/${nameFile}.png`
                abilities[name] = {
                    name : name, nameFile : nameFile, icon : icon, 
                    description : 
                        `Grants one tier greater advantage against cavalry units.` +
                        `Increases damage to them by ${75+(level*5)}%.`
                }
            });

            // Spells
            ((
                [ ["Fire"], ["Miasma Δ"], ["Heal"], ]
            ) as [string][]).forEach( 
                ([name] : [string]) => { 
                    let nameFile = name.toLowerCase().replaceAll(" ", "");
                    let icon = `${process.env.PUBLIC_URL}/images/icons/abilities/${nameFile}.png`
                    abilities[name] = {
                        name : name, nameFile : nameFile, icon : icon,
                        description : `Grants the unit ${name}, or increases the spell's potency if already learned.`
                    }
                }    
            );

            // Magic Mastery
            ((
                [ ["Black"], ["Dark"], ["Light"], ]
            ) as [string][]).forEach( 
                ([text] : [string]) => { 
                    let name = text + " Magic Mastery"
                    let nameFile = name.toLowerCase().replaceAll(" ", "");
                    let icon = `${process.env.PUBLIC_URL}/images/icons/abilities/${nameFile}.png`
                    abilities[name] = {
                        name : name, nameFile : nameFile, icon : icon,
                        description : `Reduces cooldown for ${text.toLowerCase()} magic.`
                    }
                }    
            );

            // Faire
            ((
                [ ["Sword"], ["Bow"], ]
            ) as [string][]).forEach( 
                ([text] : [string]) => { 
                    let name = text + "faire"
                    let nameFile = name.toLowerCase().replaceAll(" ", "");
                    let icon = `${process.env.PUBLIC_URL}/images/icons/abilities/${nameFile}.png`
                    abilities[name] = {
                        name : name, nameFile : nameFile, icon : icon,
                        description : `Increases critical hit rate when equipped with a ${text.toLowerCase()}.`
                    }
                }    
            );

            // Other
            ((
                [
                    ["Steal", "Periodically increases the number of items that drop when an enemy commander is defeated."],
                    ["Locktouch", "Allows the unit to open chests without a key and unlock special gates."],
                    ["Pass", "Makes it easier to perform Perfect Guards."],
                    ["Immune Status", "Nullifies all status effects."]
                ]
            ) as [string,string][]).forEach( 
                ([name,description] : [string,string]) => { 
                    let nameFile = name.toLowerCase().replaceAll(" ", "").replaceAll("'", "");
                    let icon = `${process.env.PUBLIC_URL}/images/icons/abilities/${nameFile}.png`
                    abilities[name] = {
                        name : name, nameFile : nameFile, icon : icon, description : description
                    }
                }    
            );
            Classes.abilities = abilities;

            // -------------
            // --- Class ---
            // -------------
            let classes : Dictionary<ClassDataType> = {
                // Beginner Classes
                "Myrmidon": {types: [Classes.types.INFANTRY], abilities: [Classes.abilities["Axe Buster Lv 1"  ]], description: "Especially swift, with high avoidance, the Myrmidon deftly wields the sword."},
                "Soldier":  {types: [Classes.types.INFANTRY], abilities: [Classes.abilities["Sword Buster Lv 1"]], description: "Skilled with a lance, the Soldier has a high degree of accuracy and precision."},
                "Fighter":  {types: [Classes.types.INFANTRY], abilities: [Classes.abilities["Lance Buster Lv 1"]], description: "Proficient with the axe, the bow, and gauntlets, the Fighter has high strength that translates to mighty blows."},
                "Monk":     {types: [Classes.types.INFANTRY], abilities: [Classes.abilities["Bow Buster Lv 1"  ]], description: "Well-balanced, the Monk uses magic for both offense and defense."},

                // Intermediate Classes
                "Thief":          {types: [Classes.types.INFANTRY], abilities: [Classes.abilities["Axe Buster Lv 2"]], description: "Skilled at opening locks, the Thief has excellent speed and dexterity."},
                "Mercenary":      {types: [Classes.types.INFANTRY], abilities: [], description: ""},
                "Pegasus Knight": {types: [Classes.types.FLYING],   abilities: [], description: ""},
                "Cavalier":       {types: [Classes.types.CALVARY],  abilities: [Classes.abilities["Sword Buster Lv 2"]], description: "A mighty opponent who battles on horseback, the Cavalier has a wide range of movement."},
                "Armored Knight": {types: [Classes.types.INFANTRY, 
                                        Classes.types.ARMOURED],    abilities: [], description: ""},
                "Brigand":        {types: [Classes.types.INFANTRY], abilities: [], description: ""},
                "Archer":         {types: [Classes.types.INFANTRY], abilities: [], description: ""},
                "Brawler":        {types: [Classes.types.INFANTRY], abilities: [], description: ""},
                "Priest":         {types: [Classes.types.INFANTRY], abilities: [], description: ""},
                "Mage":           {types: [Classes.types.INFANTRY], abilities: [], description: ""},

                // Advanced Classes
                "Swordmaster":     {types: [Classes.types.INFANTRY], abilities: [], description: ""},
                "Paladin":         {types: [Classes.types.CALVARY],  abilities: [], description: ""},
                "Fortress Knight": {types: [Classes.types.INFANTRY, 
                                            Classes.types.ARMOURED], abilities: [], description: ""},
                "Bishop":          {types: [Classes.types.INFANTRY], abilities: [], description: ""},
                "Dark Mage":       {types: [Classes.types.INFANTRY], abilities: [Classes.abilities["Dark Magic Mastery" ],
                                                                                 Classes.abilities["Miasma Δ"           ],
                                                                                 Classes.abilities["Cavalry Buster Lv 3"]], description: "The Dark Mage shatters the defenses of their foes by employing dark magic."},
                "Wyvern Rider":    {types: [Classes.types.FLYING],   abilities: [], description: ""},
                "Assassin":        {types: [Classes.types.INFANTRY], abilities: [Classes.abilities["Locktouch"      ],
                                                                                 Classes.abilities["Pass"           ],
                                                                                 Classes.abilities["Swordfaire"     ],
                                                                                 Classes.abilities["Axe Buster Lv 3"]    ], description: "A killer who thrives in the shadows, the Assassin has excellent speed and dexterity."},
                "Warrior":         {types: [Classes.types.INFANTRY], abilities: [], description: ""},
                "Grappler":        {types: [Classes.types.INFANTRY], abilities: [], description: ""},
                "Sniper":          {types: [Classes.types.INFANTRY], abilities: [], description: ""},
                "Warlock":         {types: [Classes.types.INFANTRY], abilities: [], description: ""},

                // Master Classes
                "Bow Knight":    {types: [Classes.types.CALVARY],  abilities: [], description: ""},
                "Dark Knight":   {types: [Classes.types.CALVARY],  abilities: [], description: ""},
                "Holy Knight":   {types: [Classes.types.CALVARY],  abilities: [], description: ""},
                "Gremory":       {types: [Classes.types.INFANTRY], abilities: [], description: ""},
                "Trickster":     {types: [Classes.types.INFANTRY], abilities: [], description: ""},
                "Mortal Savant": {types: [Classes.types.INFANTRY], abilities: [], description: ""},
                "Falcon Knight": {types: [Classes.types.FLYING],   abilities: [], description: ""},
                "Wyvern Lord":   {types: [Classes.types.FLYING],   abilities: [], description: ""},
                "Great Knight":  {types: [Classes.types.CALVARY, 
                                        Classes.types.ARMOURED], abilities: [], description: ""},
                "Dark Bishop":   {types: [Classes.types.INFANTRY], abilities: [], description: ""},
                "War Master":    {types: [Classes.types.INFANTRY], abilities: [], description: ""},
                "Dancer":        {types: [Classes.types.INFANTRY], abilities: [], description: ""},

                // Unique Classes
                "Fluegel":         {types: [Classes.types.INFANTRY], abilities: [], description: ""},
                "Asura":           {types: [Classes.types.INFANTRY], abilities: [], description: ""},
                "Armored Lord":    {types: [Classes.types.INFANTRY, 
                                            Classes.types.ARMOURED], abilities: [], description: ""},
                "Emperor":         {types: [Classes.types.INFANTRY, 
                                            Classes.types.ARMOURED], abilities: [], description: ""},
                "High Lord":       {types: [Classes.types.INFANTRY], abilities: [], description: ""},
                "Great Lord":      {types: [Classes.types.INFANTRY], abilities: [], description: ""},
                "Wyvern Master":   {types: [Classes.types.FLYING],   abilities: [], description: ""},
                "Barbarossa	":     {types: [Classes.types.FLYING],   abilities: [], description: ""},
                "Silverheart":     {types: [Classes.types.INFANTRY], abilities: [], description: ""},
                "Enlightened One": {types: [Classes.types.INFANTRY], abilities: [], description: ""},
                "Saint":           {types: [Classes.types.INFANTRY], abilities: [], description: ""},
                "Death Knight":    {types: [Classes.types.CALVARY],  abilities: [], description: ""},

                // Non-Playable Classes
                "Noble":    {types: [Classes.types.INFANTRY], abilities: [], description: ""},
                "Commoner": {types: [Classes.types.INFANTRY], abilities: [], description: ""},
                "Lord":     {types: [Classes.types.INFANTRY], abilities: [], description: ""},
                "Prionsa":  {types: [Classes.types.CALVARY],  abilities: [], description: ""},
                "Gurgan":   {types: [Classes.types.FLYING],   abilities: [], description: ""},
                "Agastya":  {types: [Classes.types.INFANTRY], abilities: [], description: ""},
                "Avesta":   {types: [Classes.types.INFANTRY], abilities: [], description: ""},

                // Enemy Classes
                "Wild Demon Beast": {types: [Classes.types.MONSTER], abilities: [Classes.abilities["Immune Status"]], description: "This wild Demonic Beast has lost all sense of reason. It is infused with a powerful poison."},
            };
            Classes.class = classes;
        }

        createDataAsync();
    }

    static types : TypeListType = {
        INFANTRY : Classes.getCategoryType("Infantry"),
        FLYING : Classes.getCategoryType("Flying"),
        ARMOURED : Classes.getCategoryType("Armoured"),
        CALVARY : Classes.getCategoryType("Calvary"),
        MONSTER : Classes.getCategoryType("Monster")
    }

    static class : Dictionary<ClassDataType> = {};

    static abilities : Dictionary<AbilityDataType> = {};

    public static getClassData(unit : UnitDataType) {

        let c : ClassType = unit.class;

        // Data
        if (c.data === undefined)
            c.data = Classes.class[c.name]

        // Name Lower
        if (c.nameLower === undefined)
            c.nameLower = c.name.toLowerCase()

        // Sprite URL
        if (c.sprite.url === undefined)
            c.sprite.url = Classes.getClassSprite(unit)

        // Profile URL
        if (c.profile.url === undefined)
            c.profile.url = Classes.getClassProfile(unit)

        return c;
    }

    public static getTypeIcon(type : string) {
        return `${process.env.PUBLIC_URL}/images/icons/class-types/${type.toLowerCase()}.png`
    }

    // https://fireemblemwiki.org/wiki/Category:Three_Hopes_map_sprites
    public static getClassSprite(unit : UnitDataType) {
        if (unit.named!==undefined)
            return (
                `${process.env.PUBLIC_URL}/images/icons/sprites/named/` +
                `${unit.name.toLowerCase()}/` +
                `${unit.class.nameLower}-` +
                `${unit.allegiance}` +
                `${(unit.named.timeskip!==undefined)?"-"+unit.named.timeskip:""}.svg`
            )
        if (unit.monster!==undefined)
            return (
                `${process.env.PUBLIC_URL}/images/icons/sprites/monster/` +
                `${unit.monster.sprite}.svg`
            )
        return `${process.env.PUBLIC_URL}/images/icons/sprites/${unit.class.nameLower}/${unit.allegiance}${(unit.gender)?`-${unit.gender}`:""}.svg`
    }

    public static getClassProfile(unit : UnitDataType) {
        if (unit.named!==undefined)
            return (
                `${process.env.PUBLIC_URL}/images/icons/profiles/named/` +
                `${unit.name.toLowerCase()}` +
                `${(unit.named.timeskip!==undefined)?"-"+unit.named.timeskip:""}.png`
            )
        if (unit.monster!==undefined)
            return (
                `${process.env.PUBLIC_URL}/images/icons/profiles/monster/` +
                `${unit.class.profile.file}.png`
            )
        return `${process.env.PUBLIC_URL}/images/icons/profiles/${unit.class.nameLower}/${unit.class.profile.file}.png`
    }

    private static getCategoryType(name : string) {
            let nameLower = name.toLowerCase();
            let icon = Classes.getTypeIcon(nameLower)
            return {
                name : name,
                nameLower : nameLower,
                icon : icon
            }
        }
}