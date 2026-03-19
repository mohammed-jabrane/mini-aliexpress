import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login Success': props<{ username: string; roles: string[] }>(),
    'Logout': emptyProps(),
    'Update Roles': props<{ roles: string[] }>(),
  },
});
