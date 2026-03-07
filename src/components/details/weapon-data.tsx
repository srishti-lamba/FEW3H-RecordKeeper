interface Dictionary<T> {
    [key: string]: T;
}

interface WeaponDataType {
    icon : string;
    category : string;
    effective ?: string[];
}

interface WeaponListType {
    SWORD : string;
    LANCE : string;
    AXE : string;
    BOW : string;
    REASON : string;
    BRAWL : string;
}

class Weapons {

    static categories : WeaponListType = {
        SWORD : "sword",
        LANCE : "lance",
        AXE : "axe",
        BOW : "bow",
        REASON : "reason",
        BRAWL : "brawl"
    }

    static weakness : WeaponListType = {
        SWORD: Weapons.categories.LANCE,
        LANCE: Weapons.categories.AXE,
        AXE: Weapons.categories.SWORD,
        BOW: Weapons.categories.REASON,
        REASON: Weapons.categories.BRAWL,
        BRAWL: Weapons.categories.BOW
    }

    static weapons : Dictionary<WeaponDataType> = {
        "Iron Axe" : {
            icon : "",
            category : Weapons.categories.AXE
        }
    }

}