import { screen, fireEvent } from '@testing-library/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { renderWithUserEventSetup } from '@kitman/common/src/utils/test_utils';
import ExportSettings from '@kitman/modules/src/Medical/shared/components/ExportSettings';

const mockInputDateRange = '06/04/2024 – 14/04/2024';
const mockOutputDateRange = [
  '2024-04-06T00:00:00+00:00',
  '2024-04-14T00:00:00+00:00',
];

const clickDownload = (user) =>
  user.click(screen.getByRole('button', { name: 'Download' }));

const expectFormState = (onSaveMock, formState) =>
  expect(onSaveMock).toHaveBeenCalledWith(
    formState,
    expect.anything() // will test updateStatus callback down the line
  );

const mockOnSave = jest.fn();

const defaultProps = {
  fieldKey: 'dateRange',
  label: 'Date range',
  isCached: false,
};

const renderComponent = (props = defaultProps, settingsKey = null) =>
  renderWithUserEventSetup(
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
      <ExportSettings
        mui
        title="My Settings"
        onSave={mockOnSave}
        onCancel={() => {}}
        isOpen
        settingsKey={settingsKey}
      >
        <ExportSettings.CommonFields.Mui.DateRangePicker {...props} />
      </ExportSettings>
    </LocalizationProvider>
  );

describe('<DateRangePicker />', () => {
  it('renders a date picker with a label', () => {
    renderComponent();
    expect(screen.getByLabelText(defaultProps.label)).toBeInTheDocument();
  });

  it('can select a date range and store it in the form state', async () => {
    expect.hasAssertions();

    const { user } = renderComponent();

    const dateRangePicker = screen.getByLabelText('Date range');

    expect(dateRangePicker).toBeInTheDocument();

    fireEvent.change(dateRangePicker, {
      target: { value: mockInputDateRange },
    });

    await clickDownload(user);

    expectFormState(mockOnSave, {
      dateRange: mockOutputDateRange,
    });
  });

  it('supports caching', async () => {
    expect.hasAssertions();

    const settingsKey = 'CommonFields.DateRangePicker|Cache';

    const { user, ...component } = renderComponent(
      {
        ...defaultProps,
        isCached: true,
      },
      settingsKey
    );

    const datePicker = screen.getByRole('textbox');

    fireEvent.change(datePicker, {
      target: { value: mockInputDateRange },
    });

    await clickDownload(user);

    expectFormState(mockOnSave, {
      dateRange: mockOutputDateRange,
    });

    // Unmounting component to make sure state is clean
    mockOnSave.mockClear();
    component.unmount();

    renderComponent({ ...defaultProps, isCached: true }, settingsKey);

    await clickDownload(user);

    expectFormState(mockOnSave, {
      dateRange: mockOutputDateRange,
    });
  });
});
