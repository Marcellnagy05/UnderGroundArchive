import { useEffect, useState } from "react";
import "./Books.css";

interface Books {
  id: number; // bookId helyett id
  bookName: string;
  authorId: string;
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

interface user {
  id: string;
  userName: string;
}

const Books = () => {
  const [books, setBooks] = useState<Books[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const [error, setError] = useState("");
  const [selectedBook, setSelectedBook] = useState<Books | null>(null); // Kiválasztott könyv
  const [user, setUser] = useState<user | null>(null); // Bejelentkezett felhasználó
  const [role, setRole] = useState<string | null>(null); // Felhasználói szerepkör
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [ratings, setRatings] = useState<{ [id: number]: number }>({}); // bookId helyett id

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

  // Felhasználó és szerepkör lekérése a JWT-ból
  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      setError(
        "Nem rendelkezik megfelelő jogosultságokkal az oldal eléréséhez."
      );
      return;
    }

    try {
      // Token dekódolása
      const decodedToken = JSON.parse(atob(token.split(".")[1]));

      // Szerepkör ellenőrzése
      const roles = decodedToken["roles"] || [];
      const roleFromClaim =
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

      if (!(roles === "Author" || roleFromClaim === "Author")) {
        setError(
          "Nem rendelkezik megfelelő jogosultságokkal az oldal eléréséhez."
        );
        return;
      }

      // Felhasználói adatok beállítása
      setUser({
        id: decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ],
        userName:
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ],
      });

      // Szerepkör tárolása
      setRole(roleFromClaim || "reader");
    } catch (err) {
      console.error("Hiba a token dekódolása során:", err);
      setError("Hiba történt a jogosultságok ellenőrzésekor.");
    }
  }, []);

  // Könyvek és felhasználók lekérése
  const allBooks = async () => {
    try {
      const response = await fetch("https://localhost:7197/api/User/books");
      const bookData: Books[] = await response.json();
      setBooks(bookData);

      const authorIds = [...new Set(bookData.map((book) => book.authorId))];
      fetchUsersByIds(authorIds); // Összes felhasználó lekérése
    } catch (err) {
      console.error("Hiba a könyvek lekérése során:", err);
      setError("Hiba történt az adatok lekérésekor.");
    }
  };

  const fetchUsersByIds = async (authorIds: string[]) => {
    try {
      const userPromises = authorIds.map((id) =>
        fetch(`https://localhost:7197/api/User/user/${id}`).then((response) =>
          response.json()
        )
      );
      const usersData = await Promise.all(userPromises);

      const usersMap = usersData.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});

      setUsers(usersMap);
    } catch (err) {
      console.error("Hiba a felhasználók lekérése során:", err);
    }
  };

  // Értékelés mentése
  const saveRating = async (bookId: number, rating: number) => {
    if (!role) {
      alert("Nem rendelkezik jogosultsággal az értékeléshez.");
      return;
    }

    const apiEndpoint =
      role === "User"
        ? "https://localhost:7197/api/User/createReaderRating"
        : "https://localhost:7197/api/User/createCriticRating";

    try {
      const requestData = {
        raterId: user?.id,
        bookId: bookId,
        ratingValue: rating,
      };
      console.log(requestData);

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        console.error("Hiba az értékelés mentése során");
        return;
      }

      // Frissítsd a helyi állapotot az értékelés mentése után
      setRatings((prevRatings) => ({
        ...prevRatings,
        [bookId]: rating,
      }));

      alert("Értékelés mentése sikeres!");
    } catch (err) {
      console.error("Hiba az értékelés mentése során:", err);
    }
  };

  const handleDetails = (book: Books) => {
    setSelectedBook(book); // Kiválasztott könyv beállítása
  };

  const handleBackToList = () => {
    setSelectedBook(null); // Vissza a könyvlistához
  };

  // Az alkalmazás kódja:
  return (
    <div>
      <button onClick={() => allBooks()}>Összes könyv lekérése</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!selectedBook ? (
        <div className="allBooks">
          {books.map((book) => (
            <div key={book.id} className="bookCard"> {/* bookId helyett id */}
              <h3>{book.bookName}</h3>
              <p>Szerző: {users[book.authorId]?.userName || "Betöltés..."}</p>
              <p>Műfaj: {getGenreName(book.genreId)}</p>
              <p>Kategória: {getCategoryName(book.categoryId)}</p>
              <button onClick={() => handleDetails(book)}>Részletek</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bookDetails">
          <h2>{selectedBook.bookName}</h2>
          <p>Szerző: {users[selectedBook.authorId]?.userName || "Betöltés..."}</p>
          <p>Műfaj: {getGenreName(selectedBook.genreId)}</p>
          <p>Kategória: {getCategoryName(selectedBook.categoryId)}</p>
          {role && (
            <div className="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${
                    ratings[selectedBook.id] >= star || hoveredRating !== null && hoveredRating >= star
                      ? "filled"
                      : ""
                  }`} // bookId helyett id
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(null)}
                  onClick={() => saveRating(selectedBook.id, star)} // bookId helyett id
                >
                  ★
                </span>
              ))}
            </div>
          )}
          <button onClick={handleBackToList}>Vissza a listához</button>
        </div>
      )}
    </div>
  );
};

export default Books;
