import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Chapter.css";
import { useToast } from "../contexts/ToastContext";

const Chapters = () => {
  const { bookId } = useParams();

  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState("");
  const [chapterNumber, setChapterNumber] = useState<number>(1);
  const { showToast } = useToast();

  const fetchChapterNumber = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`https://localhost:7197/api/Author/chapters/${bookId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Nem sikerült betölteni a fejezeteket.");
      }

      const chapters = await response.json();
      if (chapters.length > 0) {
        const maxChapterNumber = Math.max(...chapters.map((c: any) => c.chapterNumber));
        setChapterNumber(maxChapterNumber + 1);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (bookId) {
      fetchChapterNumber();
    }
  }, [bookId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const chapterData = {
      BookId: Number(bookId), // Könyv ID konvertálása számmá
      ChapterNumber: chapterNumber,
      ChapterTitle: chapterTitle,
      ChapterContent: chapterContent,
    };

    try {
      const response = await fetch(
        "https://localhost:7197/api/Author/publishChapter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          body: JSON.stringify(chapterData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }


      showToast("A fejezet sikeresen hozzáadva","success")
      setChapterTitle("");
      setChapterContent("");
      fetchChapterNumber();
    } catch (error) {
        showToast("Hiba történt a fejezet hozzáadása során","error")
    }
  };

  return (
    <div className="addChaptersContainer">
      <form className="addChapters" onSubmit={handleSubmit}>
        <h2 className="form-title">Új fejezet hozzáadása</h2>

        <div className="chapter-input-group">
          <label className="chapter-label">Fejezet száma:</label>
          <input
            type="textfield"
            value={`${chapterNumber}.fejezet`}
            className="chapter-input"
            readOnly
            disabled
          />
        </div>

        <div className="chapter-input-group">
          <label className="chapter-label">Fejezet címe:</label>
          <input
            type="text"
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
            className="chapter-input"
            required
          />
        </div>

        <div className="chapter-input-group">
          <label className="chapter-label">Fejezet tartalma:</label>
          <textarea
            value={chapterContent}
            onChange={(e) => setChapterContent(e.target.value)}
            className="chapter-textarea"
            required
          />
        </div>

        <button type="submit">Mentés</button>
      </form>
    </div>
  );
};

export default Chapters;
