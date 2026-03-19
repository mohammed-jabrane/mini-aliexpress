import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ProductActions } from './product.actions';
import { ProductService } from '../../features/product/services/product.service';

@Injectable()
export class ProductEffects {
  private actions$ = inject(Actions);
  private productService = inject(ProductService);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      switchMap(({ query, categoryId }) =>
        this.productService.getProducts(query, categoryId).pipe(
          map((products) => ProductActions.loadProductsSuccess({ products })),
          catchError((error) => of(ProductActions.loadProductsFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  loadProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProduct),
      switchMap(({ id }) =>
        this.productService.getProduct(id).pipe(
          map((product) => ProductActions.loadProductSuccess({ product })),
          catchError((error) => of(ProductActions.loadProductFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadCategories),
      switchMap(() =>
        this.productService.getCategories().pipe(
          map((categories) => ProductActions.loadCategoriesSuccess({ categories })),
          catchError((error) => of(ProductActions.loadCategoriesFailure({ error: error.message }))),
        ),
      ),
    ),
  );
}
