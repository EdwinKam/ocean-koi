import { theme } from "@/constants/theme";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const Loading = ({ size = "large" as const, color = theme.light.tint }) => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({});
