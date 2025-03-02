import LikeButton from '@/components/LikeButton';
import { theme } from '@/constants/theme';
import useAuth from '@/lib/auth';
import { hp, wp } from '@/lib/common';
import { likePost, unlikePost } from '@/lib/postService';
import { Post } from '@/model/post';
import { format } from 'date-fns'; // Import the format function from date-fns
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PostCardProps {
  post: Post;
  showCreationDate?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, showCreationDate }) => {
  const { accessToken } = useAuth();
  const [isLiked, setIsLiked] = React.useState(post.likedByCurrentUser);
  const [likeCount, setLikeCount] = React.useState(post.likes);
  const router = useRouter();

  const handlePress = () => {
    router.push(`/viewpost/${post.id}`); // Navigate to the /post route
  };

  const handleLike = async () => {
    if (!accessToken) {
      console.error('No access token available');
      return;
    }

    try {
      if (isLiked) {
        await unlikePost(accessToken, post.id);
        setLikeCount((prev) => prev - 1);
      } else {
        await likePost(accessToken, post.id);
        setLikeCount((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.postContainer}
    >
      {Math.random() > 0.5 ? (
        <ImagePostCard
          post={post}
          showCreationDate={showCreationDate}
          handleLike={handleLike}
          isLiked={isLiked}
          likeCount={likeCount}
        />
      ) : (
        <TextPostCard
          post={post}
          showCreationDate={showCreationDate}
          handleLike={handleLike}
          isLiked={isLiked}
          likeCount={likeCount}
        />
      )}
    </TouchableOpacity>
  );
};

interface PostCardChildProps {
  post: Post;
  showCreationDate?: boolean;
  handleLike: () => Promise<void>;
  isLiked: boolean;
  likeCount: number;
}

const TextPostCard: React.FC<PostCardChildProps> = ({
  post,
  showCreationDate,
  handleLike,
  isLiked,
  likeCount,
}) => {
  const formattedDate = post.creationTs
    ? format(new Date(post.creationTs), 'MMM d, yyyy')
    : 'null';

  return (
    <View style={styles.contentContainer}>
      {post.subject && <Text style={styles.postSubject}>{post.subject}</Text>}
      <View style={styles.bottomContainer}>
        <View style={styles.textColumn}>
          <Text style={styles.postContent}>{post.content}</Text>
          <Text style={styles.postAuthor}>
            {!showCreationDate
              ? `@${post.author?.username || 'null'}`
              : formattedDate}
          </Text>
        </View>
        <View style={styles.likeButtonContainer}>
          <LikeButton
            likes={likeCount}
            isLiked={isLiked}
            onPress={handleLike}
          />
        </View>
      </View>
    </View>
  );
};

const ImagePostCard: React.FC<PostCardChildProps> = ({
  post,
  showCreationDate,
  handleLike,
  isLiked,
  likeCount,
}) => {
  const formattedDate = post.creationTs
    ? format(new Date(post.creationTs), 'MMM d, yyyy')
    : 'null';

  return (
    <View style={styles.contentContainer}>
      <View style={styles.imagePlaceholder}>
        <Image
          source={{
            uri: 'https://64.media.tumblr.com/b4f649d5fd4e5e8c2ae3bd66a5783016/18ce8e60dacba0b7-c5/s1280x1920/18278335098dbe59b5d5db9f8af65fb7789efbb0.jpg',
          }}
          style={styles.image}
          resizeMode='cover'
        />
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.textColumn}>
          <Text style={styles.postContent}>{post.content}</Text>
          <Text style={styles.postAuthor}>
            {!showCreationDate
              ? `@${post.author?.username || 'null'}`
              : formattedDate}
          </Text>
        </View>
        <View style={styles.likeButtonContainer}>
          <LikeButton
            likes={likeCount}
            isLiked={isLiked}
            onPress={handleLike}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    flex: 1,
    marginBottom: hp(1.2),
    marginHorizontal: wp(2),
    backgroundColor: '#ffffff',
    borderRadius: wp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  contentContainer: {
    width: '100%',
    padding: wp(3),
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 1, // Changed to a more standard image ratio
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: wp(1),
  },
  postSubject: {
    fontSize: hp(2),
    fontWeight: '600',
    color: theme.light.text,
    marginBottom: hp(1),
  },
  bottomContainer: {
    flexDirection: 'row',
    paddingTop: hp(1),
  },
  textColumn: {
    flex: 1,
    paddingRight: wp(2),
  },
  postContent: {
    fontSize: hp(1.5),
    color: theme.light.text,
    marginBottom: hp(0.25),
  },
  postAuthor: {
    fontSize: hp(1.4),
    color: theme.light.icon,
    fontWeight: '500',
  },
  likeButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: wp(2),
  },
});

export default PostCard;
