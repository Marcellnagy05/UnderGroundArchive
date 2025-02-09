import { useEffect, useState } from "react";
import "./Books.css";
import StarRating from "../StarRating/StarRating";
import { useToast } from "../contexts/ToastContext";
import Comments from "../Comments/Comments";
import { FaSyncAlt } from "react-icons/fa";
import {
  getAllBooks,
  getGenres,
  getCategories,
  getUserById,
  getCriticRatings,
  getReaderRatings,
  saveRating,
  deleteRating,
} from "../../services/BookServices";
import { Book, Genre, Category, User, CriticRating } from "../../Types/Books";
import { updatePoints } from "../../services/RankingServices";
import { UserProfile } from '../../Types/UserProfile';


const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const [error, setError] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [ratings, setRatings] = useState<{
    [bookId: number]: { [userId: string]: number };
  }>({});
  const [criticRatings, setCriticRatings] = useState<CriticRating[]>([]);
  const { showToast } = useToast();
  const [flippedStates, setFlippedStates] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const booksData = await getAllBooks();
        setBooks(booksData);
      } catch (err) {
        console.error("Hiba a könyvek lekérése során:", err);
        setError("Hiba történt az adatok lekérésekor.");
      }
    };
  
    fetchInitialData();
  }, []);

  useEffect(() => {
    allBooks();
  }, []);
  
  useEffect(() => {
    const fetchGenresAndCategories = async () => {
      try {
        const genresData = await getGenres();
        setGenres(genresData);

        const categoriesData = await getCategories();
        setCategories(categoriesData);
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
      const roleFromClaim =
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

      const userId =
        decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];
      const userName =
        decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ];

      setUser({ id: userId, userName, role: roleFromClaim });
      setRole(roleFromClaim || "guest");

      // Értékelések frissítése bejelentkezés után
      fetchReaderRatings(userId);
      if (roleFromClaim === "Critic") {
        // Kritikusok értékeléseinek frissítése
        criticRatings.forEach((rating) => fetchCriticRatings(rating.bookId));
      }
    } catch (err) {
      console.error("Hiba a token dekódolása során:", err);
      setError("Hiba történt a jogosultságok ellenőrzésekor.");
    }
  }, []);

  const allBooks = async () => {
    try {
      const bookData = await getAllBooks();
      setBooks(bookData);
  
      if (bookData.length > 0) {
        const authorIds = [...new Set(bookData.map((book: Book) => book.authorId))];
        await fetchUsersByIds(authorIds); // ✅ Csak akkor fut, ha van könyv
      }
  
      if (user?.id) {
        await fetchReaderRatings(user.id);
  
        if (role === "Critic") {
          bookData.forEach((book) => fetchCriticRatings(book.id));
        }
      }
    } catch (err) {
      console.error("Hiba a könyvek lekérése során:", err);
      setError("Hiba történt az adatok lekérésekor.");
    }
  };
  

  const fetchUsersByIds = async (authorIds: string[]) => {
    try {
      const userPromises = authorIds.map(async (id) => {
        const response = await fetch(`https://localhost:7197/api/User/user/${id}`);
        if (!response.ok) {
          console.warn(`Nem található felhasználó az ID-val: ${id}`);
          return null;
        }
        return response.json();
      });
  
      const usersData = await Promise.all(userPromises);
  
      const usersMap = usersData.reduce((acc, user) => {
        if (user) acc[user.id] = user; // Csak ha van érvényes adat
        return acc;
      }, {} as { [key: string]: User });
  
      setUsers((prevUsers) => ({ ...prevUsers, ...usersMap }));
    } catch (err) {
      console.error("Hiba a felhasználók lekérése során:", err);
    }
  };
  

  const fetchCriticRatings = async (bookId: number) => {
    try {
      const data = await getCriticRatings(bookId);
      setCriticRatings(data);

      // Minden kritikus értékelés hozzáadása a ratings állapothoz
      setRatings((prevRatings) => {
        const newRatings = { ...prevRatings };
        newRatings[bookId] = data.reduce((acc, rating) => {
          acc[rating.raterId] = rating.ratingValue;
          return acc;
        }, {} as { [userId: string]: number });
        return newRatings;
      });
    } catch (err) {
      console.error("Hiba a kritikus értékelések lekérése során:", err);
    }
  };

  const fetchReaderRatings = async (userId: string) => {
    try {
        const ratingsData = await getReaderRatings(userId);

        // Ellenőrizzük, hogy van-e értékelés
        if (ratingsData && ratingsData.length > 0) {
            setRatings((prevRatings) => {
                const updatedRatings = { ...prevRatings };
                ratingsData.forEach((rating: any) => {
                    if (!updatedRatings[rating.bookId]) {
                        updatedRatings[rating.bookId] = {};
                    }
                    updatedRatings[rating.bookId][userId] = rating.ratingValue;
                });
                return updatedRatings;
            });
        } else {
            console.log("Nincsenek értékelések ehhez a felhasználóhoz.");
        }
    } catch (err) {
        console.error("Hiba az olvasói értékelések lekérése során:", err);
    }
};

  const saveRatings = async (bookId: number, rating: number) => {
    if (!role) {
        alert("Nem rendelkezik jogosultsággal az értékeléshez.");
        return;
    }

    if (!user?.id) {
        alert("Felhasználói azonosító hiányzik.");
        return;
    }

    try {
        await saveRating(
            bookId,
            rating,
            user.id,
            role,
            localStorage.getItem("jwt") || ""
        );

        setRatings((prevRatings) => ({
            ...prevRatings,
            [bookId]: {
                ...prevRatings[bookId],
                [user.id]: rating,
            },
        }));

        if (role === "Critic") {
            await fetchCriticRatings(bookId);
        }

        showToast("Sikeres értékelés!", "success");

        if (selectedBook?.authorId) {
            await updatePoints(selectedBook.authorId, 10, "Author");
        }
        await updatePoints(user.id, 5, "User");
    } catch (err) {
        console.error("Hiba az értékelés mentése során:", err);
        showToast("Nem sikerült menteni az értékelést.", "error");
    }
};

