using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Windows;
using System.Windows.Controls;

namespace UnderGroundArchive_WPF.Services
{
    public class NavigationService : INavigationService
    {
        private readonly IServiceProvider _serviceProvider;
        private ContentControl _navigationContent;

        public NavigationService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public void SetNavigationContent(ContentControl navigationContent)
        {
            _navigationContent = navigationContent;
        }

        public void NavigateTo<TViewModel>() where TViewModel : class
        {
            if (_navigationContent == null)
            {
                throw new InvalidOperationException("NavigationContent is not set. Call SetNavigationContent first.");
            }

            var viewType = GetViewType<TViewModel>();
            if (viewType == null)
            {
                throw new InvalidOperationException($"No view found for ViewModel: {typeof(TViewModel).Name}");
            }

            var view = _serviceProvider.GetRequiredService(viewType) as Window;
            if (view != null)
            {
                _navigationContent.Content = view.Content;
            }
        }

        public void CloseCurrentWindow()
        {
            var currentWindow = Application.Current.Windows.OfType<Window>().SingleOrDefault(w => w.IsActive);
            currentWindow?.Close();
        }

        private Type GetViewType<TViewModel>() where TViewModel : class
        {
            var viewModelType = typeof(TViewModel);
            var viewName = viewModelType.FullName.Replace("ViewModel", "View");
            var viewType = Type.GetType(viewName);

            return viewType;
        }
    }
}