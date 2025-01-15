interface User {
  email?: string;
  password?: string;
}

interface NewUser extends User {
  name?: string;
}

export type { User, NewUser };
