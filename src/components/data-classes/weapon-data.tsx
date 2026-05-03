import { Dictionary } from "../../context";
import { Classes } from "./class-data";

// Weapon Names:        https://hopes.fedatamine.com/en-us/debug/strings/62/
// Weapon Descriptions: https://hopes.fedatamine.com/en-us/debug/strings/61/

export interface WeaponDataType {
    nameLower ?: string;
    icon ?: string;
    category : CategoryType;
    make ?: string;
    description ?: string;
    advantage ?: Set<CategoryType>;
    disadvantage ?: Set<CategoryType>;
    might ?: number;
    durability ?: number;
    attributes ?: AttributeType[];
}

interface WeaponListType {
    SWORD : CategoryType;
    LANCE : CategoryType;
    AXE : CategoryType;
    BOW : CategoryType;
    TOME : CategoryType;
    GAUNTLETS : CategoryType;
    STONE: CategoryType;
}

interface WeaponType {
    REGULAR : string;
    SACRED_WEAPON : string;
    HEROS_RELIC : string;
    AGARTHAN : string;
}

export interface CategoryType {
    name : string;
    nameLower ?: string;
    icon ?: string;
}

interface AttributeType {
    name: string;
    description: string;
}

export class Weapons {

    public static createData() {

        async function createDataAsync() {
            // -----------------
            // --- Attributes ---
            // ------------------
            let attributes : Dictionary<AttributeType[]> = {};

            (([
                ["Boost Critical", "increases critical hit rate."]
            ]) as [string, string][]).forEach(
                ([name, description] : [string,string]) => {
                    attributes[name] = 
                    [
                        { name : name + " Lv 1",
                          description: "Slightly " + description },
                        { name : name + " Lv 2",
                          description: "Moderately " + description },
                        { name : name + " Lv 3",
                          description: "Greatly " + description }
                    ]
                }
            )
            Weapons.attributes = attributes;

            let weapons : Dictionary<WeaponDataType> = {
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
                "Athame" : {
                    category : Weapons.categories.SWORD,
                    make: Weapons.make.AGARTHAN,
                    description : "Crafted with archaic methods, this sword is Kronya's weapon of choice.",
                    might : 20,
                    durability : 180,
                    attributes: [attributes["Boost Critical"][1]]
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
                "Crescent Sickle" : {
                    category : Weapons.categories.LANCE,
                    description : "A sickle of impossible resilience, this weapon was crafted using forgotten knowledge.",
                    might : 50,
                    durability: 120,
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
                "Training Tome" : {category : Weapons.categories.TOME},

                // Crest Stone
                "Cracked Crest Stone" : {
                    category : Weapons.categories.STONE,
                    description : "A Crest Stone bearing a cracked surface that makes its Crest indiscernible.",
                    might: 20,
                    durability: 100,
                },
            }
            Weapons.weapons = weapons;
        }

        createDataAsync();
    }

    public static make : WeaponType = {
        REGULAR: "Regular",
        SACRED_WEAPON: "Sacred Weapon",
        HEROS_RELIC: "Hero's Relic",
        AGARTHAN: "Agarthan"
    }

    public static categories : WeaponListType = {
        SWORD : Weapons.getCategoryType("Sword"),
        LANCE : Weapons.getCategoryType("Lance"),
        AXE : Weapons.getCategoryType("Axe"),
        BOW : Weapons.getCategoryType("Bow"),
        TOME : Weapons.getCategoryType("Tome"),
        GAUNTLETS : Weapons.getCategoryType("Gauntlets"),
        STONE : Weapons.getCategoryType("Stone"),
    }

    static categoriesDict : Dictionary<CategoryType> = {
        sword: Weapons.categories.SWORD,
        lance: Weapons.categories.LANCE,
        axe: Weapons.categories.AXE,
        bow: Weapons.categories.BOW,
        tome: Weapons.categories.TOME,
        brawl: Weapons.categories.BOW
    }

    static advantage : Dictionary<CategoryType> = {
        sword: Weapons.categories.AXE,
        lance: Weapons.categories.SWORD,
        axe: Weapons.categories.LANCE,
        bow: Weapons.categories.GAUNTLETS,
        tome: Weapons.categories.BOW,
        brawl: Weapons.categories.TOME
    }

    static disadvantage : Dictionary<CategoryType> = {
        sword: Weapons.categories.LANCE,
        lance: Weapons.categories.AXE,
        axe: Weapons.categories.SWORD,
        bow: Weapons.categories.TOME,
        tome: Weapons.categories.GAUNTLETS,
        brawl: Weapons.categories.BOW
    }

    static attributes : Dictionary<AttributeType[]> = {}

    static weapons : Dictionary<WeaponDataType> = {};

    

    public static getData(weaponName : string) : WeaponDataType|undefined {
        let weapon : WeaponDataType|undefined = Weapons.weapons[weaponName];

        if (weapon === undefined)
            return undefined;

        // NameLower
        if (weapon.nameLower === undefined)
            weapon.nameLower = weaponName.toLowerCase().replaceAll(" ","").replaceAll("'","")

        // Make
        if (weapon.make === undefined)
            weapon.make = Weapons.make.REGULAR;

        // Icon
        if (weapon.icon === undefined)
            weapon.icon = Weapons.getIcon(weapon.category.nameLower as string, weapon.make);
        
        // Description
        if (weapon.description !== undefined) {}
        else if (weaponName.startsWith("Iron "))
            weapon.description = `A standard ${weapon.category.nameLower} made of iron—simple but effective.`
        else if (weaponName.startsWith("Steel "))
            weapon.description = `A weighty steel ${weapon.category.nameLower} that deals significant blows.`
        else if (weaponName.startsWith("Silver "))
            weapon.description = `A ${weapon.category.nameLower} crafted from shining silver.`
        else if (weaponName.startsWith("Brave "))
            weapon.description = `A light but sturdy ${weapon.category.nameLower} that emboldens its wielder.`
        else if (weaponName.startsWith("Killer "))
            weapon.description = `This keenly honed ${weapon.category.nameLower} is exceedingly lethal.`
        else if (weaponName.startsWith("Training "))
            weapon.description = `This simple ${weapon.category.nameLower} is perfect for training purposes.`;
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
        if (Weapons.advantage[weapon.category.nameLower as string] === undefined)
            weapon.advantage = new Set();
        else {
            let newAdvantage = new Set([Weapons.advantage[weapon.category.nameLower as string]]);
            if (weapon.category === Weapons.categories.BOW) // Advantage : Bow
                newAdvantage.add(Classes.types.FLYING)
            if (weapon.advantage === undefined)
                weapon.advantage = newAdvantage;
            else
                weapon.advantage = newAdvantage.union(weapon.advantage);
        }

        // Disadvantage
        if (Weapons.disadvantage[weapon.category.nameLower as string] === undefined)
            weapon.disadvantage = new Set();
        else {
            let newDisadvantage = new Set([Weapons.disadvantage[weapon.category.nameLower as string]]);
            if (weapon.disadvantage === undefined)
                weapon.disadvantage = newDisadvantage;
            else
                weapon.disadvantage = newDisadvantage.union(weapon.disadvantage);
        }

        // Might and Durability
        if (weapon.might !== undefined && weapon.durability !== undefined) {}
        else if (weaponName.startsWith("Iron ")) {
            weapon.might = 20;
            weapon.durability = 50;
        }
        else if (weaponName.startsWith("Steel ")) {
            weapon.might = 40;
            weapon.durability = 70;
        }
        else {
            weapon.might = 20;
            weapon.durability = 50;
        }

        return weapon;
    }

    public static getIcon(category : string, make : string) {
        return `${process.env.PUBLIC_URL}/images/icons/weapons/${category}-${make.toLowerCase().replaceAll(" ","").replaceAll("'","")}.png`
    }

    private static getCategoryType(name : string) : CategoryType {
        let nameLower = name.toLowerCase();
        let icon = Weapons.getIcon(nameLower, Weapons.make.REGULAR)
        return {
            name : name,
            nameLower : nameLower,
            icon : icon
        }
    }

}