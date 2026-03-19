import { createFeatureSelector, createSelector } from '@ngrx/store';

import { CartState } from './cart.state';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(
  selectCartState,
  (state) => state.items,
);

export const selectCartTotalAmount = createSelector(
  selectCartState,
  (state) => state.totalAmount,
);

export const selectCartTotalItems = createSelector(
  selectCartState,
  (state) => state.totalItems,
);

export const selectCartLoading = createSelector(
  selectCartState,
  (state) => state.loading,
);

export const selectCartError = createSelector(
  selectCartState,
  (state) => state.error,
);

export const selectCartIsEmpty = createSelector(
  selectCartItems,
  (items) => items.length === 0,
);
