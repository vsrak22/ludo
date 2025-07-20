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
  getPiecesInMoksha,
  // Phase 3 additions
  isPlayerActive,
  hasMovablePieces,
  getMovablePieces,
  canMovePiece,
  getPlayerStats,
  isValidPlayerTurn,
  movePiece,
  capturePiece,
  moveToMoksha,
  canCapturePiece,
  getHomePosition,
  canMultiplePiecesOccupy,
  getMaxPiecesAtPosition,
  rollDice,
  getTotalDiceValue,
  canContinueRolling,
  getNextPlayerIndex,
  isBonusRoll,
  getMaxDiceValue,
  isValidDiceValue
} from '../utils/gameUtils';
import { DICE_RULES, GAME_RULES, MOKSHA_POSITION } from '../constants/gameConstants';

export const useGameLogic = () => {
  const { state, dispatch } = useGame();

  /**
   * Check if a piece can be moved by the current player
   */
  const canMovePieceByCurrentPlayer = useCallback((piece: GamePiece): boolean => {
    const currentPlayer = state.players[state.currentPlayerIndex];
    return piece.playerId === currentPlayer?.id && currentPlayer?.currentTurn;
  }, [state.players, state.currentPlayerIndex]);

  /**
   * Check if a piece can be selected
   */
  const canSelectPiece = useCallback((piece: GamePiece): boolean => {
    if (!canMovePieceByCurrentPlayer(piece)) return false;
    
    // If no dice have been rolled, can't select pieces
    if (state.diceRolls.length === 0) return false;
    
    // Check if piece can be moved with current dice value
    const totalDiceValue = getTotalDiceValue(state.diceRolls);
    return canMovePiece(piece, totalDiceValue);
  }, [canMovePieceByCurrentPlayer, state.diceRolls]);

  /**
   * Check if a move is valid
   */
  const isValidMove = useCallback((piece: GamePiece, targetPosition: Position): boolean => {
    if (!isValidPosition(targetPosition)) return false;
    
    // Check if target position is occupied by own piece
    const piecesAtTarget = getPiecesAtPosition(targetPosition, state.players);
    const ownPieceAtTarget = piecesAtTarget.find(p => p.playerId === piece.playerId);
    if (ownPieceAtTarget && !isSafeZone(targetPosition)) return false;
    
    // Check if position can accommodate more pieces
    if (!canMultiplePiecesOccupy(targetPosition) && piecesAtTarget.length >= getMaxPiecesAtPosition(targetPosition)) {
      return false;
    }
    
    return true;
  }, [state.players]);

  /**
   * Calculate possible moves for a piece
   */
  const getPossibleMoves = useCallback((piece: GamePiece): Position[] => {
    const moves: Position[] = [];
    const totalDiceValue = getTotalDiceValue(state.diceRolls);
    
    // This is a simplified version - will be enhanced in Phase 4 with path calculation
    // For now, just return empty array as movement logic will be implemented in Phase 4
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
    return currentPlayer?.currentTurn && 
           isPlayerActive(currentPlayer) && 
           state.diceRolls.length === 0;
  }, [state.players, state.currentPlayerIndex, state.diceRolls.length]);

  /**
   * Roll the dice
   */
  const rollDiceForCurrentPlayer = useCallback(() => {
    if (!canRollDice()) return;
    
    dispatch({ type: 'ROLL_DICE', playerId: state.currentPlayerIndex + 1 });
  }, [canRollDice, dispatch, state.currentPlayerIndex]);

  /**
   * Check if the current player can end their turn
   */
  const canEndTurn = useCallback((): boolean => {
    const currentPlayer = state.players[state.currentPlayerIndex];
    return currentPlayer?.currentTurn && 
           isPlayerActive(currentPlayer) && 
           state.diceRolls.length > 0 &&
           !canContinueRolling(state.diceRolls);
  }, [state.players, state.currentPlayerIndex, state.diceRolls]);

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
    const activePlayers = state.players.filter(player => isPlayerActive(player));
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
  const getTotalDiceValueForTurn = useCallback((): number => {
    return getTotalDiceValue(state.diceRolls);
  }, [state.diceRolls]);

  /**
   * Check if current player has bonus throws available
   */
  const hasBonusThrows = useCallback((): boolean => {
    return canContinueRolling(state.diceRolls);
  }, [state.diceRolls]);

  // ===== PHASE 3: ENHANCED PLAYER MANAGEMENT =====

  /**
   * Get player statistics
   */
  const getCurrentPlayerStats = useCallback(() => {
    const currentPlayer = getCurrentPlayer();
    return currentPlayer ? getPlayerStats(currentPlayer) : null;
  }, [getCurrentPlayer]);

  /**
   * Get all player statistics
   */
  const getAllPlayerStats = useCallback(() => {
    return state.players.map(player => ({
      player,
      stats: getPlayerStats(player)
    }));
  }, [state.players]);

  /**
   * Check if current player has any movable pieces
   */
  const currentPlayerHasMovablePieces = useCallback((): boolean => {
    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer) return false;
    
    const totalDiceValue = getTotalDiceValueForTurn();
    return hasMovablePieces(currentPlayer, totalDiceValue);
  }, [getCurrentPlayer, getTotalDiceValueForTurn]);

  /**
   * Get movable pieces for current player
   */
  const getCurrentPlayerMovablePieces = useCallback((): GamePiece[] => {
    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer) return [];
    
    const totalDiceValue = getTotalDiceValueForTurn();
    return getMovablePieces(currentPlayer, totalDiceValue);
  }, [getCurrentPlayer, getTotalDiceValueForTurn]);

  /**
   * Check if a player is valid for their turn
   */
  const isValidCurrentPlayerTurn = useCallback((): boolean => {
    const currentPlayer = getCurrentPlayer();
    return currentPlayer ? isValidPlayerTurn(currentPlayer, state.currentPlayerIndex, state.players) : false;
  }, [getCurrentPlayer, state.currentPlayerIndex, state.players]);

  // ===== PHASE 3: ENHANCED PIECE MANAGEMENT =====

  /**
   * Check if a piece can be captured
   */
  const canPieceBeCaptured = useCallback((piece: GamePiece, position: Position): boolean => {
    return canCapturePiece(piece, piece, position);
  }, []);

  /**
   * Get the home position for a piece
   */
  const getPieceHomePosition = useCallback((piece: GamePiece): Position => {
    return getHomePosition(piece);
  }, []);

  /**
   * Check if a piece can move to Moksha
   */
  const canMoveToMoksha = useCallback((piece: GamePiece, diceValue: number): boolean => {
    // This will be enhanced in Phase 4 with path calculation
    // For now, just check if piece is close to Moksha
    const distanceToMoksha = Math.abs(piece.position.x - MOKSHA_POSITION.x) + 
                            Math.abs(piece.position.y - MOKSHA_POSITION.y);
    return distanceToMoksha === diceValue;
  }, []);

  /**
   * Check if multiple pieces can occupy a position
   */
  const canMultiplePiecesOccupyPosition = useCallback((position: Position): boolean => {
    return canMultiplePiecesOccupy(position);
  }, []);

  /**
   * Get maximum pieces that can occupy a position
   */
  const getMaxPiecesForPosition = useCallback((position: Position): number => {
    return getMaxPiecesAtPosition(position);
  }, []);

  // ===== PHASE 3: ENHANCED DICE SYSTEM =====

  /**
   * Roll dice manually (for testing or custom scenarios)
   */
  const rollCustomDice = useCallback((diceType: 'standard' | 'indian' = state.diceType) => {
    return rollDice(diceType);
  }, [state.diceType]);

  /**
   * Check if a dice value is valid for current dice type
   */
  const isValidDiceValueForCurrentType = useCallback((value: number): boolean => {
    return isValidDiceValue(value, state.diceType);
  }, [state.diceType]);

  /**
   * Get maximum dice value for current dice type
   */
  const getMaxDiceValueForCurrentType = useCallback((): number => {
    return getMaxDiceValue(state.diceType);
  }, [state.diceType]);

  /**
   * Check if a dice roll is a bonus roll
   */
  const isDiceRollBonus = useCallback((value: number): boolean => {
    return isBonusRoll(value, state.diceType);
  }, [state.diceType]);

  /**
   * Get bonus values for current dice type
   */
  const getBonusValuesForCurrentType = useCallback((): number[] => {
    return DICE_RULES[state.diceType].bonusValues;
  }, [state.diceType]);

  return {
    // State
    state,
    
    // Piece operations
    canMovePieceByCurrentPlayer,
    canSelectPiece,
    isValidMove,
    getPossibleMoves,
    executeMove,
    
    // Turn operations
    canRollDice,
    rollDiceForCurrentPlayer,
    canEndTurn,
    endTurn,
    
    // Game state
    isGameOver,
    getWinners,
    getCurrentPlayer,
    getTotalDiceValueForTurn,
    hasBonusThrows,
    
    // Phase 3: Enhanced Player Management
    getCurrentPlayerStats,
    getAllPlayerStats,
    currentPlayerHasMovablePieces,
    getCurrentPlayerMovablePieces,
    isValidCurrentPlayerTurn,
    
    // Phase 3: Enhanced Piece Management
    canPieceBeCaptured,
    getPieceHomePosition,
    canMoveToMoksha,
    canMultiplePiecesOccupyPosition,
    getMaxPiecesForPosition,
    
    // Phase 3: Enhanced Dice System
    rollCustomDice,
    isValidDiceValueForCurrentType,
    getMaxDiceValueForCurrentType,
    isDiceRollBonus,
    getBonusValuesForCurrentType,
    
    // Dispatch
    dispatch
  };
}; 