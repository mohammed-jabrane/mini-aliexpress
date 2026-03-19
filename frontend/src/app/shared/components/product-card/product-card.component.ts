import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Product } from '../../models/product.model';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyFormatPipe, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  constructor(private router: Router) {}

  goToDetail(): void {
    this.router.navigate(['/products', this.product.id]);
  }

  onAddToCart(event: Event): void {
    event.stopPropagation();
  }
}
