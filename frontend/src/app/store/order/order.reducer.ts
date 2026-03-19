import { createReducer, on } from '@ngrx/store';

import { OrderActions } from './order.actions';
import { OrderState, initialOrderState, orderAdapter } from './order.state';

export const orderReducer = createReducer(
  initialOrderState,

  on(OrderActions.placeOrder, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(OrderActions.placeOrderSuccess, (state, { order }) =>
    orderAdapter.addOne(order, { ...state, loading: false }),
  ),

  on(OrderActions.placeOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(OrderActions.loadOrder, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(OrderActions.loadOrderSuccess, (state, { order }) =>
    orderAdapter.upsertOne(order, { ...state, loading: false }),
  ),

  on(OrderActions.loadOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(OrderActions.loadOrders, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(OrderActions.loadOrdersSuccess, (state, { orders }) =>
    orderAdapter.setAll(orders, { ...state, loading: false }),
  ),

  on(OrderActions.loadOrdersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(OrderActions.updateOrderStatus, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(OrderActions.updateOrderStatusSuccess, (state, { order }) =>
    orderAdapter.updateOne(
      { id: order.id, changes: order },
      { ...state, loading: false },
    ),
  ),

  on(OrderActions.updateOrderStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(OrderActions.selectOrder, (state, { orderId }) => ({
    ...state,
    selectedOrderId: orderId,
  })),
);
