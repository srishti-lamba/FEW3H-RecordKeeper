import React, {useEffect, useState, useRef} from 'react';
import { Map } from './details-map'
import { MRT_RowSelectionState } from 'material-react-table';

interface DetailsProps {
    selectedRow : MRT_RowSelectionState
}

export function Details( {selectedRow} : DetailsProps ) {

    return (
        <Map selectedRow={selectedRow}/>
    )
}