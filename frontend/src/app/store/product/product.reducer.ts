import { createReducer, on } from '@ngrx/store';

import { ProductActions } from './product.actions';
import { ProductState, initialProductState, productAdapter } from './product.state';

export const productReducer = createReducer(
  initialProductState,

  on(ProductActions.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductActions.loadProductsSuccess, (state, { products }) =>
    productAdapter.setAll(products, { ...state, loading: false }),
  ),

  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ProductActions.loadProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductActions.loadProductSuccess, (state, { product }) =>
    productAdapter.upsertOne(product, { ...state, loading: false }),
  ),

  on(ProductActions.loadProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ProductActions.loadCategories, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductActions.loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    categories,
    loading: false,
  })),

  on(ProductActions.loadCategoriesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ProductActions.selectProduct, (state, { productId }) => ({
    ...state,
    selectedProductId: productId,
  })),

  on(ProductActions.setSearchQuery, (state, { query }) => ({
    ...state,
    searchQuery: query,
  })),

  on(ProductActions.setCategoryFilter, (state, { categoryId }) => ({
    ...state,
    selectedCategoryId: categoryId,
  })),
);
