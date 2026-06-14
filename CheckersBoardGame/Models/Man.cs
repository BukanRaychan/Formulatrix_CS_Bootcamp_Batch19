namespace CheckersBoardGame.Models;

public class Man : Piece
{
    
    public Man(Player owner, (int X, int Y) position): base(owner, position){}

    public override (int dx, int dy)[] GetMoveOffsets()
    {
        // PlayerOne starts at the top and moves downward (increasing Y)
        int dy = Owner.IsPlayerOne ? +1 : -1;
        return new[] { (-1, dy), (+1, dy) };
    }
}