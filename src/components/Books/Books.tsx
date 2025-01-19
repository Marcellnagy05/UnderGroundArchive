import { useEffect, useState } from "react";
import "./Books.css";

interface Books {
  bookId: number;
  bookName: string;
  authorId: string; // Módosítva id-re
  genreId: number;
  categoryId: number;
  bookDescription: string;
}

interface Genre {
  genreId: number;
  genreName: string;
}

interface Category {
  categoryId: number;
  categoryName: string;
}

interface User {
  rankId: number;
  subscriptionId: number;
  joinDate: Date;
  birthDate: Date;
  country: string;
  rankPoints: number;
  balance: string;
  favourites: string;
  books: Array<string>;
  requests: Array<string>;
  completedAchievements: Array<string>;
  comments: Array<string>;
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: string;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: null;
  lockoutEnabled: boolean;
  accessFailedCount: number;
}

const Books = () => {
  const [books, setBooks] = useState<Books[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const [error, setError] = useState("");
  const [selectedBook, setSelectedBook] = useState<Books | null>(null); // Kiválasztott könyv

  /* #region Genre&Category fetch and methods */
  useEffect(() => {
    const fetchGenresAndCategories = async () => {
      try {
        const genreResponse = await fetch(
          "https://localhost:7197/api/Metadata/genres"
        );
        const genreData: Genre[] = await genreResponse.json();
        setGenres(genreData);

        const categoryResponse = await fetch(
          "https://localhost:7197/api/Metadata/categories"
        );
        const categoryData: Category[] = await categoryResponse.json();
        setCategories(categoryData);
      } catch (err) {
        console.error("Hiba a műfajok és kategóriák lekérése során:", err);
        setError("Hiba történt az adatok lekérésekor.");
      }
    };
    fetchGenresAndCategories();
  }, []);

  const getGenreName = (genreId: number) => {
    const genre = genres.find((g) => g.genreId === genreId);
    return genre ? genre.genreName : "Ismeretlen műfaj";
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.categoryId === categoryId);
    return category ? category.categoryName : "Ismeretlen kategória";
  };
  /* #endregion */

  // Felhasználó lekérése az authorId alapján
  const fetchUser = async (authorId: string) => {
    try {
      const userResponse = await fetch(
        `https://localhost:7197/api/User/user/${authorId}`
      );
      const userData: User = await userResponse.json();
      setUsers((prevUsers) => ({
        ...prevUsers,
        [authorId]: userData,
      }));
    } catch (err) {
      console.error("Hiba a felhasználó lekérése során:", err);
    }
  };

  // Könyvek és felhasználók lekérése
  const allBooks = async () => {
    try {
      const response = await fetch("https://localhost:7197/api/User/books");
      const bookData: Books[] = await response.json();
      setBooks(bookData);

      const authorIds = [...new Set(bookData.map((book) => book.authorId))];
      authorIds.forEach((authorId) => fetchUser(authorId));
    } catch (err) {
      console.error("Hiba a könyvek lekérése során:", err);
      setError("Hiba történt az adatok lekérésekor.");
    }
  };

  const handleDetails = (book: Books) => {
    setSelectedBook(book); // Kiválasztott könyv beállítása
  };

  const handleBackToList = () => {
    setSelectedBook(null); // Vissza a könyvlistához
  };

  return (
    <div>
      <div className="allBookContainer">
        <button onClick={allBooks}>Összes könyv lekérése</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="allBooks">
          {!selectedBook ? (
            books.map((book) => (
              <div key={book.bookId} className="bookCard">
                <h3>{book.bookName}</h3>
                <p><strong>Szerző:</strong> {users[book.authorId]?.userName || "Betöltés..."}</p>
                <p><strong>Műfaj:</strong> {getGenreName(book.genreId)}</p>
                <p><strong>Kategória:</strong> {getCategoryName(book.categoryId)}</p>
                <p><strong>Leírás:</strong> {book.bookDescription}</p>
                <button onClick={() => handleDetails(book)}>Részletek</button>
              </div>
            ))
          ) : (
            <div className="bookDetails">
              <h2>{selectedBook.bookName}</h2>
              <p><strong>Szerző:</strong> {users[selectedBook.authorId]?.userName || "Betöltés..."}</p>
              <p><strong>Műfaj:</strong> {getGenreName(selectedBook.genreId)}</p>
              <p><strong>Kategória:</strong> {getCategoryName(selectedBook.categoryId)}</p>
              <p><strong>Leírás:</strong> {selectedBook.bookDescription}</p>
              <button onClick={handleBackToList}>Vissza a listához</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Books;
