using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using Undergroundarchive_Mobile.MVVM.Views;
using Undergroundarchive_Mobile.Services;

namespace Undergroundarchive_Mobile.MVVM.ViewModels
{
    public class HomeViewModel : INotifyPropertyChanged
    {
        public ICommand NavigateToBooksCommand { get; set; }
        public HomeViewModel(ApiService apiService)
        {
            //Books
            NavigateToBooksCommand = new Command(async () =>
            {
                await Shell.Current.GoToAsync(nameof(BooksView));
            });
        }
        public event PropertyChangedEventHandler PropertyChanged;
        protected void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
