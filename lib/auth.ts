import auth from "@react-native-firebase/auth"; // Firebase Authentication

import { isAccessTokenValid } from "@/lib/authService";
import { useEffect, useState } from "react";

const useAuth = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const isTokenValid = await isAccessTokenValid(user);
          setIsSignedIn(isTokenValid);
          setAccessToken(token);
        } catch (error) {
          console.error("Error getting token:", error);
          setIsSignedIn(false);
          setAccessToken(null);
        }
      } else {
        setIsSignedIn(false);
        setAccessToken(null);
      }
      setIsLoading(false);
    });

    // Clean up the subscription when the component unmounts
    return unsubscribe;
  }, []);

  return { isSignedIn, isLoading, accessToken };
};

export default useAuth;

export const signOutUser = async () => {
  try {
    await auth().signOut();
    console.log("User signed out!");
  } catch (error) {
    console.error("Sign out error:", error);
  }
};
