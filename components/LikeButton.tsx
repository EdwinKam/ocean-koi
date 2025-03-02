import Icon from "@/assets/icons";
import { theme } from "@/constants/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";

type LikeButtonProps = {
  size?: number;
  likes: number;
  isLiked?: boolean;
  onPress: () => void;
};

const LikeButton: React.FC<LikeButtonProps> = ({
  size = 26,
  likes = 0,
  isLiked = false,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, isLiked && styles.buttonLiked]}
    >
      <View style={styles.container}>
        <Icon
          name="heart"
          strokeWidth={2.5}
          size={size}
          color={isLiked ? theme.light.tint : theme.light.text}
          fill={isLiked ? theme.light.tint : "transparent"}
        />
        <Text style={[styles.likeCount, isLiked && styles.likeCountLiked]}>
          {likes}
        </Text>
      </View>
    </Pressable>
  );
};

export default LikeButton;

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: "rgba(0,0,0,0.07)",
  },
  buttonLiked: {
    backgroundColor: "rgba(10,126,164,0.1)",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  likeCount: {
    fontSize: 14,
    color: theme.light.text,
    fontWeight: "500",
  },
  likeCountLiked: {
    color: theme.light.tint,
  },
});
