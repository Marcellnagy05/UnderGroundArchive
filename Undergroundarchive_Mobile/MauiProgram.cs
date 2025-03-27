using Microsoft.Extensions.Logging;
using Undergroundarchive_Mobile.MVVM.ViewModels;
using Undergroundarchive_Mobile.MVVM.Views;
using Undergroundarchive_Mobile.Services;

namespace Undergroundarchive_Mobile
{
    public static class MauiProgram
    {
        public static MauiApp CreateMauiApp()
        {
            var builder = MauiApp.CreateBuilder();
            builder
                .UseMauiApp<App>()
                .ConfigureFonts(fonts =>
                {
                    fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                    fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
                });
            builder.Services.AddSingleton<ApiService>();
            builder.Services.AddTransient<BooksViewModel>();
            builder.Services.AddTransient<BooksView>();
#if DEBUG
            builder.Logging.AddDebug();
#endif

            return builder.Build();
        }
    }
}
