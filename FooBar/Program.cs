using System.Text;

int n = 30;

StringBuilder result = new StringBuilder();

for (int i = 1; i <= n; i++)
{
    StringBuilder sb = new StringBuilder();
    if (i % 3 == 0)
    {
        sb.Append("Foo");
    }
    if (i % 5 == 0)
    {
        sb.Append("Bar");
    }
    if (i % 7 == 0)
    {
        sb.Append("jazz");
    }
    if (sb.Length == 0)
    {
        sb.Append(i);
    }

    sb.Append(", ");

    result.Append(sb);
}

Console.WriteLine(result.ToString().TrimEnd(',', ' '));

