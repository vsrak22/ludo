# Ludo Game

A modern implementation of the classic Ludo board game built with React and TypeScript. This game supports 2-4 players with both standard and traditional Indian dice rules.

## Features

- **2-4 Player Support**: Play with 2, 3, or 4 players
- **Dual Dice Systems**: Choose between standard 6-sided dice or traditional Indian 4-sided dice
- **Complex Board Layout**: 32x32 grid with three concentric squares and safe zones
- **Professional UI**: Modern, responsive design with smooth animations
- **Game State Management**: Robust state management using React Context

## Game Rules

### Basic Rules
- Each player has 4 pieces that start in their home area
- Players roll dice to move pieces around the board
- First piece must enter with a roll of 1
- Subsequent pieces can enter with 1 or 5
- Pieces move clockwise around three concentric squares
- Goal is to get all 4 pieces to Moksha (center)

### Dice Rules
- **Standard Dice**: Roll 1, 5, or 6 for bonus throws
- **Indian Dice**: Roll 1, 5, 6, or 12 (both dice blank) for bonus throws

### Special Rules
- Pieces can capture opponents by landing on the same square
- Safe zones protect pieces from capture
- Exact dice value needed to enter Moksha
- Game continues until only one player remains

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ludo-game
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/          # React components
│   ├── GameBoard.tsx   # Main game board component
│   └── GameSetup.tsx   # Game setup screen
├── constants/          # Game constants and configuration
│   └── gameConstants.ts
├── store/             # State management
│   └── GameContext.tsx
├── types/             # TypeScript type definitions
│   └── game.ts
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
└── App.tsx           # Main application component
```

## Game Architecture

### State Management
The game uses React Context API for state management with a reducer pattern. The main state includes:
- Player information and pieces
- Current game phase and turn
- Dice rolls and selected pieces
- Game configuration

### Board System
The game board is a 32x32 grid with:
- Player home areas in the corners
- Three concentric square paths
- Safe zones and regular spots
- Moksha (center) as the final destination

### Component Hierarchy
- `App` - Main application wrapper with GameProvider
- `GameSetup` - Game configuration screen
- `GameBoard` - Main game interface
- Individual game pieces and UI elements

## Development Status

### Phase 1: Project Setup and Foundation ✅
- [x] React project initialization
- [x] TypeScript configuration
- [x] Basic project architecture
- [x] Game state management
- [x] Core game types and constants
- [x] Basic UI components

### Upcoming Phases
- Phase 2: Game Board Implementation
- Phase 3: Game Logic Implementation
- Phase 4: Game Rules Implementation
- Phase 5: User Interface Development
- Phase 6: Visual Design and Graphics
- Phase 7: Game Features and Polish
- Phase 8: Testing and Quality Assurance
- Phase 9: Documentation and Deployment
- Phase 10: Future Enhancements

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Traditional Ludo game rules and mechanics
- React and TypeScript communities
- Styled-components for styling
