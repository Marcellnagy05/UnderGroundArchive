import React, { useEffect, useState } from "react";
import "./RankBar.css";

interface Rank {
  rankId: number;
  rankName: string;
  pointsRequired: number;
}

interface RankBarProps {
  userId: string;
  userPoints: number;
  rankId: number;
  onRankUpdate: () => void;
}

const RankBar: React.FC<RankBarProps> = ({
  userId,
  userPoints,
  rankId,
  onRankUpdate,
}) => {
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [nextRank, setNextRank] = useState<Rank | null>(null);
  const [userRank, setUserRank] = useState<Rank | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Rangok lekérése a szerverről
    const fetchRanks = async () => {
      try {
        const response = await fetch(
          "https://localhost:7197/api/Account/ranks"
        );
        const data = await response.json();
        setRanks(data);
      } catch (error) {
        console.error("Hiba a rangok lekérése során:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRanks();
  }, []);

  useEffect(() => {
    if (!loading && ranks.length > 0) {
      // Aktuális rang meghatározása a rankId alapján
      const currentRank = ranks.find((rank) => rank.rankId === rankId);

      if (currentRank) {
        // Következő rang meghatározása
        const currentRankIndex = ranks.indexOf(currentRank);
        const nextRank = ranks[currentRankIndex + 1];
        setUserRank(currentRank);
        if (nextRank) {
          // Progress kiszámítása
          const progressValue =
            ((userPoints - currentRank.pointsRequired) /
              (nextRank.pointsRequired - currentRank.pointsRequired)) *
            100;
          setProgress(progressValue);
          setNextRank(nextRank);

          // Ha a felhasználó elérte a következő ranghoz szükséges pontokat
          if (userPoints >= nextRank.pointsRequired) {
            updateRank(nextRank.rankId);
          }
        } else {
          // Ha nincs következő rang, a progress 100%
          setProgress(100);
          setNextRank(null);
        }
      } else {
        console.error("Nem található a felhasználó aktuális rangja.");
      }
    }
  }, [ranks, userPoints, rankId, loading]);

  const updateRank = async (newRankId: number) => {
    try {
      const response = await fetch(
        `https://localhost:7197/api/Account/${userId}/updaterank`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt") || ""}`,
          },
          body: JSON.stringify({ rankId: newRankId }),
        }
      );

      if (!response.ok) {
        throw new Error("Hiba a rang frissítése során.");
      }

      // Callback hívása a rangfrissítés után
      onRankUpdate();
    } catch (error) {
      console.error("Hiba a rang frissítése során:", error);
    }
  };

  if (loading) {
    return <p>Rangok betöltése...</p>;
  }

  return (
    <div>
<div className="rankContainer">
    <div className="currentRank">
        <strong>{userRank?.rankName}</strong>
        <p>{userPoints}</p>
    </div>

    <div className="progressContainer">
        <div className="progressBar" style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}></div>
        <span className="progressText">{Math.max(0, Math.min(100, progress)).toFixed(0)}%</span>
    </div>

    <div className="nextRank">
        <strong>{nextRank ? nextRank.rankName : ""}</strong>
        <p>{nextRank ? nextRank.pointsRequired : ""}</p>
    </div>
</div>


    </div>
  );
};

export default RankBar;
