using UnderGroundArchive_Backend.Dbcontext;
using UnderGroundArchive_Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace UnderGroundArchive_Backend.Services
{
    public class BookService :IBookService
    {
        private readonly UGA_DBContext _context;

        public BookService(UGA_DBContext context)
        {
            _context = context;
        }

        public async Task<bool> PublishBookAsync(Books book)
        {
            _context.Books.Add(book);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Books>> GetBooksAsync()
        {
            return await _context.Books.ToListAsync();
        }
    }
}
