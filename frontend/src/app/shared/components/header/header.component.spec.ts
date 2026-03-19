import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { HeaderComponent } from './header.component';
import { AuthKeycloakService } from '../../../core/auth/keycloak.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceStub: {
    isAuthenticated: ReturnType<typeof signal<boolean>>;
    currentUsername: ReturnType<typeof signal<string>>;
    currentRoles: ReturnType<typeof signal<string[]>>;
    login: jasmine.Spy;
    logout: jasmine.Spy;
  };
  let router: Router;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    authServiceStub = {
      isAuthenticated: signal(false),
      currentUsername: signal(''),
      currentRoles: signal<string[]>([]),
      login: jasmine.createSpy('login'),
      logout: jasmine.createSpy('logout'),
    };

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: AuthKeycloakService, useValue: authServiceStub },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reflect isLoggedIn from auth service', () => {
    // GIVEN
    authServiceStub.isAuthenticated.set(true);

    // WHEN / THEN
    expect(component.isLoggedIn()).toBeTrue();
  });

  it('should reflect username from auth service', () => {
    // GIVEN
    authServiceStub.currentUsername.set('john');

    // WHEN / THEN
    expect(component.username()).toBe('john');
  });

  it('should compute isAdmin when ROLE_ADMIN is present', () => {
    // GIVEN
    authServiceStub.currentRoles.set(['ROLE_USER', 'ROLE_ADMIN']);

    // WHEN / THEN
    expect(component.isAdmin()).toBeTrue();
  });

  it('should compute isAdmin as false when ROLE_ADMIN is absent', () => {
    // GIVEN
    authServiceStub.currentRoles.set(['ROLE_USER']);

    // WHEN / THEN
    expect(component.isAdmin()).toBeFalse();
  });

  it('should navigate to /products with query param on search', () => {
    // GIVEN
    const navigateSpy = spyOn(router, 'navigate');
    component.searchQuery = '  laptop  ';

    // WHEN
    component.onSearch();

    // THEN
    expect(navigateSpy).toHaveBeenCalledWith(['/products'], {
      queryParams: { q: 'laptop' },
    });
  });

  it('should navigate to /products with empty queryParams when search is blank', () => {
    // GIVEN
    const navigateSpy = spyOn(router, 'navigate');
    component.searchQuery = '   ';

    // WHEN
    component.onSearch();

    // THEN
    expect(navigateSpy).toHaveBeenCalledWith(['/products'], {
      queryParams: {},
    });
  });

  it('should call authService.login on login()', () => {
    // WHEN
    component.login();

    // THEN
    expect(authServiceStub.login).toHaveBeenCalled();
  });

  it('should open confirm dialog and call logout when confirmed', () => {
    // GIVEN
    const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<unknown>>('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(true));
    dialogSpy.open.and.returnValue(dialogRefSpy);

    // WHEN
    component.logout();

    // THEN
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(authServiceStub.logout).toHaveBeenCalled();
  });

  it('should not call logout when dialog is cancelled', () => {
    // GIVEN
    const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<unknown>>('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(false));
    dialogSpy.open.and.returnValue(dialogRefSpy);

    // WHEN
    component.logout();

    // THEN
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(authServiceStub.logout).not.toHaveBeenCalled();
  });
});
