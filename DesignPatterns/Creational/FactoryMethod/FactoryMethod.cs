
using WithoutPattern = DesignPatterns.Creational.FactoryMethodExamples.WithoutPattern;
using WithPattern = DesignPatterns.Creational.FactoryMethodExamples.WithPattern;

namespace DesignPatterns.Creational;

public class FactoryMethod : IApp
{
    public void Run()
    {
        //========= Without Factory Method =========
        var checkout = new WithoutPattern.PaymentService();
        checkout.Checkout("stripe", 49.99m);
        checkout.Checkout("paypal", 19.99m);
        // Adding Razorpay here means editing CheckoutService's switch statement.

        //========= With Factory Method =========
        WithPattern.PaymentProcessorCreator creator = new WithPattern.StripePaymentCreator();
        creator.Checkout(49.99m);

        creator = new WithPattern.PayPalPaymentCreator();
        creator.Checkout(19.99m);

        creator = new WithPattern.RazorpayPaymentCreator();
        creator.Checkout(9.99m);
        // Razorpay support required zero changes to existing classes -
        // just a new creator, satisfying the Open/Closed Principle.
    }
}