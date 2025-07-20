import React from 'react';
import styled from 'styled-components';
import { useGame } from '../store/GameContext';
import { BOARD_SIZE, PLAYER_COLORS, SAFE_ZONES, REGULAR_SPOTS, MOKSHA_AREA, MIDDLE_SQUARE_PATHS, INNER_SQUARE_PATHS } from '../constants/gameConstants';
import BoardLayout from './BoardLayout';
import Dice from './Dice';

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
`;

const GameLayout = styled.div`
  display: flex;
  gap: 30px;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1400px;
  margin: 0 auto;
`;

const BoardTitle = styled.h1`
  color: #333;
  margin-bottom: 20px;
  font-size: 2rem;
`;

const BoardWrapper = styled.div`
  position: relative;
  width: 800px;
  height: 800px;
  border: 4px solid #2c3e50;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  background: #f8f9fa;
`;

const BoardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${BOARD_SIZE}, 1fr);
  grid-template-rows: repeat(${BOARD_SIZE}, 1fr);
  gap: 1px;
  background: #333;
  width: 100%;
  height: 100%;
  position: relative;
`;

const CoordinateTooltip = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 8px;
  font-weight: bold;
  z-index: 10;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
`;

const Cell = styled.div<{ 
  isHome: boolean; 
  playerId?: number;
  isSafeZone: boolean;
  isRegularSpot: boolean;
  isMoksha: boolean;
  isMiddleSquarePath: boolean;
  isInnerSquarePath: boolean;
  square: 1 | 2 | 3;
}>`
  width: 100%;
  height: 100%;
  background: ${props => {
    if (props.isMoksha) return '#8e44ad';
    if (props.isHome && props.playerId) {
      return PLAYER_COLORS[props.playerId - 1];
    }
    if (props.isSafeZone) return '#f39c12';
    if (props.isRegularSpot) {
      switch (props.square) {
        case 1: return '#e8f5e8';
        case 2: return '#e3f2fd';
        case 3: return '#fff3e0';
        default: return '#fff';
      }
    }
    // Show only the path squares with light green shading (but not if it's a regular spot)
    if (props.isMiddleSquarePath && !props.isRegularSpot) return '#d4edda'; // Light green for middle square path
    if (props.isInnerSquarePath && !props.isRegularSpot) return '#c3e6cb'; // Slightly darker green for inner square path
    return '#fff';
  }};
  border: 1px solid ${props => {
    if (props.isMoksha) return '#6c5ce7';
    return '#e0e0e0';
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6px;
  color: #666;
  position: relative;
  aspect-ratio: 1;
  transition: all 0.1s ease;



  &:hover {
    background: ${props => {
      if (props.isMoksha) return '#9b59b6';
      if (props.isHome && props.playerId) {
        return `${PLAYER_COLORS[props.playerId - 1]}dd`;
      }
      if (props.isSafeZone) return '#e67e22';
      if (props.isRegularSpot) {
        switch (props.square) {
          case 1: return '#d4edda';
          case 2: return '#cce7ff';
          case 3: return '#ffe0b2';
          default: return '#f8f9fa';
        }
      }
      // Hover effects for inner paths
      if (props.isMiddleSquarePath && !props.isRegularSpot) return '#b8dacc'; // Darker green for middle square path hover
      if (props.isInnerSquarePath && !props.isRegularSpot) return '#a8d5b5'; // Darker green for inner square path hover
      return '#f8f9fa';
    }};

    ${CoordinateTooltip} {
      opacity: 1;
    }
  }
`;

const Piece = styled.div<{ color: string; isSelected: boolean }>`
  width: 70%;
  height: 70%;
  background: ${props => props.color};
  border-radius: 8px;
  border: 2px solid ${props => props.isSelected ? '#333' : 'rgba(0, 0, 0, 0.3)'};
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  z-index: 2;

  &:hover {
    transform: scale(1.1) translateY(-1px);
    box-shadow: 
      0 4px 8px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.5),
      inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  }

  &::before {
    content: '';
    position: absolute;
    top: 20%;
    left: 20%;
    width: 60%;
    height: 60%;
    background: ${props => props.color};
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  &::after {
    content: '';
    position: absolute;
    top: 35%;
    left: 35%;
    width: 30%;
    height: 30%;
    background: ${props => props.color};
    border-radius: 2px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
`;

const GameInfo = styled.div`
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  min-width: 300px;
  max-width: 350px;
`;

const GameControls = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin-top: 20px;
  flex-wrap: wrap;
  justify-content: center;
`;

const PlayerInfo = styled.div<{ isCurrentTurn: boolean }>`
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  background: ${props => props.isCurrentTurn ? '#e3f2fd' : '#f5f5f5'};
  border-left: 4px solid ${props => props.isCurrentTurn ? '#2196f3' : '#ddd'};
`;

const Legend = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 8px;
  font-size: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 200px;
  margin-bottom: 20px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin: 2px 0;
`;

const LegendColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  background: ${props => props.color};
  border-radius: 2px;
  margin-right: 5px;
  border: 1px solid #ddd;
`;

const GameBoard: React.FC = () => {
  const { state, dispatch } = useGame();

  const handlePieceClick = (piece: any) => {
    dispatch({ type: 'SELECT_PIECE', piece });
  };

  const handleRollDice = () => {
    dispatch({ type: 'ROLL_DICE', playerId: state.currentPlayerIndex + 1 });
  };

  const handleEndTurn = () => {
    dispatch({ type: 'END_TURN' });
  };

  // Helper functions to determine cell properties
  const isHomeArea = (x: number, y: number): { isHome: boolean; playerId?: number } => {
    if (x >= 16 && x <= 17 && y >= 1 && y <= 2) return { isHome: true, playerId: 1 };
    if (x >= 1 && x <= 2 && y >= 16 && y <= 17) return { isHome: true, playerId: 2 };
    if (x >= 16 && x <= 17 && y >= 31 && y <= 32) return { isHome: true, playerId: 3 };
    if (x >= 31 && x <= 32 && y >= 16 && y <= 17) return { isHome: true, playerId: 4 };
    return { isHome: false };
  };

  const isSafeZone = (x: number, y: number): boolean => {
    return SAFE_ZONES.some(zone => 
      x >= zone.x && x < zone.x + zone.width &&
      y >= zone.y && y < zone.y + zone.height
    );
  };

  const isRegularSpot = (x: number, y: number): boolean => {
    return REGULAR_SPOTS.some(spot => 
      x >= spot.x && x < spot.x + spot.width &&
      y >= spot.y && y < spot.y + spot.height
    );
  };

  const isMiddleSquarePath = (x: number, y: number): boolean => {
    return MIDDLE_SQUARE_PATHS.some(path => 
      x >= path.x && x < path.x + path.width &&
      y >= path.y && y < path.y + path.height
    );
  };

  const isInnerSquarePath = (x: number, y: number): boolean => {
    return INNER_SQUARE_PATHS.some(path => 
      x >= path.x && x < path.x + path.width &&
      y >= path.y && y < path.y + path.height
    );
  };

  const getSquare = (x: number, y: number): 1 | 2 | 3 => {
    // Outer square (square 1)
    if (x >= 3 && x <= 30 && y >= 3 && y <= 30) {
      // Inner square (square 3) - center area
      if (x >= 11 && x <= 22 && y >= 11 && y <= 22) {
        return 3;
      }
      // Middle square (square 2) - between outer and inner
      if (x >= 7 && x <= 26 && y >= 7 && y <= 26) {
        return 2;
      }
      return 1;
    }
    return 1;
  };

  const renderCell = (x: number, y: number) => {
    const homeInfo = isHomeArea(x, y);
    const safe = isSafeZone(x, y);
    const regular = isRegularSpot(x, y);
    const middlePath = isMiddleSquarePath(x, y);
    const innerPath = isInnerSquarePath(x, y);
    const moksha = x >= MOKSHA_AREA.x && x < MOKSHA_AREA.x + MOKSHA_AREA.width &&
                   y >= MOKSHA_AREA.y && y < MOKSHA_AREA.y + MOKSHA_AREA.height;
    const square = getSquare(x, y);

    const piece = state.players
      .flatMap(player => player.pieces)
      .find(p => p.position.x === x && p.position.y === y);

    return (
      <Cell 
        key={`${x}-${y}`} 
        isHome={homeInfo.isHome}
        playerId={homeInfo.playerId}
        isSafeZone={safe}
        isRegularSpot={regular}
        isMoksha={moksha}
        isMiddleSquarePath={middlePath}
        isInnerSquarePath={innerPath}
        square={square}
      >
        {piece && (
          <Piece
            color={state.players[piece.playerId - 1]?.color || '#ccc'}
            isSelected={state.selectedPiece?.id === piece.id}
            onClick={() => handlePieceClick(piece)}
          />
        )}
        <CoordinateTooltip>{`${x},${y}`}</CoordinateTooltip>
      </Cell>
    );
  };

  const cells = [];
  for (let y = 1; y <= BOARD_SIZE; y++) {
    for (let x = 1; x <= BOARD_SIZE; x++) {
      cells.push(renderCell(x, y));
    }
  }

  return (
    <BoardContainer>
      <BoardTitle>🎲 Ludo Game Board</BoardTitle>
      
      <GameLayout>
        <BoardWrapper>
          <BoardGrid>
            {cells}
          </BoardGrid>
          <BoardLayout />
        </BoardWrapper>

        <GameInfo>
          <h3>Game Status</h3>
          <p>Current Player: {state.players[state.currentPlayerIndex]?.name || 'None'}</p>
          
          <GameControls>
            <Dice diceRolls={state.diceRolls} diceType={state.diceType} />
            
            <div>
              <div style={{ marginBottom: '10px' }}>
                <button onClick={handleRollDice} style={{ marginRight: '10px', padding: '10px 20px' }}>
                  Roll Dice
                </button>
                <button onClick={handleEndTurn} style={{ padding: '10px 20px' }}>
                  End Turn
                </button>
              </div>
            </div>
          </GameControls>

          <div style={{ marginTop: '20px' }}>
            <h4>Players:</h4>
            {state.players.map((player, index) => (
              <PlayerInfo key={player.id} isCurrentTurn={index === state.currentPlayerIndex}>
                <strong>{player.name}</strong> - {player.pieces.filter(p => p.isInMoksha).length}/4 in Moksha
              </PlayerInfo>
            ))}
          </div>

          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
            <h4>Legend:</h4>
            <LegendItem>
              <LegendColor color="#e8f5e8" />
              <span>Outer Square</span>
            </LegendItem>
            <LegendItem>
              <LegendColor color="#d4edda" />
              <span>Middle Square (Inner Path)</span>
            </LegendItem>
            <LegendItem>
              <LegendColor color="#c3e6cb" />
              <span>Inner Square (Inner Path)</span>
            </LegendItem>
            <LegendItem>
              <LegendColor color="#f39c12" />
              <span>Safe Zone</span>
            </LegendItem>
            <LegendItem>
              <LegendColor color="#8e44ad" />
              <span>Moksha</span>
            </LegendItem>
          </div>
        </GameInfo>
      </GameLayout>
    </BoardContainer>
  );
};

export default GameBoard; 