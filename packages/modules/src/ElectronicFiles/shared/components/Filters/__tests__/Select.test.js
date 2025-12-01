import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  mockSelectOptions,
  mockSelectValue,
} from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import Select from '@kitman/modules/src/ElectronicFiles/shared/components/Filters/Select';

const mockOnChange = jest.fn();

const props = {
  label: 'Status',
  value: null,
  onChange: mockOnChange,
  options: mockSelectOptions,
  t: i18nextTranslateStub(),
};

const renderComponent = () => render(<Select {...props} />);

describe('<Select />', () => {
  it('renders correctly', () => {
    renderComponent();

    expect(screen.getByLabelText('Status')).toBeInTheDocument();
  });

  it('calls dispatch when value changes', async () => {
    const user = userEvent.setup();

    renderComponent();

    const statusFilter = screen.getByLabelText('Status');

    await user.click(statusFilter);

    const option2 = screen.getByText(mockSelectValue);

    expect(option2).toBeInTheDocument();

    await user.click(option2);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(mockSelectOptions[1]);
  });
});
