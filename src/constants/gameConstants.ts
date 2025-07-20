// Game Constants for Ludo Game

export const BOARD_SIZE = 32;
export const PLAYER_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
export const PLAYER_NAMES = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];

// Player starting positions (home areas)
export const PLAYER_STARTING_POSITIONS = {
  1: [
    { x: 16, y: 1 }, { x: 17, y: 1 },
    { x: 16, y: 2 }, { x: 17, y: 2 }
  ],
  2: [
    { x: 1, y: 16 }, { x: 1, y: 17 },
    { x: 2, y: 16 }, { x: 2, y: 17 }
  ],
  3: [
    { x: 16, y: 31 }, { x: 17, y: 31 },
    { x: 16, y: 32 }, { x: 17, y: 32 }
  ],
  4: [
    { x: 31, y: 16 }, { x: 31, y: 17 },
    { x: 32, y: 16 }, { x: 32, y: 17 }
  ]
};

// Entry positions for each player (first position when entering the board)
export const PLAYER_ENTRY_POSITIONS = {
  1: [{ x: 15, y: 3 }, { x: 15, y: 4 }],
  2: [{ x: 3, y: 17 }, { x: 4, y: 17 }],
  3: [{ x: 17, y: 30 }, { x: 17, y: 29 }],
  4: [{ x: 29, y: 16 }, { x: 30, y: 16 }]
};

// Safe zones in the outer square
export const SAFE_ZONES = [
  // Corner safe zones (4 spots each)
  { x: 3, y: 3, width: 2, height: 2 },
  { x: 3, y: 29, width: 2, height: 2 },
  { x: 29, y: 29, width: 2, height: 2 },
  { x: 29, y: 3, width: 2, height: 2 },
  
  // Middle safe zones (8 spots each)
  { x: 15, y: 3, width: 4, height: 2 },
  { x: 3, y: 15, width: 2, height: 4 },
  { x: 15, y: 29, width: 4, height: 2 },
  { x: 29, y: 15, width: 2, height: 4 }
];

// Regular spots in the outer square (rectangles with 20 spots each)
export const REGULAR_SPOTS = [
  { x: 5, y: 3, width: 10, height: 2 },   // First rectangle
  { x: 3, y: 5, width: 2, height: 10 },   // Second rectangle
  { x: 3, y: 19, width: 2, height: 10 },  // Third rectangle
  { x: 5, y: 29, width: 10, height: 2 },  // Fourth rectangle
  { x: 19, y: 29, width: 10, height: 2 }, // Fifth rectangle
  { x: 29, y: 19, width: 2, height: 10 }, // Sixth rectangle
  { x: 29, y: 5, width: 2, height: 10 },  // Seventh rectangle
  { x: 19, y: 3, width: 10, height: 2 }   // Eighth rectangle
];

// Middle square path positions (inner path)
export const MIDDLE_SQUARE_PATHS = [
  // Top left corner (x: 7-8, y: 7-8)
  { x: 7, y: 7, width: 2, height: 2 },
  // Top path (x: 9-16, y: 7-8)
  { x: 9, y: 7, width: 8, height: 2 },
  // Top right corner (x: 17-18, y: 7-8)
  { x: 17, y: 7, width: 2, height: 2 },
  // Top right path (x: 19-24, y: 7-8)
  { x: 19, y: 7, width: 6, height: 2 },
  // Top right corner (x: 25-26, y: 7-8)
  { x: 25, y: 7, width: 2, height: 2 },
  // Right top path (x: 25-26, y: 9-16)
  { x: 25, y: 9, width: 2, height: 8 },
  // Right path (x: 25-26, y: 17-18) - covers the missing squares
  { x: 25, y: 17, width: 2, height: 2 },
  // Right bottom path (x: 25-26, y: 19-26)
  { x: 25, y: 19, width: 2, height: 8 },
  // Bottom right corner (x: 25-26, y: 25-26)
  { x: 25, y: 25, width: 2, height: 2 },
  // Bottom path (x: 17-24, y: 25-26) - covers the missing squares
  { x: 17, y: 25, width: 8, height: 2 },
  // Bottom left corner (x: 7-8, y: 25-26)
  { x: 7, y: 25, width: 2, height: 2 },
  // Bottom path (x: 9-16, y: 25-26)
  { x: 9, y: 25, width: 8, height: 2 },
  // Bottom left path (x: 7-8, y: 19-26)
  { x: 7, y: 19, width: 2, height: 8 },
  // Left path (x: 7-8, y: 17-18) - covers the missing squares
  { x: 7, y: 17, width: 2, height: 2 },
  // Left path (x: 7-8, y: 9-16)
  { x: 7, y: 9, width: 2, height: 8 }
];

