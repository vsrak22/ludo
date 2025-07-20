import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, GameAction, Player, GamePiece, Position, DiceRoll } from '../types/game';
import { PLAYER_COLORS, PLAYER_NAMES, PLAYER_STARTING_POSITIONS } from '../constants/gameConstants';

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
        diceRolls: []
      };

    case 'ROLL_DICE':
      const currentPlayer = state.players[state.currentPlayerIndex];
      if (!currentPlayer || !currentPlayer.currentTurn) return state;

      // Simple dice roll logic (will be enhanced later)
      const diceValue = Math.floor(Math.random() * 6) + 1;
      const isBonus = [1, 5, 6].includes(diceValue);
      
      const newDiceRoll: DiceRoll = {
        value: diceValue,
        isBonus,
        diceType: state.diceType
      };

      return {
        ...state,
        diceRolls: [...state.diceRolls, newDiceRoll]
      };

    case 'SELECT_PIECE':
      return {
        ...state,
        selectedPiece: action.piece
      };

    case 'MOVE_PIECE':
      // This will be implemented in Phase 4 with full movement logic
      return state;

    case 'END_TURN':
      const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
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