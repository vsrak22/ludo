import React from 'react';
import styled from 'styled-components';
import { BOARD_SIZE, SAFE_ZONES, REGULAR_SPOTS, MOKSHA_POSITION } from '../constants/gameConstants';

const BoardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const SquarePath = styled.div<{ square: 1 | 2 | 3 }>`
  position: absolute;
  border: 2px solid ${props => {
    switch (props.square) {
      case 1: return '#27ae60';
      case 2: return '#3498db';
      case 3: return '#f39c12';
      default: return '#333';
    }
  }};
  border-radius: 4px;
  opacity: 0.3;
  pointer-events: none;
`;

const OuterSquare = styled(SquarePath)`
  top: 6.25%;
  left: 6.25%;
  width: 87.5%;
  height: 87.5%;
`;

const MiddleSquare = styled(SquarePath)`
  top: 18.75%;
  left: 18.75%;
  width: 62.5%;
  height: 62.5%;
`;

const InnerSquare = styled(SquarePath)`
  top: 31.25%;
  left: 31.25%;
  width: 37.5%;
  height: 37.5%;
`;

const MokshaCenter = styled.div`
  position: absolute;
  top: 43.75%;
  left: 43.75%;
  width: 12.5%;
  height: 12.5%;
  background: #8e44ad;
  border: 2px solid #6c5ce7;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const PlayerHomeIndicator = styled.div<{ playerId: number }>`
  position: absolute;
  width: 6.25%;
  height: 6.25%;
  background: ${props => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
    return colors[props.playerId - 1];
  }};
  border: 2px solid #333;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 8px;
  font-weight: bold;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
`;

const BoardLayout: React.FC = () => {
  return (
    <BoardOverlay>
      {/* Three concentric squares */}
      <OuterSquare square={1} />
      <MiddleSquare square={2} />
      <InnerSquare square={3} />
      
      {/* Player home indicators */}
      <PlayerHomeIndicator 
        playerId={1} 
        style={{ top: '0%', left: '46.875%' }}
      >
        P1
      </PlayerHomeIndicator>
      
      <PlayerHomeIndicator 
        playerId={2} 
        style={{ top: '46.875%', left: '0%' }}
      >
        P2
      </PlayerHomeIndicator>
      
      <PlayerHomeIndicator 
        playerId={3} 
        style={{ top: '93.75%', left: '46.875%' }}
      >
        P3
      </PlayerHomeIndicator>
      
      <PlayerHomeIndicator 
        playerId={4} 
        style={{ top: '46.875%', left: '93.75%' }}
      >
        P4
      </PlayerHomeIndicator>
    </BoardOverlay>
  );
};

export default BoardLayout; 