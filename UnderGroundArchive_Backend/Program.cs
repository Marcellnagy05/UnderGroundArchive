
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using UnderGroundArchive_Backend.Dbcontext;
using UnderGroundArchive_Backend.Models;

namespace UnderGroundArchive_Backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddDbContext<UGA_DBContext>(options =>
                options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
                    new MySqlServerVersion(new Version(8, 0, 33)))); // Replace with your MySQL version

            builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                // Identity beállítások (opcionális)
                options.Password.RequireDigit = false; // Nem kell szám a jelszóban
                options.Password.RequireNonAlphanumeric = false; // Nem kell speciális karakter
                options.Password.RequireUppercase = false; // Nem kell nagybetű
                options.Password.RequiredLength = 6; // Minimális hossz
                options.User.RequireUniqueEmail = true; // E-mail egyediség
            })
            .AddEntityFrameworkStores<UGA_DBContext>()
            .AddDefaultTokenProviders();

            // Auth cookie beállítása (opcionális)
            builder.Services.ConfigureApplicationCookie(options =>
            {
                options.LoginPath = "/Account/Login"; // Bejelentkezési oldal
                options.LogoutPath = "/Account/Logout"; // Kijelentkezési oldal
                options.ExpireTimeSpan = TimeSpan.FromDays(14); // Cookie lejárati idő
                options.SlidingExpiration = true; // Automatikus hosszabbítás
            });


            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();
            app.UseStaticFiles();

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
