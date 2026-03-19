import { createReducer, on } from '@ngrx/store';

import { AuthActions } from './auth.actions';
import { AuthState, initialAuthState } from './auth.state';

export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.loginSuccess, (state, { username, roles }) => ({
    ...state,
    isAuthenticated: true,
    username,
    roles,
  })),

  on(AuthActions.logout, () => ({
    ...initialAuthState,
  })),

  on(AuthActions.updateRoles, (state, { roles }) => ({
    ...state,
    roles,
  })),
);
