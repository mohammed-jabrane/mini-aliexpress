import { TestBed } from '@angular/core/testing';
import { KeycloakService } from 'keycloak-angular';

import { AuthKeycloakService } from './keycloak.service';

describe('AuthKeycloakService', () => {
  let service: AuthKeycloakService;
  let keycloakSpy: jasmine.SpyObj<KeycloakService>;

  beforeEach(() => {
    keycloakSpy = jasmine.createSpyObj('KeycloakService', [
      'isLoggedIn',
      'getUserRoles',
      'isUserInRole',
      'login',
      'logout',
      'getToken',
      'getKeycloakInstance',
      'loadUserProfile',
    ]);
    keycloakSpy.isLoggedIn.and.returnValue(true);
    keycloakSpy.getUserRoles.and.returnValue(['ROLE_USER']);
    keycloakSpy.getKeycloakInstance.and.returnValue({
      tokenParsed: { preferred_username: 'testuser', email: 'test@example.com' },
    } as any);

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

  it('should initialize all signals synchronously from token', () => {
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.currentUsername()).toBe('testuser');
    expect(service.currentRoles()).toEqual(['ROLE_USER']);
  });

  it('should delegate isLoggedIn to KeycloakService', () => {
    expect(service.isLoggedIn()).toBeTrue();
    expect(keycloakSpy.isLoggedIn).toHaveBeenCalled();
  });

  it('should return currentUsername from getUsername()', () => {
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

  it('should fall back to email when preferred_username is missing', () => {
    const spy = jasmine.createSpyObj('KeycloakService', [
      'isLoggedIn', 'getUserRoles', 'isUserInRole',
      'login', 'logout', 'getToken', 'getKeycloakInstance', 'loadUserProfile',
    ]);
    spy.isLoggedIn.and.returnValue(true);
    spy.getUserRoles.and.returnValue([]);
    spy.getKeycloakInstance.and.returnValue({
      tokenParsed: { email: 'fallback@example.com' },
    } as any);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        AuthKeycloakService,
        { provide: KeycloakService, useValue: spy },
      ],
    });

    const svc = TestBed.inject(AuthKeycloakService);
    expect(svc.currentUsername()).toBe('fallback@example.com');
  });

  it('should leave signals empty when not logged in', () => {
    const spy = jasmine.createSpyObj('KeycloakService', [
      'isLoggedIn', 'getUserRoles', 'isUserInRole',
      'login', 'logout', 'getToken', 'getKeycloakInstance', 'loadUserProfile',
    ]);
    spy.isLoggedIn.and.returnValue(false);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        AuthKeycloakService,
        { provide: KeycloakService, useValue: spy },
      ],
    });

    const svc = TestBed.inject(AuthKeycloakService);
    expect(svc.isAuthenticated()).toBeFalse();
    expect(svc.currentUsername()).toBe('');
    expect(svc.currentRoles()).toEqual([]);
    expect(spy.getKeycloakInstance).not.toHaveBeenCalled();
    expect(spy.getUserRoles).not.toHaveBeenCalled();
  });
});
