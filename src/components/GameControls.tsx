import React from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { Dice } from './Dice';
import { PlayerInfo } from './PlayerInfo';
import { DiceRoll } from '../types/game';
import './GameControls.css';

interface GameControlsProps {
  showPlayerInfo?: boolean;
  showDiceHistory?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const GameControls: React.FC<GameControlsProps> = ({
  showPlayerInfo = true,
  showDiceHistory = true,
  size = 'medium'
}) => {
  const {
    state,
    getCurrentPlayer,
    getCurrentPlayerStats,
    getAllPlayerStats,
    currentPlayerHasMovablePieces,
    getCurrentPlayerMovablePieces,
    canRollDice,
    canEndTurn,
    endTurn,
    hasBonusThrows,
    getTotalDiceValueForTurn,
    isGameOver,
    getWinners,
    isValidCurrentPlayerTurn
  } = useGameLogic();

  const currentPlayer = getCurrentPlayer();
  const movablePieces = getCurrentPlayerMovablePieces();
  const totalDiceValue = getTotalDiceValueForTurn();
  const gameOver = isGameOver();
  const winners = getWinners();

  const handleDiceRoll = (diceRoll: DiceRoll) => {
    console.log('Dice rolled:', diceRoll);
  };

  const handleEndTurn = () => {
    if (canEndTurn()) {
      endTurn();
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'game-controls-small';
      case 'large': return 'game-controls-large';
      default: return 'game-controls-medium';
    }
  };

  if (gameOver) {
    return (
      <div className={`game-controls ${getSizeClass()} game-over`}>
        <div className="game-over-content">
          <h2 className="game-over-title">🎉 Game Over! 🎉</h2>
          <div className="winners-section">
            <h3>Winners:</h3>
            {winners.map(winner => (
              <div key={winner.id} className="winner-item">
                <PlayerInfo 
                  player={winner} 
                  size="small" 
                  showDetails={false}
                />
              </div>
            ))}
          </div>
          <button 
            className="new-game-button"
            onClick={() => window.location.reload()}
          >
            Start New Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`game-controls ${getSizeClass()}`}>
      {/* Current Player Info */}
      {showPlayerInfo && currentPlayer && (
        <div className="current-player-section">
          <h3 className="section-title">Current Player</h3>
          <PlayerInfo 
            player={currentPlayer} 
            isCurrentPlayer={true}
            size={size}
          />
        </div>
      )}

      {/* Game Status */}
      <div className="game-status-section">
        <div className="status-indicators">
          <div className={`status-indicator ${isValidCurrentPlayerTurn() ? 'active' : 'inactive'}`}>
            <span className="status-icon">▶️</span>
            <span className="status-text">
              {isValidCurrentPlayerTurn() ? 'Your Turn' : 'Waiting'}
            </span>
          </div>
          
          {hasBonusThrows() && (
            <div className="status-indicator bonus">
              <span className="status-icon">✨</span>
              <span className="status-text">Bonus Throw Available!</span>
            </div>
          )}
        </div>

        {totalDiceValue > 0 && (
          <div className="dice-summary">
            <span className="dice-summary-label">Total Dice Value:</span>
            <span className="dice-summary-value">{totalDiceValue}</span>
          </div>
        )}
      </div>

      {/* Dice Component */}
      <div className="dice-section">
        <Dice 
          onRoll={handleDiceRoll}
          disabled={!canRollDice()}
          diceType={state.diceType}
          size={size}
        />
      </div>

      {/* Movable Pieces Info */}
      {movablePieces.length > 0 && (
        <div className="movable-pieces-section">
          <h4 className="section-subtitle">
            Movable Pieces ({movablePieces.length})
          </h4>
          <div className="pieces-grid">
            {movablePieces.map(piece => (
              <div 
                key={piece.id} 
                className="piece-indicator"
                style={{ backgroundColor: currentPlayer?.color }}
              >
                <span className="piece-id">{piece.id.split('-').pop()}</span>
                <span className="piece-status">
                  {piece.isInHome ? 'Home' : 'Board'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Turn Controls */}
      <div className="turn-controls">
        {canEndTurn() && (
          <button 
            className="end-turn-button"
            onClick={handleEndTurn}
          >
            End Turn
          </button>
        )}
        
        {!currentPlayerHasMovablePieces() && totalDiceValue > 0 && (
          <div className="no-moves-message">
            No valid moves available. Turn will be skipped.
          </div>
        )}
      </div>

      {/* All Players Overview */}
      {showPlayerInfo && (
        <div className="all-players-section">
          <h3 className="section-title">All Players</h3>
          <div className="players-grid">
            {state.players.map(player => (
              <div key={player.id} className="player-item">
                <PlayerInfo 
                  player={player} 
                  isCurrentPlayer={player.id === currentPlayer?.id}
                  size="small"
                  showDetails={true}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Game Info */}
      <div className="game-info-section">
        <div className="info-item">
          <span className="info-label">Game Mode:</span>
          <span className="info-value">{state.gameMode}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Dice Type:</span>
          <span className="info-value">{state.diceType}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Phase:</span>
          <span className="info-value">{state.gamePhase}</span>
        </div>
      </div>
    </div>
  );
};

export default GameControls; 