export type Player = 'X' | 'O' | null;
export type Board = Player[];
export type PlayerType = 'HUMAN' | 'COMPUTER';

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player;
  playerWins: number;
  computerWins: number;
  isComputerTurn: boolean;
} 