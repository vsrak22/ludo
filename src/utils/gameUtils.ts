// Game utility functions

import { Position, GamePiece, Player, DiceRoll } from '../types/game';
import { BOARD_SIZE, PLAYER_STARTING_POSITIONS, SAFE_ZONES, DICE_RULES, GAME_RULES, MOKSHA_POSITION, PLAYER_ENTRY_POSITIONS, SECOND_SQUARE_POSITIONS, THIRD_SQUARE_POSITIONS } from '../constants/gameConstants';

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
  // For now, allow any piece on board to be moved for testing
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
  // Add some entropy by using current time and multiple random calls
  const entropy = Date.now() % 1000;
  const random1 = Math.random();
  const random2 = Math.random();
  const combined = (random1 + random2 + entropy) % 1;
  return Math.floor(combined * 6) + 1;
};

/**
 * Roll Indian dice (two 4-sided dice with blank faces)
 */
export const rollIndianDice = (): number => {
  // Add some entropy by using current time and multiple random calls
  const entropy = Date.now() % 1000;
  const random1 = Math.random();
  const random2 = Math.random();
  const random3 = Math.random();
  const random4 = Math.random();
  
  const combined1 = (random1 + random2 + entropy) % 1;
  const combined2 = (random3 + random4 + entropy + 1) % 1;
  
  const dice1 = Math.floor(combined1 * 4) + 1;
  const dice2 = Math.floor(combined2 * 4) + 1;
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
  // Can continue rolling only if the most recent roll was a bonus roll
  if (diceRolls.length === 0) return false;
  const lastRoll = diceRolls[diceRolls.length - 1];
  return lastRoll.isBonus;
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

// ===== PHASE 4: MOVEMENT RULES IMPLEMENTATION =====

/**
 * Get the entry position for a player's piece
 */
export const getEntryPosition = (playerId: number, pieceIndex: number): Position => {
  const entryPositions = PLAYER_ENTRY_POSITIONS[playerId as keyof typeof PLAYER_ENTRY_POSITIONS];
  return entryPositions[pieceIndex] || entryPositions[0];
};

/**
 * Calculate the path from current position to target position
 */
export const calculatePath = (from: Position, to: Position, playerId: number): Position[] => {
  const path: Position[] = [];
  
  // If moving from home to entry position
  if (isHomeArea(from, playerId)) {
    const entryPos = getEntryPosition(playerId, 0);
    path.push(entryPos);
    return path;
  }
  
  // If moving to Moksha
  if (to.x === MOKSHA_POSITION.x && to.y === MOKSHA_POSITION.y) {
    // This function needs the piece's current square, so we'll need to pass it from the calling function
    // For now, assume square 1 (outer square)
    return calculatePathToMoksha(from, playerId, 1);
  }
  
  // Regular path calculation (simplified for now)
  // This will be enhanced with proper path following rules
  const currentX = from.x;
  const currentY = from.y;
  const targetX = to.x;
  const targetY = to.y;
  
  // Simple linear path (will be replaced with proper Ludo path)
  const steps = Math.max(Math.abs(targetX - currentX), Math.abs(targetY - currentY));
  
  for (let i = 1; i <= steps; i++) {
    const progress = i / steps;
    const x = Math.round(currentX + (targetX - currentX) * progress);
    const y = Math.round(currentY + (targetY - currentY) * progress);
    path.push({ x, y });
  }
  
  return path;
};

/**
 * Calculate path to Moksha for a piece
 */
export const calculatePathToMoksha = (from: Position, playerId: number, currentSquare: 1 | 2 | 3): Position[] => {
  const path: Position[] = [];
  
  // Get the appropriate square positions based on current square
  let squarePositions;
  if (currentSquare === 1) {
    squarePositions = SECOND_SQUARE_POSITIONS[playerId as keyof typeof SECOND_SQUARE_POSITIONS];
  } else if (currentSquare === 2) {
    squarePositions = THIRD_SQUARE_POSITIONS[playerId as keyof typeof THIRD_SQUARE_POSITIONS];
  } else {
    // Already in inner square, move to Moksha
    path.push(MOKSHA_POSITION);
    return path;
  }
  
  // Add path to next square
  const nextSquarePos = squarePositions.start[0];
  path.push(nextSquarePos);
  
  // If moving to inner square, add path to Moksha
  if (currentSquare === 2) {
    path.push(MOKSHA_POSITION);
  }
  
  return path;
};

/**
 * Check if a move is valid according to Ludo rules
 */
export const isValidLudoMove = (
  piece: GamePiece, 
  targetPosition: Position, 
  diceValue: number, 
  players: Player[]
): { isValid: boolean; reason?: string } => {
  
  // Check if piece can be moved with this dice value
  if (!canMovePiece(piece, diceValue)) {
    return { isValid: false, reason: 'Piece cannot be moved with this dice value' };
  }
  
  // Check if target position is valid
  if (!isValidPosition(targetPosition)) {
    return { isValid: false, reason: 'Target position is outside board' };
  }
  
  // Check if target position is occupied by own piece (unless safe zone)
  const piecesAtTarget = getPiecesAtPosition(targetPosition, players);
  const ownPieceAtTarget = piecesAtTarget.find(p => p.playerId === piece.playerId);
  if (ownPieceAtTarget && !isSafeZone(targetPosition)) {
    return { isValid: false, reason: 'Target position occupied by own piece' };
  }
  
  // Check if position can accommodate more pieces
  if (!canMultiplePiecesOccupy(targetPosition) && piecesAtTarget.length >= getMaxPiecesAtPosition(targetPosition)) {
    return { isValid: false, reason: 'Target position is full' };
  }
  
  // Check if move distance matches dice value (simplified for now)
  const distance = calculateDistance(piece.position, targetPosition);
  if (distance !== diceValue) {
    return { isValid: false, reason: 'Move does not match dice value' };
  }
  
  return { isValid: true };
};

/**
 * Get all valid moves for a piece
 */
export const getValidMoves = (piece: GamePiece, diceValue: number, players: Player[]): Position[] => {
  const validMoves: Position[] = [];
  
  // If piece is in home, check if it can enter
  if (piece.isInHome) {
    if (canEnterGame(piece, diceValue, isFirstPieceToEnter(piece))) {
      const entryPos = getEntryPosition(piece.playerId, 0);
      validMoves.push(entryPos);
    }
    return validMoves;
  }
  
  // If piece is on board, calculate possible moves
  const currentPos = piece.position;
  
  // For now, allow movement to any valid position within dice value distance
  // This is a simplified approach - in a full implementation, we'd follow the exact Ludo path
  for (let dx = -diceValue; dx <= diceValue; dx++) {
    for (let dy = -diceValue; dy <= diceValue; dy++) {
      // Use Manhattan distance (L1 norm) for movement
      if (Math.abs(dx) + Math.abs(dy) === diceValue) {
        const targetPos = {
          x: currentPos.x + dx,
          y: currentPos.y + dy
        };
        
        // Basic validation - position must be on board and not occupied by own piece
        if (isValidPosition(targetPos)) {
          const piecesAtTarget = getPiecesAtPosition(targetPos, players);
          const ownPieceAtTarget = piecesAtTarget.find(p => p.playerId === piece.playerId);
          
          // Allow move if no own piece at target (or if it's a safe zone)
          if (!ownPieceAtTarget || isSafeZone(targetPos)) {
            validMoves.push(targetPos);
          }
        }
      }
    }
  }
  
  return validMoves;
};

/**
 * Check if a piece can enter Moksha
 */
export const canEnterMoksha = (piece: GamePiece, diceValue: number): boolean => {
  if (piece.isInMoksha) return false;
  
  // Calculate distance to Moksha
  const distanceToMoksha = calculateDistance(piece.position, MOKSHA_POSITION);
  
  // Must have exact dice value to enter Moksha
  if (GAME_RULES.exactMokshaEntry) {
    return distanceToMoksha === diceValue;
  }
  
  return distanceToMoksha <= diceValue;
};

/**
 * Execute a move and handle captures
 */
export const executeMove = (
  piece: GamePiece, 
  targetPosition: Position, 
  players: Player[]
): { updatedPiece: GamePiece; capturedPieces: GamePiece[] } => {
  
  const capturedPieces: GamePiece[] = [];
  
  // Check for captures
  const piecesAtTarget = getPiecesAtPosition(targetPosition, players);
  piecesAtTarget.forEach(targetPiece => {
    if (canCapturePiece(piece, targetPiece, targetPosition)) {
      const homePos = getHomePosition(targetPiece);
      const capturedPiece = capturePiece(targetPiece, homePos);
      capturedPieces.push(capturedPiece);
    }
  });
  
  // Move the piece
  let updatedPiece = movePiece(piece, targetPosition);
  
  // Check if piece reached Moksha
  if (targetPosition.x === MOKSHA_POSITION.x && targetPosition.y === MOKSHA_POSITION.y) {
    updatedPiece = moveToMoksha(updatedPiece, targetPosition);
  }
  
  return { updatedPiece, capturedPieces };
};

/**
 * Check if a player has any valid moves
 */
export const hasValidMoves = (player: Player, diceValue: number, players: Player[]): boolean => {
  return player.pieces.some(piece => {
    const validMoves = getValidMoves(piece, diceValue, players);
    return validMoves.length > 0;
  });
};

/**
 * Get all valid moves for a player
 */
export const getAllValidMoves = (player: Player, diceValue: number, players: Player[]): { piece: GamePiece; moves: Position[] }[] => {
  return player.pieces
    .map(piece => ({
      piece,
      moves: getValidMoves(piece, diceValue, players)
    }))
    .filter(item => item.moves.length > 0);
}; 