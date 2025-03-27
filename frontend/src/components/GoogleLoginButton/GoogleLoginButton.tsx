import { GoogleLogin } from "@react-oauth/google";
import { useUserContext } from "../contexts/UserContext";
import { useThemeContext } from "../contexts/ThemeContext";

const GoogleLoginButton = () => {
  const { setUser } = useUserContext();
  const { setTheme } = useThemeContext();

  const handleGoogleSuccess = async (response: any) => {
    const googleToken = response.credential;
  
    try {
      const res = await fetch("https://localhost:7197/api/Account/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleToken }),
      });
  
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("jwt", data.jwt.result);
  
        const userResponse = await fetch("https://localhost:7197/api/User/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${data.jwt.result}` },
        });
  
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
  
          // Ellenőrizzük, hogy van-e téma és beállítjuk
          if (userData.theme) {
            localStorage.setItem("theme", userData.theme);
            setTheme(userData.theme as "light" | "dark");
          }
        }
      } else {
        console.error("Google login failed with status:", res.status);
      }
    } catch (err) {
      console.error("Error during Google login:", err);
    }
  };
  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => console.error("Google Login Failed")}
    />
  );
};

export default GoogleLoginButton;
