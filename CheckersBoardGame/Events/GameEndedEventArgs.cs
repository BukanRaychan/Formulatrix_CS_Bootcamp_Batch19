using CheckersBoardGame.Models;

namespace CheckersBoardGame.Events;

public class GameEndedEventArgs : EventArgs
{
    public Player Winner { get; }
    public string Reason { get; }

    public GameEndedEventArgs(Player winner, string reason)
    {
        Winner = winner;
        Reason = reason;
    }
}
