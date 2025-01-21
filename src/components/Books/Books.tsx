import { useEffect, useState } from "react";
import "./Books.css";
import StarRating from "../StarRating/StarRating";
import { useToast } from "../contexts/ToastContext";

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

interface CriticRating {
  ratingId: number;
  bookId: number;
  ratingValue: number;
  raterId: string;
  bookName: string;
  genreId: number;
  categoryId: number;
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
  const [criticRatings, setCriticRatings] = useState<CriticRating[]>([]);
  const {showToast} = useToast();

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

  const fetchCriticRatings = async (bookId: number) => {
    try {
      const response = await fetch(
        `https://localhost:7197/api/User/criticRatings?bookId=${bookId}`
      );

      if (response.ok) {
        const data: CriticRating[] = await response.json();
        setCriticRatings(data);
      } else {
        console.error("Hiba a kritikus értékelések lekérése során.");
      }
    } catch (err) {
      console.error("Hiba a kritikus értékelések lekérése során:", err);
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
        showToast("Már értékelted ezt a könyvet!","error")
        return;
      }

      setRatings((prevRatings) => ({
        ...prevRatings,
        [bookId]: rating,
      }));
      showToast("Sikeres értékelés!","success")
    } catch (err) {
      console.error("Hiba az értékelés mentése során:", err);
    }
  };

  const deleteRating = async (bookId: number) => {
    if (!user?.id) {
      showToast("Felhasználói azonositó hiányzik!","error")
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
        showToast("Hiba az értékelés törlése során!","error")
        return;
      }

      setRatings((prevRatings) => {
        const updatedRatings = { ...prevRatings };
        delete updatedRatings[bookId];
        return updatedRatings;
      });

      showToast("Értékelés sikeresen törölve!","success")
    } catch (err) {
      console.error("Hiba az értékelés törlése során:", err);
    }
  };

  const handleDetails = (book: Books) => {
    setSelectedBook(book);
    fetchCriticRatings(book.id);
  };

  const handleBackToList = async () => {
    await allBooks();
    setSelectedBook(null);
    setCriticRatings([]); // Kritikus értékelések állapotának alaphelyzetbe állítása
  };

  const calculateCriticAverage = () => {
    if (criticRatings.length === 0) return 0;
    const total = criticRatings.reduce(
      (sum, rating) => sum + rating.ratingValue,
      0
    );
    return total / criticRatings.length;
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
              <p>Átlagos értékelés: {book.averageRating || ""}</p>
              <StarRating rating={book.averageRating || 0} />
              <p>Saját értékelés:</p>
              <div className="rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${
                      ratings[book.id] >= star ? "filled" : ""
                    }`}
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
        <div className="bookDetailsContainer">
          <div className="bookDetails">
            <div className="bookInfo">
              <h2>{selectedBook.bookName}</h2>
              <p>
                Szerző:{" "}
                {users[selectedBook.authorId]?.userName || "Betöltés..."}
              </p>
              <p>Műfaj: {getGenreName(selectedBook.genreId)}</p>
              <p>Kategória: {getCategoryName(selectedBook.categoryId)}</p>
              <p>Leirás: {selectedBook.bookDescription}</p>
            </div>
            <div className="ratings">
              <h3>Értékelés:</h3>
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
              <h3>Kritikusok értékelték:</h3>
              <StarRating rating={calculateCriticAverage()} />
              {ratings[selectedBook.id] && (
                <button onClick={() => deleteRating(selectedBook.id)}>
                  Értékelés törlése
                </button>
              )}
            </div>
          </div>
          <button className="backToList" onClick={handleBackToList}>
            Vissza a listához
          </button>
        </div>
      )}
    </div>
  );
};

export default Books;
