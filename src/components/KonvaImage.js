import React, { useState, useEffect } from 'react';
import { Stage, Layer, Line, Image } from 'react-konva';
import { parseCoordinates } from '../utilities/parseCordinates';
import { getCoordinatesData } from '../utilities/fetchS3Images';

export const KonvaImage = ({ image }) => {
    const [konvaImage, setKonvaImage] = useState(null);
    const [markers, setMarkers] = useState(null);

    const loadLabelContents = async () => {
        const coords = await getCoordinatesData(image.labelKey);
        setMarkers(parseCoordinates(coords, 300, 300))
    }

    useEffect(() => {
        setMarkers([])
        loadLabelContents();
    }, [image.labelKey]);

    useEffect(() => {
        const img = new window.Image();
        img.src = image.photoUrl;
        img.onload = () => {
            setKonvaImage(img);
        }
    }, [image.photoUrl]);

    return (
        <div>
            {konvaImage && markers ? (
                <Stage width={300} height={300}>
                    <Layer>
                        <Image image={konvaImage} width={300} height={300} />
                        <Line 
                            points={markers.flatMap(({ x, y }) => [x, y])} 
                            stroke="yellow" 
                            strokeWidth={2}
                            lineCap="round"
                            lineJoin="round"
                        />
                    </Layer>
                </Stage>
            ): null}
        </div>
    );
}