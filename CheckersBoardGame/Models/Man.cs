namespace CheckersBoardGame.Models;

public class Man : Piece
{
    
    public Man(Player owner, (int X, int Y) position): base(owner, position){}

    public override (int dx, int dy)[] GetMoveOffsets()
    {
        int dy = Owner.IsPlayerOne ? -1 : +1;
        return [(-1, dy), (+1, dy)];
    }
}