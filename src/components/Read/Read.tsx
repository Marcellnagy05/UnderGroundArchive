import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Read.css";

const Read = () => {
  const { bookId } = useParams();
  const [chapter, setChapter] = useState<{
    chapterTitle: string;
    chapterContent: string;
    chapterNumber: string;
  } | null>(null);
  const [chapterNumber, setChapterNumber] = useState<number>(1);
  const [totalChapters, setTotalChapters] = useState<number | null>(null);
  const token = localStorage.getItem("jwt");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavouriteChapter = async () => {
      try {
        const response = await fetch(
          "https://localhost:7197/api/User/myfavourites"
        );
        if (!response.ok) throw new Error("Hiba a kedvencek lekérésekor");
        const favourites = await response.json();

        const favouriteBook = favourites.find(
          (fav: any) => fav.BookName === bookId
        );
        if (favouriteBook && favouriteBook.ChapterNumber) {
          setChapterNumber(favouriteBook.ChapterNumber);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchFavouriteChapter();
  }, [bookId]);

  useEffect(() => {
    const fetchTotalChapters = async () => {
      try {
        const response = await fetch(
          `https://localhost:7197/api/Book/chapters/${bookId}/totalChapters`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok)
          throw new Error("Hiba a fejezetek számának lekérésekor");
        const data = await response.json();
        setTotalChapters(data.totalChapters);
      } catch (error) {
        console.error(error);
      }
    };

    if (bookId) fetchTotalChapters();
  }, [bookId]);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await fetch(
          `https://localhost:7197/api/Book/chapter/${bookId}/${chapterNumber}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Hiba a fejezet lekérésekor");
        const data = await response.json();
        setChapter(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (bookId) fetchChapter();
  }, [bookId, chapterNumber]);

  const navigateToBooks = () => {
    navigate("/books");
  };
  const updateLastReadChapter = async (newChapterNumber: number) => {
    try {
      const response = await fetch(
        `https://localhost:7197/api/User/updateLastReadChapter/${bookId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newChapterNumber),
        }
      );
      if (!response.ok) throw new Error("Hiba a fejezet frissítésekor");
      console.log("Last read chapter updated:", newChapterNumber);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePreviousChapter = () => {
    if (chapterNumber > 1) {
      const newChapterNumber = chapterNumber - 1;
      setChapterNumber(newChapterNumber);
      updateLastReadChapter(newChapterNumber);
    }
  };

  const handleNextChapter = () => {
    if (totalChapters !== null && chapterNumber < totalChapters) {
      const newChapterNumber = chapterNumber + 1;
      setChapterNumber(newChapterNumber);
      updateLastReadChapter(newChapterNumber);
    }
  };

  return (
    <div className="currentChapterContainer">
      <button className="backToList chapters" onClick={navigateToBooks}>
        Vissza a könyvekhez
      </button>
      <h2>
        Chapter {chapter?.chapterNumber}: {chapter?.chapterTitle}
      </h2>
      <div className="currentChapter">
        <p>{chapter?.chapterContent}</p>
      </div>
      <div className="btnChapterContainer">
        {chapterNumber > 1 && (
          <button onClick={handlePreviousChapter}>Előző oldal</button>
        )}
        {totalChapters !== null && chapterNumber < totalChapters && (
          <button onClick={handleNextChapter}>Következő oldal</button>
        )}
      </div>
    </div>
  );
};

export default Read;
