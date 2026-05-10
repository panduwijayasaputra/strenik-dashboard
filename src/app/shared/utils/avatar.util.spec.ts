import { getInitials, getAvatarColor } from './avatar.util';

describe('getInitials', () => {
  it('returns initials from a full name', () => {
    expect(getInitials('John Doe')).toBe('JD');
  });

  it('returns single initial for a single name', () => {
    expect(getInitials('Alice')).toBe('A');
  });

  it('uses first and last word for names with multiple parts', () => {
    expect(getInitials('Mary Jane Watson')).toBe('MW');
  });

  it('returns empty string for empty input', () => {
    expect(getInitials('')).toBe('');
  });

  it('handles extra whitespace', () => {
    expect(getInitials('  John   Doe  ')).toBe('JD');
  });
});

describe('getAvatarColor', () => {
  const validClasses = ['bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-info'];

  it('returns a valid semantic color class', () => {
    const result = getAvatarColor('test');
    expect(validClasses).toContain(result);
  });

  it('returns the same color for the same name', () => {
    expect(getAvatarColor('Alice')).toBe(getAvatarColor('Alice'));
  });

  it('returns a string for an empty name', () => {
    expect(typeof getAvatarColor('')).toBe('string');
  });
});
