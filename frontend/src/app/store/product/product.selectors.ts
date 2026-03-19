import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ProductState, productAdapter } from './product.state';

export const selectProductState = createFeatureSelector<ProductState>('product');

const { selectAll, selectEntities } = productAdapter.getSelectors();

export const selectAllProducts = createSelector(
  selectProductState,
  selectAll,
);

export const selectProductEntities = createSelector(
  selectProductState,
  selectEntities,
);

export const selectSelectedProduct = createSelector(
  selectProductState,
  (state) => (state.selectedProductId ? state.entities[state.selectedProductId] ?? null : null),
);

export const selectCategories = createSelector(
  selectProductState,
  (state) => state.categories,
);

export const selectProductLoading = createSelector(
  selectProductState,
  (state) => state.loading,
);

export const selectProductError = createSelector(
  selectProductState,
  (state) => state.error,
);

export const selectSearchQuery = createSelector(
  selectProductState,
  (state) => state.searchQuery,
);

export const selectSelectedCategoryId = createSelector(
  selectProductState,
  (state) => state.selectedCategoryId,
);
