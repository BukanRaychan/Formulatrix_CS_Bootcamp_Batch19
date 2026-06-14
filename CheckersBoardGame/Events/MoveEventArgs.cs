using CheckersBoardGame.Models;

namespace CheckersBoardGame.Events;

public class MoveEventArgs : EventArgs
{
    public Player Player { get; }
    public (int X, int Y) From { get; }
    public (int X, int Y) To { get; }
    public Piece Piece { get; }
    public bool Crowned { get; }

    public MoveEventArgs(Player player, (int X, int Y) from, (int X, int Y) to, Piece piece, bool crowned)
    {
        Player = player;
        From = from;
        To = to;
        Piece = piece;
        Crowned = crowned;
    }
}
