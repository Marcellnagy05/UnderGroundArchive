import { useEffect, useState } from "react";
import { useUserContext } from "../contexts/UserContext";
import { motion } from "framer-motion";
import "./Profile.css";
import { jwtDecode } from "jwt-decode";
import StarRating from "../StarRating/StarRating";
import { useToast } from "../contexts/ToastContext";
import { useProfileContext } from "../contexts/ProfileContext";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import { RankIcon } from "../RankIcon/RankIcon";
import { UserInfo } from "../UserInfo/UserInfo";
import RankSelector from "../RankSelector/RankSelector";
import { FaTrashCan } from "react-icons/fa6";
import RankBar from "../RankBar/RankBar";
import { fetchFavourites } from "../../services/BookServices";


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

interface Fav {
  favouriteId: number,
  bookName: string,
  chapterNumber: number,
  chapterTitle: string
}

const Profile = () => {
  const { userProfile, setUserProfile } = useProfileContext();
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
  const [selectedRank, setSelectedRank] = useState(userProfile?.rankId || 1);
  const [selectedPictureId, setSelectedPictureId] = useState(
    userProfile?.profilePictureId || userProfile?.rankId || 1
  );
  const [userPoints, setUserPoints] = useState<number>(0);
  const [rankId, setRankId] = useState<number>(0);
  const [favourites, setFavourites] = useState<Fav[]>([])

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
    const fetchBooks = async () => {
      if (userProfile) {
        try {
          let allBooks = [];

          // Döntés a fetch típusáról
          if (activeTab === "ertekelt") {
            const response = await fetch(
              "https://localhost:7197/api/User/books",
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
              }
            );

            if (response.ok) {
              allBooks = await response.json();
            } else {
              console.error("Hiba a könyvek lekérésekor.");
              return;
            }
          } else if (
            activeTab === "konyveim" &&
            userProfile.role === "Author"
          ) {
            const response = await fetch(
              "https://localhost:7197/api/User/books",
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
              }
            );

            if (response.ok) {
              const allBooksResponse = await response.json();
              allBooks = allBooksResponse.filter(
                (book: any) => book.authorId === userProfile.id
              );
            } else {
              console.error("Hiba a könyvek lekérésekor.");
              return;
            }
          }

          setBooks(allBooks);
        } catch (err) {
          console.error("Váratlan hiba a könyvek lekérése során:", err);
        }
      }
    };

    fetchBooks();
  }, [userProfile, activeTab]);

  useEffect(() => {
    if (activeTab === "ertekelt" && books.length > 0 && userProfile) {
      const fetchAllRatings = async () => {
        const token = localStorage.getItem("jwt");
        const decoded: any = jwtDecode(token ? token : "N/A");

        for (const book of books) {
          await fetchRatingsForUserOrCritic(
            book.id,
            decoded[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ]
          );
        }
      };

      fetchAllRatings().catch((error) =>
        console.error("Error fetching ratings:", error)
      );
    }
  }, [activeTab, books, userProfile]);

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
        console.error("Error fetching critic ratings for bookId:", bookId);
      }
    } catch (err) {
      console.error("Unexpected error fetching critic ratings:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
  
    if (token) {
      const fetchData = async () => {
        try {
          const favs = await fetchFavourites(token);
          console.log("Favs:", favs);
  
          if (favs && Array.isArray(favs)) {
            setFavourites(favs);
          } else {
            console.error("A kedvencek adat nem megfelelő");
          }
        } catch (error) {
          console.error("Hiba a kedvencek betöltésekor:", error);
        }
      };
  
      fetchData();
    }
  }, []);
  


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
        console.error("Error fetching reader ratings for userId:", userId);
      }
    } catch (err) {
      console.error("Unexpected error fetching reader ratings:", err);
    }
  };

  // Segédfüggvények

  const isCritic = (): boolean => {
    return userProfile?.role === "Critic";
  };

  const fetchRatingsForUserOrCritic = async (
    bookId: number,
    userId: string
  ) => {
    if (isCritic()) {
      await fetchCriticRatings(bookId);
    } else {
      await fetchReaderRatings(userId);
    }
  };

  const reloadUserData = async () => {
    const token = localStorage.getItem("jwt");
    try {
      const response = await fetch("https://localhost:7197/api/User/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
        const data = await response.json();
        setUserPoints(data.points);
        setRankId(data.rankId);
    } catch (error) {
        console.error("Hiba a felhasználó adatainak lekérése során:", error);
    }
};

useEffect(() => {
    reloadUserData();
}, [userProfile?.rankId]);

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
            console.log(userData);
            

            setUserProfile({
              id: userData?.id,
              userName: userData?.userName,
              role: userData?.role,
              phoneNumber: userData?.phoneNumber,
              country: userData?.country,
              email: userData?.email,
              birthDate: userData?.birthDate,
              rankId: userData?.rankId.toString(),
              subscriptionId: userData?.subscriptionId.toString(),
              profilePictureId: userData.profilePictureId.toString(),
              rankPoints: userData.rankPoints,
            });
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (err) {
          console.error("Error during fetch:", err);
        }
      }
    };

    fetchUser();
  }, [setUserProfile]);

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

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const decoded: any = jwtDecode(token ? token : "N/A");
    if (
      activeTab === "ertekelt" &&
      books.length > 0 &&
      typeof userProfile !== "string"
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
  }, [activeTab, books, userProfile]);

  const deleteRating = async (bookId: number) => {
    if (
      typeof userProfile === "object" &&
      userProfile !== null &&
      "id" in userProfile &&
      "role" in userProfile
    ) {
      if (!userProfile?.id) {
        showToast("Felhasználói azonosító hiányzik!", "error");
        return;
      }

      const apiEndpoint =
        userProfile.role !== "Critic"
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
        <ProfileMenu onMenuClick={handleMenuClick} />
      </div>
      <div className="profileContent">
        {activeTab === "adatok" && (
          <motion.div
            className={`username ${getSubscriptionStyle(
              parseInt(userProfile?.subscriptionId || "N/A")
            )}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="UserInfo">
              <div className="section one">
                <RankIcon rank={userProfile?.profilePictureId.toString()} />

                <div className="userTitle">
                  <h3>{userProfile?.userName || "N/A"}</h3>
                  <p>({userProfile?.role || "N/A"})</p>
                </div>
              </div>

              <RankBar userId={userProfile?.id} userPoints={userProfile?.rankPoints} rankId={rankId} onRankUpdate={reloadUserData} />

              <UserInfo
                email={userProfile?.email || "N/A"}
                birthDate={
                  userProfile?.birthDate
                    ? `${userProfile.birthDate.substring(
                        0,
                        4
                      )}.${userProfile.birthDate.substring(
                        5,
                        7
                      )}.${userProfile.birthDate.substring(8, 10)}`
                    : "N/A"
                }
                country={userProfile?.country || "N/A"}
                phone={userProfile?.phoneNumber || "N/A"}
              />
            </div>
          </motion.div>
        )}
        {activeTab === "jelszo" && (
          <motion.div
            className={`username ${getSubscriptionStyle(
              parseInt(userProfile?.subscriptionId || "N/A")
            )}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Jelszó változtatás</h2>
            <form className="passwordForm" onSubmit={handlePasswordChange}>
              <label>Jelenlegi Jelszo:</label>
              <input type="password" name="currentPassword" required />
              <label>Új jelszó:</label>
              <input type="password" name="newPassword" required />
              <label>Új jelszó megerősítése:</label>
              <input type="password" name="confirmPassword" required />
              <button className="submitButton" type="submit">
                Jelszó frissítése
              </button>
            </form>
          </motion.div>
        )}
        {activeTab === "elofizetes" && (
          <motion.div
            className={`username ${getSubscriptionStyle(
              parseInt(userProfile?.subscriptionId || "N/A")
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
                  {sub.subscriptionId ===
                    parseInt(userProfile?.subscriptionId || "N/A") && (
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
              parseInt(userProfile?.subscriptionId || "N/A")
            )}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3>Értékelt könyvek</h3>
            {Object.keys(ratings).map((bookId) => {
              const book = books.find((book) => book.id === parseInt(bookId));
              const bookName = book ? book.bookName : "Ismeretlen könyv";

              return (
                <div key={bookId} className="ratingItem">
                  <h4>{bookName}</h4>
                  {Object.keys(ratings[parseInt(bookId)]).map((userId) => (
                    <>
                      <div key={userId}>
                      <button className="removeRatingBtn" onClick={() => deleteRating(parseInt(bookId))}>
                        <FaTrashCan/>
                      </button>
                        <StarRating
                          rating={ratings[parseInt(bookId)][userId]}
                        />
                      </div>
                    </>
                  ))}
                </div>
              );
            })}
          </motion.div>
        )}
        {activeTab === "konyveim" && (
          <motion.div
            className={`username ${getSubscriptionStyle(
              parseInt(userProfile?.subscriptionId || "N/A")
            )}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Könyveim</h2>
            {userProfile?.role !== "Author" ? (
              <button disabled>🔒 Csak szerzők számára elérhető</button>
            ) : (
              <ul>
                {books?.map((book) => (
                  <li key={book.id}>{book.bookName}</li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
        {activeTab === "kedvencek" && (
          <motion.div
            className={`username ${getSubscriptionStyle(
              parseInt(userProfile?.subscriptionId || "N/A")
            )}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ul>
              {favourites?.map((favourite) => (
                <li key={favourite.favouriteId}>{favourite.bookName}</li>
              ))
              }
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;
function setUserPoints(points: any) {
  throw new Error("Function not implemented.");
}

