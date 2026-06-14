using CheckersBoardGame.Models;

namespace CheckersBoardGame.Interfaces;

public interface IBoard
{
    int Size { get; }
    void Initialize(Player playerOne, Player playerTwo);
    Piece? GetPieceAt(int x, int y);
    bool TryMove(Piece piece, int toX, int toY, out bool crowned, out bool captured, out bool hasMoreCapture);
    IEnumerable<Piece> AllPieces();
    IEnumerable<LegalMove> GetLegalMoves(Player player);
    IEnumerable<LegalMove> GetLegalMoves(Piece piece);
    bool HasAnyMoves(Player player);
}
