import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { CartEffects } from './cart.effects';
import { CartActions } from './cart.actions';
import { CartService } from '../../features/cart/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { Cart } from '../../shared/models/cart.model';

describe('Cart Effects', () => {
  let effects: CartEffects;
  let actions$: Observable<any>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;

  const mockCart: Cart = {
    items: [{ productId: 'p1', productName: 'Laptop', unitPrice: 999, quantity: 1, imageUrl: 'img.jpg' }],
    totalAmount: 999,
    totalItems: 1,
  };

  beforeEach(() => {
    cartServiceSpy = jasmine.createSpyObj('CartService', ['getCart', 'addItem', 'updateItem', 'removeItem']);
    notificationSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);

    TestBed.configureTestingModule({
      providers: [
        CartEffects,
        provideMockActions(() => actions$),
        { provide: CartService, useValue: cartServiceSpy },
        { provide: NotificationService, useValue: notificationSpy },
      ],
    });

    effects = TestBed.inject(CartEffects);
  });

  it('should return loadCartSuccess on success', () => {
    // GIVEN
    const action = CartActions.loadCart();
    const completion = CartActions.loadCartSuccess({ cart: mockCart });
    actions$ = hot('-a', { a: action });
    cartServiceSpy.getCart.and.returnValue(cold('-b|', { b: mockCart }));

    // WHEN / THEN
    expect(effects.loadCart$).toBeObservable(cold('--c', { c: completion }));
  });

  it('should return loadCartFailure on error', () => {
    // GIVEN
    const action = CartActions.loadCart();
    const error = new Error('Network error');
    const completion = CartActions.loadCartFailure({ error: 'Network error' });
    actions$ = hot('-a', { a: action });
    cartServiceSpy.getCart.and.returnValue(cold('-#|', {}, error));

    // WHEN / THEN
    expect(effects.loadCart$).toBeObservable(cold('--c', { c: completion }));
  });

  it('should return addItemSuccess on success', () => {
    // GIVEN
    const action = CartActions.addItem({ productId: 'p1', quantity: 1 });
    const completion = CartActions.addItemSuccess({ cart: mockCart });
    actions$ = hot('-a', { a: action });
    cartServiceSpy.addItem.and.returnValue(cold('-b|', { b: mockCart }));

    // WHEN / THEN
    expect(effects.addItem$).toBeObservable(cold('--c', { c: completion }));
  });

  it('should return addItemFailure on error', () => {
    // GIVEN
    const action = CartActions.addItem({ productId: 'p1', quantity: 1 });
    const error = new Error('Out of stock');
    const completion = CartActions.addItemFailure({ error: 'Out of stock' });
    actions$ = hot('-a', { a: action });
    cartServiceSpy.addItem.and.returnValue(cold('-#|', {}, error));

    // WHEN / THEN
    expect(effects.addItem$).toBeObservable(cold('--c', { c: completion }));
  });

  it('should return updateItemSuccess on success', () => {
    // GIVEN
    const action = CartActions.updateItem({ productId: 'p1', quantity: 3 });
    const completion = CartActions.updateItemSuccess({ cart: mockCart });
    actions$ = hot('-a', { a: action });
    cartServiceSpy.updateItem.and.returnValue(cold('-b|', { b: mockCart }));

    // WHEN / THEN
    expect(effects.updateItem$).toBeObservable(cold('--c', { c: completion }));
  });

  it('should return removeItemSuccess on success', () => {
    // GIVEN
    const emptyCart: Cart = { items: [], totalAmount: 0, totalItems: 0 };
    const action = CartActions.removeItem({ productId: 'p1' });
    const completion = CartActions.removeItemSuccess({ cart: emptyCart });
    actions$ = hot('-a', { a: action });
    cartServiceSpy.removeItem.and.returnValue(cold('-b|', { b: emptyCart }));

    // WHEN / THEN
    expect(effects.removeItem$).toBeObservable(cold('--c', { c: completion }));
  });

  it('should show success notification on addItemSuccess', () => {
    // GIVEN
    const action = CartActions.addItemSuccess({ cart: mockCart });
    actions$ = hot('-a', { a: action });

    // WHEN
    effects.addItemSuccess$.subscribe();

    // THEN
    expect(effects.addItemSuccess$).toBeObservable(cold('-a', { a: action }));
  });

  it('should show error notification on cart failure', () => {
    // GIVEN
    const action = CartActions.loadCartFailure({ error: 'Network error' });
    actions$ = hot('-a', { a: action });

    // WHEN
    effects.cartError$.subscribe();

    // THEN
    expect(effects.cartError$).toBeObservable(cold('-a', { a: action }));
  });

});
