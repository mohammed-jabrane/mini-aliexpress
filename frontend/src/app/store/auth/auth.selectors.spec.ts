import {
  selectIsAuthenticated,
  selectUsername,
  selectRoles,
  selectHasRole,
  selectIsSeller,
  selectIsAdmin,
  selectAuthState,
} from './auth.selectors';
import { AuthState } from './auth.state';

describe('Auth Selectors', () => {
  const mockAuthState: AuthState = {
    isAuthenticated: true,
    username: 'john',
    roles: ['buyer', 'seller'],
  };

  it('should select isAuthenticated', () => {
    // GIVEN
    const state = { auth: mockAuthState };

    // WHEN
    const result = selectIsAuthenticated(state);

    // THEN
    expect(result).toBeTrue();
  });

  it('should select username', () => {
    // GIVEN
    const state = { auth: mockAuthState };

    // WHEN
    const result = selectUsername(state);

    // THEN
    expect(result).toBe('john');
  });

  it('should select roles', () => {
    // GIVEN
    const state = { auth: mockAuthState };

    // WHEN
    const result = selectRoles(state);

    // THEN
    expect(result).toEqual(['buyer', 'seller']);
  });

  it('should select hasRole for existing role', () => {
    // GIVEN
    const state = { auth: mockAuthState };

    // WHEN
    const result = selectHasRole('seller')(state);

    // THEN
    expect(result).toBeTrue();
  });

  it('should select hasRole for missing role', () => {
    // GIVEN
    const state = { auth: mockAuthState };

    // WHEN
    const result = selectHasRole('admin')(state);

    // THEN
    expect(result).toBeFalse();
  });

  it('should select isSeller', () => {
    // GIVEN
    const state = { auth: mockAuthState };

    // WHEN
    const result = selectIsSeller(state);

    // THEN
    expect(result).toBeTrue();
  });

  it('should select isAdmin', () => {
    // GIVEN
    const state = { auth: mockAuthState };

    // WHEN
    const result = selectIsAdmin(state);

    // THEN
    expect(result).toBeFalse();
  });

});
