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

        private async Task LoadReportsAsync()
        {
            var reports = await _apiService.GetPendingReportsAsync();
            Reports = new ObservableCollection<ReportModel>(reports);
        }

        private async Task AcceptReportAsync()
        {
            if (SelectedReport != null)
            {
                var success = await _apiService.AcceptRequestAsync(SelectedReport.ReportId);
                if (success)
                {
                    SelectedReport.IsHandled = true;
                    await LoadReportsAsync();
                }
            }
        }


        private async Task DenyReportAsync()
        {
            if (SelectedReport != null)
            {
                var success = await _apiService.DenyRequestAsync(SelectedReport.ReportId);
                if (success)
                {
                    SelectedReport.IsHandled = true;
                    await LoadReportsAsync();
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
