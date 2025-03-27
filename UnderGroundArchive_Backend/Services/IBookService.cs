using UnderGroundArchive_Backend.Models;

namespace UnderGroundArchive_Backend.Services
{
    public interface IBookService
    {
        Task<bool> PublishBookAsync(Books book);
        Task<IEnumerable<Books>> GetBooksAsync();
    }
}
