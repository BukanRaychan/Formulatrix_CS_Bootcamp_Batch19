using CheckersBoardGame.Events;
using CheckersBoardGame.Interfaces;
using CheckersBoardGame.Models;
using CheckersBoardGame.Types;

namespace CheckersBoardGame.Services;

public class GameEngine : IGameEngine
{
    private readonly IBoard _board;
    private readonly Player _playerOne;
    private readonly Player _playerTwo;
    private Player _currentPlayer;
    private Piece? _continuingPiece;

    public event EventHandler<MoveEventArgs>? MoveMade;
    public event EventHandler<GameEndedEventArgs>? GameEnded;

    public Player CurrentPlayer => _currentPlayer;
    public bool IsGameOver { get; private set; }
    public Player? Winner { get; private set; }

    public GameEngine(IBoard board, string playerOneName, string playerTwoName)
    {
        _board = board;
        _playerOne = new Player(playerOneName, ConsoleColor.Blue, isPlayerOne: true);
        _playerTwo = new Player(playerTwoName, ConsoleColor.Red, isPlayerOne: false);
        _currentPlayer = _playerOne;
    }

    public void Start()
    {
        IsGameOver = false;
        Winner = null;
        _continuingPiece = null;
        _currentPlayer = _playerOne;
        _board.Initialize(_playerOne, _playerTwo);
    }

    public bool TryMove(int fromX, int fromY, int toX, int toY, out string message)
    {
        message = string.Empty;
        if (IsGameOver)
        {
            message = "The game is over.";
            return false;
        }

        var piece = _board.GetPieceAt(fromX, fromY);
        if (piece is null)
        {
            message = "No piece at source.";
            return false;
        }

        if (piece.Owner != _currentPlayer)
        {
            message = "That is not your piece.";
            return false;
        }

        if (_continuingPiece is not null && piece.Position != _continuingPiece.Position)
        {
            message = "You must continue capturing with the same piece.";
            return false;
        }

        if (!_board.TryMove(piece, toX, toY, out bool crowned, out bool captured, out bool hasMoreCapture))
        {
            message = "Invalid move.";
            return false;
        }

        MoveMade?.Invoke(this, new MoveEventArgs(_currentPlayer, (fromX, fromY), (toX, toY), piece, crowned));

        if (captured && hasMoreCapture)
        {
            _continuingPiece = piece;
            message = "Capture again with the same piece.";
            return true;
        }

        _continuingPiece = null;

        var opponent = GetOpponent();
        if (!_board.HasAnyMoves(opponent))
        {
            EndGame(_currentPlayer, "The opponent has no legal moves left.");
            return true;
        }

        _currentPlayer = opponent;
        return true;
    }

    private Player GetOpponent() => _currentPlayer == _playerOne ? _playerTwo : _playerOne;

    private void EndGame(Player winner, string reason)
    {
        IsGameOver = true;
        Winner = winner;
        GameEnded?.Invoke(this, new GameEndedEventArgs(winner, reason));
    }
}
