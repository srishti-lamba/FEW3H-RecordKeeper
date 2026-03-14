import { createContext, useState, useRef } from 'react';
import allChapters from './db/chapters.json';
import { MRT_RowSelectionState } from 'material-react-table';
import { Mission, Row } from './components/table';
import { RouteChapters } from './components/settings/settings-chapters';

export const AllChapters = createContext<RouteChapters[]>(allChapters);
export const AllMissions = createContext<Mission[]>([]);

export const MainSelectedRow = createContext<{}>(
    []
    // const [selectedRow, setSelectedRow] = useState<MRT_RowSelectionState>({});
);

export const MainSelectedRowData = createContext(
    null
    //   const selectedRowData = useRef<Row|null>(null);
);

export const Difficulty = createContext<[number, React.Dispatch<React.SetStateAction<number>>|null]>(
    [0, null]
);

