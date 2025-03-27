using Microsoft.Extensions.DependencyInjection;
using System.Configuration;
using System.Data;
using System.Net.Http;
using System.Windows;
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
        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);

            var services = new ServiceCollection();
            ConfigureServices(services);

            var serviceProvider = services.BuildServiceProvider();
            var loginWindow = serviceProvider.GetRequiredService<LoginView>();
            loginWindow.Show();
        }

        private void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<HttpClient>();
            services.AddSingleton<ApiService>();
            services.AddSingleton<LoginViewModel>();
            services.AddSingleton<LoginView>();
            services.AddSingleton<UserViewModel>();
            services.AddSingleton<UserView>();
        }
    }

}