// Inner square path positions (innermost path)
export const INNER_SQUARE_PATHS = [
  // Top left corner (x: 11-12, y: 11-12)
  { x: 11, y: 11, width: 2, height: 2 },
  // Top path (x: 13-18, y: 11-12)
  { x: 13, y: 11, width: 6, height: 2 },
  // Top right corner (x: 19-20, y: 11-12)
  { x: 19, y: 11, width: 2, height: 2 },
  // Top right path (x: 21-22, y: 11-12)
  { x: 21, y: 11, width: 2, height: 2 },
  // Right top path (x: 21-22, y: 13-18)
  { x: 21, y: 13, width: 2, height: 6 },
  // Right path (x: 21-22, y: 19-20) - covers the missing squares
  { x: 21, y: 19, width: 2, height: 2 },
  // Right bottom path (x: 21-22, y: 21-22) - only the bottom edge
  { x: 21, y: 21, width: 2, height: 2 },
  // Bottom right corner (x: 21-22, y: 21-22)
  { x: 21, y: 21, width: 2, height: 2 },
  // Bottom path (x: 19-20, y: 21-22)
  { x: 19, y: 21, width: 2, height: 2 },
  // Bottom path (x: 13-18, y: 21-22)
  { x: 13, y: 21, width: 6, height: 2 },
  // Bottom left corner (x: 11-12, y: 21-22)
  { x: 11, y: 21, width: 2, height: 2 },
  // Bottom left path (x: 11-12, y: 21-22) - only the bottom edge
  { x: 11, y: 21, width: 2, height: 2 },
  // Left path (x: 11-12, y: 19-20) - covers the missing squares
  { x: 11, y: 19, width: 2, height: 2 },
  // Left path (x: 11-12, y: 13-18)
  { x: 11, y: 13, width: 2, height: 6 }
];

// Second square positions for each player
export const SECOND_SQUARE_POSITIONS = {
  1: {
    start: [{ x: 16, y: 7 }, { x: 16, y: 8 }],
    end: [{ x: 17, y: 7 }, { x: 17, y: 8 }]
  },
  2: {
    start: [{ x: 7, y: 17 }, { x: 8, y: 17 }],
    end: [{ x: 7, y: 16 }, { x: 8, y: 16 }]
  },
  3: {
    start: [{ x: 17, y: 26 }, { x: 17, y: 25 }],
    end: [{ x: 16, y: 26 }, { x: 16, y: 25 }]
  },
  4: {
    start: [{ x: 26, y: 16 }, { x: 25, y: 16 }],
    end: [{ x: 26, y: 17 }, { x: 25, y: 17 }]
  }
};

// Board square boundaries
export const BOARD_SQUARES = {
  outer: {
    x: { min: 3, max: 30 },
    y: { min: 3, max: 30 }
  },
  middle: {
    x: { min: 7, max: 26 },
    y: { min: 7, max: 26 }
  },
  inner: {
    x: { min: 11, max: 22 },
    y: { min: 11, max: 22 }
  }
};

// Third square positions for each player
export const THIRD_SQUARE_POSITIONS = {
  1: {
    start: [{ x: 16, y: 11 }, { x: 16, y: 12 }],
    end: [{ x: 17, y: 11 }, { x: 17, y: 12 }]
  },
  2: {
    start: [{ x: 11, y: 17 }, { x: 12, y: 17 }],
    end: [{ x: 11, y: 16 }, { x: 12, y: 16 }]
  },
  3: {
    start: [{ x: 17, y: 21 }, { x: 17, y: 22 }],
    end: [{ x: 16, y: 21 }, { x: 16, y: 22 }]
  },
  4: {
    start: [{ x: 21, y: 16 }, { x: 22, y: 16 }],
    end: [{ x: 21, y: 17 }, { x: 22, y: 17 }]
  }
};

// Moksha (center) area - 4x4 square
export const MOKSHA_AREA = {
  x: 15,
  y: 15,
  width: 4,
  height: 4
};

// Moksha center position (for reference)
export const MOKSHA_POSITION = { x: 16, y: 16 };

// Dice rules
export const DICE_RULES = {
  standard: {
    bonusValues: [1, 5, 6],
    maxValue: 6
  },
  indian: {
    bonusValues: [1, 5, 6, 12],
    maxValue: 12,
    diceCount: 2
  }
};

// Game rules
export const GAME_RULES = {
  piecesPerPlayer: 4,
  entryValues: [1, 5], // Values needed to enter the game
  firstEntryValue: 1,  // First piece must enter with 1
  exactMokshaEntry: true // Must have exact value to enter Moksha
}; 