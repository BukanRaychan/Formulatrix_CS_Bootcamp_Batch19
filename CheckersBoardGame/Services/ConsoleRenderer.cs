using CheckersBoardGame.Models;
using CheckersBoardGame.Interfaces;
using CheckersBoardGame.Events;

namespace CheckersBoardGame.Services;

public class ConsoleRenderer : IConsoleRenderer
{
    private readonly IBoard _board;
    private string _eventMessage;

    public ConsoleRenderer(IBoard board)
    {
        _board = board;
        _eventMessage = "";
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
                    Console.ForegroundColor = p.Owner.Color;
                    Console.Write($" {ch} ");
                }
                Console.ResetColor();
            }
            Console.WriteLine();
        }

        if (_eventMessage != "")
        {
            Console.ForegroundColor = ConsoleColor.Black;
            Console.BackgroundColor = ConsoleColor.Yellow;
            Console.WriteLine($"{_eventMessage}");
            Console.ResetColor();
            _eventMessage = "";
        }
    }

    public void MoveEvent(object? s, MoveEventArgs e)
    {
        _eventMessage = $"{e.Player.Name} moved from ({e.From.X},{e.From.Y}) to ({e.To.X},{e.To.Y}){(e.Crowned ? " and was crowned!" : "")} ";
    }
}
