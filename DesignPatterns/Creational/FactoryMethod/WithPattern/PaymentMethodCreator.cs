namespace DesignPatterns.Creational.FactoryMethodExamples.WithPattern;

// The "creator". Checkout() is the template that stays fixed;
// CreateMethod() is the factory method each subclass overrides
// to decide which concrete gateway gets built.
public abstract class PaymentProcessorCreator
{
    public void Checkout(decimal amount)
    {
        Console.WriteLine($"Processing payment of ${amount}...");
        IPaymentMethod Method = CreateMethod();
        Method.Pay(amount);
        Console.WriteLine("Payment completed.");
    }

    protected abstract IPaymentMethod CreateMethod();
}

public class StripePaymentCreator : PaymentProcessorCreator
{
    protected override IPaymentMethod CreateMethod() => new StripePaymentMethod();
}

public class PayPalPaymentCreator : PaymentProcessorCreator
{
    protected override IPaymentMethod CreateMethod() => new PayPalPaymentMethod();
}

public class RazorpayPaymentCreator : PaymentProcessorCreator
{
    protected override IPaymentMethod CreateMethod() => new RazorpayPaymentMethod();
}
