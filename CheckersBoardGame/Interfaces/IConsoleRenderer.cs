using CheckersBoardGame.Events;

namespace CheckersBoardGame.Interfaces;

public interface IConsoleRenderer
{
    void Render();
    void MoveEvent(object? sender, MoveEventArgs e);
}
