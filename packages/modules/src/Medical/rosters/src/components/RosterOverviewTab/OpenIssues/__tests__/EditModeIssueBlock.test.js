import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setI18n } from 'react-i18next';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import EditModeIssueBlock from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/OpenIssues/EditModeIssueBlock';
import {
  getStatusOptions as mockGetStatusOptions,
  getDefaultStatusId as mockGetDefaultStatusId,
} from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/OpenIssues/utils';

setI18n(i18n);

jest.mock(
  '@kitman/playbook/components/wrappers/MovementAwareDatePicker',
  () => {
    return function MockMovementAwareDatePicker(props) {
      return (
        <input
          data-testid="date-picker"
          value={props.value || ''}
          onChange={(e) => props.onChange(e.target.value)}
          disabled={props.disabled}
          placeholder={props.placeholder}
          min={props.minDate ? props.minDate.format('YYYY-MM-DD') : ''}
          data-athleteid={props.athleteId}
          data-disablefuture={props.disableFuture}
          data-includeancillaryranges={props.inclundeAncillaryRanges}
        />
      );
    };
  }
);

jest.mock('@kitman/components', () => ({
  Select: function MockSelect(props) {
    return (
      <select
        data-testid="status-select"
        value={props.value || ''}
        onChange={(e) => props.onChange(e.target.value)}
        disabled={props.isDisabled}
      >
        <option value="">{props.placeholder}</option>
        {props.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  },
}));

jest.mock('../utils', () => ({
  getStatusOptions: jest.fn(),
  getDefaultStatusId: jest.fn(),
}));

describe('EditModeIssueBlock', () => {
  const defaultProps = {
    openIssue: {
      id: 1,
      name: 'Ankle Sprain',
      status: 'Active',
      preliminary_status_complete: true,
    },
    injuryStatuses: [
      {
        id: 1,
        injury_status_system_id: 1,
        description: 'Active',
        order: 1,
        color: '#ff0000',
        cause_unavailability: true,
        restore_availability: false,
        is_resolver: false,
      },
      {
        id: 2,
        injury_status_system_id: 2,
        description: 'Recovered',
        order: 2,
        color: '#00ff00',
        cause_unavailability: false,
        restore_availability: true,
        is_resolver: true,
      },
    ],
    editedStatuses: {},
    saving: false,
    dateValidationErrors: {},
    athleteId: '123',
    isInjuryLockedToOccurrenceDate: false,
    getIssueDate: jest.fn(() => '2025-08-15'),
    onStatusChange: jest.fn(),
    onDateChange: jest.fn(),
    validateDate: jest.fn(() => true),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetStatusOptions.mockReturnValue([
      { value: 1, label: 'Active' },
      { value: 2, label: 'Recovered' },
    ]);
    mockGetDefaultStatusId.mockReturnValue(1);
  });

  const renderWithProviders = (component) => {
    return render(
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
        {component}
      </LocalizationProvider>
    );
  };

  it('renders correctly', () => {
    renderWithProviders(<EditModeIssueBlock {...defaultProps} />);

    expect(screen.getByText('Ankle Sprain')).toBeInTheDocument();

    const datePicker = screen.getByTestId('date-picker');
    expect(datePicker).toBeInTheDocument();
    expect(datePicker).toHaveAttribute('placeholder', 'Date');

    const statusSelect = screen.getByTestId('status-select');
    expect(statusSelect).toHaveDisplayValue('Select status');

    expect(mockGetStatusOptions).toHaveBeenCalledWith(
      defaultProps.injuryStatuses
    );
    expect(mockGetDefaultStatusId).toHaveBeenCalledWith(
      defaultProps.openIssue,
      defaultProps.injuryStatuses
    );
  });

  describe('date picker', () => {
    it('should call onDateChange and validateDate when date is changed', () => {
      const onDateChange = jest.fn();
      const validateDate = jest.fn();

      const props = {
        ...defaultProps,
        onDateChange,
        validateDate,
      };

      renderWithProviders(<EditModeIssueBlock {...props} />);

      const datePicker = screen.getByTestId('date-picker');
      fireEvent.change(datePicker, { target: { value: '2025-08-01' } });

      expect(onDateChange).toHaveBeenCalledWith(1, '2025-08-01');
      expect(onDateChange).toHaveBeenCalledTimes(1);
    });

    it('should disable date picker when saving is true', () => {
      const props = {
        ...defaultProps,
        saving: true,
      };

      renderWithProviders(<EditModeIssueBlock {...props} />);

      const datePicker = screen.getByTestId('date-picker');
      expect(datePicker).toBeDisabled();
    });

    it('should disable date picker for preliminary issues', () => {
      const props = {
        ...defaultProps,
        openIssue: {
          ...defaultProps.openIssue,
          preliminary_status_complete: true,
        },
        isInjuryLockedToOccurrenceDate: true,
      };

      renderWithProviders(<EditModeIssueBlock {...props} />);

      const datePicker = screen.getByTestId('date-picker');
      expect(datePicker).toBeDisabled();
    });

    it('should show issue date value when preliminary and locked to occurrence date', () => {
      const getIssueDate = jest.fn(() => '2025-08-20');

      const props = {
        ...defaultProps,
        openIssue: {
          ...defaultProps.openIssue,
          preliminary_status_complete: false,
        },
        isInjuryLockedToOccurrenceDate: true,
        getIssueDate,
      };

      renderWithProviders(<EditModeIssueBlock {...props} />);

      const datePicker = screen.getByTestId('date-picker');
      expect(datePicker).toHaveValue('2025-08-20');
    });

    it('should show empty date value for non-preliminary issues', () => {
      const props = {
        ...defaultProps,
        openIssue: {
          ...defaultProps.openIssue,
          preliminary_status_complete: true,
        },
      };

      renderWithProviders(<EditModeIssueBlock {...props} />);

      const datePicker = screen.getByTestId('date-picker');
      expect(datePicker).toHaveValue('');
    });

    it('should show empty date value when preliminary but not locked to occurrence date', () => {
      const props = {
        ...defaultProps,
        openIssue: {
          ...defaultProps.openIssue,
          preliminary_status_complete: false,
        },
        isInjuryLockedToOccurrenceDate: false,
      };

      renderWithProviders(<EditModeIssueBlock {...props} />);

      const datePicker = screen.getByTestId('date-picker');
      expect(datePicker).toHaveValue('');
    });

    it('should set the minDate for the date picker when openIssueLastEventDate is provided', () => {
      const props = {
        ...defaultProps,
        openIssueLastEventDate: '2025-07-01',
      };

      renderWithProviders(<EditModeIssueBlock {...props} />);

      const datePicker = screen.getByTestId('date-picker');
      expect(datePicker).toHaveAttribute('min', '2025-07-01');
    });

    it('should call onDateChange or validateDate when preliminary issue and date is changed', () => {
      const onDateChange = jest.fn();
      const validateDate = jest.fn();

      const props = {
        ...defaultProps,
        openIssue: {
          ...defaultProps.openIssue,
          preliminary_status_complete: true,
        },
        isInjuryLockedToOccurrenceDate: false,
        onDateChange,
        validateDate,
      };

      renderWithProviders(<EditModeIssueBlock {...props} />);

      const datePicker = screen.getByTestId('date-picker');
      fireEvent.change(datePicker, { target: { value: '2025-08-01' } });

      expect(onDateChange).toHaveBeenCalled();
      expect(validateDate).toHaveBeenCalled();
    });

    it('should not set the minDate for the date picker when openIssueLastEventDate is null', () => {
      const props = {
        ...defaultProps,
        openIssueLastEventDate: null,
      };

      renderWithProviders(<EditModeIssueBlock {...props} />);

      const datePicker = screen.getByTestId('date-picker');
      expect(datePicker).toHaveAttribute('min', '');
    });

    it('should display the issue date when isInjuryLockedToOccurrenceDate is true', () => {
      const getIssueDate = jest.fn(() => '2025-09-01');
      const props = {
        ...defaultProps,
        isInjuryLockedToOccurrenceDate: true,
        getIssueDate,
      };

      renderWithProviders(<EditModeIssueBlock {...props} />);

      const datePicker = screen.getByTestId('date-picker');
      expect(datePicker).toHaveValue('2025-09-01');
      expect(getIssueDate).toHaveBeenCalledWith(defaultProps.openIssue);
    });

    it('should display an empty date when isInjuryLockedToOccurrenceDate is false', () => {
      const getIssueDate = jest.fn(() => '2025-09-01');
      const props = {
        ...defaultProps,
        isInjuryLockedToOccurrenceDate: false,
        getIssueDate,
      };

      renderWithProviders(<EditModeIssueBlock {...props} />);

      const datePicker = screen.getByTestId('date-picker');
      expect(datePicker).toHaveValue('');
      expect(getIssueDate).not.toHaveBeenCalled();
    });

    it('should pass the athleteId to the date picker', () => {
      renderWithProviders(<EditModeIssueBlock {...defaultProps} />);
      const datePicker = screen.getByTestId('date-picker');
      expect(datePicker).toHaveAttribute(
        'data-athleteid',
        defaultProps.athleteId
      );
    });

    it('should pass disableFuture prop to the date picker', () => {
      renderWithProviders(<EditModeIssueBlock {...defaultProps} />);
      const datePicker = screen.getByTestId('date-picker');
      expect(datePicker).toHaveAttribute('data-disablefuture', 'true');
    });

    it('should pass inclundeAncillaryRanges prop to the date picker', () => {
      renderWithProviders(<EditModeIssueBlock {...defaultProps} />);
      const datePicker = screen.getByTestId('date-picker');
      expect(datePicker).toHaveAttribute('data-includeancillaryranges', 'true');
    });
  });

  describe('status selection', () => {
    it('should call onStatusChange when status is selected', async () => {
      const user = userEvent.setup();
      const onStatusChange = jest.fn();

      const props = {
        ...defaultProps,
        onStatusChange,
        openIssue: {
          ...defaultProps.openIssue,
          status_id: 1,
        },
      };

      renderWithProviders(<EditModeIssueBlock {...props} />);

      const statusSelect = screen.getByTestId('status-select');
      await user.selectOptions(statusSelect, '2');

      expect(onStatusChange).toHaveBeenCalledWith(1, '2');
    });

    it('should show current edited status value', () => {
      const editedStatuses = { 1: 2 };

      const props = {
        ...defaultProps,
        editedStatuses,
        openIssue: {
          ...defaultProps.openIssue,
          status_id: 1,
        },
      };

      renderWithProviders(<EditModeIssueBlock {...props} />);

      const statusSelect = screen.getByTestId('status-select');
      expect(statusSelect).toHaveValue('2');
    });

    it('should disable status select when saving is true', () => {
      const props = {
        ...defaultProps,
        saving: true,
      };

      renderWithProviders(<EditModeIssueBlock {...props} />);

      const statusSelect = screen.getByTestId('status-select');
      expect(statusSelect).toBeDisabled();
    });

    describe('filter options from status select', () => {
      it('should filter out current status from options for regular injuries', () => {
        mockGetDefaultStatusId.mockReturnValue(1);
        mockGetStatusOptions.mockReturnValue([
          { value: 1, label: 'Active' },
          { value: 2, label: 'Recovered' },
          { value: 3, label: 'Under Treatment' },
        ]);

        const props = {
          ...defaultProps,
          openIssue: {
            ...defaultProps.openIssue,
            status_id: 1,
          },
        };

        renderWithProviders(<EditModeIssueBlock {...props} />);

        const statusSelect = screen.getByTestId('status-select');

        expect(statusSelect.children).toHaveLength(3);
        expect(
          screen.getByRole('option', { name: 'Recovered' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('option', { name: 'Under Treatment' })
        ).toBeInTheDocument();
        expect(
          screen.queryByRole('option', { name: 'Active' })
        ).not.toBeInTheDocument();
      });

      it('should not filter out resolved status for injuries with status_id null', () => {
        mockGetDefaultStatusId.mockReturnValue(null);
        mockGetStatusOptions.mockReturnValue([
          { value: 1, label: 'Active' },
          { value: 2, label: 'Recovered' },
          { value: 3, label: 'Under Treatment' },
        ]);

        const props = {
          ...defaultProps,
          openIssue: {
            ...defaultProps.openIssue,
            status_id: null, // Preliminary injury
          },
          injuryStatuses: [
            {
              id: 1,
              injury_status_system_id: 1,
              description: 'Active',
              order: 1,
              color: '#ff0000',
              cause_unavailability: true,
              restore_availability: false,
              is_resolver: false,
            },
            {
              id: 2,
              injury_status_system_id: 2,
              description: 'Recovered',
              order: 2,
              color: '#00ff00',
              cause_unavailability: false,
              restore_availability: true,
              is_resolver: true, // This is the resolved status
            },
            {
              id: 3,
              injury_status_system_id: 3,
              description: 'Under Treatment',
              order: 3,
              color: '#0000ff',
              cause_unavailability: true,
              restore_availability: false,
              is_resolver: false,
            },
          ],
        };

        renderWithProviders(<EditModeIssueBlock {...props} />);

        const statusSelect = screen.getByTestId('status-select');

        expect(statusSelect.children).toHaveLength(4);
        expect(
          screen.getByRole('option', { name: 'Active' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('option', { name: 'Under Treatment' })
        ).toBeInTheDocument();
        expect(
          screen.queryByRole('option', { name: 'Recovered' })
        ).toBeInTheDocument();
      });

      it('should allow non resolved status for preliminary injuries', () => {
        mockGetDefaultStatusId.mockReturnValue(null);
        mockGetStatusOptions.mockReturnValue([
          { value: 1, label: 'Active' },
          { value: 2, label: 'Under Treatment' },
        ]);

        const props = {
          ...defaultProps,
          openIssue: {
            ...defaultProps.openIssue,
            status_id: null,
            preliminary_status_complete: true,
          },
          injuryStatuses: [
            {
              id: 1,
              injury_status_system_id: 1,
              description: 'Active',
              order: 1,
              color: '#ff0000',
              cause_unavailability: true,
              restore_availability: false,
              is_resolver: false,
            },
            {
              id: 2,
              injury_status_system_id: 2,
              description: 'Under Treatment',
              order: 2,
              color: '#0000ff',
              cause_unavailability: true,
              restore_availability: false,
              is_resolver: false,
            },
          ],
        };

        renderWithProviders(<EditModeIssueBlock {...props} />);

        const statusSelect = screen.getByTestId('status-select');

        expect(statusSelect.children).toHaveLength(3);
        expect(
          screen.getByRole('option', { name: 'Active' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('option', { name: 'Under Treatment' })
        ).toBeInTheDocument();
      });
      it('should show all options when no current status and not preliminary', () => {
        mockGetDefaultStatusId.mockReturnValue(null);
        mockGetStatusOptions.mockReturnValue([
          { value: 1, label: 'Active' },
          { value: 2, label: 'Recovered' },
        ]);

        const props = {
          ...defaultProps,
          openIssue: {
            ...defaultProps.openIssue,
            status_id: 3,
          },
        };

        renderWithProviders(<EditModeIssueBlock {...props} />);

        const statusSelect = screen.getByTestId('status-select');

        expect(statusSelect.children).toHaveLength(3);
        expect(
          screen.getByRole('option', { name: 'Active' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('option', { name: 'Recovered' })
        ).toBeInTheDocument();
      });

      it('should not allow resolved status when preliminary_status_complete is false', () => {
        mockGetDefaultStatusId.mockReturnValue(null);
        mockGetStatusOptions.mockReturnValue([
          { value: 1, label: 'Active' },
          { value: 2, label: 'Resolved' },
        ]);

        const props = {
          ...defaultProps,
          openIssue: {
            ...defaultProps.openIssue,
            status_id: null,
            preliminary_status_complete: false,
          },
          injuryStatuses: [
            {
              id: 1,
              injury_status_system_id: 1,
              description: 'Active',
              order: 1,
              color: '#ff0000',
              cause_unavailability: true,
              restore_availability: false,
              is_resolver: false,
            },
            {
              id: 2,
              injury_status_system_id: 2,
              description: 'Resolved',
              order: 2,
              color: '#00ff00',
              cause_unavailability: false,
              restore_availability: true,
              is_resolver: true,
            },
          ],
        };

        renderWithProviders(<EditModeIssueBlock {...props} />);

        const statusSelect = screen.getByTestId('status-select');

        expect(statusSelect.children).toHaveLength(2);
        expect(
          screen.getByRole('option', { name: 'Active' })
        ).toBeInTheDocument();
        expect(
          screen.queryByRole('option', { name: 'Resolved' })
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('validation error display', () => {
    it('should display date validation error message', () => {
      const dateValidationErrors = { 1: 'Date is required' };

      const props = {
        ...defaultProps,
        dateValidationErrors,
      };

      renderWithProviders(<EditModeIssueBlock {...props} />);

      expect(screen.getByText('Date is required')).toBeInTheDocument();
    });

    it('should not display error message when no validation error', () => {
      const dateValidationErrors = {};

      const props = {
        ...defaultProps,
        dateValidationErrors,
      };

      renderWithProviders(<EditModeIssueBlock {...props} />);

      expect(screen.queryByText('Date is required')).not.toBeInTheDocument();
    });
  });

  describe('preliminary issue handling', () => {
    it('should display lock message for preliminary issues', () => {
      const props = {
        ...defaultProps,
        isInjuryLockedToOccurrenceDate: true,
      };

      renderWithProviders(<EditModeIssueBlock {...props} />);

      expect(
        screen.getByText('Date locked to injury occurrence')
      ).toBeInTheDocument();
    });

    it('should not display lock message for non-preliminary issues', () => {
      renderWithProviders(<EditModeIssueBlock {...defaultProps} />);

      expect(
        screen.queryByText('Date locked to injury occurrence')
      ).not.toBeInTheDocument();
    });
  });
});
