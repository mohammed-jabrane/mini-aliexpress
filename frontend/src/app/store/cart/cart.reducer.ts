import { createReducer, on } from '@ngrx/store';

import { CartActions } from './cart.actions';
import { CartState, initialCartState } from './cart.state';

export const cartReducer = createReducer(
  initialCartState,

  on(CartActions.loadCart, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CartActions.loadCartSuccess, (state, { cart }) => ({
    ...state,
    items: cart.items,
    totalAmount: cart.totalAmount,
    totalItems: cart.totalItems,
    loading: false,
  })),

  on(CartActions.loadCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(CartActions.addItem, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CartActions.addItemSuccess, (state, { cart }) => ({
    ...state,
    items: cart.items,
    totalAmount: cart.totalAmount,
    totalItems: cart.totalItems,
    loading: false,
  })),

  on(CartActions.addItemFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(CartActions.updateItem, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CartActions.updateItemSuccess, (state, { cart }) => ({
    ...state,
    items: cart.items,
    totalAmount: cart.totalAmount,
    totalItems: cart.totalItems,
    loading: false,
  })),

  on(CartActions.updateItemFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(CartActions.removeItem, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CartActions.removeItemSuccess, (state, { cart }) => ({
    ...state,
    items: cart.items,
    totalAmount: cart.totalAmount,
    totalItems: cart.totalItems,
    loading: false,
  })),

  on(CartActions.removeItemFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(CartActions.clearCart, () => ({
    ...initialCartState,
  })),
);
