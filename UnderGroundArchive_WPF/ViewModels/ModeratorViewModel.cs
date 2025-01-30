using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using UnderGroundArchive_WPF.Models;
using UnderGroundArchive_WPF.Services;

namespace UnderGroundArchive_WPF.ViewModels
{
    public class ModeratorViewModel : INotifyPropertyChanged
    {
        private readonly ApiService _apiService;
        private ObservableCollection<RequestModel> _reports;
        private RequestModel _selectedReport;

        public ModeratorViewModel(ApiService apiService)
        {
            _apiService = apiService;
        }

        // Add properties and commands specific to the Moderator view

        public event PropertyChangedEventHandler? PropertyChanged;
        protected void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
