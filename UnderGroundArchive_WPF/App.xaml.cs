using Microsoft.Extensions.DependencyInjection;
using System.Configuration;
using System.Data;
using System.Net.Http;
using System.Windows;
using System.Windows.Controls;
using UnderGroundArchive_WPF.Services;
using UnderGroundArchive_WPF.ViewModels;
using UnderGroundArchive_WPF.Views;

namespace UnderGroundArchive_WPF
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        private IServiceProvider _serviceProvider;
        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);

            var services = new ServiceCollection();
            ConfigureServices(services);

            _serviceProvider = services.BuildServiceProvider();

            // Show the MainWindow (or Shell) as the main application window
            var mainWindow = _serviceProvider.GetRequiredService<MainWindow>();
            mainWindow.Show();

            // Get the NavigationContent control from MainWindow
            var navigationContent = mainWindow.FindName("NavigationContent") as ContentControl;
            if (navigationContent == null)
            {
                throw new InvalidOperationException("NavigationContent not found in MainWindow.");
            }

            // Set the navigation content in the NavigationService
            var navigationService = _serviceProvider.GetRequiredService<INavigationService>();
            if (navigationService is NavigationService navService)
            {
                navService.SetNavigationContent(navigationContent);
            }

            // Use the NavigationService to navigate to the LoginView initially
            navigationService.NavigateTo<LoginViewModel>();
        }

        private void ConfigureServices(IServiceCollection services)
        {
            // Register services
            services.AddSingleton<HttpClient>();
            services.AddSingleton<ApiService>();
            services.AddSingleton<INavigationService, NavigationService>();

            // Register ViewModels
            services.AddTransient<LoginViewModel>();
            services.AddTransient<UserViewModel>();
            services.AddTransient<ModeratorViewModel>();

            // Register Views
            services.AddTransient<LoginView>();
            services.AddTransient<UserView>();
            services.AddTransient<ModeratorView>();

            // Register MainWindow as the main application window
            services.AddSingleton<MainWindow>();

        }
    }

}
