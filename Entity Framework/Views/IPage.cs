namespace EntityFramework.Views;

// A page is one screen. Index() renders it, handles input, and returns
// the next page to show — or null to exit the app.
public interface IPage
{
    IPage? Index();
}
