import React from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/lib/common";
import { createPost } from "@/lib/postService";
import { useRouter } from "expo-router";
import auth from "@react-native-firebase/auth";
import { useAfterAuthContext } from "@/components/globalContext";
import ImagePicker from "@/components/ImagePicker";

const Post = () => {
  const router = useRouter();

  const [postContent, setPostContent] = React.useState("");
  const [postSubject, setPostSubject] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [image, setImage] = React.useState<string | null>(null);
  const { setCreatedPost } = useAfterAuthContext();

  const submitCreatePost = async () => {
    setLoading(true);
    try {
      const accessToken = (await auth().currentUser?.getIdToken()) || "";
      await createPost({
        accessToken,
        content: postContent,
        subject: postSubject,
        imageUri: image || "",
      });
      setCreatedPost((prev) => prev + 1);
      router.push("/home");
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <ImagePicker image={image} setImage={setImage} />
        <TextInput
          placeholder="Enter post title"
          style={styles.customInput}
          value={postSubject}
          onChangeText={setPostSubject}
        />
        <TextInput
          placeholder="Enter post content"
          style={styles.contentInput}
          value={postContent}
          onChangeText={setPostContent}
          multiline={true} // Allow multiple lines
        />
        <Button title={"Submit"} onPress={submitCreatePost} loading={loading} />
      </View>
    </ScreenWrapper>
  );
};

export default Post;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(5),
  },
  customInput: {
    backgroundColor: theme.light.background,
    marginVertical: hp(1),
    padding: 10,
  },
  contentInput: {
    backgroundColor: theme.light.background,
    marginVertical: hp(1),
    height: hp(20), // Adjust the height to make it bigger
    borderWidth: 0, // Remove the border
    fontSize: 16, // Optional: Increase font size for better readability
    padding: 10, // Optional: Add padding for better text spacing
    textAlignVertical: "top", // Align text to the top
  },
});
