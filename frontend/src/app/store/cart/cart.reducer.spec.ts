import { CartActions } from './cart.actions';
import { cartReducer } from './cart.reducer';
import { initialCartState } from './cart.state';
import { Cart, CartItem } from '../../shared/models/cart.model';

describe('Cart Reducer', () => {
  const mockCart: Cart = {
    items: [
      { productId: 'p1', productName: 'Laptop', unitPrice: 999, quantity: 1, imageUrl: 'img.jpg' },
      { productId: 'p2', productName: 'Phone', unitPrice: 599, quantity: 2, imageUrl: 'img2.jpg' },
    ],
    totalAmount: 2197,
    totalItems: 3,
  };

  it('should return the initial state when unknown action', () => {
    // GIVEN
    const action = { type: 'Unknown' };

    // WHEN
    const result = cartReducer(initialCartState, action);

    // THEN
    expect(result).toBe(initialCartState);
  });

  it('should set loading on loadCart', () => {
    // GIVEN
    const state = { ...initialCartState };

    // WHEN
    const result = cartReducer(state, CartActions.loadCart());

    // THEN
    expect(result.loading).toBeTrue();
    expect(result.error).toBeNull();
  });

  it('should populate cart on loadCartSuccess', () => {
    // GIVEN
    const state = { ...initialCartState, loading: true };

    // WHEN
    const result = cartReducer(state, CartActions.loadCartSuccess({ cart: mockCart }));

    // THEN
    expect(result.loading).toBeFalse();
    expect(result.items.length).toBe(2);
    expect(result.totalAmount).toBe(2197);
    expect(result.totalItems).toBe(3);
  });

  it('should set error on loadCartFailure', () => {
    // GIVEN
    const state = { ...initialCartState, loading: true };

    // WHEN
    const result = cartReducer(state, CartActions.loadCartFailure({ error: 'Network error' }));

    // THEN
    expect(result.loading).toBeFalse();
    expect(result.error).toBe('Network error');
  });

  it('should set loading on addItem', () => {
    // GIVEN
    const state = { ...initialCartState };

    // WHEN
    const result = cartReducer(state, CartActions.addItem({ productId: 'p1', quantity: 1 }));

    // THEN
    expect(result.loading).toBeTrue();
  });

  it('should update cart on addItemSuccess', () => {
    // GIVEN
    const state = { ...initialCartState, loading: true };

    // WHEN
    const result = cartReducer(state, CartActions.addItemSuccess({ cart: mockCart }));

    // THEN
    expect(result.loading).toBeFalse();
    expect(result.items.length).toBe(2);
    expect(result.totalAmount).toBe(2197);
  });

  it('should update cart on updateItemSuccess', () => {
    // GIVEN
    const updatedCart: Cart = { ...mockCart, totalAmount: 1598, totalItems: 2 };
    const state = { ...initialCartState, items: mockCart.items, loading: true };

    // WHEN
    const result = cartReducer(state, CartActions.updateItemSuccess({ cart: updatedCart }));

    // THEN
    expect(result.loading).toBeFalse();
    expect(result.totalAmount).toBe(1598);
  });

  it('should update cart on removeItemSuccess', () => {
    // GIVEN
    const reducedCart: Cart = {
      items: [mockCart.items[0]],
      totalAmount: 999,
      totalItems: 1,
    };
    const state = { ...initialCartState, items: mockCart.items, loading: true };

    // WHEN
    const result = cartReducer(state, CartActions.removeItemSuccess({ cart: reducedCart }));

    // THEN
    expect(result.loading).toBeFalse();
    expect(result.items.length).toBe(1);
    expect(result.totalAmount).toBe(999);
  });

  it('should set error on addItemFailure', () => {
    // GIVEN
    const state = { ...initialCartState, loading: true };

    // WHEN
    const result = cartReducer(state, CartActions.addItemFailure({ error: 'Out of stock' }));

    // THEN
    expect(result.loading).toBeFalse();
    expect(result.error).toBe('Out of stock');
  });

  it('should reset to initial state on clearCart', () => {
    // GIVEN
    const state = { items: mockCart.items, totalAmount: 2197, totalItems: 3, loading: false, error: null };

    // WHEN
    const result = cartReducer(state, CartActions.clearCart());

    // THEN
    expect(result).toEqual(initialCartState);
  });

});
