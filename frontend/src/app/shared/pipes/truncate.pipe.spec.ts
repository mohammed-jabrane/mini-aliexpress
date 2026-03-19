import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  let pipe: TruncatePipe;

  beforeEach(() => {
    pipe = new TruncatePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return empty string for empty string', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should not truncate string shorter than limit', () => {
    expect(pipe.transform('Hello', 50)).toBe('Hello');
  });

  it('should not truncate string equal to limit', () => {
    const text = 'a'.repeat(50);
    expect(pipe.transform(text, 50)).toBe(text);
  });

  it('should truncate string longer than limit with ellipsis', () => {
    const text = 'a'.repeat(60);
    expect(pipe.transform(text, 50)).toBe('a'.repeat(50) + '...');
  });

  it('should use default limit of 50', () => {
    const text = 'a'.repeat(60);
    expect(pipe.transform(text)).toBe('a'.repeat(50) + '...');
  });

  it('should use custom ellipsis', () => {
    const text = 'a'.repeat(60);
    expect(pipe.transform(text, 50, '---')).toBe('a'.repeat(50) + '---');
  });

  it('should use custom limit', () => {
    expect(pipe.transform('Hello World', 5)).toBe('Hello...');
  });
});
