
class Player
{
    public readonly string name = "ray";
}

class Piece
{
    public readonly Player Player = new Player();
}

class Ngulik
{
    public static void Main()
    {

        Dictionary<(int, int), Piece> dict = new Dictionary<(int, int), Piece>();
        dict[(1, 2)] = new Piece();
        Console.WriteLine(dict[(1, 2)].Player.name);
    }
}
