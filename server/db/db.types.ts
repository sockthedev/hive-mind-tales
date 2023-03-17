export interface Part {
  partId: string;
  storyId: string;
  parentId: string | null;
  content: string;
  createdBy: string;
  createdAt: string;
}

export interface Story {
  storyId: string;
  title: string;
  rootPartId: string;
  createdBy: string;
  createdAt: string;
}

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
  part: Part;
  story: Story;
  user: User;
}
