import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CategoryManagementComponent } from './category-management.component';
import { ProductService } from '../../../product/services/product.service';
import { AdminService } from '../../services/admin.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Category } from '../../../../shared/models/product.model';

describe('CategoryManagementComponent', () => {
  let component: CategoryManagementComponent;
  let fixture: ComponentFixture<CategoryManagementComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;

  const mockCategories: Category[] = [
    { id: 'c1', name: 'Electronics', parentId: null, children: [] },
    { id: 'c2', name: 'Laptops', parentId: 'c1', children: [] },
  ];

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', ['getCategories']);
    adminServiceSpy = jasmine.createSpyObj('AdminService', ['createCategory', 'updateCategory', 'deleteCategory']);
    notificationSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);
    productServiceSpy.getCategories.and.returnValue(of(mockCategories));

    await TestBed.configureTestingModule({
      imports: [CategoryManagementComponent, NoopAnimationsModule],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: AdminService, useValue: adminServiceSpy },
        { provide: NotificationService, useValue: notificationSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryManagementComponent);
    component = fixture.componentInstance;
  });

  function spyDialogOpen(returnValue: unknown): void {
    const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<unknown>>('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(returnValue));
    spyOn(component['dialog'], 'open').and.returnValue(dialogRefSpy);
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', fakeAsync(() => {
    // WHEN
    component.ngOnInit();
    tick();

    // THEN
    expect(productServiceSpy.getCategories).toHaveBeenCalled();
    expect(component.categories()).toEqual(mockCategories);
    expect(component.dataSource.data).toEqual(mockCategories);
    expect(component.loading()).toBeFalse();
  }));

  it('should show error when loading categories fails', fakeAsync(() => {
    // GIVEN
    productServiceSpy.getCategories.and.returnValue(throwError(() => new Error('fail')));

    // WHEN
    component.loadCategories();
    tick();

    // THEN
    expect(notificationSpy.error).toHaveBeenCalledWith('Failed to load categories');
    expect(component.loading()).toBeFalse();
  }));

  // ── getParentName ─────────────────────────────────────────

  it('should return dash for null parentId', () => {
    component.categories.set(mockCategories);
    expect(component.getParentName(null)).toBe('—');
  });

  it('should return parent name when found', () => {
    component.categories.set(mockCategories);
    expect(component.getParentName('c1')).toBe('Electronics');
  });

  it('should return dash when parent not found', () => {
    component.categories.set(mockCategories);
    expect(component.getParentName('unknown')).toBe('—');
  });

  // ── openCreateDialog ──────────────────────────────────────

  it('should create category when dialog returns result', fakeAsync(() => {
    // GIVEN
    component.categories.set(mockCategories);
    spyDialogOpen({ name: 'Books', parentId: null });
    adminServiceSpy.createCategory.and.returnValue(of({ id: 'c3', name: 'Books', parentId: null, children: [] }));

    // WHEN
    component.openCreateDialog();
    tick();

    // THEN
    expect(adminServiceSpy.createCategory).toHaveBeenCalledWith('Books', undefined);
    expect(notificationSpy.success).toHaveBeenCalledWith('Category created successfully');
  }));

  it('should not create category when dialog cancelled', fakeAsync(() => {
    // GIVEN
    spyDialogOpen(undefined);

    // WHEN
    component.openCreateDialog();
    tick();

    // THEN
    expect(adminServiceSpy.createCategory).not.toHaveBeenCalled();
  }));

  it('should show error when create fails', fakeAsync(() => {
    // GIVEN
    component.categories.set(mockCategories);
    spyDialogOpen({ name: 'Books', parentId: null });
    adminServiceSpy.createCategory.and.returnValue(throwError(() => new Error('fail')));

    // WHEN
    component.openCreateDialog();
    tick();

    // THEN
    expect(notificationSpy.error).toHaveBeenCalledWith('Failed to create category');
  }));

  // ── openEditDialog ────────────────────────────────────────

  it('should update category when dialog returns result', fakeAsync(() => {
    // GIVEN
    component.categories.set(mockCategories);
    spyDialogOpen({ name: 'Gadgets', parentId: null });
    adminServiceSpy.updateCategory.and.returnValue(of({ ...mockCategories[0], name: 'Gadgets' }));

    // WHEN
    component.openEditDialog(mockCategories[0]);
    tick();

    // THEN
    expect(adminServiceSpy.updateCategory).toHaveBeenCalledWith('c1', 'Gadgets', undefined);
    expect(notificationSpy.success).toHaveBeenCalledWith('Category updated successfully');
  }));

  it('should show error when update fails', fakeAsync(() => {
    // GIVEN
    component.categories.set(mockCategories);
    spyDialogOpen({ name: 'Gadgets', parentId: null });
    adminServiceSpy.updateCategory.and.returnValue(throwError(() => new Error('fail')));

    // WHEN
    component.openEditDialog(mockCategories[0]);
    tick();

    // THEN
    expect(notificationSpy.error).toHaveBeenCalledWith('Failed to update category');
  }));

  // ── deleteCategory ────────────────────────────────────────

  it('should delete category when confirmed', fakeAsync(() => {
    // GIVEN
    component.categories.set(mockCategories);
    spyDialogOpen(true);
    adminServiceSpy.deleteCategory.and.returnValue(of(void 0));

    // WHEN
    component.deleteCategory(mockCategories[0]);
    tick();

    // THEN
    expect(adminServiceSpy.deleteCategory).toHaveBeenCalledWith('c1');
    expect(notificationSpy.success).toHaveBeenCalledWith('Category deleted successfully');
  }));

  it('should not delete category when dialog cancelled', fakeAsync(() => {
    // GIVEN
    spyDialogOpen(false);

    // WHEN
    component.deleteCategory(mockCategories[0]);
    tick();

    // THEN
    expect(adminServiceSpy.deleteCategory).not.toHaveBeenCalled();
  }));

  it('should show error when delete fails', fakeAsync(() => {
    // GIVEN
    spyDialogOpen(true);
    adminServiceSpy.deleteCategory.and.returnValue(throwError(() => new Error('fail')));

    // WHEN
    component.deleteCategory(mockCategories[0]);
    tick();

    // THEN
    expect(notificationSpy.error).toHaveBeenCalledWith('Failed to delete category');
  }));

  it('should unsubscribe on destroy', () => {
    const destroySpy = spyOn(component['destroy$'], 'next');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
  });
});
