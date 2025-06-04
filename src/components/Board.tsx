import React from 'react';
import { GameState, Player } from '../types';
import './Board.css';

interface BoardProps {
  gameState: GameState & {
    xWins: number;
    oWins: number;
  };
  onCellClick: (index: number) => void;
  onPlayAgain: () => void;
}

const Board: React.FC<BoardProps> = ({ gameState, onCellClick, onPlayAgain }) => {
  const { board, currentPlayer, winner, xWins, oWins, isComputerTurn } = gameState;

  const getStatus = () => {
    if (winner) {
      return winner === 'X' ? 'You win!' : 'Computer wins!';
    }
    if (board.every((cell: Player) => cell !== null)) {
      return "It's a draw!";
    }
    return isComputerTurn ? 'Computer is thinking...' : 'Your turn!';
  };

  return (
    <div className="game-container">
      <div className="score-board">
        <div className="score">X - {xWins}</div>
        <div className="score">O - {oWins}</div>
      </div>
      
      <div className="status">{getStatus()}</div>
      
      <div className="board">
        {board.map((cell: Player, index: number) => (
          <button
            key={index}
            className="cell"
            onClick={() => onCellClick(index)}
            disabled={cell !== null || winner !== null}
          >
            {cell}
          </button>
        ))}
      </div>

      {(winner || board.every((cell: Player) => cell !== null)) && (
        <button className="play-again" onClick={onPlayAgain}>
          Play Again
        </button>
      )}
    </div>
  );
};

export default Board; 