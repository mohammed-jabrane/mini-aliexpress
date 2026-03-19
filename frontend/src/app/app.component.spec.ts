import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    const keycloakSpy = jasmine.createSpyObj('KeycloakService', [
      'isLoggedIn', 'getUserRoles', 'getKeycloakInstance',
    ]);
    keycloakSpy.isLoggedIn.and.returnValue(false);
    keycloakSpy.getUserRoles.and.returnValue([]);
    keycloakSpy.getKeycloakInstance.and.returnValue({ tokenParsed: null });

    await TestBed.configureTestingModule({
      imports: [AppComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: KeycloakService, useValue: keycloakSpy },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the header component', () => {
    // GIVEN
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    // WHEN
    const header = fixture.nativeElement.querySelector('app-header');

    // THEN
    expect(header).toBeTruthy();
  });

  it('should render the footer component', () => {
    // GIVEN
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    // WHEN
    const footer = fixture.nativeElement.querySelector('app-footer');

    // THEN
    expect(footer).toBeTruthy();
  });

  it('should render a router-outlet', () => {
    // GIVEN
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    // WHEN
    const outlet = fixture.nativeElement.querySelector('router-outlet');

    // THEN
    expect(outlet).toBeTruthy();
  });

  it('should have main content wrapper', () => {
    // GIVEN
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    // WHEN
    const main = fixture.nativeElement.querySelector('main.main-content');

    // THEN
    expect(main).toBeTruthy();
  });
});
