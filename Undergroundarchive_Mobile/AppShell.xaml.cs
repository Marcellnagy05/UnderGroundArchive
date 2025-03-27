using Undergroundarchive_Mobile.Services;
using Undergroundarchive_Mobile.MVVM.Views;
using Microsoft.Maui.Controls;
using System.Diagnostics;

namespace Undergroundarchive_Mobile;
public partial class AppShell : Shell
{
    public AppShell()
    {
        InitializeComponent();
        AuthService.Instance.OnAuthStateChanged += UpdateShellItems;
        UpdateShellItems();
        CurrentItem = Items.FirstOrDefault();
    }

    private void UpdateShellItems()
    {
        Debug.WriteLine("UpdateShellItems called");

        MainThread.BeginInvokeOnMainThread(() =>
        {
            var newTabBar = new TabBar();

            newTabBar.Items.Add(new ShellContent
            {
                Title = "Home",
                ContentTemplate = new DataTemplate(typeof(HomeView)),
                Icon = "home_icon.png"
            });

            if (AuthService.Instance.IsLoggedIn)
            {
                Debug.WriteLine("User is logged in, adding books page");

                newTabBar.Items.Add(new ShellContent
                {
                    Title = "Books",
                    ContentTemplate = new DataTemplate(typeof(BooksView)),
                    Icon = "book.png"
                });

                // Logout gombot a Toolbar-ba tesszük
                this.ToolbarItems.Clear();
                this.ToolbarItems.Add(new ToolbarItem
                {
                    Text = "Logout",
                    Command = new Command(async () =>
                    {
                        await AuthService.Instance.Logout();
                        UpdateShellItems();
                    })
                });
            }
            else
            {
                Debug.WriteLine("User is NOT logged in, adding login page");

                newTabBar.Items.Add(new ShellContent
                {
                    Title = "Login",
                    ContentTemplate = new DataTemplate(typeof(LoginView)),
                    Icon = "login.png"
                });

                // Ha nincs bejelentkezve, akkor töröljük a Logout gombot
                this.ToolbarItems.Clear();
            }

            this.Items.Clear();
            this.Items.Add(newTabBar);
        });
    }
}
