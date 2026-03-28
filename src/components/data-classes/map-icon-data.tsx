import { JSX } from "react";
import { Dictionary } from "../../context";

// === Fills ===

export interface FillsType {
    base : string;
    stronghold : Dictionary<fill_StrongholdType>;
    gate : string;
    pot : Dictionary<string>;
}

interface fill_StrongholdType {
    ground : string;
    icon : {
        outer : string;
        inner: string;
    }
}

export class MapIcons {

    public static fills : FillsType = {
        base: "#928A7D",
        stronghold: {
            blue: {
                ground: "rgb(120, 120, 165)",
                icon: {
                    outer: "#2E71E6",
                    inner: "#CDD5F4"
                }
            },
            green: {
                ground: "rgb(120, 165, 120)",
                icon: {
                    outer: "#5FBF4C",
                    inner: "#D3E8D0"
                }
            },
            red: {
                ground: "#AE7A6C",
                icon: {
                    outer: "#E63E2D",
                    inner: "#F4CECD"
                }
            },
            yellow: {
                ground: "rgb(180, 155, 100)",
                icon: {
                    outer: "#E6A82E",
                    inner: "#F6E1CD"
                }
            }
        },
        gate: "#d146d1",
        pot: {
            blue: "#0580f4",
            green: "#3FAF00",
            purple: "#BD3AD3",
            red: "#E04834",
            yellow: "#CDBA08",
            label: "#d0cb7b"
        }
    };

    private static allegiance = ["blue", "green", "red", "yellow"];

    public static stronghold : Dictionary<JSX.Element> = MapIcons.getStrongholds();

    private static getStrongholds() {
        let result : Dictionary<JSX.Element> = {}
        MapIcons.allegiance.forEach( (colour) => {
            result[colour] = 
            (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="100%"
                    viewBox="0 0 28 28" 
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Background */}
                    <rect
                        width="28" height="28" 
                        x="0" y="0" rx="2.5" ry="2.5" 
                        fill={MapIcons.fills.stronghold[colour].icon.outer}
                    />
                    {/* Castle */}
                    <path
                        fill={MapIcons.fills.stronghold[colour].icon.inner}
                        d=" M 3 3 v 17 l 5 5 h 12 l 5 -5 v -17 h -6 v 5.5 h -2 v -5.5 h -6 v 5.5 h -2 v -5.5 z 
                            m 14 14 v 5 h -6 v -5 l 3 -3 z"
                    />
                </svg>
            )
        })
        return result;
    }

}
