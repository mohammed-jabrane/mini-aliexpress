import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { Category } from '../../../../shared/models/product.model';

export interface CategoryFormDialogData {
  mode: 'create' | 'edit';
  category?: Category;
  categories: Category[];
}

export interface CategoryFormDialogResult {
  name: string;
  parentId: string | null;
}

@Component({
  selector: 'app-category-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './category-form-dialog.component.html',
  styleUrl: './category-form-dialog.component.scss',
})
export class CategoryFormDialogComponent implements OnInit {
  data = inject<CategoryFormDialogData>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<CategoryFormDialogComponent>);
  private fb = inject(FormBuilder);

  form!: FormGroup;
  availableParents: Category[] = [];

  ngOnInit(): void {
    this.availableParents = this.data.categories.filter(
      c => !this.data.category || c.id !== this.data.category.id
    );

    this.form = this.fb.group({
      name: [this.data.category?.name || '', Validators.required],
      parentId: [this.data.category?.parentId || null],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value as CategoryFormDialogResult);
    }
  }
}
