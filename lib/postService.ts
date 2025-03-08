import { Post } from "@/model/post";
import { PostComment } from "@/model/postComment";
import User from "@/model/user";
import {
  AddCommentRequest,
  CreatePostRequest,
  GetBatchPostRequest,
} from "@/model/whaleRequests";
import { getBatchUser } from "./userService";

export const createPost = async (request: CreatePostRequest) => {
  console.log(
    "calling " + `${process.env.EXPO_PUBLIC__BACKEND_HOST}/api/posts`
  );
  const formData = new FormData();

  // Append text data
  formData.append("postContent", request.content);
  formData.append("postSubject", request.subject);
  // Convert the image URI to a Blob and append to FormData
  if (request.imageUri) {
    formData.append("image", {
      uri: request.imageUri,
      name: `photo.jpg`, // You can use a dynamic name or the original file name
      type: "image/jpeg", // Ensure the correct MIME type
    } as any);
  }

  console.log(formData);

  const response = await fetch(
    `${process.env.EXPO_PUBLIC__BACKEND_HOST}/api/posts`,
    {
      method: "POST",
      headers: {
        accessToken: request.accessToken,
      },
      body: formData, // Use formData instead of JSON.stringify
    }
  );

  if (!response.ok) {
    // If the response status is not OK, throw an error
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, details: ${errorText}`
    );
  }

  const data = await response.json();
  return data;
};

export async function getRecommendations(accessToken: string): Promise<Post[]> {
  console.log(
    "calling " +
      `${process.env.EXPO_PUBLIC__BACKEND_HOST}/api/posts/recommendations`
  );
  const response = await fetch(
    `${process.env.EXPO_PUBLIC__BACKEND_HOST}/api/posts/recommendations`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*", // Match the accept header from the curl command
        accessToken: accessToken,
      },
    }
  );

  if (!response.ok) {
    // If the response status is not OK, throw an error
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, details: ${errorText}`
    );
  }

  const data = await response.json();

  if (!data.posts || data.posts.length === 0) {
    console.log("post is empty");
    return [];
  }

  const authorIds: string[] = Array.from(
    new Set(data.posts.map((post: { authorId: any }) => post.authorId))
  ); // get deduped authorId

  const userMap: Record<string, User> = await getBatchUser({
    accessToken: accessToken,
    userIds: authorIds,
  });

  const posts: Post[] = data.posts
    .filter(
      (post: { authorId: string | number }) =>
        userMap[post.authorId] !== undefined
    ) // Filter out posts with undefined authors
    .map((post: { authorId: string | number }) => ({
      ...post,
      author: userMap[post.authorId],
    }));

  return posts;
}

export async function getBatchPost(request: GetBatchPostRequest) {
  if (request.postIds.length === 0) {
    return [];
  }

  const queryParams = request.postIds
    .map((id) => `postIds=${encodeURIComponent(id)}`)
    .join("&");
  const url = `${process.env.EXPO_PUBLIC__BACKEND_HOST}/api/posts/batch?${queryParams}`;

  console.log("calling " + url);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*", // Match the accept header from the curl command
      accessToken: request.accessToken,
    },
  });

  if (!response.ok) {
    // If the response status is not OK, throw an error
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, details: ${errorText}`
    );
  }

  const data = await response.json();
  console.log(data.posts);
  const authorIds: string[] = Array.from(
    new Set(data.posts.map((post: { authorId: any }) => post.authorId))
  ); // get deduped authorId

  const userMap: Record<string, User> = await getBatchUser({
    accessToken: request.accessToken,
    userIds: authorIds,
  });

  const posts: Post[] = data.posts
    .filter(
      (post: { authorId: string | number }) =>
        userMap[post.authorId] !== undefined
    ) // Filter out posts with undefined authors
    .map((post: { authorId: string | number }) => ({
      ...post,
      author: userMap[post.authorId],
    }));

  console.log(posts);
  return posts;
}

export async function getOwnPosts(accessToken: string): Promise<Post[]> {
  const url = `${process.env.EXPO_PUBLIC__BACKEND_HOST}/api/posts/me`;

  console.log("calling " + url);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*", // Match the accept header from the curl command
      accessToken: accessToken,
    },
  });

  if (!response.ok) {
    // If the response status is not OK, throw an error
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, details: ${errorText}`
    );
  }

  const data = await response.json();

  if (!data.posts || data.posts.length === 0) {
    console.log("post is empty");
    return [];
  }

  const authorIds: string[] = Array.from(
    new Set(data.posts.map((post: { authorId: any }) => post.authorId))
  ); // get deduped authorId

  const userMap: Record<string, User> = await getBatchUser({
    accessToken: accessToken,
    userIds: authorIds,
  });

  const posts: Post[] = data.posts
    .filter(
      (post: { authorId: string | number }) =>
        userMap[post.authorId] !== undefined
    ) // Filter out posts with undefined authors
    .map((post: { authorId: string | number }) => ({
      ...post,
      author: userMap[post.authorId],
    }));

  return posts;
}

