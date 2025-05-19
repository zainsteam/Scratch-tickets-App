import React from 'react';
import {Path} from 'react-native-svg';

const PathComponent = React.memo(
  ({id, fill, stroke, width, opacity, area, onClick}: any) => {
    return (
      <Path
        onPressIn={onClick}
        id={id}
        fill={fill}
        stroke={stroke}
        strokeWidth={width}
        strokeOpacity={opacity}
        d={area}
      />
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.fill === nextProps.fill &&
      prevProps.opacity === nextProps.opacity &&
      prevProps.area === nextProps.area
    );
  },
);

export default PathComponent;
