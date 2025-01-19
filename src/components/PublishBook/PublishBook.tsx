import React, { useState, useEffect } from "react";
import { useToast } from "../contexts/ToastContext";

// Műfaj típus
interface Genre {
  genreId: number;
  genreName: string;
}

// Kategória típus
interface Category {
  categoryId: number;
  categoryName: string;
}

const PublishBook = () => {
  const [bookName, setBookName] = useState("");
  const [genreId, setGenreId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [bookDescription, setBookDescription] = useState("");
  const [error, setError] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAuthor, setIsAuthor] = useState(false);
  const {showToast} = useToast();

  // Műfajok és kategóriák lekérése
  const fetchGenresAndCategories = async () => {
    try {
      const genreResponse = await fetch("https://localhost:7197/api/Metadata/genres");
      const genreData = await genreResponse.json();
      setGenres(genreData);

      const categoryResponse = await fetch("https://localhost:7197/api/Metadata/categories");
      const categoryData = await categoryResponse.json();
      setCategories(categoryData);
    } catch (err) {
      console.error("Hiba a műfajok és kategóriák lekérése során:", err);
      setError("Hiba történt az adatok lekérésekor.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
  
    // Ha nincs token, akkor nem engedjük az oldal elérését
    if (!token) {
      setError("Nem rendelkezik megfelelő jogosultságokkal az oldal eléréséhez.");
      return;
    }
  
    try {
      // Token dekódolása
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      
      // Ellenőrizzük mindkét kulcsot, ha van szerepkör
      const roles = decodedToken["roles"] || [];
      const roleFromClaim = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      // Ha egyik kulcsban sem találunk "Author" szerepkört, akkor nem engedjük az oldalt
      if (!(roles.includes("Author") && roleFromClaim === "Author")) {
        setError("Nem rendelkezik megfelelő jogosultságokkal az oldal eléréséhez.");
        setIsAuthor(false);
      } else {
        setIsAuthor(true);
        fetchGenresAndCategories(); // Ha Author, akkor lehozzuk a műfajokat és kategóriákat
      }
    } catch (err) {
      console.error("Hiba a token dekódolása során:", err);
      setError("Hiba történt a jogosultságok ellenőrzésekor.");
    }
  }, []);
   // Üres dependency array, így csak egyszer fut le

  const handlePublish = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!bookName || !genreId || !categoryId || !bookDescription) {
      showToast("Minden mező kitöltse kötelező!","error")
      return;
    }

    const token = localStorage.getItem("jwt");
    if (!token) {
      setError("Nincs érvényes bejelentkezési token.");
      return;
    }

    try {
      // A kérés a könyv publikálására
      const bookData = {
        bookName,
        genreId: Number(genreId), // Átalakítás number típusra
        categoryId: Number(categoryId), // Átalakítás number típusra
        bookDescription,
      };

      const response = await fetch("https://localhost:7197/api/Author/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Sikeres könyv publikálás:", data.message);
        showToast("A Könyv sikeresen publikálva.","success")
        setError(""); // Hiba törlése
      } else {
        switch (response.status) {
          case 400:
            showToast("Kérlek ellenőrizd a beküldött adatokat.","error");
            break;
          case 403:
            showToast("Publikálni csak a szerzői jogosultságokkal rendelkező tagok tudnak.","error");
            break;
          case 500:
            showToast("Belső szerverhiba történt.","error");
            break;
          default:
            const responseText = await response.text();
            showToast(responseText || "Hiba történt a könyv publikálása során.","error");
        }
      }
    } catch (err) {
      console.error("Hiba a könyv publikálása során:", err);
      setError("Hiba történt a könyv publikálása során.");
    }
  };

  return (
    <div>
      <h2>Könyv publikálása</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {isAuthor ? (
        <form onSubmit={handlePublish}>
          <div>
            <label>Könyv neve:</label>
            <input
              type="text"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
            />
          </div>
          <div>
            <label>Műfaj:</label>
            <select
              value={genreId}
              onChange={(e) => setGenreId(e.target.value)}
            >
              <option value="">Válasszon műfajt</option>
              {genres.map((genre) => (
                <option key={genre.genreId} value={genre.genreId.toString()}>
                  {genre.genreName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Kategória:</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Válasszon kategóriát</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId.toString()}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Könyv leírás:</label>
            <textarea
              value={bookDescription}
              onChange={(e) => setBookDescription(e.target.value)}
            />
          </div>
          <button type="submit">Könyv publikálása</button>
        </form>
      ) : (
        <></>
      )}
    </div>
  );
};

export default PublishBook;
