using Microsoft.AspNetCore.Identity;

namespace UnderGroundArchive_Backend.Services
{
    public class RoleManagerService
    {
        public static async Task SeedRolesAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            // Létrehozandó szerepkörök
            var roles = new[] { "User", "Admin", "Moderator" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }
    }
}
