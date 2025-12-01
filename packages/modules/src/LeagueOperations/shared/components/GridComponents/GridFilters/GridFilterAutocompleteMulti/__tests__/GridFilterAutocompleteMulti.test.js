import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GridFilterAutocomplete from '..';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationStatusesApi'
);

jest.mock('@kitman/common/src/utils/i18n', () => ({
  t: (key) => key,
}));

const mockOptions = [
  { id: 1, name: 'Manchester United' },
  { id: 2, name: 'Arsenal' },
  { id: 3, name: 'Liverpool' },
  { id: 4, name: 'Chelsea' },
];

const mockUseOptionsQuery = jest.fn(() => ({
  data: mockOptions,
}));

describe('GridFilterAutocompleteMulti', () => {
  const defaultProps = {
    param: 'organisation_ids',
    defaultValue: [],
    value: [],
    label: 'Club',
    placeholder: 'Club',
    onChange: jest.fn(),
    useOptionsQuery: mockUseOptionsQuery,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders AutocompleteMulti with options', () => {
    render(<GridFilterAutocomplete {...defaultProps} />);
    const input = screen.getByPlaceholderText('Club');
    expect(input).toBeInTheDocument();
  });

  it('calls onChange with selected option', async () => {
    render(<GridFilterAutocomplete {...defaultProps} />);
    const input = screen.getByPlaceholderText('Club');

    fireEvent.mouseDown(input); // open dropdown
    const option = await screen.findByText('Manchester United');
    fireEvent.click(option);

    await waitFor(() => {
      expect(defaultProps.onChange).toHaveBeenCalledWith([
        { id: 1, name: 'Manchester United' },
      ]);
    });
  });

  it('calls onChange with multiple options', async () => {
    const props = {
      ...defaultProps,
      value: [1],
    };
    render(<GridFilterAutocomplete {...props} />);
    const input = screen.getByPlaceholderText('Club');

    fireEvent.mouseDown(input); // open dropdown
    const option = await screen.findByText('Arsenal');
    fireEvent.click(option);

    await waitFor(() => {
      expect(defaultProps.onChange).toHaveBeenCalledWith([
        { id: 1, name: 'Manchester United' },
        { id: 2, name: 'Arsenal' },
      ]);
    });
  });

  it('lists values of dropdown as a comma separated list', () => {
    const props = {
      ...defaultProps,
      value: [1, 2],
    };
    render(<GridFilterAutocomplete {...props} />);
    const input = screen.getByPlaceholderText('Club');
    expect(input).toHaveValue('Manchester United, Arsenal');
  });
});
