int n = 15;

for(int i = 1; i <= n; i++)
{
    if (i % 3 == 0)
    {
        Console.Write("foo");
    }

    if (i % 5 == 0)
    {
        Console.Write("bar");
    }

    if (i % 3 != 0 && i % 5 != 0)
    {
        Console.Write(i);
    }

    Console.Write(", ");
}

