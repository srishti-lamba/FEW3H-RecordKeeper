interface Dictionary<T> {
    [key: string]: T;
}

export interface WeaponDataType {
    icon ?: string;
    category : string;
    type : string;
    advantage ?: Set<string>;
    disadvantage ?: Set<string>;
}

interface WeaponListType {
    SWORD : string;
    LANCE : string;
    AXE : string;
    BOW : string;
    REASON : string;
    BRAWL : string;
}

interface WeaponType {
    REGULAR : string;
    SACRED_WEAPON : string;
    HEROS_RELIC : string;
    AGARTHAN : string;
}

export class Weapons {

    public static categories : WeaponListType = {
        SWORD : "sword",
        LANCE : "lance",
        AXE : "axe",
        BOW : "bow",
        REASON : "reason",
        BRAWL : "brawl"
    }

    static advantage : Dictionary<string> = {
        sword: Weapons.categories.AXE,
        lance: Weapons.categories.SWORD,
        axe: Weapons.categories.LANCE,
        bow: Weapons.categories.BRAWL,
        reason: Weapons.categories.BOW,
        brawl: Weapons.categories.REASON
    }

    static disadvantage : Dictionary<string> = {
        sword: Weapons.categories.LANCE,
        lance: Weapons.categories.AXE,
        axe: Weapons.categories.SWORD,
        bow: Weapons.categories.REASON,
        reason: Weapons.categories.BRAWL,
        brawl: Weapons.categories.BOW
    }

    public static type : WeaponType = {
        REGULAR: "Regular",
        SACRED_WEAPON: "Sacred Weapon",
        HEROS_RELIC: "Hero's Relic",
        AGARTHAN: "Agarthan"
    }

    static weapons : Dictionary<WeaponDataType> = {
        "Iron Sword" : {
            category : Weapons.categories.SWORD,
            type : Weapons.type.REGULAR
        },
        "Iron Axe" : {
            category : Weapons.categories.AXE,
            type : Weapons.type.REGULAR
        }
    }

    public static getData(weaponName : string) : WeaponDataType|null {
        let weapon : WeaponDataType|undefined = Weapons.weapons[weaponName];

        if (weapon === undefined)
            return null;

        // Icon
        if (weapon.icon === undefined)
            weapon.icon = Weapons.getIcon(weapon.category, weapon.type);
        
        // Advantage
        if (weapon.advantage === undefined)
            weapon.advantage = new Set([Weapons.advantage[weapon.category]]);
        else
            weapon.advantage = new Set([Weapons.advantage[weapon.category]]).union(weapon.advantage);

        // Disadvantage
        if (weapon.disadvantage === undefined)
            weapon.disadvantage = new Set([Weapons.disadvantage[weapon.category]]);
        else
            weapon.disadvantage = new Set([Weapons.disadvantage[weapon.category]]).union(weapon.disadvantage);
        
        return weapon;
    }

    public static getIcon(category : string, type : string) {
        return `${process.env.PUBLIC_URL}/images/icons/weapons/${category.toLowerCase()}-${type.toLowerCase().replaceAll(" ","").replaceAll("'","")}.png`
    }

}