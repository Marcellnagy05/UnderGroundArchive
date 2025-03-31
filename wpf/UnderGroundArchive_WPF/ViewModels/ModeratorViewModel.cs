using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using System.Windows;
using UnderGroundArchive_WPF.Models;
using UnderGroundArchive_WPF.Services;
using GalaSoft.MvvmLight.Command;

namespace UnderGroundArchive_WPF.ViewModels
{
    public class ModeratorViewModel : INotifyPropertyChanged
    {
        private readonly ApiService _apiService;
        private ObservableCollection<ReportModel> _reports;
        private ReportModel _selectedReport;

        public ModeratorViewModel(ApiService apiService)
        {
            _apiService = apiService;
            LoadReportsCommand = new RelayCommand(async () => await LoadReportsAsync());
            AcceptReporttCommand = new RelayCommand(async () => await AcceptReportAsync());
            DenyReportCommand = new RelayCommand(async () => await DenyReportAsync());
            LogOutCommand = new RelayCommand(async () => await LogOutAsync());
        }

        public ObservableCollection<ReportModel> Reports
        {
            get => _reports;
            set
            {
                _reports = value;
                OnPropertyChanged();
            }
        }

        public ReportModel SelectedReport
        {
            get => _selectedReport;
            set
            {
                _selectedReport = value;
                OnPropertyChanged();
            }
        }

        public ICommand LoadReportsCommand { get; }
        public ICommand AcceptReporttCommand { get; }
        public ICommand DenyReportCommand { get; }
        public ICommand LogOutCommand { get; }


        private async Task LogOutAsync()
        {
            _apiService.LogOut();

            await Application.Current.Dispatcher.InvokeAsync(() =>
            {
                var currentWindow = Application.Current.Windows.OfType<Window>().FirstOrDefault(w => w.IsActive);
                currentWindow?.Close();

                var loginView = new Views.LoginView(new LoginViewModel(_apiService));
                loginView.Show();
            });
        }

        private async Task LoadReportsAsync()
        {
            var reports = await _apiService.GetPendingReportsAsync();
            Reports = new ObservableCollection<ReportModel>(reports);
        }

        private async Task AcceptReportAsync()
        {
            if (SelectedReport != null)
            {
                var success = await _apiService.ChangeMuteStatusAsync(SelectedReport.ReportedPersonId);
                if (success)
                {
                    SelectedReport.IsHandled = true;
                    await LoadReportsAsync();
                }
            }
            else
            {
                MessageBox.Show("Válassz ki egy bejelentést!");
            }
        }


        private async Task DenyReportAsync()
        {
            if (SelectedReport != null)
            {
                SelectedReport.IsHandled = true;
                await LoadReportsAsync();
            }
            else
            {
                MessageBox.Show("Válassz ki egy bejelentést!");
            }
        }


        public event PropertyChangedEventHandler PropertyChanged;
        protected void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

    }
}
