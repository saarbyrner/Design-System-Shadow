import { render, screen, fireEvent } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { mockSearchValue } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import Search from '@kitman/modules/src/ElectronicFiles/shared/components/Filters/Search';

const mockOnChange = jest.fn();

const props = {
  value: '',
  onChange: mockOnChange,
  t: i18nextTranslateStub(),
};

const renderComponent = () => render(<Search {...props} />);

describe('<Search />', () => {
  it('renders correctly', () => {
    renderComponent();

    expect(screen.getByLabelText('Search')).toBeInTheDocument();
  });

  it('calls dispatch when value changes', () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText('Search'), {
      target: { value: mockSearchValue },
    });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(mockSearchValue);
  });
});
