import { useEffect, useState } from "react";
import { useUserContext } from "../contexts/UserContext";
import { motion } from "framer-motion";
import "./Profile.css";
import { jwtDecode } from "jwt-decode";
import StarRating from "../StarRating/StarRating";
import { useToast } from "../contexts/ToastContext";
import { User } from "../contexts/UserContext";

interface Ranks {
  rankId: number;
  rankName: string;
  pointsRequired: number;
  pointsDescription: string;
}

interface Subscriptions {
  subscriptionId: number;
  subscriptionName: string;
  subscriptionDescription: string;
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

interface Books {
  id: number;
  bookName: string;
  authorId: string;
  genreId: number;
  categoryId: number;
  bookDescription: string;
  averageRating: number;
}

const Profile = () => {
  const { user, setUser } = useUserContext();
  const [ranks, setRanks] = useState<Ranks[] | undefined>(undefined);
  const [subscriptions, setSubscriptions] = useState<
    Subscriptions[] | undefined
  >(undefined);
  const [books, setBooks] = useState<Books[]>([]);
  const [activeTab, setActiveTab] = useState("adatok");
  const [ratings, setRatings] = useState<{
    [bookId: number]: { [userId: string]: number };
  }>({});
  const [criticRatings, setCriticRatings] = useState<CriticRating[]>([]);
  const { showToast } = useToast();

  const handleMenuClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handlePasswordChange = (e: React.FormEvent<HTMLFormElement>) => {
    const token = localStorage.getItem("jwt");
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();
    const currentPassword = formData.get("currentPassword")?.toString();

    if (newPassword !== confirmPassword) {
      alert("A két jelszó nem egyezik meg!");
      return;
    }

    fetch("https://localhost:7197/api/Account/user/password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        CurrentPassword: currentPassword,
        NewPassword: newPassword,
      }),
    })
      .then((res) => {
        if (res.ok) {
          alert("Jelszó sikeresen frissítve!");
        } else {
          alert("Hiba történt a jelszó frissítése közben.");
        }
      })
      .catch(() => alert("Hiba történt a jelszó frissítése közben."));
  };

  useEffect(() => {
    if (typeof user !== "string") {
      fetch("https://localhost:7197/api/User/books")
        .then((res) => res.json())
        .then((data) => setBooks(data))
        .catch((error) => console.error("Könyvek betöltési hiba:", error));
    }
  }, [user]);

  const fetchCriticRatings = async (bookId: number) => {
    try {
      const response = await fetch(
        `https://localhost:7197/api/User/criticRatingsForBook/${bookId}`
      );

      if (response.ok) {
        const data: CriticRating[] = await response.json();
        setCriticRatings(data);

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

  // Segédfüggvények

  const isCritic = (): boolean => {
    return user.role === "Critic";
  };

  const fetchRatingsForUserOrCritic = async (
    bookId: number,
    userId: string
  ) => {
    if (isCritic()) {
      await fetchCriticRatings(bookId); // Kritikus értékelések
    } else {
      await fetchReaderRatings(userId); // Felhasználói értékelések
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("jwt");

      if (token) {
        try {
          const response = await fetch("https://localhost:7197/api/User/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData); // Frissítjük a felhasználót
          } else {
            setUser("guest");
          }
        } catch (err) {
          console.error("Hiba a felhasználói adatok betöltésekor:", err);
          setUser("guest");
        }
      } else {
        setUser("guest");
      }
    };

    fetchUser();
  }, [setUser]);

  useEffect(() => {
    const fetchRanks = async () => {
      const token = localStorage.getItem("jwt");
      if (token) {
        try {
          const response = await fetch(
            "https://localhost:7197/api/Account/ranks",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const ranksData = await response.json();
            setRanks(ranksData);
          } else {
            console.log("Hiba");
          }
        } catch (error) {}
      }
    };
    fetchRanks();
  }, []);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const token = localStorage.getItem("jwt");
      if (token) {
        try {
          const response = await fetch(
            "https://localhost:7197/api/Account/subscriptions",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const subscriptionData = await response.json();
            setSubscriptions(subscriptionData);
          } else {
            console.log("Hiba");
          }
        } catch (error) {}
      }
    };
    fetchSubscriptions();
  }, []);

  const getSubscriptionStyle = (subscriptionId: number | undefined): string => {
    if (!subscriptions) return "";
    const subscription = subscriptions.find(
      (sub) => sub.subscriptionId === subscriptionId
    );
    return subscription ? subscription.subscriptionName : "";
  };

  const getRankName = (rankId: number | undefined): string => {
    if (!ranks || !rankId) return "Nincs adat";
    const rank = ranks.find((rank) => rank.rankId === rankId);
    return rank ? rank.rankName : "Nincs adat";
  };

  const getSubscriptionName = (subscriptionId: number | undefined): string => {
    if (!subscriptions || !subscriptionId) return "Nincs adat";
    const subscription = subscriptions.find(
      (sub) => sub.subscriptionId === subscriptionId
    );
    return subscription ? subscription.subscriptionName : "Nincs adat";
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const decoded: any = jwtDecode(token);
    if (
      activeTab === "ertekelt" &&
      books.length > 0 &&
      typeof user !== "string"
    ) {
      books.forEach((book) => {
        fetchRatingsForUserOrCritic(
          book.id,
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ]
        ); // Fetch ratings for each book
      });
    }
  }, [activeTab, books, user]);

  const deleteRating = async (bookId: number) => {
    const { user } = useUserContext(); // Hozzáférés a user contexthez
  
    if (typeof user === "object" && user !== null && 'userId' in user && 'role' in user) {
      const userId = (user as User).userId;
      const role = (user as User).role;
  
      if (!userId) {
        showToast("Felhasználói azonosító hiányzik!", "error");
        return;
      }
  
      const apiEndpoint =
        role !== "Critic"
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
    } else {
      showToast("Felhasználói azonosító vagy szerepkör hiányzik!", "error");
    }
  };
  

  return (
    <div className="profileContainer">
      <div className="profileSidebar">
        <button onClick={() => handleMenuClick("adatok")}>Adatok</button>
        <button onClick={() => handleMenuClick("jelszo")}>
          Jelszó változtatás
        </button>
        <button onClick={() => handleMenuClick("elofizetes")}>
          Előfizetés
        </button>
        <button onClick={() => handleMenuClick("ertekelt")}>
          Értékelt könyvek
        </button>
        <button onClick={() => handleMenuClick("konyveim")}>Könyveim</button>
      </div>
      <div className="profileContent">
        {activeTab === "adatok" && (
          <motion.div
            className={`username ${getSubscriptionStyle(
              parseInt(user.subscriptionId)
            )}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Felhasználói adatok</h2>
            <p>
              <strong>Felhasználónév:</strong> {user.userName}
            </p>
            <p>
              <strong>Szerepkör:</strong> {user.role}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Szül. idő:</strong> {user.birthDate}
            </p>
            <p>
              <strong>Ország:</strong> {user.country}
            </p>
            <p>
              <strong>Telefonszám:</strong> {user.phoneNumber}
            </p>
          </motion.div>
        )}
        {activeTab === "jelszo" && (
          <motion.div
            className={`username ${getSubscriptionStyle(
              parseInt(user.subscriptionId)
            )}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Jelszó változtatás</h2>
            <form onSubmit={handlePasswordChange}>
              <label>
                Jelenlegi Jelszo:
                <input type="password" name="currentPassword" required />
              </label>
              <label>
                Új jelszó:
                <input type="password" name="newPassword" required />
              </label>
              <label>
                Új jelszó megerősítése:
                <input type="password" name="confirmPassword" required />
              </label>
              <button type="submit">Jelszó frissítése</button>
            </form>
          </motion.div>
        )}
        {activeTab === "elofizetes" && (
          <motion.div
            className={`username ${getSubscriptionStyle(
              parseInt(user.subscriptionId)
            )}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Előfizetések</h2>
            <ul>
              {subscriptions?.map((sub) => (
                <li key={sub.subscriptionId}>
                  {sub.subscriptionName}{" "}
                  {sub.subscriptionId === parseInt(user.subscriptionId) && (
                    <strong>(Aktív)</strong>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
        {activeTab === "ertekelt" && (
          <motion.div
          className={`username ${getSubscriptionStyle(
            parseInt(user.subscriptionId)
          )}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3>Értékelt könyvek</h3>
            {Object.keys(ratings).map((bookId) => {
              // Könyv név kikeresése az books tömbből az aktuális bookId alapján
              const book = books.find((book) => book.id === parseInt(bookId));
              const bookName = book ? book.bookName : "Ismeretlen könyv";

              return (
                <div key={bookId} className="ratingItem">
                  <h4>{bookName}</h4>
                  {Object.keys(ratings[parseInt(bookId)]).map((userId) => (
                    <div key={userId}>
                      {typeof user === "object" &&
                      user !== null &&
                      "userName" in user ? (
                        <>
                          <StarRating rating={ratings[parseInt(bookId)][userId]}/>
                        </>
                      ) : (
                        "Felhasználó adatai nem elérhetőek"
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </motion.div>
        )}
        {activeTab === "konyveim" && (
          <motion.div
            className={`username ${getSubscriptionStyle(
              parseInt(user.subscriptionId)
            )}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Könyveim</h2>
            {user.role !== "Author" ? (
              <button disabled>🔒 Csak szerzők számára elérhető</button>
            ) : (
              <ul>
                {user.books?.map((book) => (
                  <li key={book.bookId}>{book.title}</li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;
