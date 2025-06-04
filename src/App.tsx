import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import Login from './components/Login';
import WinningModal from './components/WinningModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GameState, Player, Board as BoardType } from './types';
import './App.css';

const initialGameState: GameState = {
  board: Array(9).fill(null),
  currentPlayer: 'X',
  winner: null,
  playerWins: 0,
  computerWins: 0,
  isComputerTurn: false,
};

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

const checkWinner = (board: BoardType): Player => {
  for (const [a, b, c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

const findBestMove = (board: BoardType, computerMark: Player): number => {
  // First, try to win
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const testBoard = [...board];
      testBoard[i] = computerMark;
      if (checkWinner(testBoard) === computerMark) {
        return i;
      }
    }
  }

  // Second, block player from winning
  const playerMark = computerMark === 'X' ? 'O' : 'X';
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const testBoard = [...board];
      testBoard[i] = playerMark;
      if (checkWinner(testBoard) === playerMark) {
        return i;
      }
    }
  }

  // Try to take center
  if (!board[4]) return 4;

  // Take any corner
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(i => !board[i]);
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }

  // Take any available space
  const availableSpaces = board
    .map((cell, index) => cell === null ? index : null)
    .filter((index): index is number => index !== null);
  return availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
};

const GameComponent: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [showModal, setShowModal] = useState(false);
  const { signOut, user } = useAuth();

  useEffect(() => {
    if (gameState.isComputerTurn && !gameState.winner) {
      const timeoutId = setTimeout(() => {
        makeComputerMove();
      }, 700); // Add delay to make it feel more natural
      return () => clearTimeout(timeoutId);
    }
  }, [gameState.isComputerTurn]);

  const makeComputerMove = () => {
    const computerMark = 'O';
    const moveIndex = findBestMove(gameState.board, computerMark);
    
    const newBoard = [...gameState.board];
    newBoard[moveIndex] = computerMark;
    
    const winner = checkWinner(newBoard);
    
    setGameState({
      ...gameState,
      board: newBoard,
      currentPlayer: 'X',
      winner,
      computerWins: winner === 'O' ? gameState.computerWins + 1 : gameState.computerWins,
      isComputerTurn: false,
    });

    if (winner) {
      setShowModal(true);
    }
  };

  const handleCellClick = (index: number) => {
    if (gameState.board[index] || gameState.winner || gameState.isComputerTurn) return;

    const newBoard = [...gameState.board];
    newBoard[index] = 'X';

    const winner = checkWinner(newBoard);
    
    setGameState({
      ...gameState,
      board: newBoard,
      currentPlayer: 'O',
      winner,
      playerWins: winner === 'X' ? gameState.playerWins + 1 : gameState.playerWins,
      isComputerTurn: !winner,
    });

    if (winner) {
      setShowModal(true);
    }
  };

  const handlePlayAgain = () => {
    setGameState({
      ...gameState,
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      isComputerTurn: false,
    });
    setShowModal(false);
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Tic Tac Toe vs Computer</h1>
        <div className="user-info">
          <span className="user-email">{user?.email}</span>
          <button className="neon-button logout-button" onClick={signOut}>
            Logout
          </button>
        </div>
      </div>
      <Board
        gameState={{
          ...gameState,
          xWins: gameState.playerWins,
          oWins: gameState.computerWins,
        }}
        onCellClick={handleCellClick}
        onPlayAgain={handlePlayAgain}
      />
      {showModal && gameState.winner && (
        <WinningModal
          winner={gameState.winner}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return user ? <GameComponent /> : <Login />;
}

export default App;
