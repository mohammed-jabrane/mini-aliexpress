import {
  selectCartItems,
  selectCartTotalAmount,
  selectCartTotalItems,
  selectCartLoading,
  selectCartError,
  selectCartIsEmpty,
} from './cart.selectors';
import { CartState } from './cart.state';
import { CartItem } from '../../shared/models/cart.model';

describe('Cart Selectors', () => {
  const mockItems: CartItem[] = [
    { productId: 'p1', productName: 'Laptop', unitPrice: 999, quantity: 1, imageUrl: 'img.jpg' },
  ];

  const populatedState: CartState = {
    items: mockItems,
    totalAmount: 999,
    totalItems: 1,
    loading: false,
    error: null,
  };

  const emptyState: CartState = {
    items: [],
    totalAmount: 0,
    totalItems: 0,
    loading: false,
    error: null,
  };

  it('should select cart items', () => {
    // GIVEN
    const state = { cart: populatedState };

    // WHEN
    const result = selectCartItems(state);

    // THEN
    expect(result.length).toBe(1);
    expect(result[0].productName).toBe('Laptop');
  });

  it('should select cart total amount', () => {
    // GIVEN
    const state = { cart: populatedState };

    // WHEN
    const result = selectCartTotalAmount(state);

    // THEN
    expect(result).toBe(999);
  });

  it('should select cart total items', () => {
    // GIVEN
    const state = { cart: populatedState };

    // WHEN
    const result = selectCartTotalItems(state);

    // THEN
    expect(result).toBe(1);
  });

  it('should select cart loading', () => {
    // GIVEN
    const loadingState: CartState = { ...populatedState, loading: true };
    const state = { cart: loadingState };

    // WHEN
    const result = selectCartLoading(state);

    // THEN
    expect(result).toBeTrue();
  });

  it('should select cart error', () => {
    // GIVEN
    const errorState: CartState = { ...populatedState, error: 'Failed to load cart' };
    const state = { cart: errorState };

    // WHEN
    const result = selectCartError(state);

    // THEN
    expect(result).toBe('Failed to load cart');
  });

  it('should select cart is empty for empty cart', () => {
    // GIVEN
    const state = { cart: emptyState };

    // WHEN
    const result = selectCartIsEmpty(state);

    // THEN
    expect(result).toBeTrue();
  });

  it('should select cart is not empty for populated cart', () => {
    // GIVEN
    const state = { cart: populatedState };

    // WHEN
    const result = selectCartIsEmpty(state);

    // THEN
    expect(result).toBeFalse();
  });

});
