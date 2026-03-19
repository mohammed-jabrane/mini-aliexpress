import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        return throwError(() => error);
      }

      let message: string;

      switch (error.status) {
        case 0:
          message = 'Network error. Please check your connection.';
          break;
        case 400:
          message = error.error?.message || 'Invalid request.';
          break;
        case 404:
          message = 'The requested resource was not found.';
          break;
        case 409:
        case 422:
          message = error.error?.message || 'The request could not be processed.';
          break;
        case 500:
          message = 'Internal server error. Please try again later.';
          break;
        case 503:
          message = 'Service unavailable. Please try again later.';
          break;
        default:
          message = `An unexpected error occurred (${error.status}).`;
          break;
      }

      notification.error(message);
      return throwError(() => error);
    }),
  );
};
