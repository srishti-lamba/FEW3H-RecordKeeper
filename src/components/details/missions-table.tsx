import { MRT_RowSelectionState } from "material-react-table";
import { Row } from "../table";

interface MissionsProps {
    selectedRow : MRT_RowSelectionState
    selectedRowData : React.RefObject<Row|null>;
}

export function Missions( {selectedRow, selectedRowData} : MissionsProps ) {}