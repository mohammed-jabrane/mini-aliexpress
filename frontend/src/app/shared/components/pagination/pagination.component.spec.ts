import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('totalItems', 100);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default page size of 10', () => {
    expect(component.pageSize()).toBe(10);
  });

  it('should have default page index of 0', () => {
    expect(component.pageIndex()).toBe(0);
  });

  it('should have default page size options', () => {
    expect(component.pageSizeOptions()).toEqual([5, 10, 25, 50]);
  });

  it('should have showFirstLastButtons true by default', () => {
    expect(component.showFirstLastButtons()).toBe(true);
  });

  it('should emit pageChange on page event', () => {
    spyOn(component.pageChange, 'emit');
    const event = { pageIndex: 1, pageSize: 10, length: 100 };
    component.onPageChange(event);
    expect(component.pageChange.emit).toHaveBeenCalledWith(event);
  });

  it('should render mat-paginator', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('mat-paginator')).toBeTruthy();
  });
});
