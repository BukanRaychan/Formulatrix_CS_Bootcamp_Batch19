public class NotificationEventArgs : EventArgs
{
    public string Message { get; set; } = string.Empty;
    public string Recipient { get; set; } = string.Empty;
    public string SenderName { get; set; } = string.Empty;
}

public interface INotificationService
{
    event EventHandler<NotificationEventArgs>? NotificationSent;
    void SendNotification(string message, string recipient);
}

public class NotificationService : INotificationService
{
    public event EventHandler<NotificationEventArgs>? NotificationSent;
    private string _name;

    public NotificationService(string name)
    {
        _name = name;
    }

    public void SendNotification(string message, string recipient)
    {
        Console.WriteLine($"Sending notification to {recipient}: {message}");

        OnNotificationSent(new NotificationEventArgs
        {
            Message = message,
            Recipient = recipient,
            SenderName = _name
        });
    }

    protected virtual void OnNotificationSent(NotificationEventArgs e)
    {
        NotificationSent?.Invoke(this, e); 
    }
}

public class Whatsapp
{
    public void SendMessage(object? sender, NotificationEventArgs args)
    {
        Console.WriteLine($"Hai {args.Recipient}, my name is {args.SenderName}, I want to tell you that {args.Message}");
    }
}

public class Email
{
    public void SendEmail(object? sender, NotificationEventArgs args)
    {
        Console.WriteLine($"Dear {args.Recipient}, my name is {args.SenderName}, I want to inform you that {args.Message}");
    }
}

public class Program
{
    public static void Main(string[] args)
    {
        INotificationService notificationService = new NotificationService("admin");

        Whatsapp whatsapp = new Whatsapp();
        Email email = new Email();

        notificationService.NotificationSent += whatsapp.SendMessage;
        notificationService.NotificationSent += email.SendEmail;

        notificationService.SendNotification("Your order has been placed!", "Ray");
    }
}