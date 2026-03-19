import { createFeatureSelector, createSelector } from '@ngrx/store';

import { OrderState, orderAdapter } from './order.state';

export const selectOrderState = createFeatureSelector<OrderState>('order');

const { selectAll, selectEntities, selectTotal } = orderAdapter.getSelectors();

export const selectAllOrders = createSelector(
  selectOrderState,
  selectAll,
);

export const selectOrderEntities = createSelector(
  selectOrderState,
  selectEntities,
);

export const selectOrderTotal = createSelector(
  selectOrderState,
  selectTotal,
);

export const selectSelectedOrder = createSelector(
  selectOrderState,
  (state) => (state.selectedOrderId ? state.entities[state.selectedOrderId] ?? null : null),
);

export const selectOrderLoading = createSelector(
  selectOrderState,
  (state) => state.loading,
);

export const selectOrderError = createSelector(
  selectOrderState,
  (state) => state.error,
);
