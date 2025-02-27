import { useState } from "react";
import { chapters } from "../../Types/Chapters";
import { useParams } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import "./ChapterList.css"

const EditChapter = () => {
  const token = localStorage.getItem("jwt");
  const { bookId, chapterId, chapterNumber } = useParams<{
    bookId: string;
    chapterId: string;
    chapterNumber: string;
  }>();

  const [chapterTitle, setChapterTitle] = useState<string>("");
  const [chapterContent, setChapterContent] = useState<string>("");
  const { showToast } = useToast();

  const handleChapterEdit = async (chapterData: chapters) => {
    try {
      const response = await fetch(
        `https://localhost:7197/api/Author/modifyChapter/${chapterId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(chapterData),
        }
      );
      if (!response.ok) throw new Error("Hiba a fejezet módosításakor");

      showToast("A fejezet sikeresen módosítva", "success");
    } catch (error) {
      console.error(error);
      showToast("Hiba történt a fejezet módosítása során", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const chapterData: chapters = {
      chapterId: Number(chapterId),
      bookId: Number(bookId),
      chapterNumber: Number(chapterNumber),
      chapterTitle: chapterTitle,
      chapterContent: chapterContent,
    };

    handleChapterEdit(chapterData);

    setChapterTitle("");
    setChapterContent("");
  };

  return (
    <div>
      <form className="addChapters" onSubmit={handleSubmit}>
        <h2 className="form-title">Fejezet szerkesztése</h2>

        <div className="chapter-input-group">
          <label className="chapter-label">Fejezet száma:</label>
          <input
            type="text"
            value={chapterNumber !== undefined ? `${chapterNumber}` : ""}
            className="chapter-input"
            readOnly
            disabled
          />
        </div>

        <div className="chapter-input-group">
          <label className="chapter-label">Fejezet címe:</label>
          <input
            type="text"
            value={chapterTitle ? `${chapterTitle}` : ""}
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

export default EditChapter;
