import React from 'react';
import styled from 'styled-components';
import { useGame } from '../store/GameContext';
import { BOARD_SIZE, PLAYER_COLORS } from '../constants/gameConstants';

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
`;

const BoardTitle = styled.h1`
  color: #333;
  margin-bottom: 20px;
  font-size: 2rem;
`;

const BoardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${BOARD_SIZE}, 1fr);
  grid-template-rows: repeat(${BOARD_SIZE}, 1fr);
  gap: 1px;
  background: #333;
  border: 4px solid #2c3e50;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  width: 800px;
  height: 800px;
  aspect-ratio: 1;
`;

const Cell = styled.div<{ isHome: boolean; playerId?: number }>`
  width: 100%;
  height: 100%;
  background: ${props => {
    if (props.isHome && props.playerId) {
      return PLAYER_COLORS[props.playerId - 1];
    }
    return '#fff';
  }};
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  color: #666;
  position: relative;
  aspect-ratio: 1;
  transition: all 0.1s ease;

  &:hover {
    background: ${props => {
      if (props.isHome && props.playerId) {
        return `${PLAYER_COLORS[props.playerId - 1]}dd`;
      }
      return '#f8f9fa';
    }};
  }
`;

const Piece = styled.div<{ color: string; isSelected: boolean }>`
  width: 70%;
  height: 70%;
  background: ${props => props.color};
  border-radius: 50%;
  border: 2px solid ${props => props.isSelected ? '#333' : 'transparent'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  }
`;

const GameInfo = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  min-width: 300px;
`;

const PlayerInfo = styled.div<{ isCurrentTurn: boolean }>`
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  background: ${props => props.isCurrentTurn ? '#e3f2fd' : '#f5f5f5'};
  border-left: 4px solid ${props => props.isCurrentTurn ? '#2196f3' : '#ddd'};
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

  const renderCell = (x: number, y: number) => {
    const isHome = (x >= 16 && x <= 17 && y >= 1 && y <= 2) || // Player 1
                   (x >= 1 && x <= 2 && y >= 16 && y <= 17) || // Player 2
                   (x >= 16 && x <= 17 && y >= 31 && y <= 32) || // Player 3
                   (x >= 31 && x <= 32 && y >= 16 && y <= 17); // Player 4

    let playerId: number | undefined;
    if (x >= 16 && x <= 17 && y >= 1 && y <= 2) playerId = 1;
    else if (x >= 1 && x <= 2 && y >= 16 && y <= 17) playerId = 2;
    else if (x >= 16 && x <= 17 && y >= 31 && y <= 32) playerId = 3;
    else if (x >= 31 && x <= 32 && y >= 16 && y <= 17) playerId = 4;

    const piece = state.players
      .flatMap(player => player.pieces)
      .find(p => p.position.x === x && p.position.y === y);

    return (
      <Cell key={`${x}-${y}`} isHome={isHome} playerId={playerId}>
        {piece && (
          <Piece
            color={state.players[piece.playerId - 1]?.color || '#ccc'}
            isSelected={state.selectedPiece?.id === piece.id}
            onClick={() => handlePieceClick(piece)}
          />
        )}
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
      
      <BoardGrid>
        {cells}
      </BoardGrid>

      <GameInfo>
        <h3>Game Status</h3>
        <p>Current Player: {state.players[state.currentPlayerIndex]?.name || 'None'}</p>
        <p>Dice Rolls: {state.diceRolls.map(roll => roll.value).join(', ') || 'None'}</p>
        
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleRollDice} style={{ marginRight: '10px', padding: '10px 20px' }}>
            Roll Dice
          </button>
          <button onClick={handleEndTurn} style={{ padding: '10px 20px' }}>
            End Turn
          </button>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h4>Players:</h4>
          {state.players.map((player, index) => (
            <PlayerInfo key={player.id} isCurrentTurn={index === state.currentPlayerIndex}>
              <strong>{player.name}</strong> - {player.pieces.filter(p => p.isInMoksha).length}/4 in Moksha
            </PlayerInfo>
          ))}
        </div>
      </GameInfo>
    </BoardContainer>
  );
};

export default GameBoard; 