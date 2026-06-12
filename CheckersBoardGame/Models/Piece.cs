// Model/Piece.cs
namespace CheckersBoardGame.Models;

public abstract class Piece
{
    public Player Owner { get; }
    public (int X, int Y) Position { get; private set; }

    protected Piece(Player owner, (int X, int Y) position)
    {
        Owner = owner;
        Position = position;
    }

    public abstract (int dx, int dy)[] GetMoveOffsets();

    public void MoveTo(int x, int y)
    {
        Position = (x, y);
    }
}