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

const { width: screenWidth } = Dimensions.get("window");

interface ViewImagePostPageProps {
  post: Post;
  comments: { id: string; username: string; comment: string }[];
}

const ViewImagePostPage: React.FC<ViewImagePostPageProps> = ({
  post,
  comments,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.authorName}>
        {post?.author.username || "Author Name"}
      </Text>
      <Image
        source={{ uri: post?.imageUrl || "https://via.placeholder.com/300" }}
        style={styles.image}
      />
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <Text style={styles.commentUsername}>{item.username}</Text>
            <Text style={styles.commentText}>{item.comment}</Text>
          </View>
        )}
      />
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
