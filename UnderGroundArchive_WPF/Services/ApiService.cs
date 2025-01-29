using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using UnderGroundArchive_WPF.Models;
using System.Net.Http;
using System.IO;
using System.Windows;
using System.Diagnostics;
using System.Text.Json;
using System.Text;

namespace UnderGroundArchive_WPF.Services
{
    public class ApiService
    {
        private readonly HttpClient _httpClient;
        private readonly string BASE_URL = "https://localhost:7197";
        private string _token;

        public ApiService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }


        public void SetToken(string token)
        {
            _token = token;
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _token);

            // Save token locally
            File.WriteAllText("token.txt", token);
        }

        // Load token on app startup
        public void LoadToken()
        {
            if (File.Exists("token.txt"))
            {
                _token = File.ReadAllText("token.txt");
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _token);
            }
        }
        public async Task<(bool isSuccess, string? token)> LoginAsync(string username, string password)
        {
            var loginData = new { Login = username, Password = password };
            string jsonPayload = JsonSerializer.Serialize(loginData);

            Trace.WriteLine($"Sending Login Request: {jsonPayload}");

            var response = await _httpClient.PostAsJsonAsync($"{BASE_URL}/api/Account/login", loginData);
            string responseContent = await response.Content.ReadAsStringAsync(); // Log the response body

            Trace.WriteLine($"Login API Response: {responseContent}");

            if (!response.IsSuccessStatusCode)
            {
                return (false, null);
            }

            var loginResponse = await response.Content.ReadFromJsonAsync<LoginResponseModel>();
            var token = loginResponse?.jwt?.result; // Extract the token

            return !string.IsNullOrEmpty(token) ? (true, token) : (false, null);
        }





        // Ensure Authorization Header is always set before making a request
        private void EnsureAuthenticated()
        {
            if (string.IsNullOrEmpty(_token))
                throw new UnauthorizedAccessException("User is not authenticated. Please log in first.");
        }

        // Get all users with authorization
        public async Task<List<UserModel>> GetUsersAsync()
        {
            EnsureAuthenticated();
            var request = new HttpRequestMessage(HttpMethod.Get, $"{BASE_URL}/api/Admin/users");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _token);

            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<List<UserModel>>();
        }

        // Get a single user by ID
        public async Task<UserModel> GetUserAsync(string id)
        {
            EnsureAuthenticated();
            var request = new HttpRequestMessage(HttpMethod.Get, $"{BASE_URL}/api/Admin/user/{id}");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _token);

            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<UserModel>();
        }

        // Update mute status
        public async Task<bool> ChangeMuteStatusAsync(string userId)
        {
            EnsureAuthenticated();

            string url = $"{BASE_URL}/api/Admin/muteStatusChange?userId={userId}";

            var response = await _httpClient.PutAsync(url, null);

            string responseContent = await response.Content.ReadAsStringAsync();

            return response.IsSuccessStatusCode;
        }




        // Update ban status
        public async Task<bool> ChangeBanStatusAsync(string userId)
        {
            EnsureAuthenticated();

            string url = $"{BASE_URL}/api/Admin/banStatusChanged?userId={userId}";

            var response = await _httpClient.PutAsync(url, null);

            string responseContent = await response.Content.ReadAsStringAsync();

            return response.IsSuccessStatusCode;
        }

        // Update user role
        public async Task<bool> UpdateUserRoleAsync(string userId, string newRoleName)
        {
            EnsureAuthenticated();

            // Construct the URL for the role update request
            string url = $"{BASE_URL}/api/Admin/user/{userId}/role/{newRoleName}";

            // Send the PUT request
            var response = await _httpClient.PutAsync(url, null); // No body is required for this API

            // Log the response received
            string responseContent = await response.Content.ReadAsStringAsync();



            return response.IsSuccessStatusCode;
        }
    }
}
