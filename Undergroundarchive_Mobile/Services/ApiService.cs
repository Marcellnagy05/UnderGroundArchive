using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Undergroundarchive_Mobile.DTO;

namespace Undergroundarchive_Mobile.Services
{
    public class ApiService
    {
        private readonly HttpClient _httpClient;

        public ApiService()
        {
            _httpClient = new HttpClient();
            _httpClient.BaseAddress = new Uri("https://2cdc-94-44-112-18.ngrok-free.app");

            // Statikus JWT token beállítása (csak teszteléshez)
            string jwtToken = "YOUR_JWT_TOKEN_HERE";  // Itt add meg a saját tokenedet!
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", jwtToken);
        }

        public async Task<List<BookDTO>> GetBooksAsync()
        {
            try
            {
                HttpResponseMessage response = await _httpClient.GetAsync("api/User/books");
                response.EnsureSuccessStatusCode();
                string json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<BookDTO>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            }
            catch (Exception ex)
            {
                Trace.WriteLine($"Hiba történt: {ex.Message}");
                return new List<BookDTO>();
            }
        }

        public async Task<string> LoginAsync(string username, string password)
        {
            var loginDto = new { Login = username, Password = password };
            var json = JsonSerializer.Serialize(loginDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await _httpClient.PostAsync("api/Account/login", content);
            var responseContent = await response.Content.ReadAsStringAsync();

            Console.WriteLine($"Server Response: {responseContent}"); // Ellenőrizd a választ!

            if (response.IsSuccessStatusCode)
            {
                try
                {
                    var jsonResponse = JsonSerializer.Deserialize<Dictionary<string, string>>(responseContent);
                    if (jsonResponse.ContainsKey("jwt"))
                        return jsonResponse["jwt"];
                    if (jsonResponse.ContainsKey("token"))
                        return jsonResponse["token"];
                }
                catch (JsonException)
                {
                    // Ha sima stringet kaptunk vissza (nem JSON), akkor az a token
                    return responseContent;
                }
            }

            return null;
        }



    }
}
