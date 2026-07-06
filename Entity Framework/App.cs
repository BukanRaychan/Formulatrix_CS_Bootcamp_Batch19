using EntityFramework.Controllers;
using EntityFramework.Views;
using EntityFramework.Views.Pages;

namespace EntityFramework;

public class App
{
    private readonly MenuController _controller;

    public App(MenuController controller) => _controller = controller;

    public void Run()
    {
        IPage? page = new MainMenuPage(_controller);
        while (page is not null)
            page = page.Index();
    }
}
