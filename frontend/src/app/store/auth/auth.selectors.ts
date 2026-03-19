import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.isAuthenticated,
);

export const selectUsername = createSelector(
  selectAuthState,
  (state) => state.username,
);

export const selectRoles = createSelector(
  selectAuthState,
  (state) => state.roles,
);

export const selectHasRole = (role: string) =>
  createSelector(selectRoles, (roles) => roles.includes(role));

export const selectIsSeller = createSelector(
  selectRoles,
  (roles) => roles.includes('seller'),
);

export const selectIsAdmin = createSelector(
  selectRoles,
  (roles) => roles.includes('admin'),
);
