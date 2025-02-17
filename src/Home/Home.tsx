import { useEffect, useState } from "react";
import { Book } from "../Types/Books";
import "./Home.css";
import { getAllBooks } from "../services/BookServices";
import { FaStar } from "react-icons/fa";

const Home = () => {
  const items = Array.from({ length: 10 }, (_, i) => i + 1);
  const [books, setBooks] = useState<Book[]>([]);
  const selectedBooks = books.slice(0, 10);

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

  return (
    <div className="homeContainer">
      <div className="logo">
        <img src="/images/LogoIcon.png" alt="" />
      </div>
      <div className="cardContainer">
        <div className="titleCard">
          <div className="cardTitle">
            <h3>Üdvözöllek az UnderGroundArchive oldalán!</h3>
          </div>
          <div className="cardBody">
            <div className="sliderContainer">
              <h2>Heti felkapottjaink</h2>
              <div className="slider">
                <div className="list">
                  {selectedBooks.map((book, index) => (
                    <div
                      className="item"
                      key={index}
                      style={{ "--position": index + 1 } as React.CSSProperties}
                    >
                      <div className="homeBooks">
                        <h3>{book.bookName}</h3>
                        <p>
                          {book.averageRating} <FaStar />
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
function setError(arg0: string) {
  throw new Error("Function not implemented.");
}
