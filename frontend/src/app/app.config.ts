import { APP_INITIALIZER, ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { routes } from './app.routes';
import { initializeKeycloak } from './core/auth/keycloak.init';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([authInterceptor, errorInterceptor]),
    ),
    provideAnimationsAsync(),
    provideStore(),
    provideEffects(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
  ]
};
