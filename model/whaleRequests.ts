export interface WhaleBaseRequest {
  accessToken: string;
}

export interface CreatePostRequest extends WhaleBaseRequest {
  content: string;
  subject: string;
  imageUri: string;
}

export interface GetBatchPostRequest extends WhaleBaseRequest {
  postIds: string[];
}

export interface GetBatchUserPublicDataRequest extends WhaleBaseRequest {
  userIds: string[];
}

export interface AddCommentRequest extends WhaleBaseRequest {
  content: string;
  postId: string;
  parentCommentId?: string;
}
