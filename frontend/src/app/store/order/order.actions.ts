import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Order, PlaceOrderRequest, UpdateOrderStatusRequest } from '../../shared/models/order.model';

export const OrderActions = createActionGroup({
  source: 'Order',
  events: {
    'Place Order': props<{ request: PlaceOrderRequest }>(),
    'Place Order Success': props<{ order: Order }>(),
    'Place Order Failure': props<{ error: string }>(),

    'Load Order': props<{ id: string }>(),
    'Load Order Success': props<{ order: Order }>(),
    'Load Order Failure': props<{ error: string }>(),

    'Load Orders': emptyProps(),
    'Load Orders Success': props<{ orders: Order[] }>(),
    'Load Orders Failure': props<{ error: string }>(),

    'Update Order Status': props<{ id: string; request: UpdateOrderStatusRequest }>(),
    'Update Order Status Success': props<{ order: Order }>(),
    'Update Order Status Failure': props<{ error: string }>(),

    'Select Order': props<{ orderId: string | null }>(),
  },
});
