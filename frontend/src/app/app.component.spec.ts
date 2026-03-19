import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

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
      imports: [AppComponent],
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
});
