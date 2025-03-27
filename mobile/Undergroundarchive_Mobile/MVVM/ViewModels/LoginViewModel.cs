using System.Windows.Input;
using Undergroundarchive_Mobile.Services;
using Microsoft.Maui.Controls;
using Undergroundarchive_Mobile.MVVM.ViewModels;
using Undergroundarchive_Mobile.MVVM.Views;

public class LoginViewModel : BaseViewModel
{
    public string Username { get; set; }
    public string Password { get; set; }

    public ICommand LoginCommand { get; }

    public LoginViewModel()
    {
        LoginCommand = new Command(async () => await LoginAsync());
    }

    private async Task LoginAsync()
    {
        var apiService = new ApiService();
        string token = await apiService.LoginAsync(Username, Password);

        if (!string.IsNullOrEmpty(token))
        {
            AuthService.Instance.Login(token);
        }
        else
        {
            await Application.Current.MainPage.DisplayAlert("Hiba", "Sikertelen bejelentkezés!", "OK");
        }
    }
}
