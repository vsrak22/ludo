// Game Types for Ludo Game

export interface Position {
  x: number;
  y: number;
}

export interface GamePiece {
  id: string;
  playerId: number;
  position: Position;
  isInHome: boolean;
  isInMoksha: boolean;
  currentSquare: 1 | 2 | 3; // 1 = outer square, 2 = middle square, 3 = inner square
  track: number; // Which track the piece is on (for dual-track squares)
}

export interface Player {
  id: number;
  name: string;
  color: string;
  pieces: GamePiece[];
  isActive: boolean;
  hasWon: boolean;
  currentTurn: boolean;
}

export interface DiceRoll {
  value: number;
  isBonus: boolean;
  diceType: 'standard' | 'indian';
}

export interface MoveValidation {
  isValid: boolean;
  reason?: string;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  diceRolls: DiceRoll[];
  gamePhase: 'setup' | 'playing' | 'finished';
  selectedPiece: GamePiece | null;
  gameMode: '2player' | '3player' | '4player';
  diceType: 'standard' | 'indian';
  // Phase 4 additions
  lastRoll: DiceRoll | null;
  gameOver: boolean;
  lastMoveValidation: MoveValidation | null;
  highlightedPositions: Position[];
  turnSkipped: boolean;
}

export interface BoardPosition {
  position: Position;
  type: 'regular' | 'safe' | 'home' | 'moksha';
  playerId?: number; // For home areas and safe zones
  square: 1 | 2 | 3; // Which square this position belongs to
}

export interface Move {
  piece: GamePiece;
  from: Position;
  to: Position;
  isCapture: boolean;
  capturedPiece?: GamePiece;
}

export type GameAction = 
  | { type: 'ROLL_DICE'; playerId: number }
  | { type: 'SELECT_PIECE'; piece: GamePiece }
  | { type: 'MOVE_PIECE'; move: Move }
  | { type: 'END_TURN' }
  | { type: 'START_GAME'; gameMode: GameState['gameMode']; diceType: GameState['diceType'] }
  | { type: 'RESET_GAME' }
  // Phase 4 additions
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SET_DICE_TYPE'; diceType: 'standard' | 'indian' }
  | { type: 'VALIDATE_MOVE'; piece: GamePiece; targetPosition: Position }
  | { type: 'EXECUTE_MOVE_WITH_CAPTURE'; piece: GamePiece; targetPosition: Position }
  | { type: 'HIGHLIGHT_VALID_MOVES'; pieceId: string }
  | { type: 'CLEAR_HIGHLIGHTS' }
  | { type: 'CHECK_GAME_OVER' }
  | { type: 'AUTO_END_TURN' }
  | { type: 'CLEAR_TURN_SKIPPED' }; 