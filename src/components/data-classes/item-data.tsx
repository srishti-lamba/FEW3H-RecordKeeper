import { Dictionary } from "../../context";

export interface ItemType {
    name ?: string;
    nameLower ?: string;
    icon ?: string;
    category : string;
    rarity : number;
    description : string;
}

export interface CategoryType {
    ORE : string;
    STAT_BOOSTER : string;
    FISH : string;
    PRODUCE : string;
    MEAT : string;
    SEAL : string;
    BULLION : string;
    WHISTLE : string;
    SHIELD : string;
}

export class Items {

    public static createData() {

        async function createDataAsync() {
            let items : Dictionary<ItemType> = {}

            // Stat Boosters
            items["Seraph Robe"]         = {rarity: 5, category: Items.category.STAT_BOOSTER, description: "Permanently increases max HP by 1000."};
            items["Energy Drop"]         = {rarity: 5, category: Items.category.STAT_BOOSTER,  description: "Permanently increases strength by 5."};
            items["Spirit Dust"]         = {rarity: 5, category: Items.category.STAT_BOOSTER,  description: "Permanently increases magic by 5."};
            items["Secret Book"]         = {rarity: 5, category: Items.category.STAT_BOOSTER,  description: "Permanently increases dexterity by 5."};
            items["Speedwing"]           = {rarity: 5, category: Items.category.STAT_BOOSTER,  description: "Permanently increases speed by 5."};
            items["Goddess Icon"]        = {rarity: 5, category: Items.category.STAT_BOOSTER,  description: "Permanently increases luck by 5."};
            items["Giant Shell"]         = {rarity: 5, category: Items.category.STAT_BOOSTER,  description: "Permanently increases defence by 5."};
            items["Talisman"]            = {rarity: 5, category: Items.category.STAT_BOOSTER,  description: "Permanently increases resistance by 5."};
            items["Black Pearl"]         = {rarity: 5, category: Items.category.STAT_BOOSTER,  description: "Permanently increases charm by 5."};
            items["Rocky Burdock"]       = {rarity: 4, category: Items.category.STAT_BOOSTER,  description: "A stiff medicinal root that is quite difficult to eat. Permanently increases strength by 2."};
            items["Premium Magic Herbs"] = {rarity: 4, category: Items.category.STAT_BOOSTER,  description: "A collection of especially pure magical herbs. Permanently increases magic by 2."};
            items["Ailell Pomegranate"]  = {rarity: 4, category: Items.category.STAT_BOOSTER,  description: "A pomegranate that flourishes in harsh conditions. Permanently increases dexterity by 2."};
            items["Speed Carrot"]        = {rarity: 4, category: Items.category.STAT_BOOSTER,  description: "For a carrot, it grants surprisingly fast feet. Permanently increases speed by 2."};
            items["Miracle Bean"]        = {rarity: 4, category: Items.category.STAT_BOOSTER,  description: "A delicious bean from a plant that appeared overnight. Permanently increases luck by 2."};
            items["Ambrosia"]            = {rarity: 4, category: Items.category.STAT_BOOSTER,  description: "A medicinal herb that can be used as a body salve. Permanently increases defense by 2."};
            items["White Verona"]        = {rarity: 4, category: Items.category.STAT_BOOSTER,  description: "A rare variety of verona. Permanently increases resistance by 2."};
            items["Golden Apple"]        = {rarity: 4, category: Items.category.STAT_BOOSTER,  description: "An apple said to be blessed by the goddess. Permanently increases charm by 2."};
            items["Fruit of Life"]       = {rarity: 4, category: Items.category.STAT_BOOSTER,  description: "A curious fruit said to extend one's lifespan. Permanently increases HP by 200."};
        
            // Minerals
            items["Smithing Stone"]   = {rarity: 1, category: Items.category.ORE, description: "A basic ore used to forge or repair weapons."};
            items["Black-Sand Steel"] = {rarity: 2, category: Items.category.ORE, description: "A metal smelted through a unique process."};
            items["Wootz Steel"]      = {rarity: 4, category: Items.category.ORE, description: "A metal that is both light and durable."};
            items["Arcane Crystal"]   = {rarity: 3, category: Items.category.ORE, description: "A crystal that glows with magical light."};
            items["Mythril"]          = {rarity: 5, category: Items.category.ORE, description: "A metal blessed with holy might."};
            items["Umbral Steel"]     = {rarity: 5, category: Items.category.ORE, description: "A metal steeped in the power of darkness."};
            items["Agarthium"]        = {rarity: 4, category: Items.category.ORE, description: "A metal refined using archaic methods."};
            items["Venomstone"]       = {rarity: 1, category: Items.category.ORE, description: "A highly toxic ore that should be handled with great care."};

            // Produce
            items["Airmid Goby"]         = {rarity: 1, category: Items.category.FISH, description: "A small fish found throughout the waters ofFódlan. These fish can be eaten but aren't particularly tasty..."};
            items["Caledonian Crayfish"] = {rarity: 1, category: Items.category.FISH, description: "A hard-shelled edible crayfish that hides beneath pebbles in rapid water."};
            items["White Trout"]         = {rarity: 2, category: Items.category.FISH, description: "A stark white fish that gleams in sunlight."};
            items["Teutates Loach"]      = {rarity: 2, category: Items.category.FISH, description: "A stately bearded fish from Lake Teutates."};
            items["Airmid Pike"]         = {rarity: 3, category: Items.category.FISH, description: "This fish is commonly found in the Airmid River."};
            items["Caledonian Gar"]      = {rarity: 3, category: Items.category.FISH, description: "This fish has very hard scales, signifying its origins on the Caledonian Plateau."};
            items["Albinean Herring"]    = {rarity: 2, category: Items.category.FISH, description: "An intense swimmer who migrates over vast distances near the coast of Albinea."};
            items["Tomato"]              = {rarity: 2, category: Items.category.PRODUCE, description: "A rare vegetable from Dagda that requires delicate conditions to thrive."};
            items["Noa Fruit"]           = {rarity: 2, category: Items.category.PRODUCE, description: "A fruit named after Saint Noa. It takes a skilled hand to extract the pulp."};
            items["Peach Currant"]       = {rarity: 2, category: Items.category.PRODUCE, description: "Sweet peach currants."};
            items["Verona"]              = {rarity: 3, category: Items.category.PRODUCE, description: "Blessed by the goddess herself, this vegetable is as tasty as it is beautiful."};
            items["Albinean Berries"]    = {rarity: 3, category: Items.category.PRODUCE, description: "Simple Albinean berries that are tart with a hint of sweetness."};
            items["Onion"]               = {rarity: 2, category: Items.category.PRODUCE, description: "A Fódlan onion—a staple in many dishes."};
            items["Carrot"]              = {rarity: 2, category: Items.category.PRODUCE, description: "A simple carrot grown in Fódlan that adds texture to any recipe."};
            items["Turnip"]              = {rarity: 2, category: Items.category.PRODUCE, description: "A Fódlan turnip. Tasty and earthy."};
            items["Chickpeas"]           = {rarity: 2, category: Items.category.PRODUCE, description: "Chickpeas harvested throughout Fódlan."};
            items["Cabbage"]             = {rarity: 2, category: Items.category.PRODUCE, description: "Cabbage of Fódlan that is enjoyed in a number of dishes."};
            items["Poultry"]             = {rarity: 2, category: Items.category.MEAT, description: "Meat from birds hunted in the hills."};
            items["Wild Game"]           = {rarity: 2, category: Items.category.MEAT, description: "Meat from beasts hunted in the hills."};

            // Misc
            items["Intermediate Seal"]   = {rarity: 3, category: Items.category.SEAL, description: "Allows unit to take the certification exam for an intermediate class."};
            items["Advanced Seal"]       = {rarity: 4, category: Items.category.SEAL, description: "Allows unit to take the certification exam for an advanced class."};
            items["Master Seal"]         = {rarity: 5, category: Items.category.SEAL, description: "Allows unit to take the certification exam for a master class."};
            items["Merc Whistle"]        = {rarity: 5, category: Items.category.WHISTLE, description: "A whistle used to notify fellow mercenaries of one's position. Can also be given as a good luck charm."};
            items["Vanguard Whistle"]    = {rarity: 5, category: Items.category.WHISTLE, description: "A whistle that signals your army to advance. Can be used to instantly capture unclaimed regions."};
            items["Bullion"]             = {rarity: 3, category: Items.category.BULLION, description: "A gold bullion that sells for a high price at shops."};
            items["Large Bullion"]       = {rarity: 4, category: Items.category.BULLION, description: "A gold bullion that sells for a very high price at shops."};
            items["Extra Large Bullion"] = {rarity: 5, category: Items.category.BULLION, description: "A gold bullion that sells for an extremely high price at shops."};

            // Accessories
            items["Leather Shield"]   = {rarity: 1, category: Items.category.SHIELD, description: "A shield made of leather. Simple but sturdy."};

            Items.items = items;
        }

        createDataAsync();
    }

    public static category : CategoryType = {
        ORE: "ore",
        STAT_BOOSTER: "stat-booster",
        FISH: "fish",
        PRODUCE: "produce",
        MEAT: "meat",
        SEAL: "seal",
        BULLION: "bullion",
        WHISTLE: "whistle",
        SHIELD: "shield"
    }

    public static getItem(name:string) {
        let data = Items.items[name]

        if (data === undefined)
            return undefined;

        data.name = name;
        data.nameLower = name.toLowerCase();
        data.icon = Items.getIcon(data.category, data.rarity)

        return data;
    }

    public static getIcon(category: string, rarity: number) {
        // Accessory
        if (
            category === Items.category.SHIELD
        )
            return `${process.env.PUBLIC_URL}/images/icons/items/${category}-${rarity}.png`
        else
            return `${process.env.PUBLIC_URL}/images/icons/items/${category}.png`
    }

    static items : Dictionary<ItemType> = {}
}