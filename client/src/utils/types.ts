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
  recentTransactions: [];
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

interface FilterButtonProps {
  options: string[];
  onChange?: (selectedIndex: number) => void;
}

interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps {
  options: SelectOption[];
  placeholder?: string;
  value?: SelectOption | null;
  onChange: (selected: SelectOption) => void;
}

interface DurationType {
  label: string;
  value: string | number;
}

interface SearchProps {
  placeholder?: string;
  onInputChange?: (e: any) => void;
}

interface TableProps {
  columns: string[];
  data: any[];
  itemsPerPage: number;
  totalItems: number;
  currentPage?: number;
}

export interface Transaction {
  _id: string;
  description: string;
  amount: number;
  date: string;
  category: string | "credit" | "debit";
}

export interface Filters {
  incomeType: number;
  dateStart: string | null | Date;
  dateEnd: string | null | Date;
  searchValue: string;
}

export type {
  User,
  NewUser,
  UserState,
  SidebarLink,
  SidebarProps,
  FilterButtonProps,
  SelectOption,
  SelectProps,
  DurationType,
  SearchProps,
  TableProps,
};
