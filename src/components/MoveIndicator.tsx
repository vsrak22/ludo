import React from 'react';
import styled from 'styled-components';
import { Position } from '../types/game';

interface MoveIndicatorProps {
  position: Position;
  isValid: boolean;
  isSelected: boolean;
  onClick?: () => void;
}

const Indicator = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isValid', 'isSelected'].includes(prop)
})<{ isValid: boolean; isSelected: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  border-radius: 50%;
  border: 3px solid ${props => {
    if (props.isSelected) return '#e74c3c';
    return props.isValid ? '#27ae60' : '#e74c3c';
  }};
  background: ${props => {
    if (props.isSelected) return 'rgba(231, 76, 60, 0.3)';
    return props.isValid ? 'rgba(39, 174, 96, 0.2)' : 'rgba(231, 76, 60, 0.2)';
  }};
  cursor: ${props => props.isValid ? 'pointer' : 'not-allowed'};
  z-index: 5;
  transition: all 0.2s ease;
  animation: ${props => props.isValid ? 'pulse 1.5s infinite' : 'none'};

  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
    background: ${props => {
      if (props.isSelected) return 'rgba(231, 76, 60, 0.4)';
      return props.isValid ? 'rgba(39, 174, 96, 0.3)' : 'rgba(231, 76, 60, 0.3)';
    }};
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(39, 174, 96, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(39, 174, 96, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(39, 174, 96, 0);
    }
  }
`;

const MoveIndicator: React.FC<MoveIndicatorProps> = ({ 
  position, 
  isValid, 
  isSelected, 
  onClick 
}) => {
  return (
    <Indicator 
      isValid={isValid} 
      isSelected={isSelected}
      onClick={onClick}
    />
  );
};

export default MoveIndicator; 