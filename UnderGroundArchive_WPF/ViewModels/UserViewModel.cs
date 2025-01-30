using GalaSoft.MvvmLight.Command;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;
using UnderGroundArchive_WPF.Models;
using UnderGroundArchive_WPF.Services;

namespace UnderGroundArchive_WPF.ViewModels
{
    public class UserViewModel : INotifyPropertyChanged
    {
        private readonly ApiService _apiService;
        private readonly INavigationService _navigationService;
        private ObservableCollection<UserModel> _users;
        private UserModel _selectedUser;

        private List<string> _roleOptions = new List<string>
        {
            "User", "Author", "Critic", "Moderator", "Admin"
        };

        public List<string> RoleOptions
        {
            get => _roleOptions;
            set
            {
                _roleOptions = value;
                OnPropertyChanged();
            }
        }

        private string _selectedRole;
        public string SelectedRole
        {
            get => _selectedRole;
            set
            {
                _selectedRole = value;
                OnPropertyChanged();
            }
        }

        public UserViewModel(ApiService apiService, INavigationService navigationService)
        {
            _apiService = apiService;
            LoadUsersCommand = new RelayCommand(async () => await LoadUsersAsync());
            ChangeMuteStatusCommand = new RelayCommand(async () => await ChangeMuteStatusAsync());
            ChangeBanStatusCommand = new RelayCommand(async () => await ChangeBanStatusAsync());
            UpdateUserRoleCommand = new RelayCommand(async () => await UpdateUserRoleAsync());
            GoToRequestsCommand = new RelayCommand(async () => await GoToRequests());
            _navigationService = navigationService;
        }

        private async Task GoToRequests()
        {
            _navigationService.NavigateTo<RequestViewModel>();
        }

        public ObservableCollection<UserModel> Users
        {
            get => _users;
            set
            {
                _users = value;
                OnPropertyChanged();
            }
        }

        public UserModel SelectedUser
        {
            get => _selectedUser;
            set
            {
                _selectedUser = value;
                OnPropertyChanged();
            }
        }

        public ICommand LoadUsersCommand { get; }
        public ICommand ChangeMuteStatusCommand { get; }
        public ICommand ChangeBanStatusCommand { get; }
        public ICommand UpdateUserRoleCommand { get; }
        public ICommand GoToRequestsCommand { get; }

        private async Task LoadUsersAsync()
        {
            var users = await _apiService.GetUsersAsync();
            Users = new ObservableCollection<UserModel>(users);
        }

        private async Task ChangeMuteStatusAsync()
        {
            if (SelectedUser != null)
            {
                var success = await _apiService.ChangeMuteStatusAsync(SelectedUser.Id);
                if (success)
                {
                    SelectedUser.IsMuted = !SelectedUser.IsMuted;
                    await LoadUsersAsync();
                }
            }
        }


        private async Task ChangeBanStatusAsync()
        {
            if (SelectedUser != null && !string.IsNullOrEmpty(SelectedUser.Id))
            {
                var success = await _apiService.ChangeBanStatusAsync(SelectedUser.Id);
                if (success)
                {
                    SelectedUser.IsBanned = !SelectedUser.IsBanned;
                    await LoadUsersAsync();                    
                }
            }
        }



        private async Task UpdateUserRoleAsync()
        {
            if (SelectedUser != null && !string.IsNullOrEmpty(SelectedRole))
            {
                var success = await _apiService.UpdateUserRoleAsync(SelectedUser.Id, SelectedRole);
                if (success)
                {
                    SelectedUser.RoleName = SelectedRole;
                    await LoadUsersAsync();
                }
            }
        }



        public event PropertyChangedEventHandler PropertyChanged;
        protected void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
