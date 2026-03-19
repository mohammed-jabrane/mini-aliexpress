import { AuthActions } from './auth.actions';
import { authReducer } from './auth.reducer';
import { initialAuthState } from './auth.state';

describe('Auth Reducer', () => {

  it('should return the initial state when unknown action', () => {
    // GIVEN
    const action = { type: 'Unknown' };

    // WHEN
    const result = authReducer(initialAuthState, action);

    // THEN
    expect(result).toBe(initialAuthState);
  });

  it('should set user on loginSuccess', () => {
    // GIVEN
    const username = 'john';
    const roles = ['buyer', 'seller'];

    // WHEN
    const result = authReducer(initialAuthState, AuthActions.loginSuccess({ username, roles }));

    // THEN
    expect(result.isAuthenticated).toBeTrue();
    expect(result.username).toBe('john');
    expect(result.roles).toEqual(['buyer', 'seller']);
  });

  it('should reset state on logout', () => {
    // GIVEN
    const loggedInState = { isAuthenticated: true, username: 'john', roles: ['buyer'] };

    // WHEN
    const result = authReducer(loggedInState, AuthActions.logout());

    // THEN
    expect(result).toEqual(initialAuthState);
  });

  it('should update roles on updateRoles', () => {
    // GIVEN
    const state = { isAuthenticated: true, username: 'john', roles: ['buyer'] };
    const newRoles = ['buyer', 'seller', 'admin'];

    // WHEN
    const result = authReducer(state, AuthActions.updateRoles({ roles: newRoles }));

    // THEN
    expect(result.roles).toEqual(['buyer', 'seller', 'admin']);
    expect(result.isAuthenticated).toBeTrue();
    expect(result.username).toBe('john');
  });

});
