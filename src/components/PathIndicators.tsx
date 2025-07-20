import React from 'react';
import styled from 'styled-components';

// Styled components for path indicators
const PathIndicatorContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
`;

const SVG = styled.svg`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

// Path indicator types
export type PathType = 
  | 'turn-left-up'      // Turn left then up
  | 'turn-left-down'    // Turn left then down
  | 'turn-right-up'     // Turn right then up
  | 'turn-right-down'   // Turn right then down
  | 'straight-up'       // Continue straight then up
  | 'straight-down'     // Continue straight then down
  | 'straight-left'     // Continue straight then left
  | 'straight-right'    // Continue straight then right
  | 'diagonal-up-left'  // Diagonal movement up-left
  | 'diagonal-up-right' // Diagonal movement up-right
  | 'diagonal-down-left' // Diagonal movement down-left
  | 'diagonal-down-right'; // Diagonal movement down-right

interface PathIndicatorProps {
  type: PathType;
  x: number;
  y: number;
  isVisible?: boolean;
  color?: string;
  strokeWidth?: number;
}

// Enhanced SVG path definitions for different turn types
const PATH_DEFINITIONS = {
  'turn-left-up': {
    path: 'M 75 75 Q 50 75 25 75 Q 25 50 25 25',
    arrow: 'M 25 25 L 30 20 L 25 15 L 20 20 Z'
  },
  'turn-left-down': {
    path: 'M 75 25 Q 50 25 25 25 Q 25 50 25 75',
    arrow: 'M 25 75 L 30 70 L 25 65 L 20 70 Z'
  },
  'turn-right-up': {
    path: 'M 25 75 Q 50 75 75 75 Q 75 50 75 25',
    arrow: 'M 75 25 L 70 20 L 75 15 L 80 20 Z'
  },
  'turn-right-down': {
    path: 'M 25 25 Q 50 25 75 25 Q 75 50 75 75',
    arrow: 'M 75 75 L 70 70 L 75 65 L 80 70 Z'
  },
  'straight-up': {
    path: 'M 50 75 L 50 25',
    arrow: 'M 50 25 L 45 20 L 50 15 L 55 20 Z'
  },
  'straight-down': {
    path: 'M 50 25 L 50 75',
    arrow: 'M 50 75 L 45 70 L 50 65 L 55 70 Z'
  },
  'straight-left': {
    path: 'M 75 50 L 25 50',
    arrow: 'M 25 50 L 20 45 L 15 50 L 20 55 Z'
  },
  'straight-right': {
    path: 'M 25 50 L 75 50',
    arrow: 'M 75 50 L 70 45 L 75 40 L 80 45 Z'
  },
  'diagonal-up-left': {
    path: 'M 75 75 L 25 25',
    arrow: 'M 25 25 L 30 20 L 25 15 L 20 20 Z'
  },
  'diagonal-up-right': {
    path: 'M 25 75 L 75 25',
    arrow: 'M 75 25 L 70 20 L 75 15 L 80 20 Z'
  },
  'diagonal-down-left': {
    path: 'M 75 25 L 25 75',
    arrow: 'M 25 75 L 30 70 L 25 65 L 20 70 Z'
  },
  'diagonal-down-right': {
    path: 'M 25 25 L 75 75',
    arrow: 'M 75 75 L 70 70 L 75 65 L 80 70 Z'
  }
};

const PathIndicator: React.FC<PathIndicatorProps> = ({ 
  type, 
  x, 
  y, 
  isVisible = true, 
  color = '#4CAF50',
  strokeWidth = 2
}) => {
  if (!isVisible) return null;

  const pathDef = PATH_DEFINITIONS[type];
  if (!pathDef) return null;

  // Convert grid coordinates to SVG coordinates (32x32 grid to 3200x3200 SVG)
  const svgX = (x - 1) * 100;
  const svgY = (y - 1) * 100;

  return (
    <g transform={`translate(${svgX}, ${svgY})`}>
      {/* Path line */}
      <path
        d={pathDef.path}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        opacity="0.8"
        strokeDasharray="8,4"
        className="path-line"
      />
      {/* Arrowhead */}
      <path
        d={pathDef.arrow}
        fill={color}
        opacity="0.9"
        className="path-arrow"
      />
    </g>
  );
};

// Component to show multiple path indicators
interface PathIndicatorsProps {
  indicators: Array<{
    type: PathType;
    x: number;
    y: number;
    color?: string;
    strokeWidth?: number;
  }>;
  isVisible?: boolean;
}

