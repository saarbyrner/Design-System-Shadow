import { render, screen, fireEvent } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import IssueExaminationDatePicker from '../IssueExaminationDatePicker';

// The mock is updated to expose the calculated min/max dates for testing.
jest.mock(
  '@kitman/playbook/components/wrappers/MovementAwareDatePicker',
  () => (props) => {
    const minDate = props.minDate ? props.minDate.format('YYYY-MM-DD') : '';
    const maxDate = props.maxDate ? props.maxDate.format('YYYY-MM-DD') : '';

    return (
      <input
        data-testid={props.inputLabel}
        value={props.value ? props.value.format('YYYY-MM-DD') : ''}
        onChange={(e) => props.onChange(e.target.value)}
        data-min-date={minDate}
        data-max-date={maxDate}
        data-provided-date-ranges={JSON.stringify(props.providedDateRanges)}
      />
    );
  }
);

setI18n(i18n);

const defaultProps = {
  athleteId: 1,
  athleteData: { constraints: { active_periods: [] } },
  examinationDateProps: {
    selectedDiagnosisDate: '2025-07-10',
    selectedExaminationDate: '2025-07-15',
  },
  isEditMode: false,
  onSelectExaminationDate: jest.fn(),
  onChangeExaminationDate: jest.fn(),
  onChangeOccurrenceDate: jest.fn(),
  onSelectDetail: jest.fn(),
  details: {},
  t: i18nextTranslateStub(),
};

