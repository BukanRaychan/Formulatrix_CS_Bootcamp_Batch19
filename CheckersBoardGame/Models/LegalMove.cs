namespace CheckersBoardGame.Models;

public sealed record LegalMove(Piece Piece, int ToX, int ToY, bool IsCapture);
