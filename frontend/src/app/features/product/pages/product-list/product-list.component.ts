import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, switchMap, combineLatest, BehaviorSubject } from 'rxjs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Product, Category } from '../../../../shared/models/product.model';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    MatChipsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    ProductCardComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit, OnDestroy {
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  selectedCategoryId = signal<string | null>(null);
  loading = signal(true);
  sortBy = signal<SortOption>('newest');
  searchQuery = signal<string>('');

  sortedProducts = computed(() => {
    const items = [...this.products()];
    switch (this.sortBy()) {
      case 'price-asc':
        return items.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return items.sort((a, b) => b.price - a.price);
      case 'name':
        return items.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
      default:
        return items.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

  private destroy$ = new Subject<void>();
  private categoryFilter$ = new BehaviorSubject<string | null>(null);

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.productService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe(categories => this.categories.set(categories));

    combineLatest([
      this.route.queryParams,
      this.categoryFilter$,
    ]).pipe(
      switchMap(([params, categoryId]) => {
        this.loading.set(true);
        const query = params['q'] || undefined;
        this.searchQuery.set(query || '');
        return this.productService.getProducts(query, categoryId || undefined);
      }),
      takeUntil(this.destroy$),
    ).subscribe({
      next: products => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => {
        this.products.set([]);
        this.loading.set(false);
      },
    });
  }

  onCategoryChange(categoryId: string | null): void {
    this.selectedCategoryId.set(categoryId);
    this.categoryFilter$.next(categoryId);
  }

  onSortChange(sort: SortOption): void {
    this.sortBy.set(sort);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
