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
  getMaxPiecesAtPosition,
  executeMove as executeMoveUtil,
  getValidMoves,
  hasValidMoves,
  isValidLudoMove
} from '../utils/gameUtils';

// Initial game state
const createInitialGameState = (): GameState => ({
  players: [],
  currentPlayerIndex: 0,
  diceRolls: [],
  gamePhase: 'setup',
  selectedPiece: null,
  gameMode: '4player',
  diceType: 'standard',
  // Phase 4 additions
  lastRoll: null,
  gameOver: false,
  lastMoveValidation: null,
  highlightedPositions: [],
  turnSkipped: false
});

// Enhanced game reducer with Phase 4 movement rules
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
      const newRoll = rollDice(state.diceType);
      const updatedRolls = [...state.diceRolls, newRoll];
      
      // Check if there are bonus throws available first
      const hasBonusThrows = canContinueRolling(updatedRolls);
      
      // If there are bonus throws, always allow the player to continue rolling
      if (hasBonusThrows) {
        return {
          ...state,
          diceRolls: updatedRolls,
          lastRoll: newRoll
        };
      }
      
      // Only check for valid moves if there are no bonus throws
      const rollingPlayer = state.players[state.currentPlayerIndex];
      const diceValueForTurn = getTotalDiceValue(updatedRolls);
      const playerHasMoves = hasValidMoves(rollingPlayer, diceValueForTurn, state.players);
      
      // If no valid moves and no bonus throws, automatically end turn
      if (!playerHasMoves) {
        const nextPlayerIndex = getNextPlayerIndex(state.currentPlayerIndex, state.players.length);
        const updatedPlayers = state.players.map((player, index) => ({
          ...player,
          currentTurn: index === nextPlayerIndex
        }));

        return {
          ...state,
          currentPlayerIndex: nextPlayerIndex,
          players: updatedPlayers,
          diceRolls: [],
          lastRoll: null,
          selectedPiece: null,
          turnSkipped: true
        };
      }
      
      return {
        ...state,
        diceRolls: updatedRolls,
        lastRoll: newRoll
      };

    case 'SELECT_PIECE':
      return {
        ...state,
        selectedPiece: action.piece
      };

    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedPiece: null
      };

    case 'SET_DICE_TYPE':
      return {
        ...state,
        diceType: action.diceType
      };

    case 'MOVE_PIECE':
      const { piece: movedPiece, from, to, isCapture, capturedPiece } = action.move;
      
      // Update the piece in the player's pieces array
      const updatedPlayersWithMove = state.players.map(player => {
        if (player.id === movedPiece.playerId) {
          const updatedPieces = player.pieces.map(p => 
            p.id === movedPiece.id ? movedPiece : p
          );
          
          // Check if player has won
          const hasWon = hasPlayerWon({ ...player, pieces: updatedPieces });
          
          return {
            ...player,
            pieces: updatedPieces,
            hasWon,
            isActive: !hasWon
          };
        }
        return player;
      });

      // Handle captured piece if any
      let finalPlayers = updatedPlayersWithMove;
      if (isCapture && capturedPiece) {
        finalPlayers = finalPlayers.map(player => {
          if (player.id === capturedPiece.playerId) {
            const updatedPieces = player.pieces.map(p => 
              p.id === capturedPiece.id ? capturedPiece : p
            );
            return {
              ...player,
              pieces: updatedPieces
            };
          }
          return player;
        });
      }

      // Check if game is over
      const activePlayers = finalPlayers.filter(player => isPlayerActive(player));
      const gameOver = activePlayers.length <= 1;

      return {
        ...state,
        players: finalPlayers,
        gameOver,
        selectedPiece: null
      };

    case 'END_TURN':
      const nextPlayerIndex = getNextPlayerIndex(state.currentPlayerIndex, state.players.length);
      const updatedPlayers = state.players.map((player, index) => ({
        ...player,
        currentTurn: index === nextPlayerIndex
      }));

      return {
        ...state,
        currentPlayerIndex: nextPlayerIndex,
        players: updatedPlayers,
        diceRolls: [],
        lastRoll: null,
        selectedPiece: null
      };

    case 'RESET_GAME':
      return createInitialGameState();

    case 'VALIDATE_MOVE':
      const { piece: validatePiece, targetPosition } = action;
      const totalDiceValue = getTotalDiceValue(state.diceRolls);
      const validation = isValidLudoMove(validatePiece, targetPosition, totalDiceValue, state.players);
      
      return {
        ...state,
        lastMoveValidation: validation
      };

    case 'EXECUTE_MOVE_WITH_CAPTURE':
      const { piece: pieceToMove, targetPosition: targetPos } = action;
      const moveResult = executeMoveUtil(pieceToMove, targetPos, state.players);
      
      // Create move object for the MOVE_PIECE action
      const move: Move = {
        piece: moveResult.updatedPiece,
        from: pieceToMove.position,
        to: targetPos,
        isCapture: moveResult.capturedPieces.length > 0,
        capturedPiece: moveResult.capturedPieces[0]
      };
      
      // Dispatch the move action
      return gameReducer(state, { type: 'MOVE_PIECE', move });

    case 'HIGHLIGHT_VALID_MOVES':
      const { pieceId } = action;
      const highlightPiece = state.players
        .flatMap(p => p.pieces)
        .find(p => p.id === pieceId);
      
      if (highlightPiece) {
        const totalDiceValue = getTotalDiceValue(state.diceRolls);
        const validMoves = getValidMoves(highlightPiece, totalDiceValue, state.players);
        
        return {
          ...state,
          highlightedPositions: validMoves,
          selectedPiece: highlightPiece
        };
      }
      
      return state;

    case 'CLEAR_HIGHLIGHTS':
      return {
        ...state,
        highlightedPositions: [],
        selectedPiece: null
      };

    case 'CHECK_GAME_OVER':
      const activePlayersCount = state.players.filter(player => isPlayerActive(player)).length;
      const isGameOver = activePlayersCount <= 1;
      
      return {
        ...state,
        gameOver: isGameOver
      };

    case 'AUTO_END_TURN':
      // Automatically end turn if no valid moves available
      const currentPlayer = state.players[state.currentPlayerIndex];
      const totalDiceValueForTurn = getTotalDiceValue(state.diceRolls);
      const hasMoves = hasValidMoves(currentPlayer, totalDiceValueForTurn, state.players);
      
      if (!hasMoves && !canContinueRolling(state.diceRolls)) {
        return gameReducer(state, { type: 'END_TURN' });
      }
      
      return state;

    default:
      return state;

    case 'CLEAR_TURN_SKIPPED':
      return {
        ...state,
        turnSkipped: false
      };
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