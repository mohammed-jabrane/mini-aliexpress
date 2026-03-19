import { Component, OnInit, OnDestroy, signal, ViewChild, AfterViewInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Category } from '../../../../shared/models/product.model';
import { ProductService } from '../../../product/services/product.service';
import { AdminService } from '../../services/admin.service';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import {
  CategoryFormDialogComponent,
  CategoryFormDialogData,
  CategoryFormDialogResult,
} from '../../components/category-form-dialog/category-form-dialog.component';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.scss',
})
export class CategoryManagementComponent implements OnInit, OnDestroy, AfterViewInit {
  categories = signal<Category[]>([]);
  loading = signal(true);
  displayedColumns = ['name', 'parent', 'actions'];
  dataSource = new MatTableDataSource<Category>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private destroy$ = new Subject<void>();
  private productService: ProductService;
  private adminService: AdminService;
  private notificationService: NotificationService;
  private dialog: MatDialog;

  constructor(
    productService: ProductService,
    adminService: AdminService,
    notificationService: NotificationService,
    dialog: MatDialog,
  ) {
    this.productService = productService;
    this.adminService = adminService;
    this.notificationService = notificationService;
    this.dialog = dialog;
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadCategories(): void {
    this.loading.set(true);
    this.productService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: categories => {
          this.categories.set(categories);
          this.dataSource.data = categories;
          this.loading.set(false);
        },
        error: () => {
          this.notificationService.error('Failed to load categories');
          this.loading.set(false);
        },
      });
  }

  getParentName(parentId: string | null): string {
    if (!parentId) return '—';
    const parent = this.categories().find(c => c.id === parentId);
    return parent ? parent.name : '—';
  }

  openCreateDialog(): void {
    const dialogData: CategoryFormDialogData = {
      mode: 'create',
      categories: this.categories(),
    };

    this.dialog.open(CategoryFormDialogComponent, { data: dialogData })
      .afterClosed()
      .subscribe((result: CategoryFormDialogResult | undefined) => {
        if (!result) return;
        this.adminService.createCategory(result.name, result.parentId ?? undefined)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.notificationService.success('Category created successfully');
              this.loadCategories();
            },
            error: () => {
              this.notificationService.error('Failed to create category');
            },
          });
      });
  }

  openEditDialog(category: Category): void {
    const dialogData: CategoryFormDialogData = {
      mode: 'edit',
      category,
      categories: this.categories(),
    };

    this.dialog.open(CategoryFormDialogComponent, { data: dialogData })
      .afterClosed()
      .subscribe((result: CategoryFormDialogResult | undefined) => {
        if (!result) return;
        this.adminService.updateCategory(category.id, result.name, result.parentId ?? undefined)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.notificationService.success('Category updated successfully');
              this.loadCategories();
            },
            error: () => {
              this.notificationService.error('Failed to update category');
            },
          });
      });
  }

  deleteCategory(category: Category): void {
    const dialogData: ConfirmDialogData = {
      title: 'Delete Category',
      message: `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
      confirmLabel: 'Delete',
      confirmColor: 'warn',
    };

    this.dialog.open(ConfirmDialogComponent, { data: dialogData })
      .afterClosed()
      .subscribe(confirmed => {
        if (!confirmed) return;
        this.adminService.deleteCategory(category.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.notificationService.success('Category deleted successfully');
              this.loadCategories();
            },
            error: () => {
              this.notificationService.error('Failed to delete category');
            },
          });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
