import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface chapters {
  chapterId: number;
  bookId: number;
  chapterNumber: number;
  chapterTitle: string;
  chapterContent: string;
}

const ChapterList = () => {
  const [chapters, setChapters] = useState<chapters[]>([]);
  const token = localStorage.getItem("jwt");
  const { bookId } = useParams();

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch(
          `https://localhost:7197/api/Author/chapters/${bookId}`,
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
        const responseData = await response.json();
        setChapters(responseData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchChapters();
  }, []);

  const handleChapterDelete = async (chapterId: number) => {
    try {
      const response = await fetch(
        `https://localhost:7197/api/Author/deleteChapter/${chapterId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ chapterId }),
        }
      );
      if (!response.ok) throw new Error("Hiba a fejezet törlésekor");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="chapterListContainer">
      <div className="chapterList">
        {chapters.map((chapter) => (
          <div key={chapter.chapterId} className="chapterItem">
            <h3>{chapter.chapterTitle}</h3>
            <button className="chapterEdit">Szerkesztés</button>
            <button
              onClick={() => handleChapterDelete(chapter.chapterId)}
              className="chapterDelete"
            >
              Törlés
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChapterList;
