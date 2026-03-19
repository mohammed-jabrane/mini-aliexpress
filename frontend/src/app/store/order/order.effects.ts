import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, tap } from 'rxjs/operators';

import { OrderActions } from './order.actions';
import { CartActions } from '../cart/cart.actions';
import { OrderService } from '../../features/order/services/order.service';
import { NotificationService } from '../../core/services/notification.service';

@Injectable()
export class OrderEffects {
  private actions$ = inject(Actions);
  private orderService = inject(OrderService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  placeOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.placeOrder),
      exhaustMap(({ request }) =>
        this.orderService.placeOrder(request).pipe(
          map((order) => OrderActions.placeOrderSuccess({ order })),
          catchError((error) => of(OrderActions.placeOrderFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  placeOrderSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.placeOrderSuccess),
      tap(({ order }) => {
        this.notificationService.success('Order placed successfully');
        this.router.navigate(['/orders', order.id]);
      }),
      map(() => CartActions.clearCart()),
    ),
  );

  loadOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.loadOrder),
      switchMap(({ id }) =>
        this.orderService.getOrder(id).pipe(
          map((order) => OrderActions.loadOrderSuccess({ order })),
          catchError((error) => of(OrderActions.loadOrderFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.loadOrders),
      switchMap(() =>
        this.orderService.getOrders().pipe(
          map((orders) => OrderActions.loadOrdersSuccess({ orders })),
          catchError((error) => of(OrderActions.loadOrdersFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  updateOrderStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.updateOrderStatus),
      exhaustMap(({ id, request }) =>
        this.orderService.updateOrderStatus(id, request).pipe(
          map((order) => OrderActions.updateOrderStatusSuccess({ order })),
          catchError((error) => of(OrderActions.updateOrderStatusFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  orderError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        OrderActions.placeOrderFailure,
        OrderActions.loadOrderFailure,
        OrderActions.loadOrdersFailure,
        OrderActions.updateOrderStatusFailure,
      ),
      tap(({ error }) => this.notificationService.error(error)),
    ),
    { dispatch: false },
  );
}
