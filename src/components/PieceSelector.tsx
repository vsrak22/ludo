import React from 'react';
import styled from 'styled-components';
import { GamePiece } from '../types/game';

interface PieceSelectorProps {
  pieces: GamePiece[];
  onPieceSelect: (piece: GamePiece) => void;
  selectedPieceId?: string;
  validPieceIds: string[];
}

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 300px;
`;

const Title = styled.h3`
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 16px;
  text-align: center;
`;

const PieceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PieceItem = styled.button<{ 
  isSelected: boolean; 
  isValid: boolean; 
  isMovable: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 2px solid ${props => {
    if (props.isSelected) return '#3498db';
    if (!props.isValid) return '#bdc3c7';
    return props.isMovable ? '#27ae60' : '#f39c12';
  }};
  border-radius: 8px;
  background: ${props => {
    if (props.isSelected) return '#3498db';
    if (!props.isValid) return '#ecf0f1';
    return props.isMovable ? '#d5f4e6' : '#fef9e7';
  }};
  color: ${props => {
    if (props.isSelected) return 'white';
    if (!props.isValid) return '#7f8c8d';
    return '#2c3e50';
  }};
  cursor: ${props => props.isMovable ? 'pointer' : 'not-allowed'};
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    transform: ${props => props.isMovable ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.isMovable ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PieceIcon = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.color};
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const PieceInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
`;

const PieceName = styled.span`
  font-weight: 600;
`;

const PieceStatus = styled.span`
  font-size: 12px;
  opacity: 0.8;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch (props.status) {
      case 'home': return '#e74c3c';
      case 'board': return '#3498db';
      case 'moksha': return '#9b59b6';
      default: return '#95a5a6';
    }
  }};
  color: white;
`;

const NoPiecesMessage = styled.div`
  text-align: center;
  color: #7f8c8d;
  font-style: italic;
  padding: 20px;
`;

const PieceSelector: React.FC<PieceSelectorProps> = ({
  pieces,
  onPieceSelect,
  selectedPieceId,
  validPieceIds
}) => {
  const getPieceStatus = (piece: GamePiece): string => {
    if (piece.isInMoksha) return 'moksha';
    if (piece.isInHome) return 'home';
    return 'board';
  };

  const getPieceStatusText = (piece: GamePiece): string => {
    if (piece.isInMoksha) return 'In Moksha';
    if (piece.isInHome) return 'In Home';
    return `At (${piece.position.x}, ${piece.position.y})`;
  };

  const isPieceMovable = (piece: GamePiece): boolean => {
    return validPieceIds.includes(piece.id);
  };

  const getPlayerColor = (playerId: number): string => {
    const colors = ['#e74c3c', '#3498db', '#f39c12', '#27ae60'];
    return colors[playerId - 1] || '#95a5a6';
  };

  if (pieces.length === 0) {
    return (
      <SelectorContainer>
        <Title>Select Piece to Move</Title>
        <NoPiecesMessage>No pieces available to move</NoPiecesMessage>
      </SelectorContainer>
    );
  }

  return (
    <SelectorContainer>
      <Title>Select Piece to Move</Title>
      <PieceList>
        {pieces.map((piece) => {
          const isSelected = piece.id === selectedPieceId;
          const isValid = validPieceIds.includes(piece.id);
          const isMovable = isPieceMovable(piece);
          const status = getPieceStatus(piece);

          return (
            <PieceItem
              key={piece.id}
              isSelected={isSelected}
              isValid={isValid}
              isMovable={isMovable}
              onClick={() => isMovable && onPieceSelect(piece)}
              disabled={!isMovable}
            >
              <PieceIcon color={getPlayerColor(piece.playerId)} />
              <PieceInfo>
                <PieceName>Piece {piece.id.split('-').pop()}</PieceName>
                <PieceStatus>{getPieceStatusText(piece)}</PieceStatus>
              </PieceInfo>
              <StatusBadge status={status}>
                {status}
              </StatusBadge>
            </PieceItem>
          );
        })}
      </PieceList>
    </SelectorContainer>
  );
};

export default PieceSelector; 