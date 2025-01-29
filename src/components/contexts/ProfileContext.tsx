import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

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
}

interface ProfileContextType {
  userProfile: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const defaultProfileContext: ProfileContextType = {
  userProfile: null,
  setUserProfile: () => {},
};

export const ProfileContext = createContext<ProfileContextType>(defaultProfileContext);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);

        const profile: UserProfile = {
          id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
          userName: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
          role: decoded["http://schemas.xmlsoap.org/ws/2008/06/identity/claims/role"],
          phoneNumber: decoded["PhoneNumber"],
          country: decoded["Country"],
          email: decoded["Email"],
          birthDate: decoded["BirthDate"],
          rankId: decoded["RankId"],
          subscriptionId: decoded["SubscriptionId"],
        };

        setUserProfile(profile);
        
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <ProfileContext.Provider value={{ userProfile, setUserProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => useContext(ProfileContext);
