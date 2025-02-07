import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserProfile {
  id: string;
  userName: string;
  role: string;
  phoneNumber: string;
  country: string;
  email: string;
  birthDate: string;
  rankId: string;
  subscriptionId: string;
  profilePictureId: string;
}

interface ProfileContextType {
  userProfile: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>; // 🔥 Hozzáadva!
  fetchUserProfile: () => Promise<void>;
}

// 🔥 Most már `setUserProfile` is az alapértékben van!
const ProfileContext = createContext<ProfileContextType>({
  userProfile: null,
  setUserProfile: () => {}, // 🔥 Hozzáadva!
  fetchUserProfile: async () => {},
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    try {
      const response = await fetch("https://localhost:7197/api/User/me", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Nem sikerült lekérni a felhasználói adatokat");
      }

      const data = await response.json();
      setUserProfile(data); // 🔄 Frissítjük a userProfile-t

    } catch (error) {
      console.error("Hiba a profil lekérésekor:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile(); // 🔄 Amikor betölt az oldal, kérd le a user adatokat
  }, []);

  return (
    <ProfileContext.Provider value={{ userProfile, setUserProfile, fetchUserProfile }}> 
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => useContext(ProfileContext);
