import { TestBed } from '@angular/core/testing';
import { KeycloakService } from 'keycloak-angular';

import { AuthKeycloakService } from './keycloak.service';

describe('AuthKeycloakService', () => {
  let service: AuthKeycloakService;
  let keycloakSpy: jasmine.SpyObj<KeycloakService>;

  beforeEach(() => {
    keycloakSpy = jasmine.createSpyObj('KeycloakService', [
      'isLoggedIn',
      'getUsername',
      'getUserRoles',
      'isUserInRole',
      'login',
      'logout',
      'getToken',
      'loadUserProfile',
    ]);
    keycloakSpy.isLoggedIn.and.returnValue(true);
    keycloakSpy.getUsername.and.returnValue('testuser');
    keycloakSpy.getUserRoles.and.returnValue(['ROLE_USER']);

    TestBed.configureTestingModule({
      providers: [
        AuthKeycloakService,
        { provide: KeycloakService, useValue: keycloakSpy },
      ],
    });

    service = TestBed.inject(AuthKeycloakService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize signals from KeycloakService', () => {
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.currentUsername()).toBe('testuser');
    expect(service.currentRoles()).toEqual(['ROLE_USER']);
  });

  it('should delegate isLoggedIn to KeycloakService', () => {
    expect(service.isLoggedIn()).toBeTrue();
    expect(keycloakSpy.isLoggedIn).toHaveBeenCalled();
  });

  it('should delegate getUsername to KeycloakService', () => {
    expect(service.getUsername()).toBe('testuser');
  });

  it('should delegate getUserRoles to KeycloakService', () => {
    expect(service.getUserRoles()).toEqual(['ROLE_USER']);
  });

  it('should delegate hasRole to KeycloakService.isUserInRole', () => {
    keycloakSpy.isUserInRole.and.returnValue(true);
    expect(service.hasRole('ROLE_USER')).toBeTrue();
    expect(keycloakSpy.isUserInRole).toHaveBeenCalledWith('ROLE_USER');
  });

  it('should delegate login to KeycloakService', async () => {
    keycloakSpy.login.and.returnValue(Promise.resolve());
    await service.login();
    expect(keycloakSpy.login).toHaveBeenCalled();
  });

  it('should delegate logout to KeycloakService', async () => {
    keycloakSpy.logout.and.returnValue(Promise.resolve());
    await service.logout();
    expect(keycloakSpy.logout).toHaveBeenCalled();
  });

  it('should delegate getToken to KeycloakService', async () => {
    keycloakSpy.getToken.and.returnValue(Promise.resolve('mock-token'));
    const token = await service.getToken();
    expect(token).toBe('mock-token');
  });

  it('should not call getUsername/getUserRoles when not logged in', () => {
    const notLoggedInSpy = jasmine.createSpyObj('KeycloakService', [
      'isLoggedIn', 'getUsername', 'getUserRoles', 'isUserInRole',
      'login', 'logout', 'getToken', 'loadUserProfile',
    ]);
    notLoggedInSpy.isLoggedIn.and.returnValue(false);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        AuthKeycloakService,
        { provide: KeycloakService, useValue: notLoggedInSpy },
      ],
    });

    const svc = TestBed.inject(AuthKeycloakService);
    expect(svc.isAuthenticated()).toBeFalse();
    expect(svc.currentUsername()).toBe('');
    expect(svc.currentRoles()).toEqual([]);
    expect(notLoggedInSpy.getUsername).not.toHaveBeenCalled();
    expect(notLoggedInSpy.getUserRoles).not.toHaveBeenCalled();
  });
});
