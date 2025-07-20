import React, { useState } from 'react';
import styled from 'styled-components';
import { useGame } from '../store/GameContext';

const SetupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
`;

const SetupCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 500px;
  width: 100%;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const OptionGroup = styled.div`
  margin-bottom: 30px;
`;

const OptionLabel = styled.label`
  display: block;
  margin-bottom: 10px;
  font-size: 1.2rem;
  font-weight: 600;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.2);
  }

  option {
    background: #333;
    color: white;
  }
`;

const StartButton = styled.button`
  width: 100%;
  padding: 15px;
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const GameSetup: React.FC = () => {
  const { dispatch } = useGame();
  const [gameMode, setGameMode] = useState<'2player' | '3player' | '4player'>('4player');
  const [diceType, setDiceType] = useState<'standard' | 'indian'>('standard');

  const handleStartGame = () => {
    dispatch({
      type: 'START_GAME',
      gameMode,
      diceType
    });
  };

  return (
    <SetupContainer>
      <SetupCard>
        <Title>🎲 Ludo Game</Title>
        
        <OptionGroup>
          <OptionLabel htmlFor="gameMode">Number of Players:</OptionLabel>
          <Select
            id="gameMode"
            value={gameMode}
            onChange={(e) => setGameMode(e.target.value as '2player' | '3player' | '4player')}
          >
            <option value="2player">2 Players</option>
            <option value="3player">3 Players</option>
            <option value="4player">4 Players</option>
          </Select>
        </OptionGroup>

        <OptionGroup>
          <OptionLabel htmlFor="diceType">Dice Type:</OptionLabel>
          <Select
            id="diceType"
            value={diceType}
            onChange={(e) => setDiceType(e.target.value as 'standard' | 'indian')}
          >
            <option value="standard">Standard Dice (1-6)</option>
            <option value="indian">Traditional Indian Dice (1,2,3,blank)</option>
          </Select>
        </OptionGroup>

        <StartButton onClick={handleStartGame}>
          Start Game
        </StartButton>
      </SetupCard>
    </SetupContainer>
  );
};

export default GameSetup; 