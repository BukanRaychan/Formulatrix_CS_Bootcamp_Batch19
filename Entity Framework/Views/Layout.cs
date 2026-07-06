using Spectre.Console;

namespace EntityFramework.Views;

// Shared Spectre.Console chrome and input helpers. Pages render their body
// through these so colors, headers and prompts stay consistent everywhere.
public static class Layout
{
    // Clear the screen and print a consistent page header.
    public static void Header(string title)
    {
        AnsiConsole.Clear();
        AnsiConsole.Write(
            new Rule($"[bold yellow]{title}[/]")
                .RuleStyle("grey")
                .LeftJustified());
        AnsiConsole.WriteLine();
    }

    // Ask for non-empty text.
    public static string AskText(string label) =>
        AnsiConsole.Prompt(
            new TextPrompt<string>($"[green]{label}[/]:")
                .PromptStyle("cyan")
                .ValidationErrorMessage("[red]This value can't be empty[/]")
                .Validate(v => string.IsNullOrWhiteSpace(v)
                    ? ValidationResult.Error()
                    : ValidationResult.Success()));

    // Ask for a non-negative decimal (Spectre reprompts on bad input).
    public static decimal AskDecimal(string label) =>
        AnsiConsole.Prompt(
            new TextPrompt<decimal>($"[green]{label}[/]:")
                .PromptStyle("cyan")
                .ValidationErrorMessage("[red]Enter a valid number[/]")
                .Validate(v => v < 0
                    ? ValidationResult.Error("[red]Must be zero or more[/]")
                    : ValidationResult.Success()));

    // User-supplied text is escaped so names with [ ] don't break markup.
    public static void Success(string message) =>
        AnsiConsole.MarkupLine($"[green]✓ {Markup.Escape(message)}[/]");

    public static void Error(string message) =>
        AnsiConsole.MarkupLine($"[red]✗ {Markup.Escape(message)}[/]");

    public static void Info(string message) =>
        AnsiConsole.MarkupLine($"[grey]{Markup.Escape(message)}[/]");

    public static void Pause()
    {
        AnsiConsole.WriteLine();
        AnsiConsole.Markup("[grey]Press any key to continue...[/]");
        Console.ReadKey(true);
    }
}
