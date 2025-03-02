import Icon from "@/assets/icons";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/lib/common";
import { authWithGoogle, isAccessTokenValid } from "@/lib/authService";
import auth from "@react-native-firebase/auth";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

const SignUp = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const confirmRef = useRef("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current || !confirmRef.current) {
      Alert.alert("Sign Up", "Please fill all the fields!");

      return;
    }

    if (passwordRef.current != confirmRef.current) {
      Alert.alert("Sign Up", "Password does not match!");

      return;
    }

    try {
      setLoadingEmail(true);

      await auth().createUserWithEmailAndPassword(
        emailRef.current,
        passwordRef.current,
      );
    } catch (error: any) {
      console.error(error);

      if (error.code === "auth/email-already-in-use") {
        console.log("That email address is already in use!");
        Alert.alert("Sign In", "Email is already in use");
      }

      if (error.code === "auth/invalid-email") {
        console.log("That email address is invalid!");
        Alert.alert("Sign In", "Email is invalid");
      }
    } finally {
      setLoadingEmail(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoadingGoogle(true);
    try {
      await authWithGoogle();
      const isTokenValid = await isAccessTokenValid(await auth().currentUser!);
      if (!isTokenValid) {
        throw new Error("could not verify token");
      }
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      Alert.alert("Sign Up", "Google Sign Up was unsuccessful");
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <BackButton router={router} />

        {/* welcome */}
        <View>
          <Text style={styles.welcomeText}>Let's</Text>
          <Text style={styles.welcomeText}>Get Started</Text>
        </View>

        {/* form */}
        <View style={styles.form}>
          <Text style={{ fontSize: hp(1.5), color: theme.light.text }}>
            Please enter the details to create an account
          </Text>
          <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
            placeholder="Enter your email"
            onChangeText={(value) => {
              emailRef.current = value;
            }}
          />
          <Input
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder="Enter your password"
            onChangeText={(value) => {
              passwordRef.current = value;
            }}
            secureTextEntry={true}
          />
          <Input
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder="Confirm your password"
            onChangeText={(value) => {
              confirmRef.current = value;
            }}
            secureTextEntry={true}
          />
          <Button
            title={"Sign Up"}
            loading={loadingEmail}
            onPress={onSubmit}
            buttonStyle={undefined}
            textStyle={undefined}
          />
          <Button
            title="Sign Up with Google"
            loading={loadingGoogle}
            onPress={signInWithGoogle}
            buttonStyle={styles.googleButton}
            textStyle={styles.googleButtonText}
            icon={<Icon name="google" size={26} strokeWidth={1.6} />}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable
            onPress={() => {
              router.push("/signin");
            }}
          >
            <Text
              style={[
                styles.footerText,
                {
                  color: theme.light.tabIconSelected,
                  fontWeight: theme.fonts.semibold,
                },
              ]}
            >
              Sign In
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
  },

  welcomeText: {
    fontSize: hp(4),
    fontWeight: theme.fonts.bold,
    color: theme.light.text,
  },

  form: {
    gap: 25,
  },

  forgotPassword: {
    textAlign: "right",
    fontWeight: theme.fonts.semibold,
    color: theme.light.text,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },

  footerText: {
    textAlign: "center",
    color: theme.light.text,
    fontSize: hp(1.6),
  },

  googleButton: {
    backgroundColor: "#4285F4",
  },

  googleButtonText: {
    color: "#fff",
  },
});
