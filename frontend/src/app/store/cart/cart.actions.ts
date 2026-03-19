import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Cart } from '../../shared/models/cart.model';

export const CartActions = createActionGroup({
  source: 'Cart',
  events: {
    'Load Cart': emptyProps(),
    'Load Cart Success': props<{ cart: Cart }>(),
    'Load Cart Failure': props<{ error: string }>(),

    'Add Item': props<{ productId: string; quantity: number }>(),
    'Add Item Success': props<{ cart: Cart }>(),
    'Add Item Failure': props<{ error: string }>(),

    'Update Item': props<{ productId: string; quantity: number }>(),
    'Update Item Success': props<{ cart: Cart }>(),
    'Update Item Failure': props<{ error: string }>(),

    'Remove Item': props<{ productId: string }>(),
    'Remove Item Success': props<{ cart: Cart }>(),
    'Remove Item Failure': props<{ error: string }>(),

    'Clear Cart': emptyProps(),
  },
});
