interface User {
  email?: string;
  password?: string;
}

interface NewUser extends User {
  name?: string;
}

interface UserState {
  name: string;
  email: string;
  isVerified: boolean;
  loading: boolean;
  error: string | null;
}

export type { User, NewUser, UserState };
