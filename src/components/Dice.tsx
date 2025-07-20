import React from 'react';
import styled from 'styled-components';
import { DiceRoll } from '../types/game';

const DiceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  min-width: 200px;
`;

const DiceTitle = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.2rem;
`;

const DiceDisplay = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
`;

const DiceValue = styled.div<{ isBonus: boolean }>`
  width: 50px;
  height: 50px;
  background: ${props => props.isBonus ? '#e74c3c' : '#3498db'};
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  border: 2px solid ${props => props.isBonus ? '#c0392b' : '#2980b9'};
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
`;

const TotalValue = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: #2c3e50;
  margin-top: 10px;
  padding: 8px 16px;
  background: #ecf0f1;
  border-radius: 5px;
  border: 1px solid #bdc3c7;
`;

const BonusIndicator = styled.div`
  color: #e74c3c;
  font-size: 0.9rem;
  font-weight: bold;
  margin-top: 5px;
`;

const NoDiceMessage = styled.div`
  color: #7f8c8d;
  font-style: italic;
  padding: 20px;
`;

interface DiceProps {
  diceRolls: DiceRoll[];
  diceType: 'standard' | 'indian';
}

const Dice: React.FC<DiceProps> = ({ diceRolls, diceType }) => {
  const totalValue = diceRolls.reduce((sum, roll) => sum + roll.value, 0);
  const hasBonus = diceRolls.some(roll => roll.isBonus);

  if (diceRolls.length === 0) {
    return (
      <DiceContainer>
        <DiceTitle>🎲 Dice</DiceTitle>
        <NoDiceMessage>No dice rolled yet</NoDiceMessage>
      </DiceContainer>
    );
  }

  return (
    <DiceContainer>
      <DiceTitle>
        🎲 {diceType === 'standard' ? 'Standard Dice' : 'Indian Dice'}
      </DiceTitle>
      
      <DiceDisplay>
        {diceRolls.map((roll, index) => (
          <DiceValue key={index} isBonus={roll.isBonus}>
            {roll.value}
          </DiceValue>
        ))}
      </DiceDisplay>
      
      <TotalValue>
        Total: {totalValue}
      </TotalValue>
      
      {hasBonus && (
        <BonusIndicator>
          ✨ Bonus Throw Available!
        </BonusIndicator>
      )}
    </DiceContainer>
  );
};

export default Dice; 