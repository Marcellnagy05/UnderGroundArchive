using GalaSoft.MvvmLight.Command;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using UnderGroundArchive_WPF.Models;
using UnderGroundArchive_WPF.Services;

namespace UnderGroundArchive_WPF.ViewModels
{
    public class UserViewModel : INotifyPropertyChanged
    {
        private readonly ApiService _apiService;
        private ObservableCollection<UserModel> _users;
        private UserModel _selectedUser;

        public UserViewModel(ApiService apiService)
        {
            _apiService = apiService;
            LoadUsersCommand = new RelayCommand(async () => await LoadUsersAsync());
            ChangeMuteStatusCommand = new RelayCommand(async () => await ChangeMuteStatusAsync());
            ChangeBanStatusCommand = new RelayCommand(async () => await ChangeBanStatusAsync());
            UpdateUserRoleCommand = new RelayCommand(async () => await UpdateUserRoleAsync());
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
                }
            }
        }

        private async Task ChangeBanStatusAsync()
        {
            if (SelectedUser != null)
            {
                var success = await _apiService.ChangeBanStatusAsync(SelectedUser.Id);
                if (success)
                {
                    SelectedUser.IsBanned = !SelectedUser.IsBanned;
                }
            }
        }

        private async Task UpdateUserRoleAsync()
        {
            if (SelectedUser != null)
            {
                var newRoleName = "Admin"; // Replace with actual role selection logic
                var success = await _apiService.UpdateUserRoleAsync(SelectedUser.Id, newRoleName);
                if (success)
                {
                    SelectedUser.RoleName = newRoleName;
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
