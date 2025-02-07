import "./RankSelector.css";
import { useEffect, useState } from "react";
import { useProfileContext } from "../contexts/ProfileContext";

const RankSelector = ({ selectedPictureId, setSelectedPictureId }) => {
  const { userProfile, fetchUserProfile } = useProfileContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [ranks, setRanks] = useState<number[]>([]);

  useEffect(() => {
    if (userProfile?.profilePictureId) {
      setSelectedPictureId(Number(userProfile.profilePictureId));
    }

    if (userProfile?.rankId) {
      const maxRank = Number(userProfile.rankId);
      const availableRanks = Array.from({ length: maxRank }, (_, i) => i + 1);
      setRanks(availableRanks);
    }
  }, [userProfile]);

  const handleSelection = async (rank: number) => {
    setSelectedPictureId(rank);
    setIsDropdownOpen(false);

    try {
      const response = await fetch("https://localhost:7197/api/Account/updateProfilePicture", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ profilePictureId: rank }),
      });

      if (!response.ok) {
        throw new Error("Sikertelen frissítés.");
      }

      await fetchUserProfile(); // 🔄 **Frissítsd a user adatokat a módosítás után!**

    } catch (error) {
      console.error("Hiba:", error);
    }
  };

  return (
    <div className="rank-selector-container">
      <button className="dropdown-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} disabled={ranks.length === 0}>
        {getRankName(selectedPictureId)} ▼
      </button>
      {isDropdownOpen && ranks.length > 0 && (
        <div className="dropdown-menu">
          {ranks.map((rank) => (
            <div
              key={rank}
              className={`dropdown-item ${selectedPictureId === rank ? "selected" : ""}`}
              onClick={() => handleSelection(rank)}
            >
              {rank}. {getRankName(rank)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getRankName = (rank: number): string => {
  const rankNames = [
    "Beginner", "Novice", "Apprentice", "JourneyMan", "Adept", "Expert", "Master", "Grandmaster",
    "Sage", "GreatSage", "Epic", "Legend", "Immortal", "Godly", "Unreal", "Cosmic",
    "Outerversal", "Ascendant"
  ];
  return rankNames[rank - 1] || `Rank ${rank}`;
};

export default RankSelector;
