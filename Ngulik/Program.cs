
class Player(string name)
{
    public readonly string name = name;
}

class Piece(string name)
{
    public readonly Player Player = new Player(name);
}

class Ngulik
{
    public static void Main()
    {

        Dictionary<(int, int), Piece> dict = new Dictionary<(int, int), Piece>();
        int n = 3;
        dict[(1, 1)] = new Piece("1");
        dict[(1, 2)] = new Piece("2");
        dict[(1, 3)] = new Piece("3");
        dict[(2, 1)] = new Piece("4");
        dict[(2, 2)] = new Piece("5");
        dict[(2, 3)] = new Piece("6");
        
        int i = 0;
        foreach (var (k, v) in dict)
        {
            Console.Write($" |{k.Item1}, {k.Item2}: {v.Player.name}| ");
            if (i % n == 2) Console.WriteLine();
            i = (i + 1) % n;
        }
    }
}
