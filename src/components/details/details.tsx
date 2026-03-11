import React, {useEffect, useState, useRef} from 'react';
import { Map } from './details-map/details-map'
import { MRT_RowSelectionState } from 'material-react-table';
import { Row } from '../table';

interface DetailsProps {
    selectedRow : MRT_RowSelectionState
    selectedRowData : React.RefObject<Row|null>;
}

export function Details( {selectedRow, selectedRowData} : DetailsProps ) {

    return (
        <div id="right-pane-contents">
            <Map selectedRow={selectedRow} selectedRowData={selectedRowData} />
            <div className="test"></div>
            <div className="test2"></div>
            {/* <img src={process.env.PUBLIC_URL + "/images/ui-background/test.svg"} width="100%" height="100px" /> */}
        </div>
    )
}