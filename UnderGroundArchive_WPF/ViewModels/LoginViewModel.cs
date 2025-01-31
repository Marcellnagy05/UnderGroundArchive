using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using System.Windows;
using UnderGroundArchive_WPF.Services;
using GalaSoft.MvvmLight.Command;
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace UnderGroundArchive_WPF.ViewModels
{
    public class LoginViewModel
    {
        private readonly ApiService _apiService;
        private readonly INavigationService _navigationService;
        private string _username;
        private string _password;

        public LoginViewModel(ApiService apiService, INavigationService navigationService)
        {
            _apiService = apiService;
            _navigationService = navigationService;
            LoginCommand = new RelayCommand(async () => await LoginAsync());
        }

        public string Username
        {
            get => _username;
            set
            {
                _username = value;
                OnPropertyChanged();
            }
        }

        public string Password
        {
            get => _password;
            set
            {
                _password = value;
                OnPropertyChanged();
            }
        }

        public ICommand LoginCommand { get; }

        private async Task LoginAsync()
        {
            var (isSuccess, token, role) = await _apiService.LoginAsync(Username, Password);

            if (isSuccess && !string.IsNullOrEmpty(token))
            {
                MessageBox.Show("Login successful! Token received.");

                // Store the JWT token in ApiService
                _apiService.SetToken(token);

                // Check the user's role and redirect accordingly
                if (role == "Admin")
                {
                    _navigationService.NavigateTo<UserViewModel>();
                }
                else if (role == "Moderator")
                {
                    _navigationService.NavigateTo<ModeratorViewModel>();
                }
                else
                {
                    MessageBox.Show("Access denied! You do not have the required permissions.");
                }
                _navigationService.CloseCurrentWindow();
            }
            else
            {
                MessageBox.Show("Login failed! Please check your credentials.");
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;
        protected void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

    }
}
