import React from 'react';
import { GameProvider, useGame } from './store/GameContext';
import GameSetup from './components/GameSetup';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import './App.css';

const GameApp: React.FC = () => {
  const { state } = useGame();

  return (
    <div className="App">
      {state.gamePhase === 'setup' ? (
        <GameSetup />
      ) : (
        <div className="game-container">
          <div className="game-board-section">
            <GameBoard />
          </div>
          <div className="game-controls-section">
            <GameControls size="medium" />
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  );
}

export default App;
