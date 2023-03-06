export interface User {
  userId: string;
  userType: string;
  username: string;
  email: string | null;
  twitterId: string | null;
  googleId: string | null;
  createdAt: string;
}

export interface DB {
  user: User;
}
