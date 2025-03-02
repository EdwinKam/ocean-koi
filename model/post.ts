import User from './user';

// Define the Post interface
export interface Post {
  id: string;
  subject: string;
  content: string;
  author: User;
  creationTs: number;
  likes: number;
  likedByCurrentUser: boolean;
}
