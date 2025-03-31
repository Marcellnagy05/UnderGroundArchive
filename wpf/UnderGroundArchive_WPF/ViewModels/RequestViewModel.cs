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
    public class RequestViewModel : INotifyPropertyChanged
    {
        private readonly ApiService _apiService;
        private ObservableCollection<RequestModel> _requests;
        private RequestModel _selectedRequest;

        public RequestViewModel(ApiService apiService)
        {
            _apiService = apiService;
            LoadRequestsCommand = new RelayCommand(async () => await LoadRequestsAsync());
            AcceptRequestCommand = new RelayCommand(async () => await AcceptRequestAsync());
            DenyRequestCommand = new RelayCommand(async () => await DenyRequestAsync());
            GoToUsersCommand = new RelayCommand(async () => await GoToUsers());
        }

        public ObservableCollection<RequestModel> Requests
        {
            get => _requests;
            set
            {
                _requests = value;
                OnPropertyChanged();
            }
        }

        public RequestModel SelectedRequest
        {
            get => _selectedRequest;
            set
            {
                _selectedRequest = value;
                OnPropertyChanged();
            }
        }

        public ICommand LoadRequestsCommand { get; }
        public ICommand AcceptRequestCommand { get; }
        public ICommand DenyRequestCommand { get; }
        public ICommand GoToUsersCommand { get; }


        private async Task GoToUsers()
        {
            var userView = new Views.UserView(new UserViewModel(_apiService));
            Application.Current.Windows.OfType<Window>().SingleOrDefault(w => w.IsActive)?.Close();
            userView.Show();
        }
        private async Task LoadRequestsAsync()
        {
            var requests = await _apiService.GetPendingRequestsAsync();
            Requests = new ObservableCollection<RequestModel>(requests);
        }

        private async Task AcceptRequestAsync()
        {
            if (SelectedRequest != null)
            {
                var success = await _apiService.AcceptRequestAsync(SelectedRequest.RequestId);
                if (success)
                {
                    SelectedRequest.IsApproved = true;
                    SelectedRequest.IsHandled = true;
                    await LoadRequestsAsync();
                }
            }
            else
            {
                MessageBox.Show("Válassz ki egy kérelmet!");
            }
        }


        private async Task DenyRequestAsync()
        {
            if (SelectedRequest != null)
            {
                var success = await _apiService.DenyRequestAsync(SelectedRequest.RequestId);
                if (success)
                {
                    SelectedRequest.IsApproved = false;
                    SelectedRequest.IsHandled = true;
                    await LoadRequestsAsync();
                }
            }
            else
            {
                MessageBox.Show("Válassz ki egy kérelmet!");
            }
        }


        public event PropertyChangedEventHandler PropertyChanged;
        protected void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

    }
}
