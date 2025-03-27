using Undergroundarchive_Mobile.MVVM.ViewModels;
using Undergroundarchive_Mobile.Services;

namespace Undergroundarchive_Mobile.MVVM.Views;

public partial class BooksView : ContentPage
{
	public BooksView(BooksViewModel viewModel)
	{
		InitializeComponent();
        BindingContext = viewModel;
    }
}