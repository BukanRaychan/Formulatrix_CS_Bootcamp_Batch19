using CheckersBoardGame.Models;
using CheckersBoardGame.Services;
using CheckersBoardGame.Types;
using CheckersBoardGame.Interfaces;

const bool development = true;

Console.WriteLine("Checkers - Console Edition");
Console.Write("Player One name: ");
var p1 = development ? "Ray" : Console.ReadLine() ?? "Player1";
Console.Write("Player Two name: ");
var p2 = development ? "Hay" :Console.ReadLine() ?? "Player2";

IBoard board = new Board(BoardSize.Standard);
var engine = new GameEngine(board, p1, p2);
var renderer = new ConsoleRenderer(board);

engine.MoveMade += (s, e) =>
{
    Console.WriteLine($"{e.Player.Name} moved from ({e.From.X},{e.From.Y}) to ({e.To.X},{e.To.Y}){(e.Crowned ? " and was crowned!" : "")} ");
};

engine.GameEnded += (s, e) =>
{
    Console.WriteLine($"Game over: {e.Winner.Name} wins. {e.Reason}");
};

engine.Start();

while (true)
{
	renderer.Render();
	Console.WriteLine($"Current: {engine.CurrentPlayer.Name}. Enter command (move x1 y1 x2 y2 | quit):");
	var line = Console.ReadLine();
	if (line is null) break;
	var parts = line.Split(' ', StringSplitOptions.RemoveEmptyEntries);
	if (parts.Length == 0) continue;
	var cmd = parts[0].ToLowerInvariant();
	if (cmd == "quit" || cmd == "exit") break;
	if (cmd == "move" && parts.Length == 5)
	{
		if (int.TryParse(parts[1], out int fx) && int.TryParse(parts[2], out int fy) &&
			int.TryParse(parts[3], out int tx) && int.TryParse(parts[4], out int ty))
		{
			if (!engine.TryMove(fx, fy, tx, ty, out var msg))
			{
				Console.WriteLine($"Move failed: {msg}");
				Console.WriteLine("Press Enter to continue..."); Console.ReadLine();
			}
			else if (engine.IsGameOver)
			{
				Console.WriteLine("Press Enter to exit...");
				Console.ReadLine();
				break;
			}
		}
		else
		{
			Console.WriteLine("Invalid coordinates.");
			Console.ReadLine();
		}
	}
	else
	{
		Console.WriteLine("Unknown command.");
		Console.ReadLine();
	}
}

Console.WriteLine("Goodbye!");
