// Game utility functions

import { Position, GamePiece, Player } from '../types/game';
import { BOARD_SIZE, PLAYER_STARTING_POSITIONS, SAFE_ZONES } from '../constants/gameConstants';

/**
 * Check if a position is within the board boundaries
 */
export const isValidPosition = (position: Position): boolean => {
  return position.x >= 1 && position.x <= BOARD_SIZE && 
         position.y >= 1 && position.y <= BOARD_SIZE;
};

/**
 * Check if a position is a safe zone
 */
export const isSafeZone = (position: Position): boolean => {
  return SAFE_ZONES.some(zone => 
    position.x >= zone.x && position.x < zone.x + zone.width &&
    position.y >= zone.y && position.y < zone.y + zone.height
  );
};

/**
 * Check if a position is a player's home area
 */
export const isHomeArea = (position: Position, playerId: number): boolean => {
  const homePositions = PLAYER_STARTING_POSITIONS[playerId as keyof typeof PLAYER_STARTING_POSITIONS];
  return homePositions.some(homePos => 
    homePos.x === position.x && homePos.y === position.y
  );
};

/**
 * Get all pieces at a specific position
 */
export const getPiecesAtPosition = (position: Position, players: Player[]): GamePiece[] => {
  return players.flatMap(player => 
    player.pieces.filter(piece => 
      piece.position.x === position.x && piece.position.y === position.y
    )
  );
};

/**
 * Check if a piece can be captured (not in safe zone and not in home)
 */
export const canBeCaptured = (piece: GamePiece, position: Position): boolean => {
  return !isSafeZone(position) && !isHomeArea(position, piece.playerId);
};

/**
 * Calculate distance between two positions
 */
export const calculateDistance = (pos1: Position, pos2: Position): number => {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
};

/**
 * Check if two positions are adjacent
 */
export const areAdjacent = (pos1: Position, pos2: Position): boolean => {
  return calculateDistance(pos1, pos2) === 1;
};

/**
 * Get the next player index
 */
export const getNextPlayerIndex = (currentIndex: number, totalPlayers: number): number => {
  return (currentIndex + 1) % totalPlayers;
};

/**
 * Check if a player has won (all pieces in Moksha)
 */
export const hasPlayerWon = (player: Player): boolean => {
  return player.pieces.every(piece => piece.isInMoksha);
};

/**
 * Get the number of pieces a player has in Moksha
 */
export const getPiecesInMoksha = (player: Player): number => {
  return player.pieces.filter(piece => piece.isInMoksha).length;
};

/**
 * Check if a piece can enter the game (has valid entry value)
 */
export const canEnterGame = (piece: GamePiece, diceValue: number, isFirstPiece: boolean): boolean => {
  if (isFirstPiece) {
    return diceValue === 1;
  }
  return diceValue === 1 || diceValue === 5;
};

/**
 * Generate a unique ID for game elements
 */
export const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}; 