describe('IssueExaminationDatePicker', () => {
  beforeEach(() => {
    const fakeDate = new Date('2025-01-31T18:00:00Z'); // UTC FORMAT
    jest.useFakeTimers();
    jest.setSystemTime(fakeDate);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('renders both date pickers', () => {
    render(<IssueExaminationDatePicker {...defaultProps} />);
    expect(screen.getByTestId('Date of injury')).toBeInTheDocument();
    expect(screen.getByTestId('Date of examination')).toBeInTheDocument();
  });

  it('calls onChangeOccurrenceDate when the injury date is changed', () => {
    render(<IssueExaminationDatePicker {...defaultProps} />);
    const injuryDatePicker = screen.getByTestId('Date of injury');
    fireEvent.change(injuryDatePicker, { target: { value: '2025-07-11' } });
    expect(defaultProps.onChangeOccurrenceDate).toHaveBeenCalledWith(
      '2025-07-11'
    );
  });

  it('calls onChangeExaminationDate when the examination date is changed', () => {
    render(<IssueExaminationDatePicker {...defaultProps} />);
    const examinationDatePicker = screen.getByTestId('Date of examination');
    fireEvent.change(examinationDatePicker, {
      target: { value: '2025-07-16' },
    });
    expect(defaultProps.onChangeExaminationDate).toHaveBeenCalledWith(
      '2025-07-16'
    );
  });

  it('displays the correct initial dates', () => {
    const props = {
      ...defaultProps,
      details: { occurrenceDate: '2025-07-12' },
      examinationDateProps: {
        selectedDiagnosisDate: '2025-07-10',
        selectedExaminationDate: '2025-07-15',
      },
    };
    render(<IssueExaminationDatePicker {...props} />);
    expect(screen.getByTestId('Date of injury')).toHaveValue('2025-07-12');
    expect(screen.getByTestId('Date of examination')).toHaveValue('2025-07-15');
  });

  it('calculates and applies the correct min/max date range from active periods', () => {
    const fakeDate = new Date('2025-07-31T18:00:00Z'); // UTC FORMAT
    jest.useFakeTimers();
    jest.setSystemTime(fakeDate);

    const activePeriods = [
      { start: '2025-02-01', end: '2025-06-30' },
      { start: '2025-01-15', end: '2025-03-10' }, // Earliest start date
    ];

    const props = {
      ...defaultProps,
      athleteData: {
        constraints: {
          active_periods: activePeriods,
        },
      },
      examinationDateProps: {
        selectedDiagnosisDate: '2025-03-01',
        selectedExaminationDate: '2025-07-15',
      },
    };

    render(<IssueExaminationDatePicker {...props} />);

    const injuryDatePicker = screen.getByTestId('Date of injury');
    const examinationDatePicker = screen.getByTestId('Date of examination');

    // The min date should be the earliest from all sources ('2025-01-15').
    // The max date should be the latest from all sources ('2025-12-15' is the furthest but todays date is '2025-01-31').
    expect(injuryDatePicker).toHaveAttribute('data-min-date', '2025-01-15');
    expect(injuryDatePicker).toHaveAttribute('data-max-date', '2025-06-30');
    expect(examinationDatePicker).toHaveAttribute(
      'data-min-date',
      '2025-01-15'
    );
    expect(examinationDatePicker).toHaveAttribute(
      'data-max-date',
      '2025-06-30'
    );

    expect(injuryDatePicker).toHaveAttribute(
      'data-provided-date-ranges',
      JSON.stringify(activePeriods)
    );
    expect(examinationDatePicker).toHaveAttribute(
      'data-provided-date-ranges',
      JSON.stringify(activePeriods)
    );
  });

  it('calculates and applies the correct min/max date range from all sources when they exceed todays date', () => {
    const activePeriods = [
      { start: '2025-02-01', end: '2025-06-30' },
      { start: '2025-01-15', end: '2025-03-10' }, // Earliest start date
    ];
    const props = {
      ...defaultProps,
      athleteData: {
        constraints: {
          active_periods: activePeriods,
        },
      },
      examinationDateProps: {
        selectedDiagnosisDate: '2025-03-01',
        selectedExaminationDate: '2025-07-15',
      },
    };

    render(<IssueExaminationDatePicker {...props} />);

    const injuryDatePicker = screen.getByTestId('Date of injury');
    const examinationDatePicker = screen.getByTestId('Date of examination');

    // The min date should be the earliest from all sources ('2025-01-15').
    // The max date should be the latest from all sources ('2025-06-30' is the furthest but todays date is '2025-01-31').
    expect(injuryDatePicker).toHaveAttribute('data-min-date', '2025-01-15');
    expect(injuryDatePicker).toHaveAttribute('data-max-date', '2025-01-31');
    expect(examinationDatePicker).toHaveAttribute(
      'data-min-date',
      '2025-01-15'
    );
    expect(examinationDatePicker).toHaveAttribute(
      'data-max-date',
      '2025-01-31'
    );

    const expectedRanges = [...activePeriods];
    expect(injuryDatePicker).toHaveAttribute(
      'data-provided-date-ranges',
      JSON.stringify(expectedRanges)
    );
    expect(examinationDatePicker).toHaveAttribute(
      'data-provided-date-ranges',
      JSON.stringify(expectedRanges)
    );
  });

  it('caps the maxDate at today when the active period ends in the future', () => {
    const fakeDate = new Date('2025-05-15T18:00:00Z');
    jest.setSystemTime(fakeDate);

    const activePeriods = [{ start: '2025-01-01', end: '2025-12-31' }]; // End date is in the future

    const props = {
      ...defaultProps,
      athleteData: {
        constraints: {
          active_periods: activePeriods,
        },
      },
    };

    render(<IssueExaminationDatePicker {...props} />);

    const injuryDatePicker = screen.getByTestId('Date of injury');
    const examinationDatePicker = screen.getByTestId('Date of examination');

    // The max date should be capped at today's date, not the end of the active period.
    expect(injuryDatePicker).toHaveAttribute('data-max-date', '2025-05-15');
    expect(examinationDatePicker).toHaveAttribute(
      'data-max-date',
      '2025-05-15'
    );
  });

  it('sets minDate to empty string when a range has a null start date', () => {
    const props = {
      ...defaultProps,
      athleteData: {
        constraints: {
          active_periods: [{ start: null, end: '2025-06-30' }],
        },
      },
    };
    render(<IssueExaminationDatePicker {...props} />);
    const injuryDatePicker = screen.getByTestId('Date of injury');
    expect(injuryDatePicker).toHaveAttribute('data-min-date', '');
  });

  it('sets maxDate to today when a range has a null end date', () => {
    const fakeDate = new Date('2025-07-15T18:00:00Z');
    jest.setSystemTime(fakeDate);
    const props = {
      ...defaultProps,
      athleteData: {
        constraints: {
          active_periods: [{ start: '2025-01-01', end: null }],
        },
      },
    };
    render(<IssueExaminationDatePicker {...props} />);
    const injuryDatePicker = screen.getByTestId('Date of injury');
    expect(injuryDatePicker).toHaveAttribute('data-max-date', '2025-07-15');
  });
});
