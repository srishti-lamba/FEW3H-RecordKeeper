interface Dictionary<T> {
    [key: string]: T;
}

interface TypeListType {
    INFANTRY : string;
    FLYING : string;
    ARMOURED : string;
    CALVARY : string;
    MONSTER : string;
}

interface ClassType {
    description: string;
    types : string[];
}

export class Classes {

    static types : TypeListType = {
        INFANTRY : "Infantry",
        FLYING : "Flying",
        ARMOURED : "Armoured",
        CALVARY : "Calvary",
        MONSTER : "Monster"
    }

    static class : Dictionary<ClassType> = {

        // Beginner Classes
        "Myrmidon": {description: "Especially swift, with high avoidance, the Myrmidon deftly wields the sword.", types: [Classes.types.INFANTRY]},
        "Soldier": {description: "Skilled with a lance, the Soldier has a high degree of accuracy and precision.", types: [Classes.types.INFANTRY]},
        "Fighter": {description: "Proficient with the axe, the bow, and gauntlets, the Fighter has high strength that translates to mighty blows.", types: [Classes.types.INFANTRY]},
        "Monk": {description: "Well-balanced, the Monk uses magic for both offense and defense.", types: [Classes.types.INFANTRY]},

        // Intermediate Classes
        "Thief": {description: "", types: [Classes.types.INFANTRY]},
        "Mercenary": {description: "", types: [Classes.types.INFANTRY]},
        "Pegasus Knight": {description: "", types: [Classes.types.FLYING]},
        "Cavalier": {description: "", types: [Classes.types.CALVARY]},
        "Armored Knight": {description: "", types: [Classes.types.INFANTRY, Classes.types.ARMOURED]},
        "Brigand": {description: "", types: [Classes.types.INFANTRY]},
        "Archer": {description: "", types: [Classes.types.INFANTRY]},
        "Brawler": {description: "", types: [Classes.types.INFANTRY]},
        "Priest": {description: "", types: [Classes.types.INFANTRY]},
        "Mage": {description: "", types: [Classes.types.INFANTRY]},

        // Advanced Classes
        "Swordmaster": {description: "", types: [Classes.types.INFANTRY]},
        "Paladin": {description: "", types: [Classes.types.CALVARY]},
        "Fortress Knight": {description: "", types: [Classes.types.INFANTRY, Classes.types.ARMOURED]},
        "Bishop": {description: "", types: [Classes.types.INFANTRY]},
        "Dark Mage": {description: "", types: [Classes.types.INFANTRY]},
        "Wyvern Rider": {description: "", types: [Classes.types.FLYING]},
        "Assassin": {description: "", types: [Classes.types.INFANTRY]},
        "Warrior": {description: "", types: [Classes.types.INFANTRY]},
        "Grappler": {description: "", types: [Classes.types.INFANTRY]},
        "Sniper": {description: "", types: [Classes.types.INFANTRY]},
        "Warlock": {description: "", types: [Classes.types.INFANTRY]},

        // Master Classes
        "Bow Knight": {description: "", types: [Classes.types.CALVARY]},
        "Dark Knight": {description: "", types: [Classes.types.CALVARY]},
        "Holy Knight": {description: "", types: [Classes.types.CALVARY]},
        "Gremory": {description: "", types: [Classes.types.INFANTRY]},
        "Trickster": {description: "", types: [Classes.types.INFANTRY]},
        "Mortal Savant": {description: "", types: [Classes.types.INFANTRY]},
        "Falcon Knight": {description: "", types: [Classes.types.FLYING]},
        "Wyvern Lord": {description: "", types: [Classes.types.FLYING]},
        "Great Knight": {description: "", types: [Classes.types.CALVARY, Classes.types.ARMOURED]},
        "Dark Bishop": {description: "", types: [Classes.types.INFANTRY]},
        "War Master": {description: "", types: [Classes.types.INFANTRY]},
        "Dancer": {description: "", types: [Classes.types.INFANTRY]},

        // Unique Classes
        "Fluegel": {description: "", types: [Classes.types.INFANTRY]},
        "Asura": {description: "", types: [Classes.types.INFANTRY]},
        "Armored Lord": {description: "", types: [Classes.types.INFANTRY, Classes.types.ARMOURED]},
        "Emperor": {description: "", types: [Classes.types.INFANTRY, Classes.types.ARMOURED]},
        "High Lord": {description: "", types: [Classes.types.INFANTRY]},
        "Great Lord": {description: "", types: [Classes.types.INFANTRY]},
        "Wyvern Master": {description: "", types: [Classes.types.FLYING]},
        "Barbarossa	": {description: "", types: [Classes.types.FLYING]},
        "Silverheart": {description: "", types: [Classes.types.INFANTRY]},
        "Enlightened One": {description: "", types: [Classes.types.INFANTRY]},
        "Saint": {description: "", types: [Classes.types.INFANTRY]},
        "Death Knight": {description: "", types: [Classes.types.CALVARY]},

        // Non-Playable Classes
        "Noble": {description: "", types: [Classes.types.INFANTRY]},
        "Commoner": {description: "", types: [Classes.types.INFANTRY]},
        "Lord": {description: "", types: [Classes.types.INFANTRY]},
        "Prionsa": {description: "", types: [Classes.types.CALVARY]},
        "Gurgan": {description: "", types: [Classes.types.FLYING]},
        "Agastya": {description: "", types: [Classes.types.INFANTRY]},
        "Avesta": {description: "", types: [Classes.types.INFANTRY]}
    }

    public static getTypeIcon(type : string) {
        return `${process.env.PUBLIC_URL}/images/icons/class-types/${type.toLowerCase()}.png`
    }

    public static getClassSprite(className : string, allegiance : string) {
        return `${process.env.PUBLIC_URL}/images/icons/sprites/${className.toLowerCase()}/${allegiance}.svg`
    }

    public static getClassProfile(className : string, profile : string) {
        return `${process.env.PUBLIC_URL}/images/icons/profiles/${className}/${profile}.png`
    }
}