using CheckersBoardGame.Types;
using CheckersBoardGame.Interfaces;

namespace CheckersBoardGame.Models;

public class Board : IBoard
{
    private readonly Piece?[,] _grid;
    public int Size { get; }

    public Board(BoardSize size)
    {
        Size = (int)size;
        _grid = new Piece?[Size, Size];
    }

    public void Initialize(Player playerOne, Player playerTwo)
    {
        int rows = Size / 2 - 1;
        for (int y = 0; y < rows; y++)
        for (int x = 0; x < Size; x++)
        {
            int by = Size / 2 + 1 + y;
            if ((x + y) % 2 != 1) 
            {
                _grid[y, x] = null;
                _grid[by, x] = new Man(playerTwo, (x, by));
            } else
            {
                _grid[y, x] = new Man(playerOne, (x, y));
                _grid[by, x] = null;
            }
        }
    }

    public Piece? GetPieceAt(int x, int y) => IsInside(x, y) ? _grid[y, x] : null;

    public bool TryMove(Piece piece, int toX, int toY, out bool crowned, out bool captured, out bool hasMoreCapture)
    {
        crowned = false;
        captured = false;
        hasMoreCapture = false;

        if (!IsInside(toX, toY)) return false;
        if (_grid[toY, toX] is not null) return false;

        foreach (var (dx, dy) in piece.GetMoveOffsets())
        {
            var stepX = piece.Position.X + dx;
            var stepY = piece.Position.Y + dy;
            var jumpX = piece.Position.X + 2 * dx;
            var jumpY = piece.Position.Y + 2 * dy;

            if (stepX == toX && stepY == toY)
            {
                if (HasCaptureMoves(piece.Owner))
                    return false;

                return PerformMove(piece, toX, toY, false, out crowned, out hasMoreCapture);
            }

            if (jumpX == toX && jumpY == toY)
            {
                var capturedPiece = GetPieceAt(stepX, stepY);
                if (capturedPiece is null || capturedPiece.Owner == piece.Owner)
                    return false;

                _grid[stepY, stepX] = null;
                captured = true;
                if (!PerformMove(piece, toX, toY, true, out crowned, out hasMoreCapture))
                    return false;

                return true;
            }
        }

        return false;
    }

    private bool PerformMove(Piece piece, int toX, int toY, bool capture, out bool crowned, out bool hasMoreCapture)
    {
        crowned = false;
        hasMoreCapture = false;

        _grid[piece.Position.Y, piece.Position.X] = null;
        _grid[toY, toX] = piece;
        piece.MoveTo(toX, toY);

        if (piece is Man)
        {
            var lastRow = piece.Owner.IsPlayerOne ? Size - 1 : 0;
            if (piece.Position.Y == lastRow)
            {
                var king = new King(piece.Owner, piece.Position);
                _grid[toY, toX] = king;
                crowned = true;
                piece = king;
            }
        }

        if (capture)
        {
            hasMoreCapture = GetLegalMoves(piece).Any(move => move.IsCapture);
        }

        return true;
    }

    public IEnumerable<LegalMove> GetLegalMoves(Player player)
    {
        var allMoves = AllPieces()
            .Where(piece => piece.Owner == player)
            .SelectMany(GetLegalMoves)
            .ToList();

        return allMoves.Any(move => move.IsCapture)
            ? allMoves.Where(move => move.IsCapture)
            : allMoves;
    }

    public IEnumerable<LegalMove> GetLegalMoves(Piece piece)
    {
        foreach (var (dx, dy) in piece.GetMoveOffsets())
        {
            var stepX = piece.Position.X + dx;
            var stepY = piece.Position.Y + dy;
            if (IsInside(stepX, stepY) && _grid[stepY, stepX] is null)
            {
                yield return new LegalMove(piece, stepX, stepY, false);
            }

            var jumpX = piece.Position.X + 2 * dx;
            var jumpY = piece.Position.Y + 2 * dy;
            if (!IsInside(jumpX, jumpY))
                continue;

            var middlePiece = GetPieceAt(piece.Position.X + dx, piece.Position.Y + dy);
            if (middlePiece is null || middlePiece.Owner == piece.Owner)
                continue;

            if (_grid[jumpY, jumpX] is null)
            {
                yield return new LegalMove(piece, jumpX, jumpY, true);
            }
        }
    }

    public bool HasAnyMoves(Player player) => GetLegalMoves(player).Any();

    public bool HasCaptureMoves(Player player) => GetLegalMoves(player).Any(move => move.IsCapture);

    private bool IsInside(int x, int y) => x >= 0 && x < Size && y >= 0 && y < Size;

    public IEnumerable<Piece> AllPieces()
    {
        for (int y = 0; y < Size; y++)
            for (int x = 0; x < Size; x++)
                if (_grid[y, x] is not null)
                    yield return _grid[y, x]!;
    }
}
