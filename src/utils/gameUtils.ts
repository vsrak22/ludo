// Game utility functions

import { Position, GamePiece, Player, DiceRoll } from '../types/game';
import { BOARD_SIZE, PLAYER_STARTING_POSITIONS, SAFE_ZONES, DICE_RULES, GAME_RULES } from '../constants/gameConstants';

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
    return diceValue === GAME_RULES.firstEntryValue;
  }
  return GAME_RULES.entryValues.includes(diceValue);
};

/**
 * Generate a unique ID for game elements
 */
export const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ===== PHASE 3: PLAYER MANAGEMENT FUNCTIONS =====

/**
 * Check if a player is active and can play
 */
export const isPlayerActive = (player: Player): boolean => {
  return player.isActive && !player.hasWon;
};

/**
 * Check if a player has any movable pieces
 */
export const hasMovablePieces = (player: Player, diceValue: number): boolean => {
  return player.pieces.some(piece => canMovePiece(piece, diceValue));
};

/**
 * Get all pieces that can be moved by a player
 */
export const getMovablePieces = (player: Player, diceValue: number): GamePiece[] => {
  return player.pieces.filter(piece => canMovePiece(piece, diceValue));
};

/**
 * Check if a piece can be moved with the given dice value
 */
export const canMovePiece = (piece: GamePiece, diceValue: number): boolean => {
  // Piece in Moksha cannot be moved
  if (piece.isInMoksha) return false;
  
  // Piece in home can only be moved if dice value allows entry
  if (piece.isInHome) {
    return canEnterGame(piece, diceValue, isFirstPieceToEnter(piece));
  }
  
  // Piece on board can always be moved (movement validation will be done separately)
  return true;
};

/**
 * Check if this is the first piece to enter the game for a player
 */
export const isFirstPieceToEnter = (piece: GamePiece): boolean => {
  // This would need to be implemented with game state context
  // For now, we'll assume it's the first piece if it's in home
  return piece.isInHome;
};

/**
 * Get player statistics
 */
export const getPlayerStats = (player: Player) => {
  const piecesInHome = player.pieces.filter(p => p.isInHome).length;
  const piecesInMoksha = getPiecesInMoksha(player);
  const piecesOnBoard = player.pieces.filter(p => !p.isInHome && !p.isInMoksha).length;
  
  return {
    piecesInHome,
    piecesInMoksha,
    piecesOnBoard,
    totalPieces: player.pieces.length,
    hasWon: hasPlayerWon(player),
    isActive: isPlayerActive(player)
  };
};

/**
 * Validate player turn
 */
export const isValidPlayerTurn = (player: Player, currentPlayerIndex: number, players: Player[]): boolean => {
  return player.id === currentPlayerIndex + 1 && player.currentTurn && isPlayerActive(player);
};

// ===== PHASE 3: PIECE MANAGEMENT FUNCTIONS =====

/**
 * Move a piece to a new position
 */
export const movePiece = (piece: GamePiece, newPosition: Position): GamePiece => {
  return {
    ...piece,
    position: newPosition,
    isInHome: false
  };
};

/**
 * Capture a piece (return to home)
 */
export const capturePiece = (piece: GamePiece, homePosition: Position): GamePiece => {
  return {
    ...piece,
    position: homePosition,
    isInHome: true,
    isInMoksha: false,
    currentSquare: 1,
    track: 1
  };
};

/**
 * Move piece to Moksha
 */
export const moveToMoksha = (piece: GamePiece, mokshaPosition: Position): GamePiece => {
  return {
    ...piece,
    position: mokshaPosition,
    isInHome: false,
    isInMoksha: true,
    currentSquare: 3
  };
};

/**
 * Check if a piece can be captured by another piece
 */
export const canCapturePiece = (attackingPiece: GamePiece, targetPiece: GamePiece, targetPosition: Position): boolean => {
  // Can't capture own pieces
  if (attackingPiece.playerId === targetPiece.playerId) return false;
  
  // Can't capture pieces in safe zones
  if (isSafeZone(targetPosition)) return false;
  
  // Can't capture pieces in home areas
  if (isHomeArea(targetPosition, targetPiece.playerId)) return false;
  
  // Can't capture pieces in Moksha
  if (targetPiece.isInMoksha) return false;
  
  return true;
};

/**
 * Get the home position for a piece
 */
export const getHomePosition = (piece: GamePiece): Position => {
  const homePositions = PLAYER_STARTING_POSITIONS[piece.playerId as keyof typeof PLAYER_STARTING_POSITIONS];
  const pieceIndex = piece.id.split('-').pop();
  const index = parseInt(pieceIndex || '1') - 1;
  return homePositions[index] || homePositions[0];
};

/**
 * Check if multiple pieces can occupy the same position
 */
export const canMultiplePiecesOccupy = (position: Position): boolean => {
  return isSafeZone(position);
};

/**
 * Get the maximum number of pieces that can occupy a position
 */
export const getMaxPiecesAtPosition = (position: Position): number => {
  if (isSafeZone(position)) {
    return 4; // Safe zones can hold multiple pieces
  }
  return 1; // Regular positions can only hold one piece
};

// ===== PHASE 3: DICE SYSTEM FUNCTIONS =====

/**
 * Roll a standard 6-sided dice
 */
export const rollStandardDice = (): number => {
  return Math.floor(Math.random() * 6) + 1;
};

/**
 * Roll Indian dice (two 4-sided dice with blank faces)
 */
export const rollIndianDice = (): number => {
  const dice1 = Math.floor(Math.random() * 4) + 1;
  const dice2 = Math.floor(Math.random() * 4) + 1;
  return dice1 + dice2;
};

/**
 * Check if a dice roll is a bonus roll
 */
export const isBonusRoll = (diceValue: number, diceType: 'standard' | 'indian'): boolean => {
  const rules = DICE_RULES[diceType];
  return rules.bonusValues.includes(diceValue);
};

/**
 * Create a dice roll object
 */
export const createDiceRoll = (value: number, diceType: 'standard' | 'indian'): DiceRoll => {
  return {
    value,
    isBonus: isBonusRoll(value, diceType),
    diceType
  };
};

/**
 * Roll dice based on type
 */
export const rollDice = (diceType: 'standard' | 'indian'): DiceRoll => {
  const value = diceType === 'standard' ? rollStandardDice() : rollIndianDice();
  return createDiceRoll(value, diceType);
};

/**
 * Get the maximum possible dice value
 */
export const getMaxDiceValue = (diceType: 'standard' | 'indian'): number => {
  return DICE_RULES[diceType].maxValue;
};

/**
 * Check if a player can continue rolling (has bonus throws)
 */
export const canContinueRolling = (diceRolls: DiceRoll[]): boolean => {
  return diceRolls.some(roll => roll.isBonus);
};

/**
 * Get the total dice value from multiple rolls
 */
export const getTotalDiceValue = (diceRolls: DiceRoll[]): number => {
  return diceRolls.reduce((sum, roll) => sum + roll.value, 0);
};

/**
 * Check if a dice value is valid for the given dice type
 */
export const isValidDiceValue = (value: number, diceType: 'standard' | 'indian'): boolean => {
  const maxValue = getMaxDiceValue(diceType);
  return value >= 1 && value <= maxValue;
}; 