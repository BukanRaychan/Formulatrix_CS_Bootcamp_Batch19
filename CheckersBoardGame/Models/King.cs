namespace CheckersBoardGame.Models;

public class King : Piece
{
    public King(Player owner, (int X, int Y) position)
        : base(owner, position)
    {
    }

    public override (int dx, int dy)[] GetMoveOffsets()
    {
        return [(-1, -1), (+1, -1), (-1, +1), (+1, +1)];
    }
}