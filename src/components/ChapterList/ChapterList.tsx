import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { chapters } from "../../Types/Chapters";
import "./ChapterList.css";
import { useToast } from "../contexts/ToastContext";

const ChapterList = () => {
  const [chapters, setChapters] = useState<chapters[]>([]);
  const token = localStorage.getItem("jwt");
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

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
  useEffect(() => {
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
      if (!response.ok) showToast("Hiba a fejezet törlésekor","error");
      showToast("Fejezet Sikeresen Törölve","success");
      fetchChapters();
    } catch (error) {
      console.error(error);
    }
  };

  const handleNavigateToChapterEdit = (
    chapterId: number,
    chapterNumber: number
  ) => {
    navigate(`/editChapter/${bookId}/${chapterId}/${chapterNumber}`);
  };

  return (
    <div className="chapterListContainer">
      <div className="chapterList">
        {chapters.map((chapter) => (
          <div key={chapter.chapterId} className="chapterItem">
            <h3>{chapter.chapterTitle}</h3>
            <button
              onClick={() =>
                handleNavigateToChapterEdit(
                  chapter.chapterId,
                  chapter.chapterNumber
                )
              }
              className="chapterEdit"
            >
              Szerkesztés
            </button>
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
