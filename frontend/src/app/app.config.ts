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

import { authReducer } from './store/auth/auth.reducer';
import { productReducer } from './store/product/product.reducer';
import { cartReducer } from './store/cart/cart.reducer';
import { orderReducer } from './store/order/order.reducer';
import { ProductEffects } from './store/product/product.effects';
import { CartEffects } from './store/cart/cart.effects';
import { OrderEffects } from './store/order/order.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([authInterceptor, errorInterceptor]),
    ),
    provideAnimationsAsync(),
    provideStore({
      auth: authReducer,
      product: productReducer,
      cart: cartReducer,
      order: orderReducer,
    }),
    provideEffects(ProductEffects, CartEffects, OrderEffects),
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
