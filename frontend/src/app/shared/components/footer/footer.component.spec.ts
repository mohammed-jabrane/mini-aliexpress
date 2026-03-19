import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the current year', () => {
    // GIVEN
    const currentYear = new Date().getFullYear();

    // WHEN / THEN
    expect(component.year).toBe(currentYear);
  });

  it('should render the copyright text with year', () => {
    // GIVEN
    fixture.detectChanges();

    // WHEN
    const text = fixture.nativeElement.textContent;

    // THEN
    expect(text).toContain(String(component.year));
    expect(text).toContain('Mini AliExpress');
    expect(text).toContain('All rights reserved');
  });

  it('should render a mat-toolbar', () => {
    // GIVEN
    fixture.detectChanges();

    // WHEN
    const toolbar = fixture.nativeElement.querySelector('mat-toolbar');

    // THEN
    expect(toolbar).toBeTruthy();
  });
});
