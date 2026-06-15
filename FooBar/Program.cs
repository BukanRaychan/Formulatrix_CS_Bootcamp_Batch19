using System.Text;

int n = 110;

StringBuilder result = new StringBuilder();

for (int i = 1; i <= n; i++)
{
    StringBuilder sb = new StringBuilder();
    if (i % 3 == 0) sb.Append("foo");
    if (i % 4 == 0) sb.Append("baz");
    if (i % 5 == 0) sb.Append("bar");
    if (i % 7 == 0) sb.Append("jazz");
    if (i % 9 == 0) sb.Append("huzz");
    if (sb.Length == 0) sb.Append(i);

    sb.Append(", ");

    result.Append(sb);
}

Console.WriteLine(result.ToString().TrimEnd(',', ' '));

