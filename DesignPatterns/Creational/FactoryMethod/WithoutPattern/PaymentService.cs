namespace DesignPatterns.Creational.FactoryMethodExamples.WithoutPattern;

// Every checkout flow that needs to charge a customer has to repeat this
// same switch. Adding a new gateway (e.g. Razorpay) means finding and
// editing every one of these switches across the codebase.
public class PaymentService
{
    public void Checkout(string gateway, decimal amount)
    {
        Console.WriteLine($"Processing payment of ${amount}...");

        IPaymentMethod Method = gateway switch
        {
            "stripe" => new StripePaymentMethod(),
            "paypal" => new PayPalPaymentMethod(),
            _ => throw new ArgumentException($"Unknown gateway: {gateway}")
        };

        Method.Pay(amount);
        Console.WriteLine("Payment completed.");
    }
}
