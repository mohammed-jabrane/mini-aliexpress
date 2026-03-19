import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Product, Category } from '../../shared/models/product.model';

export interface ProductState extends EntityState<Product> {
  selectedProductId: string | null;
  categories: Category[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategoryId: string | null;
}

export const productAdapter: EntityAdapter<Product> = createEntityAdapter<Product>({
  selectId: (product) => product.id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

export const initialProductState: ProductState = productAdapter.getInitialState({
  selectedProductId: null,
  categories: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedCategoryId: null,
});
