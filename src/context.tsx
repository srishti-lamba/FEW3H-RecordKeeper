import { createContext } from 'react';
// import allChapters from './db/chapters.json';
import { MRT_Row, MRT_RowSelectionState, MRT_TableInstance } from 'material-react-table';
import { Battle, BattleRow } from './components/table';
import { RouteChapters } from './components/settings/settings-chapters';
import { SvgPropsType } from './components/details/details-map/details-map';
import { MissionRow } from './components/details/missions-table';

interface DatabaseType {
    chapters ?: RouteChapters[];
    battles ?: Battle[];
    map ?: SvgPropsType[];
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
        React.Dispatch<React.SetStateAction<MRT_RowSelectionState>>  ]
}

interface MapType {
    size ?: React.RefObject<ResizeObserverEntry|undefined>;
}

export const DatabaseContext = createContext<DatabaseType>({});

export const BattlesTableContext = createContext<BattlesTableType>({});

export const MapContext = createContext<MapType>({})

export const MissionsTableContext = createContext<MissionsTableType>({});

export const DifficultyContext = createContext<[number, React.Dispatch<React.SetStateAction<number>>|null]>([0, null]);

