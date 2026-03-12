import { Classes } from "./class-data";

interface Dictionary<T> {
    [key: string]: T;
}

export interface WeaponDataType {
    icon ?: string;
    category : string;
    type ?: string;
    description ?: string;
    advantage ?: Set<string>;
    disadvantage ?: Set<string>;
}

interface WeaponListType {
    SWORD : string;
    LANCE : string;
    AXE : string;
    BOW : string;
    TOME : string;
    GAUNTLETS : string;
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
        TOME : "tome",
        GAUNTLETS : "gauntlets"
    }

    static advantage : Dictionary<string> = {
        sword: Weapons.categories.AXE,
        lance: Weapons.categories.SWORD,
        axe: Weapons.categories.LANCE,
        bow: Weapons.categories.GAUNTLETS,
        reason: Weapons.categories.BOW,
        brawl: Weapons.categories.TOME
    }

    static disadvantage : Dictionary<string> = {
        sword: Weapons.categories.LANCE,
        lance: Weapons.categories.AXE,
        axe: Weapons.categories.SWORD,
        bow: Weapons.categories.TOME,
        reason: Weapons.categories.GAUNTLETS,
        brawl: Weapons.categories.BOW
    }

    public static type : WeaponType = {
        REGULAR: "Regular",
        SACRED_WEAPON: "Sacred Weapon",
        HEROS_RELIC: "Hero's Relic",
        AGARTHAN: "Agarthan"
    }

    static weapons : Dictionary<WeaponDataType> = {
        // === Swords ===
        "Iron Sword" : {category : Weapons.categories.SWORD},
        "Steel Sword" : {category : Weapons.categories.SWORD},
        "Silver Sword" : {category : Weapons.categories.SWORD},
        "Brave Sword" : {category : Weapons.categories.SWORD},
        "Killing Edge" : {
            category : Weapons.categories.SWORD,
            description : "This keenly honed blade is exceedingly lethal."
        },
        "Training Sword" : {category : Weapons.categories.SWORD},
        "Levin Sword" : {
            category : Weapons.categories.SWORD,
            description : "Coursing with electric energy, this magical sword has been struck by lightning."
        },
        "Armorslayer" : {
            category : Weapons.categories.SWORD,
            description : "Sharp enough to pierce even the thickest plate, this sword is effective against armored units.",
            advantage : new Set([Classes.types.ARMOURED])
        },
        "Rapier" : {
            category : Weapons.categories.SWORD,
            description : "A sword designed to exploit the weaknesses of armored and cavalry units.",
            advantage : new Set([Classes.types.ARMOURED,Classes.types.CALVARY])
        },

        // === Lances ===
        "Iron Lance" : {category : Weapons.categories.LANCE},
        "Steel Lance" : {category : Weapons.categories.LANCE},
        "Silver Lance" : {category : Weapons.categories.LANCE},
        "Brave Lance" : {category : Weapons.categories.LANCE},
        "Killer Lance" : {category : Weapons.categories.LANCE},
        "Training Lance" : {category : Weapons.categories.LANCE},
        "Javelin" : {
            category : Weapons.categories.LANCE,
            description : "A basic ranged lance that has been balanced for throwing at distant enemies."
        },
        "Spear" : {
            category : Weapons.categories.LANCE,
            description : "The wielder of this powerful reinforced lance can hurl it at enemies for deep impact."
        },
        "Horseslayer" : {
            category : Weapons.categories.LANCE,
            description : "A lance forged specifically for combat against mounted foes.",
            advantage : new Set([Classes.types.CALVARY])
        },

        // === Axes ===
        "Iron Axe" : {category : Weapons.categories.AXE},
        "Steel Axe" : {category : Weapons.categories.AXE},
        "Silver Axe" : {category : Weapons.categories.AXE},
        "Brave Axe" : {category : Weapons.categories.AXE},
        "Killer Axe" : {category : Weapons.categories.AXE},
        "Training Axe" : {category : Weapons.categories.AXE},
        "Bolt Axe" : {
            category : Weapons.categories.AXE,
            description : "Coursing with electric energy, this magical axe has been struck by lightning."
        },
        "Short Axe" : {
            category : Weapons.categories.AXE,
            description : "This axe has been reinforced, making it easy to throw at foes from afar."
        },
        "Tomahawk" : {
            category : Weapons.categories.AXE,
            description : "The wielder of this brutal reinforced axe can hurl it at enemies for deep impact."
        },
        "Hammer" : {
            category : Weapons.categories.AXE,
            description : "This hammer can pummel metal with astonishing force, making it effective against armored units.",
            advantage : new Set([Classes.types.ARMOURED])
        },

        // === Bows ===
        "Iron Bow" : {category : Weapons.categories.BOW},
        "Steel Bow" : {category : Weapons.categories.BOW},
        "Silver Bow" : {category : Weapons.categories.BOW},
        "Brave Bow" : {category : Weapons.categories.BOW},
        "Killer Bow" : {
            category : Weapons.categories.BOW,
            description : "This keenly balanced bow is exceedingly lethal."
        },
        "Training Bow" : {category : Weapons.categories.BOW},
        "Magic Bow" : {
            category : Weapons.categories.BOW,
            description : "A mystical bow that deals magic damage."
        },
        "Longbow" : {
            category : Weapons.categories.BOW,
            description : "A bow with increased range."
        },

        // === Gauntlets ===
        "Iron Gauntlets" : {
            category : Weapons.categories.GAUNTLETS,
            description : "Standard iron gauntlets—simple but effective."
        },
        "Steel Gauntlets " : {
            category : Weapons.categories.GAUNTLETS,
            description : "Weighty steel gauntlets that deal heavy blows."
        },
        "Silver Gauntlets " : {
            category : Weapons.categories.GAUNTLETS,
            description : "Gauntlets crafted from shining silver."
        },
        "Killer Gauntlets" : {
            category : Weapons.categories.GAUNTLETS,
            description : "These keenly wrought gauntlets are exceedingly lethal."
        },
        "Training Gauntlets" : {
            category : Weapons.categories.GAUNTLETS,
            description : "Simple gauntlets perfect for training purposes."
        },

        // === Tomes ===
        "Iron Tome" : {
            category : Weapons.categories.TOME,
            description : "A standard iron-hued tome—simple but effective."
        },
        "Steel Tome" : {
            category : Weapons.categories.TOME,
            description : "A weighty steel-hued tome that deals significant blows."
        },
        "Silver Tome" : {
            category : Weapons.categories.TOME,
            description : "A tome the color of shining silver."
        },
        "Brave Tome" : {
            category : Weapons.categories.TOME,
            description : "A tome imbued with tremendous magical power that emboldens its wielder."
        },
        "Killer Tome" : {
            category : Weapons.categories.TOME,
            description : "The finely honed magics within this tome are exceedingly lethal."
        },
        "Training Tome" : {category : Weapons.categories.TOME}
    }

    public static getData(weaponName : string) : WeaponDataType|null {
        let weapon : WeaponDataType|undefined = Weapons.weapons[weaponName];

        if (weapon === undefined)
            return null;

        // Type
        if (weapon.type === undefined)
            weapon.type = Weapons.type.REGULAR;

        // Icon
        if (weapon.icon === undefined)
            weapon.icon = Weapons.getIcon(weapon.category, weapon.type);
        
        // Description
        if (weapon.description !== undefined) {}
        else if (weaponName.startsWith("Iron "))
            weapon.description = `A standard ${weapon.category} made of iron—simple but effective.`
        else if (weaponName.startsWith("Steel "))
            weapon.description = `A weighty steel ${weapon.category} that deals significant blows.`
        else if (weaponName.startsWith("Silver "))
            weapon.description = `A ${weapon.category} crafted from shining silver.`
        else if (weaponName.startsWith("Brave "))
            weapon.description = `A light but sturdy ${weapon.category} that emboldens its wielder.`
        else if (weaponName.startsWith("Killer "))
            weapon.description = `This keenly honed ${weapon.category} is exceedingly lethal.`
        else if (weaponName.startsWith("Training "))
            weapon.description = `This simple ${weapon.category} is perfect for training purposes.`;
        // else if (weaponName.startsWith(" "))
        //     weapon.description = ``
        // else if (weaponName.startsWith(" "))
        //     weapon.description = ``
        // else if (weaponName.startsWith(" "))
        //     weapon.description = ``
        // else if (weaponName.startsWith(" "))
        //     weapon.description = ``
        // else if (weaponName.startsWith(" "))
        //     weapon.description = ``

        // Advantage
        let newAdvantage = new Set([Weapons.advantage[weapon.category]]);
        if (weapon.category === Weapons.categories.BOW) // Advantage : Bow
            newAdvantage.add(Classes.types.FLYING)
        if (weapon.advantage === undefined)
            weapon.advantage = newAdvantage;
        else
            weapon.advantage = newAdvantage.union(weapon.advantage);

        // Disadvantage
        let newDisadvantage = new Set([Weapons.disadvantage[weapon.category]]);
        if (weapon.disadvantage === undefined)
            weapon.disadvantage = newDisadvantage;
        else
            weapon.disadvantage = newDisadvantage.union(weapon.disadvantage);
        
        return weapon;
    }

    public static getIcon(category : string, type : string) {
        return `${process.env.PUBLIC_URL}/images/icons/weapons/${category.toLowerCase()}-${type.toLowerCase().replaceAll(" ","").replaceAll("'","")}.png`
    }

}