import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render inline spinner by default', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.inline-spinner')).toBeTruthy();
    expect(el.querySelector('.overlay')).toBeFalsy();
  });

  it('should render overlay spinner when overlay is true', () => {
    fixture.componentRef.setInput('overlay', true);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.overlay')).toBeTruthy();
    expect(el.querySelector('.inline-spinner')).toBeFalsy();
  });

  it('should have default diameter of 48', () => {
    expect(component.diameter()).toBe(48);
  });
});
