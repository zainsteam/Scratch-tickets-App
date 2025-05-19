import React from 'react';
import {TSpan} from 'react-native-svg';

const TSpanComponent = React.memo(
  ({id, x, y, fontSize, textAnchor, value, type}: any) => {
    const smallStates = ['DC', 'NJ', 'MD', 'MA', 'NH', 'VT', 'DE', 'RI', 'CT'];
    const displayText = smallStates.includes(value) ? value : id;

    return (
      <TSpan
        id={id}
        x={x}
        y={y}
        fontSize={fontSize}
        textAnchor={textAnchor}
        fill={type === 'Newest' ? '#fff' : '#000'}>
        {displayText}
      </TSpan>
    );
  },
  (prev, next) =>
    prev.id === next.id &&
    prev.x === next.x &&
    prev.y === next.y &&
    prev.fontSize === next.fontSize &&
    prev.textAnchor === next.textAnchor &&
    prev.value === next.value &&
    prev.type === next.type,
);

export default TSpanComponent;
