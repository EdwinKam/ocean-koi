import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { format } from "date-fns"; // Import the format function from date-fns
import { theme } from "@/constants/theme";
import { hp, wp } from "@/lib/common";
import { Post } from "@/model/post";
import { useRouter } from "expo-router";

interface PostCardProps {
  post: Post;
  showCreationDate?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, showCreationDate }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/viewpost/${post.id}`); // Navigate to the /post route
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.postContainer}>
      {Math.random() > 0.5 ? (
        <ImagePostCard post={post} showCreationDate={showCreationDate} />
      ) : (
        <TextPostCard post={post} showCreationDate={showCreationDate} />
      )}
    </TouchableOpacity>
  );
};

const TextPostCard: React.FC<PostCardProps> = ({ post, showCreationDate }) => {
  // Format the creationTs to the desired format
  const formattedDate = post.creationTs
    ? format(new Date(post.creationTs), "MMM d, yyyy")
    : "null";

  post = {
    ...post,
  };

  return (
    <View style={styles.contentContainer}>
      <Text style={[styles.textPadding, styles.postSubject]}>
        {post.subject}
      </Text>
      <Text style={[styles.textPadding, styles.postSubject]}>
        {post.content}
      </Text>
      {!showCreationDate ? (
        <Text style={[styles.textPadding, styles.postAuthor]}>
          {post.author?.username || "null"}
        </Text>
      ) : (
        <Text style={[styles.textPadding, styles.creationDate]}>
          {formattedDate}
        </Text>
      )}
    </View>
  );
};

const ImagePostCard: React.FC<PostCardProps> = ({ post, showCreationDate }) => {
  const formattedDate = post.creationTs
    ? format(new Date(post.creationTs), "MMM d, yyyy")
    : "null";
  return (
    <View style={styles.contentContainer}>
      {post.imageUrls?.[0] && (
        <View style={styles.imagePlaceholder}>
          <Image
            source={{
              uri: post.imageUrls?.[0] || "",
            }}
            style={styles.image} // Apply the style here
            resizeMode="cover" // Ensure the image covers the area without stretching
          />
        </View>
      )}
      <Text style={[styles.textPadding, styles.postSubject]}>
        {post.content}
      </Text>
      {!showCreationDate ? (
        <Text style={[styles.textPadding, styles.postAuthor]}>
          {post.author?.username || "null"}
        </Text>
      ) : (
        <Text style={[styles.textPadding, styles.creationDate]}>
          {formattedDate}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    flex: 1,
    marginBottom: hp(0.5),
    marginHorizontal: wp(1),
    backgroundColor: "#f9fcff",
    borderRadius: wp(3),
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    overflow: "hidden",
  },
  contentContainer: {
    width: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    aspectRatio: 1, // Maintain a square aspect ratio
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textPadding: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
  },
  postSubject: {
    fontSize: hp(1.5),
    color: theme.light.text,
    flexWrap: "wrap",
  },
  postAuthor: {
    fontSize: hp(1),
    color: theme.light.icon,
    marginBottom: hp(0.5), // Add margin to separate from creation date
  },
  creationDate: {
    fontSize: hp(1),
    color: theme.light.icon,
    fontStyle: "italic",
  },
});

export default PostCard;
