import { createContext } from 'react';
// import allChapters from './db/chapters.json';
import { MRT_Row, MRT_RowSelectionState } from 'material-react-table';
import { Battle, BattleRow } from './components/table';
import { RouteChapters } from './components/settings/settings-chapters';
import { SvgPropsType } from './components/details/details-map/details-map';

interface DatabaseType {
    chapters ?: RouteChapters[];
    battles ?: Battle[];
    map ?: SvgPropsType[];
};

export const DatabaseContext = createContext<DatabaseType>({});

export const SelectedBattleRowContext = createContext<
    [
        [
            MRT_RowSelectionState, 
            React.Dispatch<React.SetStateAction<MRT_RowSelectionState>>
        ], 
        React.RefObject<MRT_Row<BattleRow>|undefined>
    ]
    |undefined
>(undefined);

export const SelectedMissionRowContext = createContext<
    [
        MRT_RowSelectionState,
        React.Dispatch<React.SetStateAction<MRT_RowSelectionState>>
    ]
    |undefined
>(undefined)

export const DifficultyContext = createContext<[number, React.Dispatch<React.SetStateAction<number>>|null]>([0, null]);

