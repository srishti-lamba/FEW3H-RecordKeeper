import { Jimp, RGBAColor } from "jimp";
import { intToRGBA, cssColorToHex } from "@jimp/utils";
import { CoordinateType } from "./details/details-map/details-map";

interface Dictionary<T> {
    [key: string]: T;
}

export async function PixelsToSVG() {
    const image = await Jimp.read(
        process.env.PUBLIC_URL + "/images/icons/sprites/monk/yellow.png"
    );

    function getPixel(x:number, y:number) {
        return intToRGBA(image.getPixelColor(x, y))
    }

    function colourToString(colour : RGBAColor) {
        return `rgb(${colour.r},${colour.g},${colour.b})`
    }

    function compareRGBA(one : RGBAColor, two : RGBAColor) {
        return (
            (one.r === two.r) &&
            (one.g === two.g) &&
            (one.b === two.b) &&
            (one.a === two.a)
        )
    }

    const resultDefs : string[] = [];
    const resultUse : Dictionary<string[]> = {};
    const done : boolean[][] = new Array(image.width)
        .fill(null).map( 
            () => new Array(image.height).fill(false) 
        );
    console.log(done)
    const colours : Dictionary<number> = {};
    var colourCount : number = 0;

    resultDefs.push("    <defs>")
    resultDefs.push(
`        <rect
            id="rect"
            x="0" y="0" width="1" height="1"
        />`

    )

    for (let row = 0 ; row < image.height; row++ ) {
        for (let col = 0; col < image.width; col++) {
            // console.log(`pixel (${col},${row})`)

            // If done, skip
            if (done[col][row] === true)
                continue;

            // Find colour
            let curr : CoordinateType = {x:col,y:row};
            let colour : RGBAColor = getPixel(col,row);

            // If Colour is transparent, skip
            if (colour.a === 0)
                continue;
            
            let colourStr : string = colourToString(colour);

            // Mark done
            done[col][row] = true;

            // If colour already found, find siblings
            if (colours[colourStr] !== undefined) {
                resultUse[colourStr].push(findSiblings(col,row,colour,colours[colourStr]))
                continue;
            }

            // Else, add to set, add to defs, then findAllColours
            colours[colourStr] = colourCount;
            resultDefs.push(`        <use href="#rect" id="colour-${colourCount}" fill="${colourStr}" />`)
//             resultDefs.push(
// `        <rect
//             id="colour-${colourCount}" fill="${colourStr}"
//             x="0" y="0" width="1" height="1"
//         />`
//             )
            resultUse[colourStr] = []
            resultUse[colourStr].push(findSiblings(col,row,colour,colourCount))
            colourCount++;
        }
    }
    resultDefs.push("    </defs>")

    function findSiblings(col:number, row:number, colourToFind:RGBAColor, colourCount:number) {
        // See if it continues on right
        let colRight = col + 1
        while (colRight < image.width) {
            let colourRight = getPixel(colRight,row)
            // Not same
            if (!compareRGBA(colourRight,colourToFind)) {
                colRight = colRight - 1
                break;
            }
            // Same
            done[colRight][row] = true;
            colRight++;
        }
        if (colRight !== col) {
            return(`    <use href="#colour-${colourCount}" transform="translate(${col},${row})  scale(${colRight-col+1},1)" />`)
        }

        // See if it continues down
        let rowDown = row + 1
        while (rowDown < image.height) {
            let colourDown = getPixel(col,rowDown)
            // Not same
            if (!compareRGBA(colourDown,colourToFind)) {
                rowDown = rowDown - 1
                break;
            }
            // Same
            done[col][rowDown] = true;
            rowDown++;
        }
        if (rowDown !== row) {
            return (`    <use href="#colour-${colourCount}" transform="translate(${col},${row})  scale(1,${rowDown-row+1})" />`)
        }

        // Just single pixel
        return (`    <use href="#colour-${colourCount}" transform="translate(${col},${row})" />`)
    }

        // Compiling together
    const result : string[] = [];

    result.push(
`<svg 
    xmlns="http://www.w3.org/2000/svg"
    height="100%"  
    viewBox="0 0 ${image.width} ${image.height}" 
    preserveAspectRatio="xMinYMin meet" 
    shape-rendering="crispEdges"
>`
    )
    result.push(resultDefs.join("\n"))
    Object.values(resultUse).forEach(
        (value) => result.push(value.join("\n"))
    )
    result.push("</svg>")
    console.log(result.join("\n"))
}