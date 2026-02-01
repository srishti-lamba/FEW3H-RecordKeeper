import React, {useEffect, useState} from 'react';
import { MRT_RowSelectionState } from 'material-react-table';
import mapPath from '../db/map-path.json';

interface SvgPathType {
    fill? : string;
    transform? : string;
    d? : string;
}

interface SvgPropsType {
    width? : string;
    height? : string;
    path? : SvgPathType[];
}

interface MapProps {
    selectedRow : MRT_RowSelectionState;
}

export function Map({selectedRow} : MapProps) {

    const [svgProps, setSvgProps] = useState<SvgPropsType | undefined | null>(undefined);

    // Run once
    useEffect(() => {
    }, [])

    useEffect(() => {
        let keys = Object.keys(selectedRow) as Array<string>
        if (keys.length == 0) {
            setSvgProps(null);
            return;
        }
        let key = (keys[0] as unknown) as number
        if (selectedRow[key] == false) {
            setSvgProps(null);
            return;
        }
        if (mapPath.length > key)
            setSvgProps(mapPath[key]);
        else
            setSvgProps(undefined);
    }, [selectedRow])

    useEffect(() => {
        // console.log("SVG Props:")
        // console.log(setSvgProps)
    }, [svgProps])

    if (svgProps === undefined) {
        return <>No data for this chapter yet...</>;
    }

    if (svgProps === null) {
        return <>Select a chapter.</>;
    }

    return (
        <svg 
            version="1.1" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox={"0 0 " + svgProps.width + " " + svgProps.height}
        >
            {
                svgProps.path?.map( (path : SvgPathType) => (
                    <path 
                        fill={path.fill} 
                        transform={path.transform} 
                        d={path.d} 
                    />
                ))
            }
        </svg>
    )
    
}