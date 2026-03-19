import { CurrencyFormatPipe } from './currency-format.pipe';

describe('CurrencyFormatPipe', () => {
  let pipe: CurrencyFormatPipe;

  beforeEach(() => {
    pipe = new CurrencyFormatPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format number as USD currency by default', () => {
    expect(pipe.transform(19.99)).toBe('$19.99');
  });

  it('should format with two decimal places', () => {
    expect(pipe.transform(10)).toBe('$10.00');
  });

  it('should handle zero', () => {
    expect(pipe.transform(0)).toBe('$0.00');
  });

  it('should handle null', () => {
    expect(pipe.transform(null)).toBeNull();
  });

  it('should handle undefined', () => {
    expect(pipe.transform(undefined)).toBeNull();
  });

  it('should accept custom currency code', () => {
    const result = pipe.transform(10, 'EUR');
    expect(result).toContain('10.00');
  });

  it('should format large numbers', () => {
    expect(pipe.transform(1234.56)).toBe('$1,234.56');
  });
});
