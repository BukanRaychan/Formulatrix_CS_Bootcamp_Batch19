using CheckersBoardGame.Models;

namespace CheckersBoardGame.Interfaces;

public interface IGameEngine
{
    event EventHandler<Events.MoveEventArgs>? MoveMade;
    event EventHandler<Events.GameEndedEventArgs>? GameEnded;
    Player CurrentPlayer { get; }
    bool IsGameOver { get; }
    Player? Winner { get; }
    void Start();
    bool TryMove(int fromX, int fromY, int toX, int toY, out string message);
}
