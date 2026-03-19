import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { OrderEffects } from './order.effects';
import { OrderActions } from './order.actions';
import { CartActions } from '../cart/cart.actions';
import { OrderService } from '../../features/order/services/order.service';
import { NotificationService } from '../../core/services/notification.service';
import { Order, PlaceOrderRequest } from '../../shared/models/order.model';

describe('Order Effects', () => {
  let effects: OrderEffects;
  let actions$: Observable<any>;
  let orderServiceSpy: jasmine.SpyObj<OrderService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockOrder: Order = {
    id: 'o1', userId: 'u1',
    items: [{ productId: 'p1', productName: 'Laptop', quantity: 1, unitPrice: 999 }],
    status: 'PENDING', totalAmount: 999,
    shippingAddress: { street: '123 Main St', city: 'Paris', zipCode: '75001', country: 'France' },
    createdAt: '2024-01-01', updatedAt: '2024-01-01',
  };

  beforeEach(() => {
    orderServiceSpy = jasmine.createSpyObj('OrderService', ['placeOrder', 'getOrder', 'getOrders', 'updateOrderStatus']);
    notificationSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        OrderEffects,
        provideMockActions(() => actions$),
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    effects = TestBed.inject(OrderEffects);
  });

  it('should return placeOrderSuccess on success', () => {
    // GIVEN
    const request: PlaceOrderRequest = { shippingAddress: mockOrder.shippingAddress };
    const action = OrderActions.placeOrder({ request });
    const completion = OrderActions.placeOrderSuccess({ order: mockOrder });
    actions$ = hot('-a', { a: action });
    orderServiceSpy.placeOrder.and.returnValue(cold('-b|', { b: mockOrder }));

    // WHEN / THEN
    expect(effects.placeOrder$).toBeObservable(cold('--c', { c: completion }));
  });

  it('should return placeOrderFailure on error', () => {
    // GIVEN
    const request: PlaceOrderRequest = { shippingAddress: mockOrder.shippingAddress };
    const action = OrderActions.placeOrder({ request });
    const error = new Error('Payment failed');
    const completion = OrderActions.placeOrderFailure({ error: 'Payment failed' });
    actions$ = hot('-a', { a: action });
    orderServiceSpy.placeOrder.and.returnValue(cold('-#|', {}, error));

    // WHEN / THEN
    expect(effects.placeOrder$).toBeObservable(cold('--c', { c: completion }));
  });

  it('should dispatch clearCart on placeOrderSuccess', () => {
    // GIVEN
    const action = OrderActions.placeOrderSuccess({ order: mockOrder });
    const completion = CartActions.clearCart();
    actions$ = hot('-a', { a: action });

    // WHEN / THEN
    expect(effects.placeOrderSuccess$).toBeObservable(cold('-c', { c: completion }));
  });

  it('should return loadOrdersSuccess on success', () => {
    // GIVEN
    const orders: Order[] = [mockOrder];
    const action = OrderActions.loadOrders();
    const completion = OrderActions.loadOrdersSuccess({ orders });
    actions$ = hot('-a', { a: action });
    orderServiceSpy.getOrders.and.returnValue(cold('-b|', { b: orders }));

    // WHEN / THEN
    expect(effects.loadOrders$).toBeObservable(cold('--c', { c: completion }));
  });

  it('should return loadOrderSuccess on success', () => {
    // GIVEN
    const action = OrderActions.loadOrder({ id: 'o1' });
    const completion = OrderActions.loadOrderSuccess({ order: mockOrder });
    actions$ = hot('-a', { a: action });
    orderServiceSpy.getOrder.and.returnValue(cold('-b|', { b: mockOrder }));

    // WHEN / THEN
    expect(effects.loadOrder$).toBeObservable(cold('--c', { c: completion }));
  });

  it('should return updateOrderStatusSuccess on success', () => {
    // GIVEN
    const updatedOrder: Order = { ...mockOrder, status: 'PAID' };
    const action = OrderActions.updateOrderStatus({ id: 'o1', request: { status: 'PAID' } });
    const completion = OrderActions.updateOrderStatusSuccess({ order: updatedOrder });
    actions$ = hot('-a', { a: action });
    orderServiceSpy.updateOrderStatus.and.returnValue(cold('-b|', { b: updatedOrder }));

    // WHEN / THEN
    expect(effects.updateOrderStatus$).toBeObservable(cold('--c', { c: completion }));
  });

  it('should show error notification on order failure', () => {
    // GIVEN
    const action = OrderActions.loadOrdersFailure({ error: 'Server error' });
    actions$ = hot('-a', { a: action });

    // WHEN
    effects.orderError$.subscribe();

    // THEN
    expect(effects.orderError$).toBeObservable(cold('-a', { a: action }));
  });

});
