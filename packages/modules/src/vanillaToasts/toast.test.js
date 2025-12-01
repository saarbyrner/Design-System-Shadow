import showToast from './toast'; // Replace 'your-file-name' with the actual file name

describe('showToast', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should create a toast container and a toast message', () => {
    showToast('Test Message');

    expect(document.getElementById('toast-container')).toBeDefined();
    expect(document.querySelector('.toastWrapper')).toBeDefined();
    expect(document.querySelector('.toastMessage')?.textContent).toBe(
      'Test Message'
    );
    expect(document.querySelector('.vanillaToast.show')).toBeDefined();
  });

  it('should reuse the existing toast container and update message', () => {
    showToast('Initial Message');
    showToast('Updated Message');

    expect(document.querySelectorAll('.toastWrapper').length).toBe(1);
    expect(document.querySelector('.toastMessage')?.textContent).toBe(
      'Updated Message'
    );
  });

  it('should add the "show" class with a delay', () => {
    showToast('Delayed Message');

    expect(document.querySelector('.vanillaToast.show')).toBeNull();

    jest.advanceTimersByTime(100);

    expect(document.querySelector('.vanillaToast.show')).toBeDefined();
  });

  it('should remove the toast when the close button is clicked', () => {
    showToast('Closable Message');

    const closeButton = document.querySelector('.toast-close');
    closeButton?.click();

    expect(document.querySelector('.vanillaToast.show')).toBeNull();

    jest.advanceTimersByTime(1000);

    expect(document.querySelector('.vanillaToast')).toBeNull();
  });

  it('should not have multiple toasts', () => {
    showToast('First Toast');

    jest.advanceTimersByTime(100);
    expect(document.querySelectorAll('.vanillaToast.show').length).toBe(1);

    showToast('Second Toast');
    jest.advanceTimersByTime(100);

    expect(document.querySelectorAll('.vanillaToast.show').length).toBe(1);

    // Ensure no race conditions affect assertion above
    jest.advanceTimersByTime(100);
    expect(document.querySelectorAll('.vanillaToast.show').length).toBe(1);
  });

  it('should handle default message when no message is provided', () => {
    showToast();

    expect(document.querySelector('.toastMessage')?.textContent).toBe(
      'No Message'
    );
  });
});
