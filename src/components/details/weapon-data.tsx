interface Dictionary<T> {
    [key: string]: T;
}

export interface WeaponDataType {
    icon ?: string;
    category : string;
    type : string;
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

interface WeaponType {
    REGULAR : string;
    SACRED_WEAPON : string;
    HEROS_RELIC : string;
    AGARTHAN : string;
}

export class Weapons {

    static categories : WeaponListType = {
        SWORD : "sword",
        LANCE : "lance",
        AXE : "axe",
        BOW : "bow",
        REASON : "reason",
        BRAWL : "brawl"
    }

    static weakness : Dictionary<string> = {
        sword: Weapons.categories.LANCE,
        lance: Weapons.categories.AXE,
        axe: Weapons.categories.SWORD,
        bow: Weapons.categories.REASON,
        reason: Weapons.categories.BRAWL,
        brawl: Weapons.categories.BOW
    }

    static type : WeaponType = {
        REGULAR: "Regular",
        SACRED_WEAPON: "Sacred Weapon",
        HEROS_RELIC: "Hero's Relic",
        AGARTHAN: "Agarthan"
    }

    static weapons : Dictionary<WeaponDataType> = {
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
            weapon.icon = `${process.env.PUBLIC_URL}/images/icons/weapons/${weapon.category.toLowerCase()}-${weapon.type.toLowerCase().replaceAll(" ","").replaceAll("'","")}.png`
        
        // Effectiveness
        if (weapon.effective === undefined)
            weapon.effective = [Weapons.weakness[weapon.category]];
        else
            weapon.effective.unshift(Weapons.weakness[weapon.category]);
        
        return weapon;
    }

}