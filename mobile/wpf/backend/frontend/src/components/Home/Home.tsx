import { useEffect, useState } from "react";
import { Book } from "../../Types/Books";
import "./Home.css";
import { getBookById, getBookCount } from "../../services/BookServices";
import { FaStar } from "react-icons/fa";

const Home = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchRandomBooks = async () => {
      const storedData = localStorage.getItem("randomBooks");
      const storedDate = localStorage.getItem("booksFetchDate");
      const today = new Date().toISOString().split("T")[0];

      if (storedData && storedDate === today) {
        setBooks(JSON.parse(storedData));
        return;
      }

      try {
        const bookCount = await getBookCount();
        const randomIndexes = Array.from(
          { length: 10 },
          () => Math.floor(Math.random() * bookCount) + 1
        );

        const bookPromises = randomIndexes.map(id => getBookById(id));
        const booksData = await Promise.all(bookPromises);

        localStorage.setItem("randomBooks", JSON.stringify(booksData));
        localStorage.setItem("booksFetchDate", today);

        setBooks(booksData);
      } catch (err) {
        console.error("Hiba a könyvek lekérése során:", err);
      }
    };

    fetchRandomBooks();
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
            <div className="aboutUs">
              <h2>Mire is jó ez az oldal?</h2>
              <p></p>
            </div>
            <div className="sliderContainer">
              <h2>Napi Menu</h2>
              <div className="slider">
                <div className="list">
                  {books.map((book, index) => (
                    <div
                      key={index}
                      className="item"
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
