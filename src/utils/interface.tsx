import { JSX } from "react";
import { Dictionary } from "./context";
import { ClassType } from "../components/data-classes/class-data";
import { WeaponDataType } from "../components/data-classes/weapon-data";
import { ItemType } from "../components/data-classes/item-data";


// -------------------
// --- Battle Data ---
// -------------------

export interface BattleRow {
  id : number;
  route : string;
  chapter : string;
  level : number | undefined;
  mission : string;
  type: number;
}

export interface Battle {
  general : { 
    route : number;
    chapter : number;
    name : string;
    type : number;
    level : {
      easy: number,
      normal: number,
      hard: number,
      maddening?: number,
    };
    deploy: number,
    territory: string,
    description: string,
    victory: any[],
    defeat: any[],
    restriction: string,
    strategy: any[],
    missions: MissionRow[],
    notes: string
  };
  "s-rank" : {
    time : number,
    defeat : number,
    damage : number
  };
}

// --------------------
// --- Mission Data ---
// --------------------

export interface MissionRow {
    id?: string;
    type: string|null;
    text: string;
    prereq?: string;
    notes?: string;
    subRows?: MissionRow[];
}

export interface TextRefType {
    title ?: string;
    main ?: (string | JSX.Element)[];
    prereq ?: (string | JSX.Element)[];
    notes ?: (string | JSX.Element)[];
    mainPlain ?: string;
}

// -------------------
// --- Map Objects ---
// -------------------

export interface svg_PathType {
    full : svg_GroundType;
    strongholds : svg_StrongholdType[];
    bases : svg_BaseType[];
    gates : svg_GateType[];
    structures : svg_StructureType[];
    chests : svg_ChestType[];
    pots : svg_PotType[];
    markings : svg_MarkingsType[];
    player : svg_PlayerType[];
    units : Dictionary<UnitDataType>;
}

export interface svg_GroundType { // Base ground path
    transform : string;
    d : string;
}

export interface svg_StrongholdType {
    translate : CoordinateType;
    d : string;
    icon ?: {
        translate : CoordinateType;
        coords : CoordinateType;
    }
    data ?: StrongholdDataType | undefined;
    fill ?: string;
}

export interface svg_BaseType {
    icon : {
        translate : CoordinateType;
        coords : CoordinateType;
    };
    data : BaseDataType;
    fill ?: string;
}

export interface svg_GateType {
    transform ?: string;
    d ?: string;
    fill ?: string;
    appear ?: number[];
    disappear ?: number[];
}

export interface svg_StructureType {
    type : string;
    appearAndDisappear : [number[], boolean][];
    xOne ?: number;
    yOne ?: number;
    xTwo ?: number;
    yTwo ?: number;
}

export interface svg_ChestType {
    icon : {
        translate : CoordinateType;
        coords : CoordinateType;
    };
    item ?: string|ItemType;
}

export interface svg_PotType {
    colour : string;
    m : CoordinateType;
    coords : CoordinateType;
    fill ?: string;
}

export interface svg_MarkingsType {
    type : string;
    appearAndDisappear : [number[],boolean][];
    colour ?: string;
    x ?: number;
    y ?: number;
    width ?: number;
    height ?: number;

    xOne ?: number;
    yOne ?: number;
    xTwo ?: number;
    yTwo ?: number;
}

export interface svg_PlayerType {
    coords : CoordinateType,
    allegiance : string;
    "tile-type" : string;
    "fixed-unit" ?: UnitDataType[];
    note ?: string;
}

// ----------------
// --- Map Size ---
// ----------------

export interface SvgPropsType {
    size : size_CategoryType;
    paths : svg_PathType;
}

export interface CoordinateType {
    x : number;
    y : number;
}

export interface size_SpecificType {
    width: number;
    height: number;
}

export interface size_CategoryType {
    pixels : size_SpecificType;
    squares : size_SpecificType;
}

// ---------------------------
// --- Grid Cell Reference ---
// ---------------------------

export interface GridCellType {
    gridCell: Node | React.ReactNode | JSX.Element | null;
    data: GridCellDataType | null;
}

export interface GridCellDataType {
    playerTile ?: svg_PlayerType;
    stronghold ?: [number, StrongholdDataType];
    base ?: [number, BaseDataType];
    chest ?: svg_ChestType;
    pot ?: PotDataType;
    unit ?: Dictionary<UnitDataType>;
}

export interface PotDataType {
    icon: JSX.Element | undefined;
    title: string;
    description: string;
}

export interface StrongholdDataType {
    name: string;
    icon?: JSX.Element | undefined;
    appearAndDisappear ?: [number[],boolean][];
    captain: (string|UnitDataType)[];
    colour : [number[], string][];
}

export interface BaseDataType {
    icon : {
        transform : string;
        coords : CoordinateType;
    };
    appearAndDisappear ?: [number[],boolean][];
    colour : [number[], string][];
    captain: (string|UnitDataType)[];
    fill ?: string;
}

export interface UnitDataType {
    name : string;
    gender ?: string;
    named ?: {
        timeskip ?: string;
    };
    monster ?: {
        sprite : string;
        hpGauges : number;
        barriers : [string, string, string, string];
    };
    crest ?: {name: string, type: string, level: number}[];
    class : ClassType;
    weapon : {
        name : string;
        data ?: WeaponDataType;
    };
    allegiance : string;
    faction ?: string;
    appearAndDisappear : [number[],boolean][];
    coords : [ number[], CoordinateType][];
    stats ?: {
        hp : number|number[],
        move ?: number,
        str : number|number[],
        mag : number|number[],
        dex : number|number[],
        spd : number|number[],
        lck : number|number[],
        def : number|number[],
        res : number|number[],
        cha : number|number[]
    }
    notes ?: string;
}

// --------------------
// --- Mission Data ---
// --------------------
export interface MissionDataType {
    strongholds : {appear: boolean, allegiance: string}[];
    bases : {appear: boolean, allegiance: string}[];
    gates : {appear: boolean}[];
    structures : {appear: boolean}[];
    markings : {appear: boolean}[];
    units : Dictionary<{show : boolean, coords : CoordinateType}>;
}