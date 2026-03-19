import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Product, Category } from '../../shared/models/product.model';

export const ProductActions = createActionGroup({
  source: 'Product',
  events: {
    'Load Products': props<{ query?: string; categoryId?: string }>(),
    'Load Products Success': props<{ products: Product[] }>(),
    'Load Products Failure': props<{ error: string }>(),

    'Load Product': props<{ id: string }>(),
    'Load Product Success': props<{ product: Product }>(),
    'Load Product Failure': props<{ error: string }>(),

    'Load Categories': emptyProps(),
    'Load Categories Success': props<{ categories: Category[] }>(),
    'Load Categories Failure': props<{ error: string }>(),

    'Select Product': props<{ productId: string | null }>(),
    'Set Search Query': props<{ query: string }>(),
    'Set Category Filter': props<{ categoryId: string | null }>(),
  },
});
