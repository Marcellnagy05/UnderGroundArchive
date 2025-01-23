import { useEffect, useState } from "react";
import "./Books.css";
import StarRating from "../StarRating/StarRating";
import { useToast } from "../contexts/ToastContext";
import Comments from "../Comments/Comments";

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
  const [ratings, setRatings] = useState<{
    [bookId: number]: { [userId: string]: number };
  }>({});
  const [criticRatings, setCriticRatings] = useState<CriticRating[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await allBooks(); // Összes könyv automatikus lekérése
      } catch (err) {
        console.error("Hiba a kezdeti adatok betöltése során:", err);
      }
    };
  
    fetchInitialData();
  }, []);
  

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

      const userId =
        decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];
      const userName =
        decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ];

      setUser({ id: userId, userName });
      setRole(roleFromClaim || "reader");

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
      const response = await fetch("https://localhost:7197/api/User/books");
      const bookData: Books[] = await response.json();
      setBooks(bookData);

      if (user?.id) {
        fetchReaderRatings(user.id);

        if (role === "Critic") {
          // Az összes könyv kritikus értékelésének frissítése
          bookData.forEach((book) => fetchCriticRatings(book.id));
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

        // Minden kritikus értékelés hozzáadása a ratings állapothoz
        setRatings((prevRatings) => {
          const newRatings = { ...prevRatings };
          newRatings[bookId] = data.reduce((acc, rating) => {
            acc[rating.raterId] = rating.ratingValue;
            return acc;
          }, {} as { [userId: string]: number });
          return newRatings;
        });
      } else {
        console.error("Hiba a kritikus értékelések lekérése során.");
      }
    } catch (err) {
      console.error("Hiba a kritikus értékelések lekérése során:", err);
    }
  };

  const fetchReaderRatings = async (userId: string) => {
    try {
      const response = await fetch(
        `https://localhost:7197/api/User/readerRatings?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      if (response.ok) {
        const ratingsData = await response.json();
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
        console.error("Hiba az olvasói értékelések lekérése során.");
      }
    } catch (err) {
      console.error("Hiba az olvasói értékelések lekérése során:", err);
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
        showToast("Már értékelted ezt a könyvet!", "error");
        return;
      }

      // Frissítjük a ratings állapotot az aktuális felhasználóra vonatkozóan
      setRatings((prevRatings) => ({
        ...prevRatings,
        [bookId]: {
          ...prevRatings[bookId],
          [user.id]: rating,
        },
      }));

      // Kritikus esetén frissítjük a kritikus értékeléseket
      if (role === "Critic") {
        await fetchCriticRatings(bookId);
      }

      showToast("Sikeres értékelés!", "success");
    } catch (err) {
      console.error("Hiba az értékelés mentése során:", err);
    }
  };

  const deleteRating = async (bookId: number) => {
    if (!user?.id) {
      showToast("Felhasználói azonosító hiányzik!", "error");
      return;
    }

    const apiEndpoint =
      role === "User"
        ? `https://localhost:7197/api/User/deleteReaderRating/${bookId}`
        : `https://localhost:7197/api/User/deleteCriticRating/${bookId}`;

    try {
      const response = await fetch(apiEndpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Hiba az értékelés törlése során:", errorText);

        if (response.status === 404) {
          showToast("Az értékelés nem található!", "error");
        } else {
          showToast("Hiba az értékelés törlése során!", "error");
        }
        return;
      }

      setRatings((prevRatings) => {
        const updatedRatings = { ...prevRatings };
        delete updatedRatings[bookId];
        return updatedRatings;
      });

      showToast("Értékelés sikeresen törölve!", "success");
    } catch (err) {
      console.error("Hiba az értékelés törlése során:", err);
      showToast("Váratlan hiba történt az értékelés törlése során.", "error");
    }
  };

  const handleDetails = async (book: Books) => {
    setSelectedBook(book);
    await fetchCriticRatings(book.id);
    if (user?.id) {
      await fetchReaderRatings(user.id);
    }
  };

  const handleBackToList = async () => {
    await allBooks();
    setSelectedBook(null);
    setCriticRatings([]); // Kritikus értékelések állapotának alaphelyzetbe állítása
  };

 const calculateCriticAverage = () => {
  if (!selectedBook || criticRatings.length === 0) return 0;

  // Szűrjük az adott könyvhöz tartozó kritikus értékeléseket
  const bookRatings = criticRatings.filter(
    (rating) => rating.bookId === selectedBook.id
  );

  if (bookRatings.length === 0) return 0;

  // Számítsuk ki az átlagot
  const total = bookRatings.reduce((sum, rating) => sum + rating.ratingValue, 0);
  return total / bookRatings.length;
};


return (
  <div>
    {/* <button onClick={() => allBooks()}>Összes könyv lekérése</button> */}
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
                    ratings[book.id]?.[user?.id || ""] >= star ? "filled" : ""
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            <button className="detailsButton" onClick={() => handleDetails(book)}>
              Részletek
            </button>
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
                    onClick={() => saveRating(selectedBook.id, star)}
                  >
                    ★
                  </span>
                ))}
              </div>

              <button className="detailsButton" onClick={() => handleDetails(book)}>Részletek</button>
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
                      onClick={() => saveRating(selectedBook.id, star)}
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
                <button className="removeRating" onClick={() => deleteRating(selectedBook.id)}>
                  Értékelés törlése
                </button>
              )}
            </div>
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
