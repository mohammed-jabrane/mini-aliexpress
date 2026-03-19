import { Component, input, output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [MatPaginatorModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  totalItems = input.required<number>();
  pageSize = input<number>(10);
  pageIndex = input<number>(0);
  pageSizeOptions = input<number[]>([5, 10, 25, 50]);
  showFirstLastButtons = input<boolean>(true);

  pageChange = output<PageEvent>();

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }
}
