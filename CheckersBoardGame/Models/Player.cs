using CheckersBoardGame.Types;

namespace CheckersBoardGame.Models;

public class Player
{
    public string Name { get; }
    public ConsoleColor Color { get; }
    public bool IsPlayerOne { get; }

    public Player(string name, ConsoleColor color, bool isPlayerOne = false)
    {
        Name = name;
        Color = color;
        IsPlayerOne = isPlayerOne;
    }
}