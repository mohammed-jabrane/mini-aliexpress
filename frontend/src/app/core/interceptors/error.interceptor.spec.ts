import { HttpErrorResponse, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable, throwError } from 'rxjs';

import { NotificationService } from '../services/notification.service';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let notificationSpy: jasmine.SpyObj<NotificationService>;

  const mockReq = new HttpRequest('GET', '/api/test');

  beforeEach(() => {
    notificationSpy = jasmine.createSpyObj('NotificationService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        { provide: NotificationService, useValue: notificationSpy },
      ],
    });
  });

  function runInterceptor(status: number, errorBody?: unknown): Observable<HttpEvent<unknown>> {
    const mockNext: HttpHandlerFn = () =>
      throwError(() => new HttpErrorResponse({ status, url: '/api/test', error: errorBody }));

    return TestBed.runInInjectionContext(() => errorInterceptor(mockReq, mockNext));
  }

  it('should skip 401 errors', (done) => {
    runInterceptor(401).subscribe({
      error: () => {
        expect(notificationSpy.error).not.toHaveBeenCalled();
        done();
      },
    });
  });

  it('should skip 403 errors', (done) => {
    runInterceptor(403).subscribe({
      error: () => {
        expect(notificationSpy.error).not.toHaveBeenCalled();
        done();
      },
    });
  });

  it('should show network error for status 0', (done) => {
    runInterceptor(0).subscribe({
      error: () => {
        expect(notificationSpy.error).toHaveBeenCalledWith('Network error. Please check your connection.');
        done();
      },
    });
  });

  it('should show server message for 400 if available', (done) => {
    runInterceptor(400, { message: 'Name is required' }).subscribe({
      error: () => {
        expect(notificationSpy.error).toHaveBeenCalledWith('Name is required');
        done();
      },
    });
  });

  it('should show fallback for 400 without message', (done) => {
    runInterceptor(400).subscribe({
      error: () => {
        expect(notificationSpy.error).toHaveBeenCalledWith('Invalid request.');
        done();
      },
    });
  });

  it('should show not found for 404', (done) => {
    runInterceptor(404).subscribe({
      error: () => {
        expect(notificationSpy.error).toHaveBeenCalledWith('The requested resource was not found.');
        done();
      },
    });
  });

  it('should show internal server error for 500', (done) => {
    runInterceptor(500).subscribe({
      error: () => {
        expect(notificationSpy.error).toHaveBeenCalledWith('Internal server error. Please try again later.');
        done();
      },
    });
  });

  it('should show service unavailable for 503', (done) => {
    runInterceptor(503).subscribe({
      error: () => {
        expect(notificationSpy.error).toHaveBeenCalledWith('Service unavailable. Please try again later.');
        done();
      },
    });
  });

  it('should show unexpected error with status for unknown codes', (done) => {
    runInterceptor(502).subscribe({
      error: () => {
        expect(notificationSpy.error).toHaveBeenCalledWith('An unexpected error occurred (502).');
        done();
      },
    });
  });
});
