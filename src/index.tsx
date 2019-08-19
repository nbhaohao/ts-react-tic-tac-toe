import * as React from "react";
import ReactDOM from "react-dom";
import "./index.css";

interface ISquareProps {
  value: null | string;
  onClick: () => void;
}

const Square: React.FC<ISquareProps> = ({ value, onClick }) => {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
};

type SquaresArray = Array<null | "X" | "O">;

interface IBoardProps {
  squares: SquaresArray;
  onClick: (i: number) => void;
}

class Board extends React.Component<IBoardProps> {
  renderSquare(i: number) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

interface IGameState {
  history: Array<{ squares: SquaresArray }>;
  xIsNext: boolean;
  stepNumber: number;
}

class Game extends React.Component<{}, IGameState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      xIsNext: true,
      stepNumber: 0
    };
  }

  get winner() {
    const { history, stepNumber } = this.state;
    return this.calculateWinner(history[stepNumber].squares);
  }

  calculateWinner = (squares: SquaresArray) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  handleClick = (i: number): void => {
    const { xIsNext, stepNumber } = this.state;
    const history = this.state.history.slice(0, stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.concat();
    if (this.winner || squares[i] !== null) {
      return;
    }
    const squaresCopy = squares.concat();
    squaresCopy[i] = xIsNext ? "X" : "O";
    this.setState({
      history: this.state.history.concat({
        squares: squaresCopy
      }),
      stepNumber: history.length,
      xIsNext: !xIsNext
    });
  };

  jumpTo = (move: number): void => {
    this.setState({
      stepNumber: move,
      xIsNext: move % 2 === 0
    });
  };

  renderMoves = (): Array<React.ReactElement> => {
    const { history } = this.state;
    return history.map((step: { squares: SquaresArray }, move: number) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
  };

  render() {
    const { history, xIsNext, stepNumber } = this.state;
    let status;
    if (this.winner) {
      status = `Winner: ${this.winner}`;
    } else {
      status = `Next player: ${xIsNext ? "X" : "O"}`;
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={history[stepNumber].squares}
            onClick={this.handleClick}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <ol>{this.renderMoves()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