const deleteRatings = async (bookId: number) => {
    if (!user?.id) {
        showToast("Felhasználói azonosító hiányzik!", "error");
        return;
    }

    try {
        await deleteRating(bookId, role || "", localStorage.getItem("jwt") || "");

        setRatings((prevRatings) => {
            const updatedRatings = { ...prevRatings };
            delete updatedRatings[bookId];
            return updatedRatings;
        });

        showToast("Értékelés sikeresen törölve!", "success");

        if (selectedBook?.authorId) {
            await updatePoints(selectedBook.authorId, -10, "Author");
        }
        await updatePoints(user.id, -5, "User");
    } catch (err) {
        console.error("Hiba az értékelés törlése során:", err);
        showToast("Nem sikerült törölni az értékelést.", "error");
    }
};


  const handleDetails = async (book: Book) => {
    setSelectedBook(book);
    await fetchCriticRatings(book.id);
    if (user?.id) {
      await fetchReaderRatings(user.id);
    }
  };

  const handleBackToList = async () => {
    await allBooks();
    setSelectedBook(null);
    setCriticRatings([]);
  };

  const calculateCriticAverage = () => {
    if (!selectedBook || criticRatings.length === 0) return 0;

    // Szűrjük az adott könyvhöz tartozó kritikus értékeléseket
    const bookRatings = criticRatings.filter(
      (rating) => rating.bookId === selectedBook.id
    );

    if (bookRatings.length === 0) return 0;

    const total = bookRatings.reduce(
      (sum, rating) => sum + rating.ratingValue,
      0
    );
    return total / bookRatings.length;
  };

  const toggleFlip = (id: number) => {
    setFlippedStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!selectedBook ? (
        <div className="allBooks">
          {books.map((book) => (
            <div key={book.id} className="container">
              <div
                className={`card ${flippedStates[book.id] ? "flipped" : ""}`}
              >
                <div className="front">
                  <button
                    className="flipButton"
                    onClick={() => toggleFlip(book.id)}
                  >
                    <FaSyncAlt />
                  </button>
                  <div className="title">
                    <h3>{book.bookName}</h3>
                    <p>
                      Szerző: {users[book.authorId]?.userName || "Betöltés..."}
                    </p>
                  </div>
                  <button
                    className="detailsButton"
                    onClick={() => handleDetails(book)}
                  >
                    Részletek
                  </button>
                </div>
                <div className="back">
                  <button
                    className="flipButton"
                    onClick={() => toggleFlip(book.id)}
                  >
                    <FaSyncAlt />
                  </button>
                  <p>Műfaj: {getGenreName(book.genreId)}</p>
                  <p>Kategória: {getCategoryName(book.categoryId)}</p>
                  <p>
                    Átlagos értékelés:{" "}
                    {parseFloat(book.averageRating.toString()).toFixed(2) || ""}
                  </p>
                  <StarRating rating={book.averageRating || 0} />
                  <p>Saját értékelés:</p>
                  <div className="rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${
                          ratings[book.id]?.[user?.id || ""] >= star
                            ? "filled"
                            : ""
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
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
              <p>Leírás: {selectedBook.bookDescription}</p>
            </div>
            <div className="ratings">
              <h3>
                {role === "Critic"
                  ? "Kritikus értékelés:"
                  : "Olvasói értékelés:"}
              </h3>
              {selectedBook && (
                <div className="rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${
                        (role === "Critic" &&
                          criticRatings.some(
                            (r) =>
                              r.bookId === selectedBook.id &&
                              r.raterId === user?.id &&
                              r.ratingValue >= star
                          )) ||
                        (role !== "Critic" &&
                          ratings[selectedBook.id]?.[user?.id || ""] >= star)
                          ? "filled"
                          : ""
                      } ${
                        hoveredRating !== null && hoveredRating >= star
                          ? "hovered"
                          : ""
                      }`}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(null)}
                      onClick={() => saveRatings(selectedBook.id, star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              )}
              {role !== "Critic" && (
                <>
                  <h3>Kritikusok átlagértékelése:</h3>
                  <StarRating rating={calculateCriticAverage()} />
                </>
              )}
              {selectedBook && ratings[selectedBook.id]?.[user?.id || ""] && (
                <button
                  className="removeRating"
                  onClick={() => deleteRatings(selectedBook.id)}
                >
                  Értékelés törlése
                </button>
              )}
            </div>
          </div>
          <button className="backToList" onClick={handleBackToList}>
            Vissza a listához
          </button>

          {user && <Comments bookId={selectedBook.id} currentUser={user} />}
        </div>
      )}
    </div>
  );
};

export default Books;
