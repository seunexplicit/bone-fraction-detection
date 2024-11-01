export const parseCoordinates = (data, imageWidth, imageHeight) => {
    const parts = data.trim().split(' ');
    parts.shift();
    const coordinates = [];

    for (let i = 0; i < parts.length; i += 2) {
      coordinates.push({
        x: parseFloat(parts[i]) * imageWidth,
        y: parseFloat(parts[i + 1]) * imageHeight,
      });
    }

    return coordinates;
};