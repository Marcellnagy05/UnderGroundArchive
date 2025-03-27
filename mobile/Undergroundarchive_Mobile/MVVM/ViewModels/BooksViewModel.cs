using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using Undergroundarchive_Mobile.DTO;
using Undergroundarchive_Mobile.MVVM.Views;
using Undergroundarchive_Mobile.Services;

namespace Undergroundarchive_Mobile.MVVM.ViewModels
{
    public class BooksViewModel : INotifyPropertyChanged
    {
        private readonly ApiService _apiService;
        public ObservableCollection<BookDTO> Books { get; set; } = new ObservableCollection<BookDTO>();
        public ICommand NavigateToHomeCommand { get; set; }
        public BooksViewModel(ApiService apiService)
        {
            _apiService = apiService;
            LoadBooks();
            //Books
            NavigateToHomeCommand = new Command(async () =>
            {
                await Shell.Current.GoToAsync(nameof(HomeView));
            });
        }

        #region Könyvek betöltése
        private async void LoadBooks()
        {
            var books = await _apiService.GetBooksAsync();
            if (books != null)
            {
                Books.Clear();
                foreach (var book in books)
                {
                    Books.Add(book);
                }
            }
        }
        #endregion

        public event PropertyChangedEventHandler PropertyChanged;

        protected void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
