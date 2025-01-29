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

        public UserViewModel(ApiService apiService)
        {
            _apiService = apiService;
            LoadUsersCommand = new RelayCommand(async () => await LoadUsersAsync());
            ChangeMuteStatusCommand = new RelayCommand(async () =>
            {
                Trace.WriteLine("ChangeMuteStatusCommand executed");
                await ChangeMuteStatusAsync();
            });
            ChangeBanStatusCommand = new RelayCommand(async () =>
            {
                Trace.WriteLine("ChangeBanStatusCommand executed");
                await ChangeBanStatusAsync();
            });
            UpdateUserRoleCommand = new RelayCommand(async () =>
            {
                Trace.WriteLine("UpdateUserRoleCommand executed");
                await UpdateUserRoleAsync();
            });
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
            Trace.WriteLine("Attempting to change mute status...");
            if (SelectedUser != null)
            {
                var success = await _apiService.ChangeMuteStatusAsync(SelectedUser.Id);
                Trace.WriteLine(success ? "Mute status changed" : "Mute status change failed");
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
