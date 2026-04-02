import { Dictionary } from "../../context";

export interface ItemType {
    name ?: string;
    nameLower ?: string;
    icon ?: string;
    rarity : number;
    description : string;
}

export class Items {

    public static createData() {

        async function createDataAsync() {
            let items : Dictionary<ItemType> = {}

            // Stat Boosters
            items["Seraph Robe"]         = {rarity: 5, description: "Permanently increases max HP by 1000."};
            items["Energy Drop"]         = {rarity: 5, description: "Permanently increases strength by 5."};
            items["Spirit Dust"]         = {rarity: 5, description: "Permanently increases magic by 5."};
            items["Secret Book"]         = {rarity: 5, description: "Permanently increases dexterity by 5."};
            items["Speedwing"]           = {rarity: 5, description: "Permanently increases speed by 5."};
            items["Goddess Icon"]        = {rarity: 5, description: "Permanently increases luck by 5."};
            items["Giant Shell"]         = {rarity: 5, description: "Permanently increases defence by 5."};
            items["Talisman"]            = {rarity: 5, description: "Permanently increases resistance by 5."};
            items["Black Pearl"]         = {rarity: 5, description: "Permanently increases charm by 5."};
            items["Rocky Burdock"]       = {rarity: 4, description: "A stiff medicinal root that is quite difficult to eat. Permanently increases strength by 2."};
            items["Premium Magic Herbs"] = {rarity: 4, description: "A collection of especially pure magical herbs. Permanently increases magic by 2."};
            items["Ailell Pomegranate"]  = {rarity: 4, description: "A pomegranate that flourishes in harsh conditions. Permanently increases dexterity by 2."};
            items["Speed Carrot"]        = {rarity: 4, description: "For a carrot, it grants surprisingly fast feet. Permanently increases speed by 2."};
            items["Miracle Bean"]        = {rarity: 4, description: "A delicious bean from a plant that appeared overnight. Permanently increases luck by 2."};
            items["Ambrosia"]            = {rarity: 4, description: "A medicinal herb that can be used as a body salve. Permanently increases defense by 2."};
            items["White Verona"]        = {rarity: 4, description: "A rare variety of verona. Permanently increases resistance by 2."};
            items["Golden Apple"]        = {rarity: 4, description: "An apple said to be blessed by the goddess. Permanently increases charm by 2."};
            items["Fruit of Life"]       = {rarity: 4, description: "A curious fruit said to extend one's lifespan. Permanently increases HP by 200."};
        
            // Minerals
            items["Smithing Stone"]   = {rarity: 1, description: "A basic ore used to forge or repair weapons."};
            items["Black-Sand Steel"] = {rarity: 2, description: "A metal smelted through a unique process."};
            items["Wootz Steel"]      = {rarity: 4, description: "A metal that is both light and durable."};
            items["Arcane Crystal"]   = {rarity: 3, description: "A crystal that glows with magical light."};
            items["Mythril"]          = {rarity: 5, description: "A metal blessed with holy might."};
            items["Umbral Steel"]     = {rarity: 5, description: "A metal steeped in the power of darkness."};
            items["Agarthium"]        = {rarity: 4, description: "A metal refined using archaic methods."};
            items["Venomstone"]       = {rarity: 1, description: "A highly toxic ore that should be handled with great care."};

            // Produce
            items["Airmid Goby"]         = {rarity: 1, description: "A small fish found throughout the waters ofFódlan. These fish can be eaten but aren't particularly tasty..."};
            items["Caledonian Crayfish"] = {rarity: 1, description: "A hard-shelled edible crayfish that hides beneath pebbles in rapid water."};
            items["White Trout"]         = {rarity: 2, description: "A stark white fish that gleams in sunlight."};
            items["Teutates Loach"]      = {rarity: 2, description: "A stately bearded fish from Lake Teutates."};
            items["Airmid Pike"]         = {rarity: 3, description: "This fish is commonly found in the Airmid River."};
            items["Caledonian Gar"]      = {rarity: 3, description: "This fish has very hard scales, signifying its origins on the Caledonian Plateau."};
            items["Albinean Herring"]    = {rarity: 2, description: "An intense swimmer who migrates over vast distances near the coast of Albinea."};
            items["Tomato"]              = {rarity: 2, description: "A rare vegetable from Dagda that requires delicate conditions to thrive."};
            items["Noa Fruit"]           = {rarity: 2, description: "A fruit named after Saint Noa. It takes a skilled hand to extract the pulp."};
            items["Peach Currant"]       = {rarity: 2, description: "Sweet peach currants."};
            items["Verona"]              = {rarity: 3, description: "Blessed by the goddess herself, this vegetable is as tasty as it is beautiful."};
            items["Albinean Berries"]    = {rarity: 3, description: "Simple Albinean berries that are tart with a hint of sweetness."};
            items["Onion"]               = {rarity: 2, description: "A Fódlan onion—a staple in many dishes."};
            items["Carrot"]              = {rarity: 2, description: "A simple carrot grown in Fódlan that adds texture to any recipe."};
            items["Turnip"]              = {rarity: 2, description: "A Fódlan turnip. Tasty and earthy."};
            items["Chickpeas"]           = {rarity: 2, description: "Chickpeas harvested throughout Fódlan."};
            items["Cabbage"]             = {rarity: 2, description: "Cabbage of Fódlan that is enjoyed in a number of dishes."};
            items["Poultry"]             = {rarity: 2, description: "Meat from birds hunted in the hills."};
            items["Wild Game"]           = {rarity: 2, description: "Meat from beasts hunted in the hills."};

            // Misc
            items["Intermediate Seal"]   = {rarity: 3, description: "Allows unit to take the certification exam for an intermediate class."};
            items["Advanced Seal"]       = {rarity: 4, description: "Allows unit to take the certification exam for an advanced class."};
            items["Master Seal"]         = {rarity: 5, description: "Allows unit to take the certification exam for a master class."};
            items["Merc Whistle"]        = {rarity: 5, description: "A whistle used to notify fellow mercenaries of one's position. Can also be given as a good luck charm."};
            items["Vanguard Whistle"]    = {rarity: 5, description: "A whistle that signals your army to advance. Can be used to instantly capture unclaimed regions."};
            items["Bullion"]             = {rarity: 3, description: "A gold bullion that sells for a high price at shops."};
            items["Large Bullion"]       = {rarity: 4, description: "A gold bullion that sells for a very high price at shops."};
            items["Extra Large Bullion"] = {rarity: 5, description: "A gold bullion that sells for an extremely high price at shops."};

            Items.items = items;
        }

        createDataAsync();
    }

    public static getItem(name:string) {

    }

    static items : Dictionary<ItemType> = {}
}