﻿using System;
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
        private string _username;
        private string _password;

        public LoginViewModel(ApiService apiService)
        {
            _apiService = apiService;
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


            var (isSuccess, token) = await _apiService.LoginAsync(Username, Password);

            if (isSuccess && !string.IsNullOrEmpty(token))
            {
                MessageBox.Show("Login successful! Token received.");

                // Store the JWT token in ApiService
                _apiService.SetToken(token);

                // Open Admin Dashboard
                var userView = new Views.UserView(new UserViewModel(_apiService));
                userView.Show();
                Application.Current.MainWindow?.Close();
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
