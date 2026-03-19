import { HttpErrorResponse, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Observable, throwError } from 'rxjs';

import { NotificationService } from '../services/notification.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let keycloakSpy: jasmine.SpyObj<KeycloakService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;

  const mockReq = new HttpRequest('GET', '/api/test');

  beforeEach(() => {
    keycloakSpy = jasmine.createSpyObj('KeycloakService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    notificationSpy = jasmine.createSpyObj('NotificationService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        { provide: KeycloakService, useValue: keycloakSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NotificationService, useValue: notificationSpy },
      ],
    });
  });

  function runInterceptor(status: number): Observable<HttpEvent<unknown>> {
    const mockNext: HttpHandlerFn = () =>
      throwError(() => new HttpErrorResponse({ status, url: '/api/test' }));

    return TestBed.runInInjectionContext(() => authInterceptor(mockReq, mockNext));
  }

  it('should trigger login on 401', (done) => {
    keycloakSpy.login.and.returnValue(Promise.resolve());

    runInterceptor(401).subscribe({
      error: () => {
        expect(keycloakSpy.login).toHaveBeenCalled();
        done();
      },
    });
  });

  it('should show error and navigate on 403', (done) => {
    runInterceptor(403).subscribe({
      error: () => {
        expect(notificationSpy.error).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/products']);
        done();
      },
    });
  });

  it('should re-throw the error', (done) => {
    runInterceptor(500).subscribe({
      error: (err: HttpErrorResponse) => {
        expect(err.status).toBe(500);
        done();
      },
    });
  });
});
