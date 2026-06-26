using System;
using System.IO;
using System.Xml.Serialization;

[Serializable]
public class User(int id, string name);

[Serializable]
public class Response(bool success, string message, User[] users);

public class Program
{
    static void Main(String[] args)
    {
        string dataDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Data", "JSON");
        
        if (!Directory.Exists(dataDirectory))
        {
            Directory.CreateDirectory(dataDirectory);
        }
        
        
        // StreamWriter sw = new StreamWriter("data.json");
        // sw.Close();
    }    
}

