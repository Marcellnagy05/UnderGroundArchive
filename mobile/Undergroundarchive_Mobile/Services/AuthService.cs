using System;
using System.Threading.Tasks;

namespace Undergroundarchive_Mobile.Services
{
    public class AuthService
    {
        private static AuthService _instance;
        public static AuthService Instance => _instance ??= new AuthService();

        public bool IsLoggedIn { get; private set; } = false;
        public event Action OnAuthStateChanged;

        public void Login(string token)
        {
            IsLoggedIn = true;
            SecureStorage.SetAsync("jwt_token", token);
            OnAuthStateChanged?.Invoke();
        }

        public async Task Logout()
        {
            IsLoggedIn = false;
            await SecureStorage.SetAsync("jwt_token", "");
            OnAuthStateChanged?.Invoke();
        }
    }
}
