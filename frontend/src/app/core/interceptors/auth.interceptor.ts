import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { catchError, throwError } from 'rxjs';

import { NotificationService } from '../services/notification.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        keycloakService.login({ redirectUri: window.location.href });
      }

      if (error.status === 403) {
        notification.error('You do not have permission to perform this action.');
        router.navigate(['/products']);
      }

      return throwError(() => error);
    }),
  );
};
