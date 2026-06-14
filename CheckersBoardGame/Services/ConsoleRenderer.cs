using CheckersBoardGame.Models;
using CheckersBoardGame.Interfaces;

namespace CheckersBoardGame.Services;

public class ConsoleRenderer
{
    private readonly IBoard _board;

    public ConsoleRenderer(IBoard board)
    {
        _board = board;
    }

    public void Render()
    {
        Console.Clear();
        int size = _board.Size;
        Console.Write("   ");
        for (int x = 0; x < size; x++) Console.Write($" {x} ");
        Console.WriteLine();

        for (int y = 0; y < size; y++)
        {
            Console.Write($" {y} ");
            for (int x = 0; x < size; x++)
            {
                var p = _board.GetPieceAt(x, y);
                if (p is null)
                {
                    Console.ForegroundColor = (x + y) % 2 == 1 ? ConsoleColor.White  : ConsoleColor.Black;
                    Console.Write(" ☐ ");
                }
                else
                {
                    var ch = p is King ? 'K' : 'M';
                    var color = p.Owner.IsPlayerOne ? ConsoleColor.Blue : ConsoleColor.Red;
                    Console.ForegroundColor = color;
                    Console.Write($" {ch} ");
                }
                Console.ResetColor();
            }
            Console.WriteLine();
        }
    }
}
