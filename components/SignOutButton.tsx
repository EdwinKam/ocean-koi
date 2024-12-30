import Icon from "@/assets/icons";
import { theme } from "@/constants/theme";
import auth from "@react-native-firebase/auth";
import { Router } from "expo-router";
import React from "react";
import { Alert, Pressable, StyleSheet } from "react-native";

type SignOutButtonProps = {
  size?: number;
  router: Router;
};

const SignOutButton: React.FC<SignOutButtonProps> = ({ size = 26, router }) => {
  const signOut = async () => {
    try {
      await auth().signOut();

      // router.replace("/welcome");
    } catch (error: any) {
      console.error("Sign Out Error:", error);
      Alert.alert("Sign Out", "Sign Out was unsuccessful");
    } finally {
    }
  };

  return (
    <Pressable onPress={signOut} style={styles.button}>
      <Icon
        name="signOut"
        strokeWidth={2.5}
        size={size}
        color={theme.light.text}
      />
    </Pressable>
  );
};

export default SignOutButton;

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-end",
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: "rgba(0,0,0,0.07)",
  },
});
