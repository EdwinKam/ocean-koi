import { theme } from "@/constants/theme";
import { Appearance, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ScreenWrapper = ({ children }: { children: React.ReactNode }) => {
  const edgeInsects = useSafeAreaInsets();

  const paddingTop = edgeInsects.top > 0 ? edgeInsects.top + 5 : 30;

  const colorScheme = Appearance.getColorScheme();

  let backgroundColor = theme.light.background;
  if (colorScheme === "dark") {
    backgroundColor = theme.dark.background;
  }

  return (
    <View
      style={{
        flex: 1,
        paddingTop: paddingTop,
        backgroundColor: backgroundColor as string,
      }}
    >
      {children}
    </View>
  );
};

export default ScreenWrapper;
