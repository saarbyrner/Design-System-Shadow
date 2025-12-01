import { render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { dateRangeTimePeriods } from '@kitman/common/src/utils/status_utils';
import TimePeriod from '..';

const mockDropdown = jest.fn();
const mockDateRangePicker = jest.fn();
const mockLastXPeriodPicker = jest.fn();

jest.mock('@kitman/components', () => ({
  DateRangePicker: jest.fn((props) => {
    mockDateRangePicker(props);
    return <div data-testid="date-range-picker" />;
  }),
  Dropdown: jest.fn((props) => {
    mockDropdown(props);
    return <div data-testid="dropdown" />;
  }),
  LastXPeriodPicker: jest.fn((props) => {
    mockLastXPeriodPicker(props);
    return <div data-testid="last-x-period-picker" />;
  }),
}));

describe('Graph Composer <TimePeriod /> component', () => {
  const props = {
    disableTimePeriod: false,
    updateTimePeriod: jest.fn(),
    updateDateRange: jest.fn(),
    onUpdateTimePeriodLength: jest.fn(),
    t: i18nextTranslateStub(),
    turnaroundList: [],
    dateRange: { startDate: null, endDate: null },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    const { container } = render(<TimePeriod {...props} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('contains a date range picker', () => {
    render(<TimePeriod {...props} />);

    expect(mockDropdown).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'Date Range',
        items: dateRangeTimePeriods(),
        disabled: false,
        value: '',
      })
    );
  });

  describe('When disableTimePeriod is true', () => {
    it('disables the time picker dropdown and ignore the validation', () => {
      render(<TimePeriod {...props} disableTimePeriod />);

      expect(mockDropdown).toHaveBeenCalledWith(
        expect.objectContaining({
          disabled: true,
          ignoreValidation: true,
        })
      );
    });
  });

  describe('When disableTimePeriod is false and don\t ignore the validation', () => {
    it('enables the time picker dropdown', () => {
      render(<TimePeriod {...props} disableTimePeriod={false} />);

      expect(mockDropdown).toHaveBeenCalledWith(
        expect.objectContaining({
          disabled: false,
          ignoreValidation: false,
        })
      );
    });
  });

  describe('When timePeriod is custom_date_range', () => {
    it('contains a daterange picker', () => {
      render(<TimePeriod {...props} timePeriod="custom_date_range" />);
      expect(mockDateRangePicker).toHaveBeenCalled();
    });
  });

  describe('When timePeriod is not custom_date_range', () => {
    it('doesnt contain a daterange picker', () => {
      render(<TimePeriod {...props} timePeriod="not_custom_date_range" />);
      expect(mockDateRangePicker).not.toHaveBeenCalled();
    });
  });

  it('renders a date range picker when time period is custom_date_range', () => {
    render(<TimePeriod {...props} timePeriod="custom_date_range" />);
    expect(mockDateRangePicker).toHaveBeenCalled();
  });

  it('does not render a date range picker when time period is last_x_days', () => {
    render(<TimePeriod {...props} timePeriod="last_x_days" />);
    expect(mockDateRangePicker).not.toHaveBeenCalled();
  });

  it('renders a last x days picker when time period is last_x_days', () => {
    render(<TimePeriod {...props} timePeriod="last_x_days" />);
    expect(mockLastXPeriodPicker).toHaveBeenCalled();
  });

  it('calls the correct callback when the time period length is changed', () => {
    render(<TimePeriod {...props} timePeriod="last_x_days" />);

    const lastXPeriodPickerProps = mockLastXPeriodPicker.mock.calls[0][0];
    lastXPeriodPickerProps.onPeriodLengthChange(3);

    expect(props.onUpdateTimePeriodLength).toHaveBeenCalledWith(3);
  });

  it('disables the last x period picker when the metric is not the first one', () => {
    render(<TimePeriod {...props} timePeriod="last_x_days" metricIndex={1} />);

    expect(mockLastXPeriodPicker).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true,
      })
    );
  });

  it('excludes rolling period of the dropdown if excludeRollingPeriod is true', () => {
    render(
      <TimePeriod
        {...props}
        excludeRollingPeriod
        metricIndex={1}
        overlayIndex={0}
      />
    );

    expect(mockDropdown).toHaveBeenCalledWith(
      expect.objectContaining({
        items: [
          {
            id: 'today',
            title: 'Today',
          },
          {
            id: 'yesterday',
            title: 'Yesterday',
          },
          {
            id: 'this_week',
            title: 'This Week',
          },
          {
            id: 'last_week',
            title: 'Last Week',
          },
          {
            id: 'this_season_so_far',
            title: 'This Season So Far',
          },
          {
            id: 'this_season',
            title: 'This Season',
          },
          {
            id: 'this_pre_season',
            title: 'This Pre-season',
          },
          {
            id: 'this_in_season',
            title: 'This In-season',
          },
          {
            id: 'custom_date_range',
            title: 'Custom Date Range',
          },
        ],
      })
    );
  });
});
