import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_FIREBASE_CLIENT_ID,
});

export const authWithGoogle = async () => {
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();

  const token = userInfo.data?.idToken;
  if (!token) {
    // should not print this
    throw new Error("No token found in user info");
  }

  const googleCredential = auth.GoogleAuthProvider.credential(token);
  return await auth().signInWithCredential(googleCredential);
};

export const isAccessTokenValid = async (user: FirebaseAuthTypes.User) => {
  try {
    console.log("checking token with backend");
    const firebaseToken = await user.getIdToken();
    console.log("This is the access token:", firebaseToken);

    const responseData = await verifyToken(firebaseToken);

    if (!responseData?.validToken) {
      throw new Error("Invalid token");
    }

    console.log("User signed in!");
    return true;
  } catch (error) {
    return false;
  }
};

export const verifyToken = async (firebaseToken: string) => {
  try {
    console.log(
      "calling " + `${process.env.EXPO_PUBLIC__BACKEND_HOST}/api/auth/verify`,
    );
    console.log("access token is " + firebaseToken);
    const response = await fetch(
      `${process.env.EXPO_PUBLIC__BACKEND_HOST}/api/auth/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accessToken: firebaseToken,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error verifying token:", error);
    throw error; // Rethrow the error if you want to handle it further up the call stack
  }
};
