import { useCallback } from 'react';
import { useGame } from '../store/GameContext';
import { GamePiece, Position, Move } from '../types/game';
import { 
  isValidPosition, 
  isSafeZone, 
  getPiecesAtPosition, 
  canBeCaptured,
  canEnterGame,
  hasPlayerWon,
  getPiecesInMoksha
} from '../utils/gameUtils';
import { DICE_RULES, GAME_RULES } from '../constants/gameConstants';

export const useGameLogic = () => {
  const { state, dispatch } = useGame();

  /**
   * Check if a piece can be moved by the current player
   */
  const canMovePiece = useCallback((piece: GamePiece): boolean => {
    const currentPlayer = state.players[state.currentPlayerIndex];
    return piece.playerId === currentPlayer?.id && currentPlayer?.currentTurn;
  }, [state.players, state.currentPlayerIndex]);

  /**
   * Check if a piece can be selected
   */
  const canSelectPiece = useCallback((piece: GamePiece): boolean => {
    if (!canMovePiece(piece)) return false;
    
    // If no dice have been rolled, can't select pieces
    if (state.diceRolls.length === 0) return false;
    
    return true;
  }, [canMovePiece, state.diceRolls.length]);

  /**
   * Check if a move is valid
   */
  const isValidMove = useCallback((piece: GamePiece, targetPosition: Position): boolean => {
    if (!isValidPosition(targetPosition)) return false;
    
    // Check if target position is occupied by own piece
    const piecesAtTarget = getPiecesAtPosition(targetPosition, state.players);
    const ownPieceAtTarget = piecesAtTarget.find(p => p.playerId === piece.playerId);
    if (ownPieceAtTarget && !isSafeZone(targetPosition)) return false;
    
    return true;
  }, [state.players]);

  /**
   * Calculate possible moves for a piece
   */
  const getPossibleMoves = useCallback((piece: GamePiece): Position[] => {
    const moves: Position[] = [];
    const totalDiceValue = state.diceRolls.reduce((sum, roll) => sum + roll.value, 0);
    
    // This is a simplified version - will be enhanced in Phase 4
    // For now, just return empty array
    return moves;
  }, [state.diceRolls]);

  /**
   * Execute a move
   */
  const executeMove = useCallback((move: Move) => {
    dispatch({ type: 'MOVE_PIECE', move });
  }, [dispatch]);

  /**
   * Check if the current player can roll dice
   */
  const canRollDice = useCallback((): boolean => {
    const currentPlayer = state.players[state.currentPlayerIndex];
    return currentPlayer?.currentTurn && state.diceRolls.length === 0;
  }, [state.players, state.currentPlayerIndex, state.diceRolls.length]);

  /**
   * Roll the dice
   */
  const rollDice = useCallback(() => {
    if (!canRollDice()) return;
    
    dispatch({ type: 'ROLL_DICE', playerId: state.currentPlayerIndex + 1 });
  }, [canRollDice, dispatch, state.currentPlayerIndex]);

  /**
   * Check if the current player can end their turn
   */
  const canEndTurn = useCallback((): boolean => {
    const currentPlayer = state.players[state.currentPlayerIndex];
    return currentPlayer?.currentTurn && state.diceRolls.length > 0;
  }, [state.players, state.currentPlayerIndex, state.diceRolls.length]);

  /**
   * End the current player's turn
   */
  const endTurn = useCallback(() => {
    if (!canEndTurn()) return;
    
    dispatch({ type: 'END_TURN' });
  }, [canEndTurn, dispatch]);

  /**
   * Check if the game is over
   */
  const isGameOver = useCallback((): boolean => {
    const activePlayers = state.players.filter(player => player.isActive && !hasPlayerWon(player));
    return activePlayers.length <= 1;
  }, [state.players]);

  /**
   * Get the winner(s) of the game
   */
  const getWinners = useCallback(() => {
    return state.players.filter(player => hasPlayerWon(player));
  }, [state.players]);

  /**
   * Get the current player
   */
  const getCurrentPlayer = useCallback(() => {
    return state.players[state.currentPlayerIndex];
  }, [state.players, state.currentPlayerIndex]);

  /**
   * Get total dice value for current turn
   */
  const getTotalDiceValue = useCallback((): number => {
    return state.diceRolls.reduce((sum, roll) => sum + roll.value, 0);
  }, [state.diceRolls]);

  /**
   * Check if current player has bonus throws available
   */
  const hasBonusThrows = useCallback((): boolean => {
    return state.diceRolls.some(roll => roll.isBonus);
  }, [state.diceRolls]);

  return {
    // State
    state,
    
    // Piece operations
    canMovePiece,
    canSelectPiece,
    isValidMove,
    getPossibleMoves,
    executeMove,
    
    // Turn operations
    canRollDice,
    rollDice,
    canEndTurn,
    endTurn,
    
    // Game state
    isGameOver,
    getWinners,
    getCurrentPlayer,
    getTotalDiceValue,
    hasBonusThrows,
    
    // Dispatch
    dispatch
  };
}; 