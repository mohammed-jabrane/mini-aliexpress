export interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  roles: string[];
}

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  username: null,
  roles: [],
};
