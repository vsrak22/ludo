import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useGameLogic } from '../hooks/useGameLogic';
import { GamePiece, Position } from '../types/game';
import { BOARD_SIZE, PLAYER_COLORS, SAFE_ZONES, REGULAR_SPOTS, MOKSHA_AREA, MIDDLE_SQUARE_PATHS, INNER_SQUARE_PATHS } from '../constants/gameConstants';
import MoveIndicator from './MoveIndicator';
import PieceSelector from './PieceSelector';

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

const GameBoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
`;

const BoardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${BOARD_SIZE}, 1fr);
  grid-template-rows: repeat(${BOARD_SIZE}, 1fr);
  gap: 1px;
  background: #2c3e50;
  border: 3px solid #34495e;
  border-radius: 10px;
  padding: 10px;
  width: 600px;
  height: 600px;
  position: relative;
`;

const Cell = styled.div.withConfig({
  shouldForwardProp: (prop) => ![
    'isSafeZone', 
    'isHomeArea', 
    'playerId', 
    'isHighlighted', 
    'isRegularSpot', 
    'isMoksha', 
    'isMiddleSquarePath', 
    'isInnerSquarePath', 
    'square'
  ].includes(prop)
})<{ 
  isSafeZone: boolean; 
  isHomeArea: boolean;
  playerId?: number;
  isHighlighted: boolean;
  isRegularSpot: boolean;
  isMoksha: boolean;
  isMiddleSquarePath: boolean;
  isInnerSquarePath: boolean;
  square: 1 | 2 | 3;
}>`
  background: ${props => {
    if (props.isHighlighted) return '#f1c40f';
    if (props.isMoksha) return '#8e44ad';
    if (props.isHomeArea && props.playerId) {
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
    if (props.isMiddleSquarePath && !props.isRegularSpot) return '#d4edda';
    if (props.isInnerSquarePath && !props.isRegularSpot) return '#c3e6cb';
    return '#fff';
  }};
  border: 1px solid ${props => {
    if (props.isMoksha) return '#6c5ce7';
    return props.isSafeZone ? '#95a5a6' : '#7f8c8d';
  }};
  border-radius: 4px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => {
      if (props.isHighlighted) return '#f39c12';
      if (props.isMoksha) return '#9b59b6';
      if (props.isHomeArea && props.playerId) {
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
      if (props.isMiddleSquarePath && !props.isRegularSpot) return '#b8dacc';
      if (props.isInnerSquarePath && !props.isRegularSpot) return '#a8d5b5';
      return '#f8f9fa';
    }};
    transform: scale(1.05);
  }
`;

const Piece = styled.div.withConfig({
  shouldForwardProp: (prop) => !['color', 'isSelected', 'isMovable'].includes(prop)
})<{ 
  color: string; 
  isSelected: boolean;
  isMovable: boolean;
}>`
  width: 80%;
  height: 80%;
  border-radius: 50%;
  background: ${props => props.color};
  border: 3px solid ${props => props.isSelected ? '#e74c3c' : 'white'};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  cursor: ${props => props.isMovable ? 'pointer' : 'default'};
  transition: all 0.2s ease;
  position: relative;
  z-index: 10;

  &:hover {
    transform: ${props => props.isMovable ? 'scale(1.1)' : 'scale(1)'};
    box-shadow: ${props => props.isMovable ? '0 6px 12px rgba(0, 0, 0, 0.4)' : '0 4px 8px rgba(0, 0, 0, 0.3)'};
  }

  ${props => props.isSelected && `
    animation: pulse 1.5s infinite;
    
    @keyframes pulse {
      0% {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3), 0 0 0 0 rgba(231, 76, 60, 0.7);
      }
      70% {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3), 0 0 0 10px rgba(231, 76, 60, 0);
      }
      100% {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3), 0 0 0 0 rgba(231, 76, 60, 0);
      }
    }
  `}
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

const GameInfo = styled.div`
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  min-width: 300px;
  max-width: 350px;
`;

const GameInfoPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  min-width: 250px;
`;

const GameStatus = styled.div`
  text-align: center;
  padding: 10px;
  background: #3498db;
  color: white;
  border-radius: 8px;
  font-weight: 600;
`;

const TurnInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: #ecf0f1;
  border-radius: 8px;
`;

const PlayerIndicator = styled.div.withConfig({
  shouldForwardProp: (prop) => !['color'].includes(prop)
})<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.color};
  border: 2px solid white;
`;

const MovementControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px solid #e9ecef;
`;

const ControlButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => {
    switch (props.variant) {
      case 'primary': return '#3498db';
      case 'secondary': return '#95a5a6';
      case 'danger': return '#e74c3c';
      default: return '#ecf0f1';
    }
  }};
  color: ${props => props.variant ? 'white' : '#2c3e50'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const TurnSkippedNotification = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #e74c3c;
  color: white;
  padding: 15px 25px;
  border-radius: 8px;
  font-weight: 600;
  z-index: 1000;
  animation: slideDown 0.3s ease-out;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  @keyframes slideDown {
    from {
      transform: translateX(-50%) translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }
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

const LegendColor = styled.div.withConfig({
  shouldForwardProp: (prop) => !['color'].includes(prop)
})<{ color: string }>`
  width: 12px;
  height: 12px;
  background: ${props => props.color};
  border-radius: 2px;
  margin-right: 5px;
  border: 1px solid #ddd;
`;

const GameBoard: React.FC = () => {
  const {
    state,
    dispatch,
    canSelectPiece,
    getValidMovesForPiece,
    executeMoveWithCapture,
    currentPlayerHasValidMoves,
    getCurrentPlayerValidMoves,
    validateLudoMove,
    getHighlightedPositions,
    canRollDice,
    rollDiceForCurrentPlayer,
    canEndTurn,
    endTurn,
    isGameOver,
    getWinners,
    hasBonusThrows
  } = useGameLogic();

  const [selectedPiece, setSelectedPiece] = useState<GamePiece | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [showPieceSelector, setShowPieceSelector] = useState(false);

  // Handle piece selection
  const handlePieceClick = useCallback((piece: GamePiece) => {
    if (!canSelectPiece(piece)) return;

    setSelectedPiece(piece);
    const moves = getValidMovesForPiece(piece);
    setValidMoves(moves);
    setShowPieceSelector(false);
  }, [canSelectPiece, getValidMovesForPiece]);

  // Handle cell click for movement
  const handleCellClick = useCallback((position: Position) => {
    if (!selectedPiece) return;

    const validation = validateLudoMove(selectedPiece, position);
    if (!validation.isValid) return;

    // Execute the move
    executeMoveWithCapture(selectedPiece, position);
    
    // Clear selection
    setSelectedPiece(null);
    setValidMoves([]);
  }, [selectedPiece, validateLudoMove, executeMoveWithCapture]);

  // Handle piece selector
  const handlePieceSelect = useCallback((piece: GamePiece) => {
    handlePieceClick(piece);
  }, [handlePieceClick]);

  // Check if a position is a valid move
  const isValidMovePosition = useCallback((position: Position): boolean => {
    return validMoves.some(move => move.x === position.x && move.y === position.y);
  }, [validMoves]);

  // Check if a piece is selected
  const isPieceSelected = useCallback((piece: GamePiece): boolean => {
    return selectedPiece?.id === piece.id;
  }, [selectedPiece]);

  // Check if a piece can be moved
  const canPieceBeMoved = useCallback((piece: GamePiece): boolean => {
    return canSelectPiece(piece);
  }, [canSelectPiece]);

  // Get all pieces at a position
  const getPiecesAtPosition = useCallback((position: Position): GamePiece[] => {
    return state.players.flatMap(player => 
      player.pieces.filter(piece => 
        piece.position.x === position.x && piece.position.y === position.y
      )
    );
  }, [state.players]);

  // Check if position is a home area
  const isHomeArea = useCallback((position: Position): boolean => {
    return state.players.some(player => 
      player.pieces.some(piece => 
        piece.position.x === position.x && 
        piece.position.y === position.y && 
        piece.isInHome
      )
    );
  }, [state.players]);

  // Check if position is a safe zone
  const isSafeZone = useCallback((position: Position): boolean => {
    return SAFE_ZONES.some(zone => 
      position.x >= zone.x && position.x < zone.x + zone.width &&
      position.y >= zone.y && position.y < zone.y + zone.height
    );
  }, []);

  // Check if position is a regular spot
  const isRegularSpot = useCallback((position: Position): boolean => {
    return REGULAR_SPOTS.some(spot => 
      position.x >= spot.x && position.x < spot.x + spot.width &&
      position.y >= spot.y && position.y < spot.y + spot.height
    );
  }, []);

  // Check if position is in Moksha area
  const isMoksha = useCallback((position: Position): boolean => {
    return position.x >= MOKSHA_AREA.x && position.x < MOKSHA_AREA.x + MOKSHA_AREA.width &&
           position.y >= MOKSHA_AREA.y && position.y < MOKSHA_AREA.y + MOKSHA_AREA.height;
  }, []);

  // Check if position is in middle square path
  const isMiddleSquarePath = useCallback((position: Position): boolean => {
    return MIDDLE_SQUARE_PATHS.some(path => 
      position.x >= path.x && position.x < path.x + path.width &&
      position.y >= path.y && position.y < path.y + path.height
    );
  }, []);

  // Check if position is in inner square path
  const isInnerSquarePath = useCallback((position: Position): boolean => {
    return INNER_SQUARE_PATHS.some(path => 
      position.x >= path.x && position.x < path.x + path.width &&
      position.y >= path.y && position.y < path.y + path.height
    );
  }, []);

  // Get square number for a position
  const getSquare = useCallback((position: Position): 1 | 2 | 3 => {
    if (position.x >= 11 && position.x <= 22 && position.y >= 11 && position.y <= 22) {
      return 3; // Inner square
    } else if (position.x >= 7 && position.x <= 26 && position.y >= 7 && position.y <= 26) {
      return 2; // Middle square
    } else {
      return 1; // Outer square
    }
  }, []);

  // Get player color for a position
  const getPlayerColorForPosition = useCallback((position: Position): number | undefined => {
    for (const player of state.players) {
      const pieceAtPosition = player.pieces.find(piece => 
        piece.position.x === position.x && piece.position.y === position.y
      );
      if (pieceAtPosition) {
        return player.id;
      }
    }
    return undefined;
  }, [state.players]);

  // Render a cell
  const renderCell = useCallback((x: number, y: number) => {
    const position: Position = { x, y };
    const pieces = getPiecesAtPosition(position);
    const isHighlighted = isValidMovePosition(position);
    const playerId = getPlayerColorForPosition(position);
    const isHome = isHomeArea(position);
    const isSafe = isSafeZone(position);
    const isRegular = isRegularSpot(position);
    const isMokshaArea = isMoksha(position);
    const isMiddlePath = isMiddleSquarePath(position);
    const isInnerPath = isInnerSquarePath(position);
    const square = getSquare(position);

    return (
      <Cell
        key={`${x}-${y}`}
        isSafeZone={isSafe}
        isHomeArea={isHome}
        playerId={playerId}
        isHighlighted={isHighlighted}
        isRegularSpot={isRegular}
        isMoksha={isMokshaArea}
        isMiddleSquarePath={isMiddlePath}
        isInnerSquarePath={isInnerPath}
        square={square}
        onClick={() => handleCellClick(position)}
      >
        {pieces.map((piece) => (
          <Piece
            key={piece.id}
            color={PLAYER_COLORS[piece.playerId - 1]}
            isSelected={isPieceSelected(piece)}
            isMovable={canPieceBeMoved(piece)}
            onClick={(e) => {
              e.stopPropagation();
              handlePieceClick(piece);
            }}
          />
        ))}
        {isHighlighted && (
          <MoveIndicator
            position={position}
            isValid={true}
            isSelected={false}
            onClick={() => handleCellClick(position)}
          />
        )}
      </Cell>
    );
  }, [
    getPiecesAtPosition,
    isValidMovePosition,
    getPlayerColorForPosition,
    isHomeArea,
    isSafeZone,
    isRegularSpot,
    isMoksha,
    isMiddleSquarePath,
    isInnerSquarePath,
    getSquare,
    handleCellClick,
    isPieceSelected,
    canPieceBeMoved,
    handlePieceClick
  ]);

  // Get current player info
  const currentPlayer = state.players[state.currentPlayerIndex];
  const gameOver = isGameOver();
  const winners = getWinners();

  // Clear turn skipped flag after a delay when it's set
  React.useEffect(() => {
    if (state.turnSkipped) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CLEAR_TURN_SKIPPED' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.turnSkipped, dispatch]);

  // Get valid piece IDs for selector
  const validPieceIds = getCurrentPlayerValidMoves().map(item => item.piece.id);

  return (
    <BoardContainer>
      {state.turnSkipped && (
        <TurnSkippedNotification>
          ⚠️ Turn automatically skipped - no valid moves available
        </TurnSkippedNotification>
      )}
      <BoardTitle>🎲 Ludo Game Board</BoardTitle>
      
      <GameLayout>
        <BoardWrapper>
          <BoardGrid>
            {Array.from({ length: BOARD_SIZE }, (_, y) =>
              Array.from({ length: BOARD_SIZE }, (_, x) => renderCell(x + 1, y + 1))
            )}
          </BoardGrid>
          {/* <BoardLayout /> */}
          {/* <PathIndicators 
            indicators={[
              // Example path indicators for demonstration
              { type: 'turn-left', x: 5, y: 30, color: '#FF6B6B', strokeWidth: 5 },
              { type: 'straight-up', x: 5, y: 30, color: '#4ECDC4', strokeWidth: 4 },
              { type: 'straight-up', x: 4, y: 30, color: '#45B7D1', strokeWidth: 4 },
              { type: 'straight-up', x: 3, y: 30, color: '#96CEB4', strokeWidth: 4 },
              { type: 'turn-right', x: 15, y: 3, color: '#FF9800', strokeWidth: 5 },
              { type: 'straight-down', x: 15, y: 3, color: '#9C27B0', strokeWidth: 4 },
              { type: 'turn-left', x: 29, y: 15, color: '#E91E63', strokeWidth: 5 },
              { type: 'straight-up', x: 29, y: 15, color: '#3F51B5', strokeWidth: 4 },
              { type: 'turn-left', x: 15, y: 29, color: '#009688', strokeWidth: 5 },
              { type: 'straight-up', x: 15, y: 29, color: '#795548', strokeWidth: 4 },
              { type: 'turn-right', x: 3, y: 15, color: '#607D8B', strokeWidth: 5 },
              { type: 'straight-down', x: 3, y: 15, color: '#FF5722', strokeWidth: 4 }
            ]} 
            isVisible={true}
          /> */}
        </BoardWrapper>

        <GameInfo>
          <h3>Game Status</h3>
          <p>Current Player: {currentPlayer?.name || 'None'}</p>
          
          <div style={{ marginTop: '20px' }}>
            <h4>Players:</h4>
            {state.players.map((player, index) => (
              <div key={player.id} style={{
                padding: '10px',
                margin: '5px 0',
                borderRadius: '5px',
                background: index === state.currentPlayerIndex ? '#e3f2fd' : '#f5f5f5',
                borderLeft: `4px solid ${index === state.currentPlayerIndex ? '#2196f3' : '#ddd'}`
              }}>
                <strong>{player.name}</strong> - {player.pieces.filter(p => p.isInMoksha).length}/4 in Moksha
              </div>
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
      
      {/* <PathIndicatorDemo /> */}

      <GameBoardContainer>
        <GameInfoPanel>
          <GameStatus>
            {gameOver ? 'Game Over!' : `Player ${currentPlayer?.id}'s Turn`}
          </GameStatus>

          {!gameOver && (
            <>
              <TurnInfo>
                <PlayerIndicator color={PLAYER_COLORS[state.currentPlayerIndex]} />
                <span>Player {currentPlayer?.id}</span>
              </TurnInfo>

              <MovementControls>
                <ControlButton
                  onClick={rollDiceForCurrentPlayer}
                  disabled={!canRollDice()}
                  variant="primary"
                >
                  Roll Dice
                </ControlButton>

                {state.diceRolls.length > 0 && (
                  <>
                    <div>
                      Dice: {state.diceRolls.map(roll => roll.value).join(', ')}
                    </div>
                    
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                      {hasBonusThrows() ? 
                        'Bonus throw! Roll again!' :
                        currentPlayerHasValidMoves() ? 
                          'Valid moves available' : 
                          'No valid moves - turn automatically skipped'
                      }
                    </div>
                    
                    {currentPlayerHasValidMoves() && !hasBonusThrows() && (
                      <ControlButton
                        onClick={() => setShowPieceSelector(true)}
                        variant="secondary"
                      >
                        Select Piece
                      </ControlButton>
                    )}

                    {!hasBonusThrows() && (
                      <ControlButton
                        onClick={endTurn}
                        disabled={!canEndTurn()}
                        variant="danger"
                      >
                        End Turn
                      </ControlButton>
                    )}
                  </>
                )}
              </MovementControls>
            </>
          )}

          {gameOver && winners.length > 0 && (
            <div>
              <h3>Winner(s):</h3>
              {winners.map(player => (
                <div key={player.id}>Player {player.id}</div>
              ))}
            </div>
          )}
        </GameInfoPanel>

        {showPieceSelector && (
          <PieceSelector
            pieces={currentPlayer?.pieces || []}
            onPieceSelect={handlePieceSelect}
            selectedPieceId={selectedPiece?.id}
            validPieceIds={validPieceIds}
          />
        )}
      </GameBoardContainer>
    </BoardContainer>
  );
};

export default GameBoard; 