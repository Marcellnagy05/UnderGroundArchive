
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using UnderGroundArchive_Backend.Dbcontext;
using UnderGroundArchive_Backend.Models;
using UnderGroundArchive_Backend.Services;

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

            builder.Services.AddScoped<IBookService, BookService>();

            builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 8;
                options.Password.RequiredUniqueChars = 1;
                options.User.RequireUniqueEmail = true;
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
