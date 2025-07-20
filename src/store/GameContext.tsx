import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, GameAction, Player, GamePiece, Position, DiceRoll, Move } from '../types/game';
import { PLAYER_COLORS, PLAYER_NAMES, PLAYER_STARTING_POSITIONS, MOKSHA_POSITION } from '../constants/gameConstants';
import { 
  rollDice, 
  getTotalDiceValue, 
  canContinueRolling, 
  movePiece, 
  capturePiece, 
  moveToMoksha,
  canCapturePiece,
  getHomePosition,
  hasPlayerWon,
  getNextPlayerIndex,
  isPlayerActive,
  hasMovablePieces,
  getMovablePieces,
  canMovePiece,
  getPiecesAtPosition,
  canMultiplePiecesOccupy,
  getMaxPiecesAtPosition
} from '../utils/gameUtils';

// Initial game state
const createInitialGameState = (): GameState => ({
  players: [],
  currentPlayerIndex: 0,
  diceRolls: [],
  gamePhase: 'setup',
  selectedPiece: null,
  gameMode: '4player',
  diceType: 'standard'
});

// Game reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME':
      const players: Player[] = [];
      const playerCount = action.gameMode === '2player' ? 2 : action.gameMode === '3player' ? 3 : 4;
      
      for (let i = 0; i < playerCount; i++) {
        const playerId = i + 1;
        const pieces: GamePiece[] = PLAYER_STARTING_POSITIONS[playerId as keyof typeof PLAYER_STARTING_POSITIONS].map((pos: Position, index: number) => ({
          id: `player-${playerId}-piece-${index + 1}`,
          playerId,
          position: pos,
          isInHome: true,
          isInMoksha: false,
          currentSquare: 1,
          track: index < 2 ? 1 : 2
        }));

        players.push({
          id: i + 1,
          name: PLAYER_NAMES[i],
          color: PLAYER_COLORS[i],
          pieces,
          isActive: true,
          hasWon: false,
          currentTurn: i === 0
        });
      }

      return {
        ...state,
        players,
        gamePhase: 'playing',
        gameMode: action.gameMode,
        diceType: action.diceType,
        currentPlayerIndex: 0,
        diceRolls: [],
        selectedPiece: null
      };

    case 'ROLL_DICE':
      const currentPlayer = state.players[state.currentPlayerIndex];
      if (!currentPlayer || !currentPlayer.currentTurn || !isPlayerActive(currentPlayer)) {
        return state;
      }

      // Roll the dice based on the current dice type
      const newDiceRoll = rollDice(state.diceType);
      
      // Check if player has any movable pieces with this roll
      const hasMovablePiecesWithRoll = hasMovablePieces(currentPlayer, newDiceRoll.value);
      
      // If no movable pieces and it's not a bonus roll, skip turn
      if (!hasMovablePiecesWithRoll && !newDiceRoll.isBonus) {
        // Auto-advance to next player
        const nextPlayerIndex = getNextPlayerIndex(state.currentPlayerIndex, state.players.length);
        const skippedTurnPlayers = state.players.map((player, index) => ({
          ...player,
          currentTurn: index === nextPlayerIndex
        }));

        return {
          ...state,
          players: skippedTurnPlayers,
          currentPlayerIndex: nextPlayerIndex,
          diceRolls: [],
          selectedPiece: null
        };
      }

      return {
        ...state,
        diceRolls: [...state.diceRolls, newDiceRoll]
      };

    case 'SELECT_PIECE':
      const selectedPlayer = state.players[state.currentPlayerIndex];
      if (!selectedPlayer || !selectedPlayer.currentTurn) return state;
      
      // Check if the piece belongs to the current player
      if (action.piece.playerId !== selectedPlayer.id) return state;
      
      // Check if the piece can be moved with current dice value
      const totalDiceValue = getTotalDiceValue(state.diceRolls);
      if (!canMovePiece(action.piece, totalDiceValue)) return state;
      
      return {
        ...state,
        selectedPiece: action.piece
      };

    case 'MOVE_PIECE':
      const { piece, from, to, isCapture, capturedPiece } = action.move;
      const movingPlayer = state.players[state.currentPlayerIndex];
      
      if (!movingPlayer || !movingPlayer.currentTurn) return state;
      
      // Update the moving piece
      let updatedPiece = movePiece(piece, to);
      
      // Check if piece reached Moksha
      if (to.x === MOKSHA_POSITION.x && to.y === MOKSHA_POSITION.y) {
        updatedPiece = moveToMoksha(updatedPiece, to);
      }
      
      // Handle capture if it occurred
      let capturedPieceUpdated: GamePiece | undefined;
      if (isCapture && capturedPiece) {
        const homePos = getHomePosition(capturedPiece);
        capturedPieceUpdated = capturePiece(capturedPiece, homePos);
      }
      
      // Update players with new piece positions
      const movedPlayers = state.players.map(player => {
        if (player.id === piece.playerId) {
          const updatedPieces = player.pieces.map(p => 
            p.id === piece.id ? updatedPiece : p
          );
          
          // Check if player has won
          const hasWon = hasPlayerWon({ ...player, pieces: updatedPieces });
          
          return {
            ...player,
            pieces: updatedPieces,
            hasWon
          };
        }
        
        if (capturedPieceUpdated && player.id === capturedPieceUpdated.playerId) {
          const updatedPieces = player.pieces.map(p => 
            p.id === capturedPieceUpdated!.id ? capturedPieceUpdated! : p
          );
          
          return {
            ...player,
            pieces: updatedPieces
          };
        }
        
        return player;
      });
      
      // Check if current player can continue (has bonus throws)
      const canContinue = canContinueRolling(state.diceRolls);
      
      if (canContinue) {
        // Player can continue rolling
        return {
          ...state,
          players: movedPlayers,
          selectedPiece: null,
          diceRolls: [] // Clear dice rolls for next roll
        };
      } else {
        // End turn and move to next player
        const nextPlayerIndex = getNextPlayerIndex(state.currentPlayerIndex, state.players.length);
        const finalUpdatedPlayers = movedPlayers.map((player, index) => ({
          ...player,
          currentTurn: index === nextPlayerIndex
        }));

        return {
          ...state,
          players: finalUpdatedPlayers,
          currentPlayerIndex: nextPlayerIndex,
          diceRolls: [],
          selectedPiece: null
        };
      }

    case 'END_TURN':
      const nextPlayerIndex = getNextPlayerIndex(state.currentPlayerIndex, state.players.length);
      const updatedPlayers = state.players.map((player, index) => ({
        ...player,
        currentTurn: index === nextPlayerIndex
      }));

      return {
        ...state,
        players: updatedPlayers,
        currentPlayerIndex: nextPlayerIndex,
        diceRolls: [],
        selectedPiece: null
      };

    case 'RESET_GAME':
      return createInitialGameState();

    default:
      return state;
  }
};

// Create context
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, createInitialGameState());

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 