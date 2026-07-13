

// Singleton Class
public sealed class Service
{
    public Service() { }

    private static Service? _instance;
    private static int _totCall = 0;
    public string ExternalAPIURL {get;set;} = "";

    public static Service GetInstance()
    {
        if (_instance == null)
        {
            _instance = new Service();
        }
        return _instance;
    }

    public string Fetch()
    {
        string res = $"FETCH_{_totCall++:00}_STATUS: ";
        res += ExternalAPIURL == "" ? "ERROR" : "Data is fetched successfully";
        return  res;
    }
}
public class GlobalVariable
{
    public static Service Service {get;} = new Service(){ExternalAPIURL = "https://realdomain.com"};
}

public class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine(GlobalVariable.Service.Fetch());
        
        /*
            Long Code Section
        **/
        Service.GetInstance().ExternalAPIURL = "https://realdomain.com";

        Console.WriteLine(Service.GetInstance().Fetch());
        Console.WriteLine(Service.GetInstance().Fetch());
        Console.WriteLine(Service.GetInstance().Fetch());
        Console.WriteLine(Service.GetInstance().Fetch());
        Console.WriteLine(Service.GetInstance().Fetch());
        Console.WriteLine(Service.GetInstance().Fetch());
        Console.WriteLine(Service.GetInstance().Fetch());
    }
}