export async function readPost(
  accessToken: string,
  postId: string
): Promise<Post> {
  const url = `${process.env.EXPO_PUBLIC__BACKEND_HOST}/api/posts/${postId}`;

  console.log("calling " + url);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      accessToken: accessToken,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, details: ${errorText}`
    );
  }

  const data = await response.json();

  if (!data.post) {
    throw new Error(`postId ${postId} returned null from backend`);
  }

  let author: User;

  // If not in cache, fetch the author data
  try {
    const response = await getBatchUser({
      accessToken: accessToken,
      userIds: [data.post.authorId],
    });

    if (response[data.post.authorId] === undefined) {
      throw new Error(`Author not found for postId ${postId}`);
    } else {
      author = response[data.post.authorId];
    }
  } catch (error) {
    console.error(`Failed to fetch user with ID ${data.post.authorId}:`, error);
    throw new Error(`Failed to fetch author details for postId ${postId}`);
  }

  const post: Post = {
    ...data.post,
    author: author,
  };

  console.log(post);

  return post;
}

export async function getPostComments(
  accessToken: string,
  post: Post
): Promise<PostComment[]> {
  const url = `${process.env.EXPO_PUBLIC__BACKEND_HOST}/api/posts/${post.id}/comments`;
  console.log("calling " + url);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      accessToken: accessToken,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, details: ${errorText}`
    );
  }

  const data = await response.json();

  const commenterIds: string[] = Array.from(
    new Set(
      data.postComments.map(
        (comment: { commenterUid: any }) => comment.commenterUid
      )
    )
  ); // get deduped authorId

  const userMap: Record<string, User> = await getBatchUser({
    accessToken: accessToken,
    userIds: commenterIds,
  });

  // Create a map to store comments by their ID
  const commentMap: { [key: string]: PostComment } = {};

  // First pass: create Comment objects and store them in the map
  data.postComments.forEach((commentData: any) => {
    commentMap[commentData.commentId] = {
      commenter: userMap[commentData.commenterUid],
      post: post,
      content: commentData.content,
      childComments: [],
    };
  });

  // Second pass: link child comments to their parents
  const rootComments: PostComment[] = [];
  data.postComments.forEach((commentData: any) => {
    const comment: PostComment = commentMap[commentData.commentId];
    if (commentData.parentCommentId) {
      // If there's a parentCommentId, add this comment to the parent's childComments
      const parentComment: PostComment =
        commentMap[commentData.parentCommentId];
      if (parentComment) {
        parentComment.childComments?.push(comment);
      }
    } else {
      // If there's no parentCommentId, it's a root comment
      rootComments.push(comment);
    }
  });

  console.log(rootComments);

  return rootComments;
}

export const addComment = async (request: AddCommentRequest) => {
  const url = `${process.env.EXPO_PUBLIC__BACKEND_HOST}/api/posts/${request.postId}/comments`;
  console.log("calling " + url);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*", // Match the accept header from the curl command
      accessToken: request.accessToken,
    },
    body: JSON.stringify(request), // Ensure the body matches the expected JSON structure
  });

  if (!response.ok) {
    // If the response status is not OK, throw an error
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, details: ${errorText}`
    );
  }

  const data = await response.json();
  return data;
};

export const likePost = async (accessToken: string, postId: string) => {
  const url = `${process.env.EXPO_PUBLIC__BACKEND_HOST}/api/posts/${postId}/likes`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      accessToken: accessToken,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, details: ${errorText}`
    );
  }
};

export const unlikePost = async (accessToken: string, postId: string) => {
  const url = `${process.env.EXPO_PUBLIC__BACKEND_HOST}/api/posts/${postId}/likes`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      accessToken: accessToken,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, details: ${errorText}`
    );
  }
};

export const getPostLikeCount = async (
  accessToken: string,
  postId: string
): Promise<number> => {
  const url = `${process.env.EXPO_PUBLIC__BACKEND_HOST}/api/posts/${postId}/likes/count`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      accessToken: accessToken,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, details: ${errorText}`
    );
  }

  const likeCount = await response.json();
  return likeCount;
};
