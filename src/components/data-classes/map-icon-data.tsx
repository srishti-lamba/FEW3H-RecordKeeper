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

// === Icons ===
interface IconType {
    svg: JSX.Element;
    g: JSX.Element;
}

export class MapIcons {

    public static createData() {

        async function createDataAsync() {
            var allegiance = ["blue", "green", "red", "yellow"];
            
            let strondholds : Dictionary<IconType> = {};
            let bases : Dictionary<IconType> = {};
            let unitDots : Dictionary<IconType> = {};

            allegiance.forEach( (colour) => {
                // -------------------
                // --- Strongholds ---
                // -------------------
                strondholds[colour] =
                { 
                    svg: (
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
                    ),
                    g: (
                        <>
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
                        </>
                    )
                }

                // -------------
                // --- Bases ---
                // -------------
                bases[colour] = {
                    svg: <svg
                            xmlns="http://www.w3.org/2000/svg" 
                            height="100%"
                            viewBox="0 0 18 32"
                            preserveAspectRatio="xMinYMin meet" 
                            className={`map-base-icon-${colour}`}
                        >
                            {/* Background */}
                            <path
                                fill={MapIcons.fills.stronghold[colour].icon.inner}
                                d=" M 4.5 3.5 c 0.5 -4.5 8.5 -4.5 9 0 q 0.5 -1.5 4.5 -1.5 l 0 11 q -1 3 -4 3 c 1 4 -2 4 -2.5 10.5 c 2.5 2.5 1.5 5.5 -2.5 5.5 s -5 -3 -2.5 -5.5 c -0.5 -6.5 -3.5 -6.5 -2.5 -10.5 q -3 0 -4 -3 l 0 -11 q 4 0 4.5 1.5 
                                    m 1.5 8 c 2 -1.5 4 -1.5 6 0 l 0 -4.5 q -3 2.5 -6 0 z"
                            />
                            {/* Foreground */}
                            <path
                                fill={MapIcons.fills.stronghold[colour].icon.outer}
                                d=" M 2 4 l 0 8 c 0 2 2 3 5 3 c -2 4 1 6 1 9 c 0 2 2 2 2 0 c 0 -3 3 -5 1 -9 c 3 0 5 -1 5 -3 l 0 -8 q -2 0 -2 1 l 0 7 c 0 1 -1 1 -4 1 c 0 -1 -2 -1 -2 0 c -3 0 -4 0 -4 -1 l 0 -7 q 0 -1 -2 -1 
                                    m 7 -2 c 1 0 2 1 2 2 c 0 1 -1 2 -2 2 c -1 0 -2 -1 -2 -2 c 0 -1 1 -2 2 -2 
                                    m 0 26 c 3 0 3 2 0 2 c -3 0 -3 -2 0 -2"
                            />
                    </svg>,
                    g: 
                        <>
                            {/* Background */}
                            <path
                                fill={MapIcons.fills.stronghold[colour].icon.inner}
                                d=" M 4.5 3.5 c 0.5 -4.5 8.5 -4.5 9 0 q 0.5 -1.5 4.5 -1.5 l 0 11 q -1 3 -4 3 c 1 4 -2 4 -2.5 10.5 c 2.5 2.5 1.5 5.5 -2.5 5.5 s -5 -3 -2.5 -5.5 c -0.5 -6.5 -3.5 -6.5 -2.5 -10.5 q -3 0 -4 -3 l 0 -11 q 4 0 4.5 1.5 
                                    m 1.5 8 c 2 -1.5 4 -1.5 6 0 l 0 -4.5 q -3 2.5 -6 0 z"
                            />
                            {/* Foreground */}
                            <path
                                fill={MapIcons.fills.stronghold[colour].icon.outer}
                                d=" M 2 4 l 0 8 c 0 2 2 3 5 3 c -2 4 1 6 1 9 c 0 2 2 2 2 0 c 0 -3 3 -5 1 -9 c 3 0 5 -1 5 -3 l 0 -8 q -2 0 -2 1 l 0 7 c 0 1 -1 1 -4 1 c 0 -1 -2 -1 -2 0 c -3 0 -4 0 -4 -1 l 0 -7 q 0 -1 -2 -1 
                                    m 7 -2 c 1 0 2 1 2 2 c 0 1 -1 2 -2 2 c -1 0 -2 -1 -2 -2 c 0 -1 1 -2 2 -2 
                                    m 0 26 c 3 0 3 2 0 2 c -3 0 -3 -2 0 -2"
                            />
                        </>
                }

                // ----------------
                // --- Unit Dot ---
                // ----------------
                unitDots[colour] = {
                    svg: <svg
                            xmlns="http://www.w3.org/2000/svg" 
                            height="100%"
                            viewBox="0 0 10 10"
                            preserveAspectRatio="xMinYMin meet" 
                        >
                            {/* Background */}
                            <circle
                                fill={MapIcons.fills.stronghold[colour].icon.outer}
                                cx="5" cy="5"
                                r="10"
                            />
                            {/* Foreground */}
                            <circle
                                fill="black"
                                cx="5" cy="5"
                                r="8"
                            />
                    </svg>,
                    g: 
                        <>
                            {/* Background */}
                            <circle
                                fill={MapIcons.fills.stronghold[colour].icon.outer}
                                cx="5" cy="5"
                                r="10"
                            />
                            {/* Foreground */}
                            <circle
                                fill="black"
                                cx="5" cy="5"
                                r="6"
                            />
                        </>
                }
            })
            MapIcons.stronghold = strondholds;
            MapIcons.base = bases;
            MapIcons.unitDot = unitDots;
        }
        
        createDataAsync();
    }

    // -------------
    // --- Fills ---
    // -------------
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

    public static stronghold : Dictionary<IconType> = {};

    public static base : Dictionary<IconType> = {};

    public static unitDot : Dictionary<IconType> = {}

}
