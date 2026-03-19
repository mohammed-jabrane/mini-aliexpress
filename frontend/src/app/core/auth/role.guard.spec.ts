import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

import { NotificationService } from '../services/notification.service';
import { roleGuard } from './role.guard';

describe('roleGuard', () => {
  let keycloakSpy: jasmine.SpyObj<KeycloakService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;
  const mockState = { url: '/seller' } as RouterStateSnapshot;

  beforeEach(() => {
    keycloakSpy = jasmine.createSpyObj('KeycloakService', ['getUserRoles']);
    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);
    notificationSpy = jasmine.createSpyObj('NotificationService', ['warn']);

    TestBed.configureTestingModule({
      providers: [
        { provide: KeycloakService, useValue: keycloakSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NotificationService, useValue: notificationSpy },
      ],
    });
  });

  it('should return true when no roles are required', () => {
    const route = { data: {} } as unknown as ActivatedRouteSnapshot;

    const result = TestBed.runInInjectionContext(() => roleGuard(route, mockState));

    expect(result).toBeTrue();
  });

  it('should return true when user has a required role', () => {
    const route = { data: { roles: ['ROLE_SELLER'] } } as unknown as ActivatedRouteSnapshot;
    keycloakSpy.getUserRoles.and.returnValue(['ROLE_USER', 'ROLE_SELLER']);

    const result = TestBed.runInInjectionContext(() => roleGuard(route, mockState));

    expect(result).toBeTrue();
  });

  it('should redirect to /products and warn when user lacks required role', () => {
    const route = { data: { roles: ['ROLE_ADMIN'] } } as unknown as ActivatedRouteSnapshot;
    keycloakSpy.getUserRoles.and.returnValue(['ROLE_USER']);
    const urlTree = {} as UrlTree;
    routerSpy.createUrlTree.and.returnValue(urlTree);

    const result = TestBed.runInInjectionContext(() => roleGuard(route, mockState));

    expect(result).toBe(urlTree);
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/products']);
    expect(notificationSpy.warn).toHaveBeenCalled();
  });
});
