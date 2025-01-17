using Microsoft.AspNetCore.Identity;
using UnderGroundArchive_Backend.Models;

namespace UnderGroundArchive_Backend.Services
{
    public class PasswordService : IPasswordValidator<ApplicationUser>
    {
        public Task<IdentityResult> ValidateAsync(UserManager<ApplicationUser> manager, ApplicationUser user, string password)
        {
            var errors = new List<IdentityError>();

            // Ellenőrizzük, hogy van-e szám a jelszóban
            if (!password.Any(char.IsDigit))
            {
                errors.Add(new IdentityError
                {
                    Code = "PasswordRequiresDigit",
                    Description = "A jelszónak legalább egy számot kell tartalmaznia. ('0' - '9')"
                });
            }

            // Ellenőrizzük, hogy van-e speciális karakter a jelszóban
            if (!password.Any(c => !char.IsLetterOrDigit(c)))
            {
                errors.Add(new IdentityError
                {
                    Code = "PasswordRequiresNonAlphanumeric",
                    Description = "A jelszónak legalább egy speciális karaktert kell tartalmaznia."
                });
            }

            // Ellenőrizzük, hogy van-e nagybetű a jelszóban
            if (!password.Any(c => char.IsUpper(c)))
            {
                errors.Add(new IdentityError
                {
                    Code = "PasswordRequiresUppercase",
                    Description = "A jelszónak legalább egy nagybetűt kell tartalmaznia. ('A' - 'Z')"
                });
            }

            // Ellenőrizzük, hogy a jelszó elég hosszú-e
            if (password.Length < 8)
            {
                errors.Add(new IdentityError
                {
                    Code = "PasswordTooShort",
                    Description = "A jelszónak legalább 8 karakter hosszúnak kell lennie."
                });
            }

            // Ha nem találtunk hibát
            if (errors.Any())
            {
                return Task.FromResult(IdentityResult.Failed(errors.ToArray()));
            }

            return Task.FromResult(IdentityResult.Success);
        }
    }
}
