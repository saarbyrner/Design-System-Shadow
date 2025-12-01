import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import moment from 'moment-timezone';
import {
  i18nextTranslateStub,
  TestProviders,
} from '@kitman/common/src/utils/test_utils';

import { useGetAncillaryEligibleRangesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AncillaryRangeSidePanel from '..';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  medicalSharedApi: {
    useGetAncillaryEligibleRangesQuery: jest.fn(),
  },
});

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medicalShared');

describe('<AncillaryRangeSidePanel />', () => {
  const onAncillaryRangeDataMock = jest.fn();
  const mockProps = {
    isOpen: true,
    athleteId: 123,
    onClose: jest.fn(),
    onAncillaryRangeData: onAncillaryRangeDataMock,
    t: i18nextTranslateStub(),
    athleteData: {
      fullname: 'Alysson Bauch',
      organisation_transfer_records: [{ joined_at: '2023-04-01' }],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useGetAncillaryEligibleRangesQuery.mockReturnValue({
      data: { eligible_ranges: [{ start: '2023-01-01', end: '2024-12-31' }] },
    });
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  it('renders the Ancillary Range Side Panel', async () => {
    render(
      <TestProviders store={store}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <AncillaryRangeSidePanel {...mockProps} />
        </LocalizationProvider>
      </TestProviders>
    );

    await screen.findByText('Ancillary Range');

    expect(
      screen.getByTestId('AncillaryRangePanel|MovementTypeSelector')
    ).toBeInTheDocument();
  });

  it('disables the Add button when required fields are not filled', async () => {
    render(
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <AncillaryRangeSidePanel {...mockProps} />
      </LocalizationProvider>
    );

    const addButton = screen.getByText('Add');
    expect(addButton.closest('button')).toBeDisabled();
  });

  it('enables the Add button when all required fields are filled', async () => {
    const user = userEvent.setup();

    render(
      <TestProviders store={store}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <AncillaryRangeSidePanel {...mockProps} />
        </LocalizationProvider>
      </TestProviders>
    );

    const typeDropdown = screen.getByLabelText('Type');
    await user.click(typeDropdown);

    expect(
      screen.getByRole('option', { name: 'Continuation of Care' })
    ).toBeInTheDocument();
    const tryOutOption = screen.getByRole('option', { name: 'Try-Out' });
    await user.click(tryOutOption);

    const dateRangePicker = screen.getByPlaceholderText(
      'MM/DD/YYYY – MM/DD/YYYY'
    );

    await waitFor(() => {
      expect(dateRangePicker).toBeEnabled();
    });
    await user.type(dateRangePicker, '06/01/2024 – 06/07/2024');
    await user.tab();

    const addButton = screen.getByText('Add').closest('button');
    expect(addButton).toBeEnabled();
    await user.click(addButton);

    // Dialog appears
    const dialogs = screen.getAllByRole('presentation');

    expect(
      within(dialogs[0]).getByRole('heading', {
        name: 'Confirmation',
        level: 2,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText('Alysson Bauch to Try-Out from 06/01/2024 - 06/07/2024')
    ).toBeInTheDocument();

    const confirmButton = screen.getByRole('button', { name: 'Confirm' });
    await user.click(confirmButton);
    expect(onAncillaryRangeDataMock).toHaveBeenCalledWith({
      end_date: '2024-06-07',
      movementType: 'tryout',
      start_date: '2024-06-01',
    });
  });

  describe('Date range exception message', () => {
    it('shows a warning when selected range contains disabled days', async () => {
      const user = userEvent.setup();

      const mockDateRangeValue = '06/10/2022 – 06/20/2022';
      render(
        <TestProviders store={store}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <AncillaryRangeSidePanel {...mockProps} />
          </LocalizationProvider>
        </TestProviders>
      );

      const typeDropdown = screen.getByLabelText('Type');
      await user.click(typeDropdown);

      const tryOutOption = screen.getByRole('option', { name: 'Try-Out' });
      await user.click(tryOutOption);

      const dateRangePicker = screen.getByPlaceholderText(
        'MM/DD/YYYY – MM/DD/YYYY'
      );

      await waitFor(() => {
        expect(dateRangePicker).toBeEnabled();
      });

      fireEvent.mouseDown(dateRangePicker);
      fireEvent.change(dateRangePicker, {
        target: { value: mockDateRangeValue },
      });
      fireEvent.click(dateRangePicker);

      const warning = await screen.findByText(
        'The selected range contains disabled dates. Please try again'
      );

      expect(warning).toBeInTheDocument();
    });

    it('sets the date range when the selected range does not contain disabled days', async () => {
      const user = userEvent.setup();
      const mockDateRangeValue = '06/01/2024 – 06/07/2024';

      render(
        <TestProviders store={store}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <AncillaryRangeSidePanel {...mockProps} />
          </LocalizationProvider>
        </TestProviders>
      );

      const typeDropdown = screen.getByLabelText('Type');
      await user.click(typeDropdown);

      const tryOutOption = screen.getByRole('option', { name: 'Try-Out' });
      await user.click(tryOutOption);

      const dateRangePicker = screen.getByPlaceholderText(
        'MM/DD/YYYY – MM/DD/YYYY'
      );

      await waitFor(() => {
        expect(dateRangePicker).toBeEnabled();
      });
      fireEvent.change(dateRangePicker, {
        target: { value: mockDateRangeValue },
      });
      await userEvent.tab();

      expect(dateRangePicker).toHaveValue(mockDateRangeValue);
      expect(
        screen.queryByText(
          'The selected range contains disabled dates. Please try again'
        )
      ).not.toBeInTheDocument();

      const addButton = screen.getByText('Add');
      expect(addButton.closest('button')).toBeEnabled();
    });
  });
});
