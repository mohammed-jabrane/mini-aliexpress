import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    const keycloakSpy = jasmine.createSpyObj('KeycloakService', [
      'isLoggedIn', 'getUserRoles', 'getKeycloakInstance',
    ]);
    keycloakSpy.isLoggedIn.and.returnValue(false);
    keycloakSpy.getUserRoles.and.returnValue([]);
    keycloakSpy.getKeycloakInstance.and.returnValue({ tokenParsed: null });

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        { provide: KeycloakService, useValue: keycloakSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
