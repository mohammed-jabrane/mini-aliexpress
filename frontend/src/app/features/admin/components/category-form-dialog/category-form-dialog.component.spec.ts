import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CategoryFormDialogComponent, CategoryFormDialogData } from './category-form-dialog.component';
import { Category } from '../../../../shared/models/product.model';

describe('CategoryFormDialogComponent', () => {
  let component: CategoryFormDialogComponent;
  let fixture: ComponentFixture<CategoryFormDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CategoryFormDialogComponent>>;

  const mockCategories: Category[] = [
    { id: 'c1', name: 'Electronics', parentId: null, children: [] },
    { id: 'c2', name: 'Books', parentId: null, children: [] },
  ];

  function createComponent(data: CategoryFormDialogData): void {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [CategoryFormDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryFormDialogComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  }

  // ── Create mode ───────────────────────────────────────────

  describe('create mode', () => {
    beforeEach(() => {
      createComponent({ mode: 'create', categories: mockCategories });
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize empty form', () => {
      expect(component.form.value).toEqual({ name: '', parentId: null });
    });

    it('should list all categories as available parents', () => {
      expect(component.availableParents.length).toBe(2);
    });

    it('should not submit if name is empty', () => {
      // WHEN
      component.onSubmit();

      // THEN
      expect(dialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('should submit with form value when valid', () => {
      // GIVEN
      component.form.patchValue({ name: 'Laptops', parentId: 'c1' });

      // WHEN
      component.onSubmit();

      // THEN
      expect(dialogRefSpy.close).toHaveBeenCalledWith({ name: 'Laptops', parentId: 'c1' });
    });

    it('should close without result on cancel', () => {
      // WHEN
      component.onCancel();

      // THEN
      expect(dialogRefSpy.close).toHaveBeenCalledWith();
    });
  });

  // ── Edit mode ─────────────────────────────────────────────

  describe('edit mode', () => {
    beforeEach(() => {
      createComponent({
        mode: 'edit',
        category: mockCategories[0],
        categories: mockCategories,
      });
    });

    it('should pre-fill form with category data', () => {
      expect(component.form.value).toEqual({ name: 'Electronics', parentId: null });
    });

    it('should exclude current category from available parents', () => {
      expect(component.availableParents.length).toBe(1);
      expect(component.availableParents[0].id).toBe('c2');
    });
  });
});
