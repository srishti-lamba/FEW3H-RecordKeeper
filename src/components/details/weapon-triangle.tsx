import { useContext, useState } from "react";
import { BattlesTableContext, MapContext } from "../../context";

interface WeaponTriangleProps {}

export function WeaponTriangle({}: WeaponTriangleProps) {

    const [selected, setSelected] = useContext(MapContext).selectedWeapon!;
    const [svgProps, _] = useContext(MapContext).svg!;

    // No selected battle
    if (svgProps === null || svgProps === undefined)
        return <></>

    const id = "weapon-triangle"
    const scale = 0.5;
    const arrowWidth = 5;
    const iconWidth = 36;
    const circleRadius = 25;
    const triangleHeight = 150;
    const triangleWidth = 200;
    const triangleGap = 50;

    const gXArr = [triangleWidth/2, triangleWidth-circleRadius, circleRadius];
    const gYArr = [circleRadius, triangleHeight-circleRadius , triangleHeight-circleRadius];
    const imgXArr = [-iconWidth/2, (-iconWidth/2)+2, -iconWidth/2];
    const imgYArr = [-iconWidth/2, (-iconWidth/2)-2, -iconWidth/2];
    const line = [ [1, 1, -1, -1], [-1, -1, 1, 1], [1, 1, -1, -1] ];

    const hypotenuse = 35;

    return (
        <>
            <div id={id}>
                <svg
                    version="1.1" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox={`0 0 ${triangleWidth + (triangleGap/2)} ${triangleHeight*scale}`}
                    width={triangleWidth} height={triangleHeight*scale}
                    key={`${id}-svg`}
                >
                    <defs>
                        <marker
                            id={`${id}-marker`}
                            markerWidth={arrowWidth/2} markerHeight={arrowWidth} 
                            refX={arrowWidth/3} refY={arrowWidth/2} 
                            orient="auto"
                        >
                            <path 
                                d={`M 0 0 L ${arrowWidth/2} ${arrowWidth/2} L 0 ${arrowWidth} z`}
                                fill="white"
                            />
                        </marker>
                        <circle
                            id={`${id}-circle`}
                            r={circleRadius}
                            cx="0" cy="0"
                            fill="currentColor"
                        />
                    </defs>

                    {
                        [ ["sword", "axe", "lance"], ["bow", "gauntlets", "tome"]].map( (arr, triangleIndex) => (
                            <g transform={`scale(${scale},${scale}) translate(${triangleIndex*(triangleWidth + triangleGap)},0)`}>
                                {
                                    arr.map( (weapon : string, index : number) => {
                                    let gX = gXArr[index];
                                    let gY = gYArr[index];
                                    let imgX = imgXArr[index];
                                    let imgY = imgYArr[index];

                                    let nextIndex = (index == 2) ? 0 : index + 1
                                    let angle = Math.atan( ( gYArr[nextIndex] - gYArr[index] ) / ( gXArr[nextIndex] - gXArr[index] ) )
                                    let x1 = gXArr[index] + ( (hypotenuse * Math.cos(angle)) * line[index][0] );
                                    let y1 = gYArr[index] + ( (hypotenuse * Math.sin(angle)) * line[index][1] );
                                    let x2 = gXArr[nextIndex] + ( (hypotenuse * Math.cos(angle)) * line[index][2] );
                                    let y2 = gYArr[nextIndex] + ( (hypotenuse * Math.sin(angle)) * line[index][3] );
                                    return (
                                        <>
                                            <g 
                                                transform={`translate(${gX},${gY})`} 
                                                className={`${id}-group${(selected==weapon) ? " selected" : ""}`}
                                            >
                                                <use 
                                                    xlinkHref={`#${id}-circle`}
                                                    className={`${id}-circle`}
                                                    onClick={() => setSelected( (selected === weapon) ? "" : weapon)}
                                                />
                                                <image 
                                                    xlinkHref={`${process.env.PUBLIC_URL}/images/category/${weapon}.png`}
                                                    className={`${id}-image`}
                                                    transform={`translate(${imgX},${imgY})`}
                                                />
                                            </g>
                                            <line 
                                                x1={x1} y1={y1}
                                                x2={x2} y2={y2}
                                                stroke="white" 
                                                strokeWidth="5" strokeLinecap="round"
                                                marker-end={`url(#${id}-marker)`}
                                            />
                                        </>
                                    )}  
                                )}
                            </g>
                        ))
                    }
                </svg>
            </div>
        </>
    )
}