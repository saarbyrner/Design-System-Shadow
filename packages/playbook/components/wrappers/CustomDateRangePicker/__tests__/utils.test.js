import moment from 'moment';
import {
  applyRangeStyles,
  convertDateRangeToTuple,
  formatDateInput,
  formatDateRange,
  getCurrentMonthYear,
  getThisMonth,
  getThisWeek,
  getThisYear,
} from '../utils';

// Mock moment.now() to have consistent dates in tests
const fakeDate = new Date('2025-07-07T12:00:00Z');

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(fakeDate);
});

afterAll(() => {
  jest.useRealTimers();
});

describe('Period Functions', () => {
  test('getThisWeek returns correct week range', () => {
    const [start, end] = getThisWeek();
    expect(start.format('YYYY-MM-DD')).toBe('2025-07-06');
    expect(end.format('YYYY-MM-DD')).toBe('2025-07-12');
  });

  test('getThisMonth returns correct month range', () => {
    const [start, end] = getThisMonth();
    expect(start.format('YYYY-MM-DD')).toBe('2025-07-01');
    expect(end.format('YYYY-MM-DD')).toBe('2025-07-31');
  });

  test('getThisYear returns correct year range', () => {
    const [start, end] = getThisYear();
    expect(start.format('YYYY-MM-DD')).toBe('2025-01-01');
    expect(end.format('YYYY-MM-DD')).toBe('2025-12-31');
  });
});

describe('getCurrentMonthYear', () => {
  beforeEach(() => {
    // Create a proper HTMLElement for testing
    document.body.innerHTML = `
      <div id="calendar-container">
        <div class="MuiPickersCalendarHeader-label">July 2025</div>
      </div>
    `;
  });

  test('correctly parses month and year from calendar header', () => {
    const container = document.getElementById('calendar-container');
    const result = getCurrentMonthYear(container);
    expect(result).toEqual({ month: 6, year: 2025 });
  });

  test('returns null when header element is missing', () => {
    const container = document.createElement('div');
    const result = getCurrentMonthYear(container);
    expect(result).toBeNull();
  });

  test('returns null for invalid date format', () => {
    const container = document.createElement('div');
    container.innerHTML =
      '<div class="MuiPickersCalendarHeader-label">Invalid Date</div>';
    const result = getCurrentMonthYear(container);
    expect(result).toBeNull();
  });
});

describe('formatDateInput', () => {
  test('formats complete date range for US locale', () => {
    const input = '0715202507162025';
    const result = formatDateInput(input, 'en-US');
    expect(result.formatted).toBe('07/15/2025 — 07/16/2025');
    expect(result.dateRange).toBeDefined();
    expect(result.dateRange[0].format('YYYY-MM-DD')).toBe('2025-07-15');
    expect(result.dateRange[1].format('YYYY-MM-DD')).toBe('2025-07-16');
  });

  test('formats partial date input for US locale', () => {
    const input = '0715';
    const result = formatDateInput(input, 'en-US');
    expect(result.formatted).toBe('07/15/');
    expect(result.dateRange).toBeUndefined();
  });

  test('formats complete date range for non-US locale', () => {
    const input = '1507202516072025';
    const result = formatDateInput(input, 'en-GB');
    expect(result.formatted).toBe('15/07/2025 — 16/07/2025');
    expect(result.dateRange).toBeDefined();
    expect(result.dateRange[0].format('YYYY-MM-DD')).toBe('2025-07-15');
    expect(result.dateRange[1].format('YYYY-MM-DD')).toBe('2025-07-16');
  });

  test('handles invalid input', () => {
    const input = 'invalid';
    const result = formatDateInput(input, 'en-US');
    expect(result.formatted).toBe('');
    expect(result.dateRange).toBeUndefined();
  });
});

describe('formatDateRange', () => {
  test('formats valid date range', () => {
    const startDate = moment('2025-07-15');
    const endDate = moment('2025-07-16');
    const result = formatDateRange(startDate, endDate);
    expect(result).toEqual({
      start_date: '2025-07-15',
      end_date: '2025-07-16',
    });
  });

  test('handles null dates', () => {
    const result = formatDateRange(null, null);
    expect(result).toEqual({
      start_date: '',
      end_date: '',
    });
  });

  test('handles invalid dates', () => {
    const invalidDate = moment('invalid');
    const result = formatDateRange(invalidDate, invalidDate);
    expect(result).toEqual({
      start_date: '',
      end_date: '',
    });
  });
});

describe('applyRangeStyles', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div data-calendar-type="start">
        <div class="MuiPickersCalendarHeader-label">July 2025</div>
        <button class="MuiPickersDay-root">15</button>
      </div>
      <div data-calendar-type="end">
        <div class="MuiPickersCalendarHeader-label">July 2025</div>
        <button class="MuiPickersDay-root">16</button>
      </div>
    `;
  });

  test('applies styles to selected range', () => {
    const dateRange = [moment('2025-07-15'), moment('2025-07-16')];
    const hoveredDate = null;
    const isMobile = false;

    applyRangeStyles(dateRange, hoveredDate, isMobile);

    const startDay = document.querySelector(
      '[data-calendar-type="start"] .MuiPickersDay-root'
    );
    const endDay = document.querySelector(
      '[data-calendar-type="end"] .MuiPickersDay-root'
    );

    expect(startDay.style.backgroundColor).toBeTruthy();
    expect(endDay.style.backgroundColor).toBeTruthy();
  });

  test('clears styles when no dates selected', () => {
    const dateRange = [null, null];
    const hoveredDate = null;
    const isMobile = false;

    applyRangeStyles(dateRange, hoveredDate, isMobile);

    const days = document.querySelectorAll('.MuiPickersDay-root');
    days.forEach((day) => {
      expect(day).toHaveStyle({ backgroundColor: '' });
      expect(day).toHaveStyle({ borderRadius: '' });
    });
  });
});

describe('convertDateRangeToTuple', () => {
  it('converts a valid date range object to a tuple of moment objects', () => {
    const legacyRange = { start_date: '2025-01-01', end_date: '2025-01-31' };
    const [start, end] = convertDateRangeToTuple(legacyRange);
    expect(start.format('YYYY-MM-DD')).toBe('2025-01-01');
    expect(end.format('YYYY-MM-DD')).toBe('2025-01-31');
  });

  it('handles null start_date', () => {
    const legacyRange = { start_date: null, end_date: '2025-01-31' };
    const [start, end] = convertDateRangeToTuple(legacyRange);
    expect(start).toBeNull();
    expect(end.format('YYYY-MM-DD')).toBe('2025-01-31');
  });

  it('handles null end_date', () => {
    const legacyRange = { start_date: '2025-01-01', end_date: null };
    const [start, end] = convertDateRangeToTuple(legacyRange);
    expect(start.format('YYYY-MM-DD')).toBe('2025-01-01');
    expect(end).toBeNull();
  });

  it('handles both start_date and end_date as null', () => {
    const legacyRange = { start_date: null, end_date: null };
    const [start, end] = convertDateRangeToTuple(legacyRange);
    expect(start).toBeNull();
    expect(end).toBeNull();
  });
});
