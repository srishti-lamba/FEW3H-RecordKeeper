interface Dictionary<T> {
    [key: string]: T;
}

interface TypeListType {
    INFANTRY : string;
    CALVARY : string;
    FLYING : string;
    ARMOURED : string;
    MONSTER : string;
}

interface ClassType {
    description: string;
    types : string[];
}

export class Classes {

    private static typesList : TypeListType = {
        INFANTRY : "Infantry",
        CALVARY : "Calvary",
        FLYING : "Flying",
        ARMOURED : "Armoured",
        MONSTER : "Monster"
    }

    static class : Dictionary<ClassType> = {

        // Beginner Classes
        "Myrmidon": {description: "Especially swift, with high avoidance, the Myrmidon deftly wields the sword.", types: [Classes.typesList.INFANTRY]},
        "Soldier": {description: "Skilled with a lance, the Soldier has a high degree of accuracy and precision.", types: [Classes.typesList.INFANTRY]},
        "Fighter": {description: "Proficient with the axe, the bow, and gauntlets, the Fighter has high strength that translates to mighty blows.", types: [Classes.typesList.INFANTRY]},
        "Monk": {description: "Well-balanced, the Monk uses magic for both offense and defense.", types: [Classes.typesList.INFANTRY]},

        // Intermediate Classes
        "Thief": {description: "", types: [Classes.typesList.INFANTRY]},
        "Mercenary": {description: "", types: [Classes.typesList.INFANTRY]},
        "Pegasus Knight": {description: "", types: [Classes.typesList.FLYING]},
        "Cavalier": {description: "", types: [Classes.typesList.CALVARY]},
        "Armored Knight": {description: "", types: [Classes.typesList.INFANTRY, Classes.typesList.ARMOURED]},
        "Brigand": {description: "", types: [Classes.typesList.INFANTRY]},
        "Archer": {description: "", types: [Classes.typesList.INFANTRY]},
        "Brawler": {description: "", types: [Classes.typesList.INFANTRY]},
        "Priest": {description: "", types: [Classes.typesList.INFANTRY]},
        "Mage": {description: "", types: [Classes.typesList.INFANTRY]},

        // Advanced Classes
        "Swordmaster": {description: "", types: [Classes.typesList.INFANTRY]},
        "Paladin": {description: "", types: [Classes.typesList.CALVARY]},
        "Fortress Knight": {description: "", types: [Classes.typesList.INFANTRY, Classes.typesList.ARMOURED]},
        "Bishop": {description: "", types: [Classes.typesList.INFANTRY]},
        "Dark Mage": {description: "", types: [Classes.typesList.INFANTRY]},
        "Wyvern Rider": {description: "", types: [Classes.typesList.FLYING]},
        "Assassin": {description: "", types: [Classes.typesList.INFANTRY]},
        "Warrior": {description: "", types: [Classes.typesList.INFANTRY]},
        "Grappler": {description: "", types: [Classes.typesList.INFANTRY]},
        "Sniper": {description: "", types: [Classes.typesList.INFANTRY]},
        "Warlock": {description: "", types: [Classes.typesList.INFANTRY]},

        // Master Classes
        "Bow Knight": {description: "", types: [Classes.typesList.CALVARY]},
        "Dark Knight": {description: "", types: [Classes.typesList.CALVARY]},
        "Holy Knight": {description: "", types: [Classes.typesList.CALVARY]},
        "Gremory": {description: "", types: [Classes.typesList.INFANTRY]},
        "Trickster": {description: "", types: [Classes.typesList.INFANTRY]},
        "Mortal Savant": {description: "", types: [Classes.typesList.INFANTRY]},
        "Falcon Knight": {description: "", types: [Classes.typesList.FLYING]},
        "Wyvern Lord": {description: "", types: [Classes.typesList.FLYING]},
        "Great Knight": {description: "", types: [Classes.typesList.CALVARY, Classes.typesList.ARMOURED]},
        "Dark Bishop": {description: "", types: [Classes.typesList.INFANTRY]},
        "War Master": {description: "", types: [Classes.typesList.INFANTRY]},
        "Dancer": {description: "", types: [Classes.typesList.INFANTRY]},

        // Unique Classes
        "Fluegel": {description: "", types: [Classes.typesList.INFANTRY]},
        "Asura": {description: "", types: [Classes.typesList.INFANTRY]},
        "Armored Lord": {description: "", types: [Classes.typesList.INFANTRY, Classes.typesList.ARMOURED]},
        "Emperor": {description: "", types: [Classes.typesList.INFANTRY, Classes.typesList.ARMOURED]},
        "High Lord": {description: "", types: [Classes.typesList.INFANTRY]},
        "Great Lord": {description: "", types: [Classes.typesList.INFANTRY]},
        "Wyvern Master": {description: "", types: [Classes.typesList.FLYING]},
        "Barbarossa	": {description: "", types: [Classes.typesList.FLYING]},
        "Silverheart": {description: "", types: [Classes.typesList.INFANTRY]},
        "Enlightened One": {description: "", types: [Classes.typesList.INFANTRY]},
        "Saint": {description: "", types: [Classes.typesList.INFANTRY]},
        "Death Knight": {description: "", types: [Classes.typesList.CALVARY]},

        // Non-Playable Classes
        "Noble": {description: "", types: [Classes.typesList.INFANTRY]},
        "Commoner": {description: "", types: [Classes.typesList.INFANTRY]},
        "Lord": {description: "", types: [Classes.typesList.INFANTRY]},
        "Prionsa": {description: "", types: [Classes.typesList.CALVARY]},
        "Gurgan": {description: "", types: [Classes.typesList.FLYING]},
        "Agastya": {description: "", types: [Classes.typesList.INFANTRY]},
        "Avesta": {description: "", types: [Classes.typesList.INFANTRY]}
    }
}