import React, { useState } from 'react';
import styled from 'styled-components';
import PathIndicators, { PathType } from './PathIndicators';

const DemoContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid #333;
  border-radius: 10px;
  padding: 15px;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  max-width: 300px;
`;

const DemoTitle = styled.h3`
  margin: 0 0 10px 0;
  color: #333;
  font-size: 16px;
`;

const ControlGroup = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 12px;
`;

const Input = styled.input`
  width: 60px;
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
`;

const Select = styled.select`
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
`;

const Button = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin: 2px;

  &:hover {
    background: #45a049;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
`;

const PathIndicatorDemo: React.FC = () => {
  const [x, setX] = useState(5);
  const [y, setY] = useState(30);
  const [selectedType, setSelectedType] = useState<PathType>('turn-left-up');
  const [indicators, setIndicators] = useState<Array<{
    type: PathType;
    x: number;
    y: number;
    color?: string;
    strokeWidth?: number;
  }>>([]);
  const [isVisible, setIsVisible] = useState(true);

  const pathTypes: PathType[] = [
    'turn-left-up',
    'turn-left-down',
    'turn-right-up',
    'turn-right-down',
    'straight-up',
    'straight-down',
    'straight-left',
    'straight-right',
    'diagonal-up-left',
    'diagonal-up-right',
    'diagonal-down-left',
    'diagonal-down-right'
  ];

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FF9800', '#9C27B0', '#E91E63', '#3F51B5',
    '#009688', '#795548', '#607D8B', '#FF5722'
  ];

  const addIndicator = () => {
    const newIndicator = {
      type: selectedType,
      x,
      y,
      color: colors[Math.floor(Math.random() * colors.length)],
      strokeWidth: Math.random() > 0.5 ? 2 : 3
    };
    setIndicators([...indicators, newIndicator]);
  };

  const clearIndicators = () => {
    setIndicators([]);
  };

  const addPreset = (preset: string) => {
    let newIndicators: Array<{
      type: PathType;
      x: number;
      y: number;
      color?: string;
      strokeWidth?: number;
    }> = [];

    switch (preset) {
      case 'corner-turns':
        newIndicators = [
          { type: 'turn-left-up', x: 5, y: 30, color: '#FF6B6B', strokeWidth: 3 },
          { type: 'straight-up', x: 5, y: 30, color: '#4ECDC4', strokeWidth: 2 },
          { type: 'turn-right-down', x: 15, y: 3, color: '#FF9800', strokeWidth: 3 },
          { type: 'straight-down', x: 15, y: 3, color: '#9C27B0', strokeWidth: 2 },
          { type: 'turn-left-up', x: 29, y: 15, color: '#E91E63', strokeWidth: 3 },
          { type: 'straight-up', x: 29, y: 15, color: '#3F51B5', strokeWidth: 2 },
          { type: 'turn-left-up', x: 15, y: 29, color: '#009688', strokeWidth: 3 },
          { type: 'straight-up', x: 15, y: 29, color: '#795548', strokeWidth: 2 },
          { type: 'turn-right-down', x: 3, y: 15, color: '#607D8B', strokeWidth: 3 },
          { type: 'straight-down', x: 3, y: 15, color: '#FF5722', strokeWidth: 2 }
        ];
        break;
      case 'diagonal-paths':
        newIndicators = [
          { type: 'diagonal-up-left', x: 10, y: 25, color: '#FF6B6B', strokeWidth: 3 },
          { type: 'diagonal-up-right', x: 22, y: 25, color: '#4ECDC4', strokeWidth: 3 },
          { type: 'diagonal-down-left', x: 10, y: 7, color: '#FF9800', strokeWidth: 3 },
          { type: 'diagonal-down-right', x: 22, y: 7, color: '#9C27B0', strokeWidth: 3 }
        ];
        break;
      case 'straight-paths':
        newIndicators = [
          { type: 'straight-up', x: 8, y: 28, color: '#E91E63', strokeWidth: 2 },
          { type: 'straight-down', x: 8, y: 4, color: '#3F51B5', strokeWidth: 2 },
          { type: 'straight-left', x: 28, y: 8, color: '#009688', strokeWidth: 2 },
          { type: 'straight-right', x: 4, y: 8, color: '#795548', strokeWidth: 2 }
        ];
        break;
    }
    setIndicators(newIndicators);
  };

  return (
    <DemoContainer>
      <DemoTitle>🎯 Path Indicators Demo</DemoTitle>
      
      <ControlGroup>
        <Label>Position:</Label>
        <Input
          type="number"
          value={x}
          onChange={(e) => setX(Number(e.target.value))}
          min="1"
          max="32"
          placeholder="X"
        />
        <Input
          type="number"
          value={y}
          onChange={(e) => setY(Number(e.target.value))}
          min="1"
          max="32"
          placeholder="Y"
        />
      </ControlGroup>

      <ControlGroup>
        <Label>Path Type:</Label>
        <Select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as PathType)}
        >
          {pathTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </Select>
      </ControlGroup>

      <ControlGroup>
        <Label>Visibility:</Label>
        <input
          type="checkbox"
          checked={isVisible}
          onChange={(e) => setIsVisible(e.target.checked)}
        />
        <span style={{ marginLeft: '5px', fontSize: '12px' }}>Show Indicators</span>
      </ControlGroup>

      <ButtonGroup>
        <Button onClick={addIndicator}>Add Indicator</Button>
        <Button onClick={clearIndicators}>Clear All</Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button onClick={() => addPreset('corner-turns')}>Corner Turns</Button>
        <Button onClick={() => addPreset('diagonal-paths')}>Diagonal Paths</Button>
        <Button onClick={() => addPreset('straight-paths')}>Straight Paths</Button>
      </ButtonGroup>

      <div style={{ marginTop: '10px', fontSize: '11px', color: '#666' }}>
        Current: {indicators.length} indicators
      </div>
    </DemoContainer>
  );
};

export default PathIndicatorDemo; 