import { createContext } from 'react';
import { MRT_RowSelectionState, MRT_TableInstance } from 'material-react-table';
import { RouteChapters } from '../components/settings/settings-chapters';
import { TooltipRefProps } from 'react-tooltip';
import { Battle, BattleRow, GridCellDataType, MissionRow, SvgPropsType, TextRefType } from './interface';

export interface Dictionary<T> {
    [key: string]: T;
}

interface DatabaseType {
    chapters ?: RouteChapters[];
    battles ?: Battle[];
};

interface BattlesTableType {
    battle ?: React.RefObject<Battle|undefined>;
    table ?: React.RefObject<MRT_TableInstance<BattleRow> | undefined>;
    selectedRow ?: 
    [   MRT_RowSelectionState,
        React.Dispatch<React.SetStateAction<MRT_RowSelectionState>>  ]
}

interface MissionsTableType {
    table ?: React.RefObject<MRT_TableInstance<MissionRow> | undefined>;
    selectedRow ?: 
    [   MRT_RowSelectionState,
        React.Dispatch<React.SetStateAction<MRT_RowSelectionState>>  ];
    text ?: React.RefObject<Dictionary<TextRefType>>;
    size ?: React.RefObject<ResizeObserverEntry|undefined>;
}

interface MapType {
    scrollElement ?: React.RefObject<HTMLDivElement|null>;
    size ?: React.RefObject<ResizeObserverEntry|undefined>;
    svg ?: [SvgPropsType | null | undefined, React.Dispatch<React.SetStateAction<SvgPropsType | null | undefined>>];
    tileData ?: [GridCellDataType[][], React.Dispatch<React.SetStateAction<GridCellDataType[][]>>];
    selectedWeapon ?: [string, React.Dispatch<React.SetStateAction<string>>];
    tooltip ?: React.RefObject<TooltipRefProps | null>;
    tileID ?: [string|null, React.Dispatch<React.SetStateAction<string|null>>];
}

export const DatabaseContext = createContext<DatabaseType>({});

export const BattlesTableContext = createContext<BattlesTableType>({});

export const MapContext = createContext<MapType>({})

export const MissionsTableContext = createContext<MissionsTableType>({});

export const DifficultyContext = createContext<[number, React.Dispatch<React.SetStateAction<number>>|null]>([0, null]);

export const AppRefreshContext = createContext<[Date|undefined, React.Dispatch<React.SetStateAction<Date|undefined>>|undefined]>([undefined, undefined])

