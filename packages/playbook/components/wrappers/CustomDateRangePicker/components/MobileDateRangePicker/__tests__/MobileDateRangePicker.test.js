import { render, screen } from '@testing-library/react';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterMoment } from '@mui/x-date-pickers-pro/AdapterMoment';
import moment from 'moment';
import userEvent from '@testing-library/user-event';
import MobileDateRangePicker from '../index';

// Mock i18n
jest.mock('@kitman/common/src/utils/i18n', () => ({
  t: (key) => key,
}));

describe('MobileDateRangePicker', () => {
  const defaultProps = {
    mobileStep: 'start',
    setMobileStep: jest.fn(),
    setCurrentView: jest.fn(),
    dateRange: [moment('2025-01-01'), moment('2025-01-07')],
    handleMobileDateChange: jest.fn(),
    disableFuture: false,
    disablePast: false,
    minDate: null,
    maxDate: null,
    selectedFilter: null,
    handleQuickSelect: jest.fn(),
    defaultPrimary: '#000000',
    defaultContrastText: '#FFFFFF',
    filters: [],
  };

  const renderComponent = (props = {}) => {
    return render(
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <MobileDateRangePicker {...defaultProps} {...props} />
      </LocalizationProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the start date picker when mobileStep is "start"', () => {
    renderComponent();
    expect(screen.getByText('Start date')).toBeInTheDocument();
    expect(screen.getByLabelText(/calendar view/i)).toBeInTheDocument();
  });

  it('renders the end date picker when mobileStep is "end"', () => {
    renderComponent({ mobileStep: 'end' });
    expect(screen.getByText('End date')).toBeInTheDocument();
    expect(screen.getByLabelText(/calendar view/i)).toBeInTheDocument();
  });

  it('calls setMobileStep when the back button is clicked in the end step', async () => {
    const user = userEvent.setup();
    renderComponent({ mobileStep: 'end' });

    // Instead of searching by role/name, find the icon by data-testid
    const chevronIcon = screen.getByTestId('ChevronLeftIcon');
    const backButton = chevronIcon.closest('button');
    expect(backButton).toBeInTheDocument();

    await user.click(backButton);
    expect(defaultProps.setMobileStep).toHaveBeenCalledWith('start');
  });
});
