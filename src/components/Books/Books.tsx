import { useEffect, useState } from "react";
import "./Books.css";
import StarRating from "../StarRating/StarRating"

interface Books {
  id: number;
  bookName: string;
  authorId: string;
  genreId: number;
  categoryId: number;
  bookDescription: string;
  averageRating: number;
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
  id: string;
  userName: string;
}

const Books = () => {
  const [books, setBooks] = useState<Books[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const [error, setError] = useState("");
  const [selectedBook, setSelectedBook] = useState<Books | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [ratings, setRatings] = useState<{ [id: number]: number }>({});

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

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      setError(
        "Nem rendelkezik megfelelő jogosultságokkal az oldal eléréséhez."
      );
      return;
    }

    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));

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

      setUser({
        id: decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ],
        userName:
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ],
      });

      setRole(roleFromClaim || "reader");
    } catch (err) {
      console.error("Hiba a token dekódolása során:", err);
      setError("Hiba történt a jogosultságok ellenőrzésekor.");
    }
  }, []);

  const allBooks = async () => {
    try {
      const response = await fetch("https://localhost:7197/api/User/books");
      const bookData: Books[] = await response.json();
      setBooks(bookData);

      if (user?.id) {
        const ratingsResponse = await fetch(
          `https://localhost:7197/api/User/readerRatings?userId=${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          }
        );

        if (ratingsResponse.ok) {
          const ratingsData = await ratingsResponse.json();

          const userRatings = ratingsData.reduce(
            (acc: { [id: number]: number }, rating: any) => {
              acc[rating.bookId] = rating.ratingValue;
              return acc;
            },
            {}
          );

          setRatings(userRatings);
        }
      }

      const authorIds = [...new Set(bookData.map((book) => book.authorId))];
      fetchUsersByIds(authorIds);
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

  const saveRating = async (bookId: number, rating: number) => {
    if (!role) {
      alert("Nem rendelkezik jogosultsággal az értékeléshez.");
      return;
    }

    if (!user?.id) {
      alert("Felhasználói azonosító hiányzik.");
      return;
    }

    const selectedBook = books.find((book) => book.id === bookId);
    if (!selectedBook) {
      alert("Nem található a könyv az adatok között.");
      return;
    }

    const apiEndpoint =
      role === "User"
        ? "https://localhost:7197/api/User/createReaderRating"
        : "https://localhost:7197/api/User/createCriticRating";

    try {
      const requestData = {
        raterId: user.id,
        bookId: selectedBook.id,
        bookName: selectedBook.bookName,
        ratingValue: rating,
      };

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Hiba az értékelés mentése során:", errorText);
        alert(errorText || "Hiba az értékelés mentése során.");
        return;
      }

      setRatings((prevRatings) => ({
        ...prevRatings,
        [bookId]: rating,
      }));

      alert("Értékelés mentése sikeres!");
    } catch (err) {
      console.error("Hiba az értékelés mentése során:", err);
    }
  };

  const deleteRating = async (bookId: number) => {
    if (!user?.id) {
      alert("Felhasználói azonosító hiányzik.");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7197/api/User/deleteReaderRating/${bookId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );      

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Hiba az értékelés törlése során:", errorText);
        alert(errorText || "Hiba az értékelés törlése során.");
        return;
      }

      setRatings((prevRatings) => {
        const updatedRatings = { ...prevRatings };
        delete updatedRatings[bookId];
        return updatedRatings;
      });

      alert("Értékelés sikeresen törölve!");
    } catch (err) {
      console.error("Hiba az értékelés törlése során:", err);
    }
  };

  const handleDetails = (book: Books) => {
    setSelectedBook(book);
  };

  const handleBackToList = async () => {
    await allBooks();
    setSelectedBook(null);
  };

  return (
    <div>
      <button onClick={() => allBooks()}>Összes könyv lekérése</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!selectedBook ? (
        <div className="allBooks">
          {books.map((book) => (
            <div key={book.id} className="bookCard">
              <h3>{book.bookName}</h3>
              <p>Szerző: {users[book.authorId]?.userName || "Betöltés..."}</p>
              <p>Műfaj: {getGenreName(book.genreId)}</p>
              <p>Kategória: {getCategoryName(book.categoryId)}</p>
              <p>Átlagos értékelés:</p>
              <StarRating rating={book.averageRating || 0} />
              <p>Saját értékelés:</p>
              <div className="rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${ratings[book.id] >= star ? "filled" : ""}`}
                  >
                    ★
                  </span>
                ))}
              </div>
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
          <p>{selectedBook.bookDescription}</p>
          {role && (
            <div className="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${
                    ratings[selectedBook.id] >= star ||
                    (hoveredRating !== null && hoveredRating >= star)
                      ? "filled"
                      : ""
                  }`}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(null)}
                  onClick={() => saveRating(selectedBook.id, star)}
                >
                  ★
                </span>
              ))}
            </div>
          )}
          {ratings[selectedBook.id] && (
            <button onClick={() => deleteRating(selectedBook.id)}>
              Értékelés törlése
            </button>
          )}
          <button onClick={handleBackToList}>Vissza a listához</button>
        </div>
      )}
    </div>
  );
};

export default Books;
