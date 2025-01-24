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

interface SidebarLink {
  name: string;
  icon: React.ElementType;
  href: string;
}

interface SidebarProps {
  links: SidebarLink[];
}

export type { User, NewUser, UserState, SidebarLink, SidebarProps };
