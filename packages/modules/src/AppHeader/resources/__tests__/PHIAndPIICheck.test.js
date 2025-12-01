import PHIAndPIICheck from '../PHIAndPIICheck';

describe('PHIAndPIICheck', () => {
  const defaultLocation = window.location;
  const setHref = (url = '') => {
    Object.defineProperty(window, 'location', {
      value: {
        href: url,
      },
    });
  };

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn() },
    });
  });
  afterEach(() => {
    window.location = defaultLocation;
  });

  it('checks PHI URLs', () => {
    setHref('/analysis/injuries');
    const result = PHIAndPIICheck();
    expect(result.isPII).toBe(false);
    expect(result.isPHI).toBe(true);
    expect(result.isMedicalPage).toBe(false);
  });

  it('checks PHI URLs with dynamic params', () => {
    setHref('/athletes/123');
    const result = PHIAndPIICheck();
    expect(result.isPII).toBe(false);
    expect(result.isPHI).toBe(true);
    expect(result.isMedicalPage).toBe(false);
  });

  it('checks PII URLs', () => {
    setHref('/users');
    const result = PHIAndPIICheck();
    expect(result.isPII).toBe(true);
    expect(result.isPHI).toBe(false);
    expect(result.isMedicalPage).toBe(false);
  });

  it('checks PII URLs with dynamic params', () => {
    setHref('/users/456/edit');
    const result = PHIAndPIICheck();
    expect(result.isPII).toBe(true);
    expect(result.isPHI).toBe(false);
    expect(result.isMedicalPage).toBe(false);
  });
  it('checks medical URL', () => {
    setHref('/medical');
    const result = PHIAndPIICheck();
    expect(result.isPII).toBe(false);
    expect(result.isPHI).toBe(true);
    expect(result.isMedicalPage).toBe(true);
  });

  it('checks URLs that are not MedicalPage, PII and PHI', () => {
    setHref('/url-not-listed');
    const result = PHIAndPIICheck();
    expect(result.isPII).toBe(false);
    expect(result.isPHI).toBe(false);
    expect(result.isMedicalPage).toBe(false);
  });
});
