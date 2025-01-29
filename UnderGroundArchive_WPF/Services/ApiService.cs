using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using UnderGroundArchive_WPF.Models;

namespace UnderGroundArchive_WPF.Services
{
    public class ApiService
    {
        private readonly HttpClient _httpClient;

        public ApiService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // Get all users
        public async Task<List<UserModel>> GetUsersAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<List<UserModel>>("api/admin/users");
            return response;
        }

        // Get a single user by ID
        public async Task<UserModel> GetUserAsync(string id)
        {
            var response = await _httpClient.GetFromJsonAsync<UserModel>($"api/admin/user/{id}");
            return response;
        }

        // Update mute status
        public async Task<bool> ChangeMuteStatusAsync(string userId)
        {
            var response = await _httpClient.PutAsJsonAsync($"api/admin/muteStatusChange", new { userId });
            return response.IsSuccessStatusCode;
        }

        // Update ban status
        public async Task<bool> ChangeBanStatusAsync(string userId)
        {
            var response = await _httpClient.PutAsJsonAsync($"api/admin/banStatusChanged", new { userId });
            return response.IsSuccessStatusCode;
        }

        // Update user role
        public async Task<bool> UpdateUserRoleAsync(string userId, string newRoleName)
        {
            var response = await _httpClient.PutAsJsonAsync($"api/admin/user/{userId}/role/{newRoleName}", new { });
            return response.IsSuccessStatusCode;
        }
    }
}
