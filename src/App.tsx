import React from 'react';
import { GameProvider, useGame } from './store/GameContext';
import GameSetup from './components/GameSetup';
import GameBoard from './components/GameBoard';
import './App.css';

const GameApp: React.FC = () => {
  const { state } = useGame();

  return (
    <div className="App">
      {state.gamePhase === 'setup' ? <GameSetup /> : <GameBoard />}
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
