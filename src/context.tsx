import { createContext } from 'react';
import { MRT_RowSelectionState, MRT_TableInstance } from 'material-react-table';
import { Battle, BattleRow } from './components/table';
import { RouteChapters } from './components/settings/settings-chapters';
import { GridCellDataType, SvgPropsType } from './components/details/details-map/details-map';
import { MissionRow, TextRefType } from './components/details/missions-table';

export interface Dictionary<T> {
    [key: string]: T;
}

interface DatabaseType {
    chapters ?: RouteChapters[];
    battles ?: Battle[];
};

interface BattlesTableType {
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
}

interface MapType {
    size ?: React.RefObject<ResizeObserverEntry|undefined>;
    svg ?: [SvgPropsType | null | undefined, React.Dispatch<React.SetStateAction<SvgPropsType | null | undefined>>];
    tileData ?: [GridCellDataType[][], React.Dispatch<React.SetStateAction<GridCellDataType[][]>>];
    selectedWeapon ?: [string, React.Dispatch<React.SetStateAction<string>>];
}

export const DatabaseContext = createContext<DatabaseType>({});

export const BattlesTableContext = createContext<BattlesTableType>({});

export const MapContext = createContext<MapType>({})

export const MissionsTableContext = createContext<MissionsTableType>({});

export const DifficultyContext = createContext<[number, React.Dispatch<React.SetStateAction<number>>|null]>([0, null]);

