namespace DesignPatterns.Creational.FactoryMethodExamples.WithPattern;

public interface IPaymentMethod
{
    void Pay(decimal amount);
}

public class StripePaymentMethod : IPaymentMethod
{
    public void Pay(decimal amount) => Console.WriteLine($"[Stripe] Charged ${amount}");
}

public class PayPalPaymentMethod : IPaymentMethod
{
    public void Pay(decimal amount) => Console.WriteLine($"[PayPal] Charged ${amount}");
}

public class RazorpayPaymentMethod : IPaymentMethod
{
    public void Pay(decimal amount) => Console.WriteLine($"[Razorpay] Charged ${amount}");
}
