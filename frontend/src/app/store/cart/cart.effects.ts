import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, tap } from 'rxjs/operators';

import { CartActions } from './cart.actions';
import { CartService } from '../../features/cart/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';

@Injectable()
export class CartEffects {
  private actions$ = inject(Actions);
  private cartService = inject(CartService);
  private notificationService = inject(NotificationService);

  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCart),
      switchMap(() =>
        this.cartService.getCart().pipe(
          map((cart) => CartActions.loadCartSuccess({ cart })),
          catchError((error) => of(CartActions.loadCartFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  addItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.addItem),
      exhaustMap(({ productId, quantity }) =>
        this.cartService.addItem(productId, quantity).pipe(
          map((cart) => CartActions.addItemSuccess({ cart })),
          catchError((error) => of(CartActions.addItemFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  updateItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.updateItem),
      exhaustMap(({ productId, quantity }) =>
        this.cartService.updateItem(productId, quantity).pipe(
          map((cart) => CartActions.updateItemSuccess({ cart })),
          catchError((error) => of(CartActions.updateItemFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  removeItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.removeItem),
      exhaustMap(({ productId }) =>
        this.cartService.removeItem(productId).pipe(
          map((cart) => CartActions.removeItemSuccess({ cart })),
          catchError((error) => of(CartActions.removeItemFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  addItemSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.addItemSuccess),
      tap(() => this.notificationService.success('Item added to cart')),
    ),
    { dispatch: false },
  );

  cartError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CartActions.loadCartFailure,
        CartActions.addItemFailure,
        CartActions.updateItemFailure,
        CartActions.removeItemFailure,
      ),
      tap(({ error }) => this.notificationService.error(error)),
    ),
    { dispatch: false },
  );
}
