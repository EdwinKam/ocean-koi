import { theme } from "@/constants/theme";
import { hp } from "@/lib/common";
import { StyleSheet, TextInput, View, ViewStyle } from "react-native";

interface InputProps {
  icon?: React.ReactNode;
  placeholder?: string;
  containerStyles?: ViewStyle;
  onChangeText?: ((text: string) => void) | undefined;
  secureTextEntry?: boolean | undefined;
  inputRef?: React.Ref<TextInput>;
}

const Input: React.FC<InputProps> = (props) => {
  return (
    <View
      style={[styles.container, props.containerStyles && props.containerStyles]}
    >
      {props.icon && props.icon}
      <TextInput
        style={{ flex: 1 }}
        placeholder={props.placeholder}
        placeholderTextColor={theme.light.tabIconDefault}
        onChangeText={props.onChangeText}
        secureTextEntry={props.secureTextEntry}
        ref={props.inputRef && props.inputRef}
        {...props}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: hp(7.2),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.4,
    borderColor: theme.light.text,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
    paddingHorizontal: 18,
    gap: 12,
  },
});
