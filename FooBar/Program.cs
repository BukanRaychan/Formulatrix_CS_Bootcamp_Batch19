using System.Text;
using Spectre.Console;
using FooBar;

RulesBuilder rulesBuider = new RulesBuilder()
{
    Rule = (idx, pair) => idx % pair.Num == 0
};

AnsiConsole.Clear();

while (true)
{
    var pairRows = rulesBuider.Pairs.Select(p => new Markup($"[bold]{p.Num}:[/] {p.Msg}"));

    var panel = new Panel(
            new Rows(rulesBuider.Pairs.Count > 0 ? pairRows : [new Markup("[grey]Pweaseee insert the pair first[/]")])
        )
            .Header("[bold yellow]Pairs of Num and Msg[/]")
            .Border(BoxBorder.Rounded)
            .Expand();
    AnsiConsole.Write(panel);

    var action = AnsiConsole.Prompt(
        new SelectionPrompt<string>()
            .Title("[bold]FooBar Console App[/]")
            .AddChoices(
                "Edit or Add", "Delete", "Generate", "Quit")
            );

    switch (action)
    {
        case "Edit or Add":
            int num = AnsiConsole.Ask<int>("insert [bold]num[/]? ");
            string msg = AnsiConsole.Ask<string>("insert [bold]msg[/]? ");
            int pos = AnsiConsole.Prompt(
                new TextPrompt<int>("insert [bold]position[/] (default: last position)? ")
                    .AllowEmpty()
                    .DefaultValue(-1));
            rulesBuider.EditOrAddPair(num, msg, pos);
            break;
        case "Delete":
            int numDelete = AnsiConsole.Ask<int>("insert [green]num[/]?");
            rulesBuider.RemovePair(numDelete);
            break;
        case "Generate":
            int n = AnsiConsole.Ask<int>("insert [green]n[/]?");
            if(rulesBuider.Pairs.Count() == 0) break;
            StringBuilder result = new();
            for (int i = 1; i <= n; i++)
            {
                StringBuilder temp = new();
                foreach (var pair in rulesBuider.Pairs)
                {
                    if (rulesBuider.Rule(i, pair)) temp.Append($"[bold white]{pair.Msg}[/]");
                }
                result.Append(temp.Length > 0 ? temp.ToString() : i.ToString());
                if (i < n) result.Append(", ");
            }
            AnsiConsole.MarkupLine(result.ToString());
            AnsiConsole.MarkupLine("[grey]Press any key to continue...[/]");
            Console.ReadKey(true);
            break;
        default:
            return;
    }
    AnsiConsole.Clear();
}





