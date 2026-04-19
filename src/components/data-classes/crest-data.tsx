import { Dictionary } from "../../context";

interface CrestListType {
    major : CrestDataType;
    minor : CrestDataType;
}

interface CrestDataType {
    name : string;
    description : string;
    effect : string[];
    icon : string;
}

// Names:        https://hopes.fedatamine.com/en-us/debug/strings/75/
// Descriptions: https://hopes.fedatamine.com/en-us/debug/strings/74/
// Effects:      https://hopes.fedatamine.com/en-us/debug/strings/73/

export class Crests {

    public static createData() {

        async function createDataAsync() {
            let crests : Dictionary<CrestListType> = {};

            (([
                // ["Crest Name", [minorStart, step], 
                //     "Description", 
                //     "Effect (Major) (*** -> slight/greatly)" 
                // ]
                ["Aubin",  [10,5], 
                    "A Crest long lost to history.", 
                    "% chance to land a critical hit with strong attacks." 
                ],
                ["Lamine", [10,5], 
                    "A Major Crest inherited from Lamine of the Ten Elites.",
                    "% chance that weapon durability will not decrease when using recovery magic."
                ],
                ["Macuil", [20,5], 
                    "They say Saint Macuil bore this Major Crest. A symbol of magic and mastery of the wind.",
                    "% chance to ***increase the damage dealt by offensive magic."
                ]
            ]) as [string, [number,number], string, string][]).forEach(
                ([text, [minorStart, step], description, effect]) => {
                    let textLower = text.toLowerCase();
                    let name = "Crest of " + text;
                    crests[textLower] = {
                        major: {
                            name: name,
                            description: description,
                            effect : [
                                ((minorStart*2) + (0*step)) + effect.replace("***","slightly "),
                                ((minorStart*2) + (1*step)) + effect.replace("***",""),
                                ((minorStart*2) + (2*step)) + effect.replace("***","greatly ")
                            ],
                            icon: `${process.env.PUBLIC_URL}/images/icons/crests/${textLower}-major.png`
                        },
                        minor : {
                            name: "Minor " + name,
                            description: description.replace("Major","Minor"),
                            effect: [
                                ((minorStart) + (0*step)) + effect.replace("***","slightly "),
                                ((minorStart) + (1*step)) + effect.replace("***",""),
                                ((minorStart) + (2*step)) + effect.replace("***","greatly ")
                            ],
                            icon: `${process.env.PUBLIC_URL}/images/icons/crests/${textLower}-minor.png`
                        }
                    }
                }
            );
            Crests.crest = crests;
        }

        createDataAsync();
    }

    public static crest : Dictionary<CrestListType> = {}
}