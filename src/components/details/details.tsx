import React, {useEffect, useState, useRef} from 'react';
import { Map } from './details-map/details-map'
import { MRT_RowSelectionState } from 'material-react-table';
import { Missions } from './missions-table';
// import { BattleRow } from '../table';

interface DetailsProps {
    // selectedRow : MRT_RowSelectionState
    // selectedRowData : React.RefObject<BattleRow|null>;
}

export function Details( {/*selectedRow, selectedRowData*/} : DetailsProps ) {

    return (
        <div id="right-pane-contents">
            <Map />
            <Missions />
            <div className="test"></div>
            <div className="test2"></div>
            {/* <img src={process.env.PUBLIC_URL + "/images/ui-background/test.svg"} width="100%" height="100px" /> */}
        </div>
    )
}