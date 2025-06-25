import React, { useState, useEffect } from "react";
import "./App.css";

// Color palette constants for inline styling (matches requirements)
const COLORS = {
  primary: "#1976D2",
  accent: "#FF4081",
  secondary: "#424242",
  lightBg: "#ffffff",
  gridBorder: "#e0e0e0",
  cellHover: "#E3F2FD",
  winBg: "#e3fcef",
};

// Small stateless cell component
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-cell${highlight ? " win" : ""}`}
      onClick={onClick}
      tabIndex={0}
      style={{
        color:
          value === "X"
            ? COLORS.primary
            : value === "O"
            ? COLORS.accent
            : COLORS.secondary,
        background: highlight ? COLORS.winBg : COLORS.lightBg,
        outline: "none",
      }}
      aria-label={value ? `Cell: ${value}` : "Empty Cell"}
    >
      {value}
    </button>
  );
}

function getWinner(cells) {
  // Returns {winner, winLine} or null if no winner yet
  const lines = [
    // Rows
    [0, 1, 2],[3, 4, 5],[6, 7, 8],
    // Columns
    [0, 3, 6],[1, 4, 7],[2, 5, 8],
    // Diagonals
    [0, 4, 8],[2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (
      cells[a] &&
      cells[a] === cells[b] &&
      cells[a] === cells[c]
    ) {
      return { winner: cells[a], winLine: [a, b, c] };
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  // State management
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [step, setStep] = useState(0);
  const [theme, setTheme] = useState("light");
  const winnerResult = getWinner(squares);
  const isDraw = !winnerResult && squares.every(Boolean);

  // Apply theme selection
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const handleClick = (i) => {
    if (squares[i] || winnerResult) return;
    const next = squares.slice();
    next[i] = xIsNext ? "X" : "O";
    setSquares(next);
    setXIsNext(!xIsNext);
    setStep(step + 1);
  };

  // PUBLIC_INTERFACE
  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setStep(0);
  };

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Render helpers
  const renderSquare = (idx) => {
    const highlight =
      winnerResult && winnerResult.winLine.includes(idx);
    return (
      <Square
        key={idx}
        value={squares[idx]}
        onClick={() => handleClick(idx)}
        highlight={highlight}
      />
    );
  };

  // Status text calculation
  let statusText = "";
  if (winnerResult) {
    statusText = `Winner: ${winnerResult.winner}`;
  } else if (isDraw) {
    statusText = "It's a draw!";
  } else {
    statusText = `Next turn: ${xIsNext ? "X" : "O"}`;
  }

  // Semantic display of player color
  const styledPlayer = (player) => (
    <span
      style={{
        color: player === "X" ? COLORS.primary : COLORS.accent,
        fontWeight: 700,
        letterSpacing: "0.04em",
      }}
    >
      {player}
    </span>
  );

  return (
    <div className="tic-tac-toe-app">
      <div className="ttt-header">
        <h1
          className="ttt-title"
          style={{
            color: COLORS.primary,
            letterSpacing: "0.03em",
            marginBottom: "0.25em",
          }}
        >
          Tic Tac Toe
        </h1>
        <div
          className="ttt-status"
          style={{
            padding: "0.5em 0.8em",
            background: "#f5f6fa",
            borderRadius: "12px",
            display: "inline-block",
            minWidth: 120,
            margin: "0 auto 0.5em",
            fontSize: "1.18em",
            color: COLORS.secondary,
            fontWeight: 500,
          }}
        >
          {winnerResult
            ? <>Winner: {styledPlayer(winnerResult.winner)}</>
            : isDraw
            ? "It's a draw!"
            : <>Next turn: {styledPlayer(xIsNext ? "X" : "O")}</>
          }
        </div>
      </div>

      <div className="ttt-container">
        <div className="ttt-board">
          {[0, 1, 2].map((row) => (
            <div key={row} className="ttt-row">
              {[0, 1, 2].map((col) =>
                renderSquare(row * 3 + col)
              )}
            </div>
          ))}
        </div>
        <button className="ttt-reset-btn" onClick={handleReset} aria-label="Restart Game">
          Reset Game
        </button>
      </div>
      <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>

      <footer className="ttt-footer">
        <small style={{ color: COLORS.secondary, opacity: 0.7 }}>
          Classic web game &middot; Coded with React
        </small>
      </footer>
    </div>
  );
}

export default App;
