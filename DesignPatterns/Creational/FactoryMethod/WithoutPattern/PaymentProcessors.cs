namespace DesignPatterns.Creational.FactoryMethodExamples.WithoutPattern;

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
