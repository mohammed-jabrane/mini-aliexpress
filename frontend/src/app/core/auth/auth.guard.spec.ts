import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let keycloakSpy: jasmine.SpyObj<KeycloakService>;
  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = { url: '/cart' } as RouterStateSnapshot;

  beforeEach(() => {
    keycloakSpy = jasmine.createSpyObj('KeycloakService', ['isLoggedIn', 'login']);

    TestBed.configureTestingModule({
      providers: [
        { provide: KeycloakService, useValue: keycloakSpy },
      ],
    });
  });

  it('should return true when user is logged in', () => {
    keycloakSpy.isLoggedIn.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    expect(result).toBeTrue();
  });

  it('should redirect to login and return false when user is not logged in', () => {
    keycloakSpy.isLoggedIn.and.returnValue(false);
    keycloakSpy.login.and.returnValue(Promise.resolve());

    const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    expect(result).toBeFalse();
    expect(keycloakSpy.login).toHaveBeenCalledWith({
      redirectUri: window.location.origin + '/cart',
    });
  });
});
