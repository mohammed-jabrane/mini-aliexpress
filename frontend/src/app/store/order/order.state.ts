import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Order } from '../../shared/models/order.model';

export interface OrderState extends EntityState<Order> {
  selectedOrderId: string | null;
  loading: boolean;
  error: string | null;
}

export const orderAdapter: EntityAdapter<Order> = createEntityAdapter<Order>({
  selectId: (order) => order.id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

export const initialOrderState: OrderState = orderAdapter.getInitialState({
  selectedOrderId: null,
  loading: false,
  error: null,
});