const PathIndicators: React.FC<PathIndicatorsProps> = ({ indicators, isVisible = true }) => {
  if (!isVisible) return null;

  return (
    <PathIndicatorContainer>
      <SVG viewBox="0 0 3200 3200" preserveAspectRatio="none">
        {indicators.map((indicator, index) => (
          <PathIndicator
            key={`${indicator.x}-${indicator.y}-${indicator.type}-${index}`}
            type={indicator.type}
            x={indicator.x}
            y={indicator.y}
            color={indicator.color}
            strokeWidth={indicator.strokeWidth}
            isVisible={true}
          />
        ))}
      </SVG>
    </PathIndicatorContainer>
  );
};

// Enhanced utility function to generate path indicators for a specific position
export const generatePathIndicators = (x: number, y: number, diceValue?: number): Array<{
  type: PathType;
  x: number;
  y: number;
  color?: string;
  strokeWidth?: number;
}> => {
  const indicators: Array<{
    type: PathType;
    x: number;
    y: number;
    color?: string;
    strokeWidth?: number;
  }> = [];

  // Example: For position (5, 30) - bottom edge of outer square
  if (x === 5 && y === 30) {
    // Can turn left and go up (if dice allows)
    if (!diceValue || diceValue >= 2) {
      indicators.push({
        type: 'turn-left-up',
        x: 5,
        y: 30,
        color: '#FF6B6B',
        strokeWidth: 3
      });
    }
    // Can continue straight and go up
    if (!diceValue || diceValue >= 1) {
      indicators.push({
        type: 'straight-up',
        x: 5,
        y: 30,
        color: '#4ECDC4',
        strokeWidth: 2
      });
    }
  }

  // Example: For position (4, 30) - after turning left
  if (x === 4 && y === 30) {
    // Can go up
    indicators.push({
      type: 'straight-up',
      x: 4,
      y: 30,
      color: '#45B7D1',
      strokeWidth: 2
    });
  }

  // Example: For position (3, 30) - after continuing straight
  if (x === 3 && y === 30) {
    // Can go up
    indicators.push({
      type: 'straight-up',
      x: 3,
      y: 30,
      color: '#96CEB4',
      strokeWidth: 2
    });
  }

  // Example: For position (15, 3) - top edge, can turn right or continue
  if (x === 15 && y === 3) {
    // Can turn right and go down
    indicators.push({
      type: 'turn-right-down',
      x: 15,
      y: 3,
      color: '#FF9800',
      strokeWidth: 3
    });
    // Can continue straight and go down
    indicators.push({
      type: 'straight-down',
      x: 15,
      y: 3,
      color: '#9C27B0',
      strokeWidth: 2
    });
  }

  // Example: For position (29, 15) - right edge, can turn left or continue
  if (x === 29 && y === 15) {
    // Can turn left and go up
    indicators.push({
      type: 'turn-left-up',
      x: 29,
      y: 15,
      color: '#E91E63',
      strokeWidth: 3
    });
    // Can continue straight and go up
    indicators.push({
      type: 'straight-up',
      x: 29,
      y: 15,
      color: '#3F51B5',
      strokeWidth: 2
    });
  }

  // Example: For position (15, 29) - bottom edge, can turn left or continue
  if (x === 15 && y === 29) {
    // Can turn left and go up
    indicators.push({
      type: 'turn-left-up',
      x: 15,
      y: 29,
      color: '#009688',
      strokeWidth: 3
    });
    // Can continue straight and go up
    indicators.push({
      type: 'straight-up',
      x: 15,
      y: 29,
      color: '#795548',
      strokeWidth: 2
    });
  }

  // Example: For position (3, 15) - left edge, can turn right or continue
  if (x === 3 && y === 15) {
    // Can turn right and go down
    indicators.push({
      type: 'turn-right-down',
      x: 3,
      y: 15,
      color: '#607D8B',
      strokeWidth: 3
    });
    // Can continue straight and go down
    indicators.push({
      type: 'straight-down',
      x: 3,
      y: 15,
      color: '#FF5722',
      strokeWidth: 2
    });
  }

  return indicators;
};

// Component to show path indicators for a specific piece position
interface PiecePathIndicatorProps {
  pieceX: number;
  pieceY: number;
  isVisible?: boolean;
  diceValue?: number;
}

const PiecePathIndicator: React.FC<PiecePathIndicatorProps> = ({
  pieceX,
  pieceY,
  isVisible = true,
  diceValue
}) => {
  const indicators = generatePathIndicators(pieceX, pieceY, diceValue);

  return (
    <PathIndicators 
      indicators={indicators} 
      isVisible={isVisible} 
    />
  );
};

export default PathIndicators;
export { PathIndicator, PiecePathIndicator }; 