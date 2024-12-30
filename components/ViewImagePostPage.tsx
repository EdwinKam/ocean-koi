import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { Post } from "@/model/post"; // Assuming Post is a TypeScript interface
import PostCommentView from "./PostCommentView";

const { width: screenWidth } = Dimensions.get("window");

interface ViewImagePostPageProps {
  post: Post;
}

const ViewImagePostPage: React.FC<ViewImagePostPageProps> = ({ post }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.authorName}>
        {post?.author.username || "Author Name"}
      </Text>
      {post?.imageUrls?.length > 0 && (
        <Image source={{ uri: post.imageUrls[0] }} style={styles.image} />
      )}
      <Text style={styles.authorName}>{post?.subject}</Text>
      <Text style={styles.authorName}>{post?.content}</Text>
      <PostCommentView post={post} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  authorName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
    paddingHorizontal: 20, // Add padding to the text
  },
  image: {
    width: screenWidth, // Full width of the screen
    height: screenWidth, // Assuming a square image for simplicity
    marginBottom: 10,
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    paddingHorizontal: 20, // Add padding to the comments
  },
  commentUsername: {
    fontWeight: "bold",
    marginRight: 5,
    textAlign: "left",
  },
  commentText: {
    fontSize: 16,
    textAlign: "left",
  },
});

export default ViewImagePostPage;
