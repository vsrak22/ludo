import React from 'react';
import { Player } from '../types/game';
import { getPlayerStats, hasPlayerWon } from '../utils/gameUtils';
import './PlayerInfo.css';

interface PlayerInfoProps {
  player: Player;
  isCurrentPlayer?: boolean;
  showDetails?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const PlayerInfo: React.FC<PlayerInfoProps> = ({ 
  player, 
  isCurrentPlayer = false, 
  showDetails = true,
  size = 'medium'
}) => {
  const stats = getPlayerStats(player);

  if (!stats) return null;

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'player-info-small';
      case 'large': return 'player-info-large';
      default: return 'player-info-medium';
    }
  };

  const getStatusClass = () => {
    if (hasPlayerWon(player)) return 'player-won';
    if (!player.isActive) return 'player-inactive';
    if (isCurrentPlayer) return 'player-current';
    return 'player-waiting';
  };

  const getStatusText = () => {
    if (hasPlayerWon(player)) return 'Winner!';
    if (!player.isActive) return 'Inactive';
    if (isCurrentPlayer) return 'Your Turn';
    return 'Waiting';
  };

  const getStatusIcon = () => {
    if (hasPlayerWon(player)) return '🏆';
    if (!player.isActive) return '⏸️';
    if (isCurrentPlayer) return '▶️';
    return '⏳';
  };

  return (
    <div className={`player-info ${getSizeClass()} ${getStatusClass()}`}>
      <div className="player-header">
        <div className="player-avatar" style={{ backgroundColor: player.color }}>
          <span className="player-initial">{player.name.charAt(0)}</span>
        </div>
        <div className="player-details">
          <h3 className="player-name">{player.name}</h3>
          <div className="player-status">
            <span className="status-icon">{getStatusIcon()}</span>
            <span className="status-text">{getStatusText()}</span>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="player-stats">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Home</div>
              <div className="stat-value home-pieces">{stats.piecesInHome}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Board</div>
              <div className="stat-value board-pieces">{stats.piecesOnBoard}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Moksha</div>
              <div className="stat-value moksha-pieces">{stats.piecesInMoksha}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Total</div>
              <div className="stat-value total-pieces">{stats.totalPieces}</div>
            </div>
          </div>

          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${(stats.piecesInMoksha / stats.totalPieces) * 100}%`,
                backgroundColor: player.color
              }}
            />
          </div>

          <div className="progress-text">
            {stats.piecesInMoksha} of {stats.totalPieces} pieces in Moksha
          </div>
        </div>
      )}

      {isCurrentPlayer && (
        <div className="current-player-indicator">
          <div className="pulse-dot" style={{ backgroundColor: player.color }} />
          <span>Your Turn</span>
        </div>
      )}

      {hasPlayerWon(player) && (
        <div className="winner-indicator">
          <span className="winner-icon">🏆</span>
          <span className="winner-text">Winner!</span>
        </div>
      )}
    </div>
  );
};

export default PlayerInfo; 