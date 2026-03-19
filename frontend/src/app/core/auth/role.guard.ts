import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

import { NotificationService } from '../services/notification.service';

export const roleGuard: CanActivateFn = (route, _state) => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);
  const notification = inject(NotificationService);

  const requiredRoles: string[] = route.data['roles'] ?? [];

  if (requiredRoles.length === 0) {
    return true;
  }

  const userRoles = keycloakService.getUserRoles();
  const hasRole = requiredRoles.some((role) => userRoles.includes(role));

  if (hasRole) {
    return true;
  }

  notification.warn('You do not have the required permissions to access this page.');
  return router.createUrlTree(['/products']);
};
