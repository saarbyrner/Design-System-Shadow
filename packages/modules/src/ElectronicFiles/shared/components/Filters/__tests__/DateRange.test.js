import { render, screen, fireEvent } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { mockDateRangeValue } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DateRange from '@kitman/modules/src/ElectronicFiles/shared/components/Filters/DateRange';

const mockOnChange = jest.fn();

const props = {
  value: [null, null],
  onChange: mockOnChange,
  t: i18nextTranslateStub(),
};

const renderComponent = () =>
  render(
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DateRange {...props} />
    </LocalizationProvider>
  );

describe('<DateRange />', () => {
  it('renders correctly', () => {
    renderComponent();

    expect(screen.getByLabelText('Date range')).toBeInTheDocument();
  });

  it('calls dispatch when value changes', async () => {
    renderComponent();

    const input = screen.getByLabelText('Date range');

    fireEvent.change(input, {
      target: { value: mockDateRangeValue },
    });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue(mockDateRangeValue);
  });
});
