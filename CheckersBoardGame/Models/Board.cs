using CheckersBoardGame.Types;

namespace CheckersBoardGame.Models;

public class Board
{
    private readonly Piece?[,] _grid;

    public Board(BoardSize size, Player playerOne, Player playerTwo)
    {
        int boardSize = (int)size;
        _grid = new Piece?[boardSize, boardSize];
        for (int y = 0; y < (boardSize - 2) / 2; y++)
        {
            for (int x = 0; x < boardSize; x++)
            {
                if (x % 2 == 0)
                {
                    _grid[y,x] = null;
                    _grid[y + boardSize/ 2 + 1, x] = new Man(playerTwo, (x, y + boardSize/ 2 + 1));
                } else
                {
                    _grid[y,x] = new Man(playerOne, (x, y));
                    _grid[y + boardSize/ 2 + 1, x] = null;
                }
                
                
            }
        }
    }

    public void Place(Piece piece)
    {
        _grid[piece.Position.X, piece.Position.Y] = piece;
    }

    public bool TryMove(Piece piece, int toX, int toY)
    {
        if (!IsValidMove(piece, toX, toY))
            return false;

        _grid[piece.Position.X, piece.Position.Y] = null;   
        _grid[toX, toY] = piece;                            
        piece.MoveTo(toX, toY);                              
        return true;
    }

    private bool IsValidMove(Piece piece, int toX, int toY)
    {
        if (!IsInside(toX, toY)) return false;          
        if (_grid[toX, toY] is not null) return false;  

        foreach (var (dx, dy) in piece.GetMoveOffsets())
        {
            if (piece.Position.X + dx == toX && piece.Position.Y + dy == toY)
                return true;                           
        }
        return false;                                   
    }

    private static bool IsInside(int x, int y) =>
        x is >= 0 and < 8 && y is >= 0 and < 8;
}