import "./RankSelector.css"
import { useEffect } from "react";

interface UserProfile {
  rankId: number;
  profilePictureId: number;
}

interface RankSelectorProps {
  userProfile: UserProfile | null;
  selectedPictureId: number;
  setSelectedPictureId: React.Dispatch<React.SetStateAction<number>>;
}

const RankSelector: React.FC<RankSelectorProps> = ({ userProfile, selectedPictureId, setSelectedPictureId }) => {
    useEffect(() => {
      if (userProfile?.profilePictureId) {
        setSelectedPictureId(Number(userProfile.profilePictureId)); // Biztosan számra alakítjuk
      }
    }, [userProfile, setSelectedPictureId]);
  
    const ranks = Array.from({ length: Number(userProfile?.rankId) || 1 }, (_, i) => i + 1);
  
    const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newPictureId = Number(event.target.value);
      setSelectedPictureId(newPictureId);
  
      try {
        const response = await fetch("https://localhost:7197/api/Account/updateProfilePicture", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          body: JSON.stringify({ profilePictureId: newPictureId }),
        });
  
        if (!response.ok) {
          throw new Error("Sikertelen frissítés.");
        }
  
        const data = await response.json();
        console.log("Siker:", data.message);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Hiba:", error.message);
        } else {
          console.error("Ismeretlen hiba történt.");
        }
      }
    };
  
    return (
      <div className="rank-selector-container">
        <select value={selectedPictureId} onChange={handleChange}>
          {ranks.map((rank) => (
            <option key={rank} value={rank}>
              {rank}. {getRankName(rank)}
            </option>
          ))}
        </select>
      </div>
    );
};

const getRankName = (rank: number): string => {
  const rankNames = [
    "Beginner",
    "Novice",
    "Apprentice",
    "JourneyMan",
    "Adept",
    "Expert",
    "Master",
    "Grandmaster",
    "Sage",
    "GreatSage",
    "Epic",
    "Legend",
    "Immortal",
    "Godly",
    "Unreal",
    "Cosmic",
    "Outerversal",
    "Ascendant",
  ];
  return rankNames[rank - 1] || `Rank ${rank}`;
};

export default RankSelector;
