import React, { useState } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { DiceRoll } from '../types/game';
import { DICE_RULES } from '../constants/gameConstants';
import './Dice.css';

interface DiceProps {
  onRoll?: (diceRoll: DiceRoll) => void;
  disabled?: boolean;
  diceType?: 'standard' | 'indian';
  size?: 'small' | 'medium' | 'large';
}

export const Dice: React.FC<DiceProps> = ({ 
  onRoll, 
  disabled = false, 
  diceType = 'standard',
  size = 'medium'
}) => {
  const { state, rollDiceForCurrentPlayer, canRollDice, getCurrentPlayer } = useGameLogic();
  const [isRolling, setIsRolling] = useState(false);
  const [currentValue, setCurrentValue] = useState<number>(1);
  const [animationKey, setAnimationKey] = useState(0);

  const currentPlayer = getCurrentPlayer();
  const canRoll = canRollDice() && !disabled && !isRolling;
  const currentDiceType = diceType || state.diceType;

  // Handle dice rolling animation
  const handleRoll = async () => {
    if (!canRoll) return;

    setIsRolling(true);
    setAnimationKey(prev => prev + 1);

    // Simulate rolling animation
    const rollDuration = 1000; // 1 second
    const rollInterval = 100; // Update every 100ms
    const iterations = rollDuration / rollInterval;

    for (let i = 0; i < iterations; i++) {
      await new Promise(resolve => setTimeout(resolve, rollInterval));
      const randomValue = Math.floor(Math.random() * DICE_RULES[currentDiceType].maxValue) + 1;
      setCurrentValue(randomValue);
    }

    // Final roll
    rollDiceForCurrentPlayer();
    setIsRolling(false);

    // Get the latest dice roll from state
    const latestRoll = state.diceRolls[state.diceRolls.length - 1];
    if (onRoll && latestRoll) {
      onRoll(latestRoll);
    }
  };

  // Get dice face based on value and type
  const getDiceFace = (value: number, type: 'standard' | 'indian') => {
    if (type === 'standard') {
      return getStandardDiceFace(value);
    } else {
      return getIndianDiceFace(value);
    }
  };

  // Standard 6-sided dice faces
  const getStandardDiceFace = (value: number) => {
    const dots: React.ReactElement[] = [];
    const positions: { [key: number]: [number, number][] } = {
      1: [[2, 2]],
      2: [[1, 1], [3, 3]],
      3: [[1, 1], [2, 2], [3, 3]],
      4: [[1, 1], [1, 3], [3, 1], [3, 3]],
      5: [[1, 1], [1, 3], [2, 2], [3, 1], [3, 3]],
      6: [[1, 1], [1, 2], [1, 3], [3, 1], [3, 2], [3, 3]]
    };

    const pos = positions[value] || [];
    pos.forEach(([row, col]) => {
      dots.push(
        <div
          key={`${row}-${col}`}
          className="dice-dot"
          style={{
            gridRow: row,
            gridColumn: col
          }}
        />
      );
    });

    return dots;
  };

  // Indian 4-sided dice faces (simplified representation)
  const getIndianDiceFace = (value: number) => {
    // Indian dice are typically 4-sided with blank faces
    // We'll represent them as numbers 1-4, where 1, 5, 6, 12 are bonus values
    const indianValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const displayValue = indianValues[value - 1] || value;
    
    return (
      <div className="indian-dice-value">
        {displayValue}
      </div>
    );
  };

  // Get dice color based on player
  const getDiceColor = () => {
    if (!currentPlayer) return '#666';
    return currentPlayer.color;
  };

  // Get size class
  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'dice-small';
      case 'large': return 'dice-large';
      default: return 'dice-medium';
    }
  };

  // Check if current value is a bonus roll
  const isBonus = DICE_RULES[currentDiceType].bonusValues.includes(currentValue);

  return (
    <div className={`dice-container ${getSizeClass()}`}>
      <div className="dice-info">
        <span className="dice-type">{currentDiceType === 'standard' ? '6-sided' : 'Indian'}</span>
        {currentPlayer && (
          <span className="dice-player" style={{ color: currentPlayer.color }}>
            {currentPlayer.name}
          </span>
        )}
      </div>
      
      <div 
        className={`dice ${isRolling ? 'dice-rolling' : ''} ${isBonus ? 'dice-bonus' : ''}`}
        style={{ 
          borderColor: getDiceColor(),
          backgroundColor: isBonus ? `${getDiceColor()}20` : 'white'
        }}
        key={animationKey}
        onClick={handleRoll}
      >
        {getDiceFace(currentValue, currentDiceType)}
        
        {isBonus && (
          <div className="dice-bonus-indicator">
            Bonus!
          </div>
        )}
      </div>

      <div className="dice-controls">
        <button
          className={`dice-roll-button ${!canRoll ? 'disabled' : ''}`}
          onClick={handleRoll}
          disabled={!canRoll}
        >
          {isRolling ? 'Rolling...' : 'Roll Dice'}
        </button>
        
        {isBonus && (
          <div className="bonus-message">
            Bonus throw! Roll again!
          </div>
        )}
      </div>

      {state.diceRolls.length > 0 && (
        <div className="dice-history">
          <h4>Roll History:</h4>
          <div className="dice-rolls">
            {state.diceRolls.map((roll, index) => (
              <div 
                key={index} 
                className={`dice-roll-item ${roll.isBonus ? 'bonus' : ''}`}
              >
                <span className="roll-value">{roll.value}</span>
                {roll.isBonus && <span className="bonus-badge">Bonus</span>}
              </div>
            ))}
          </div>
          <div className="total-value">
            Total: {state.diceRolls.reduce((sum, roll) => sum + roll.value, 0)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dice; 