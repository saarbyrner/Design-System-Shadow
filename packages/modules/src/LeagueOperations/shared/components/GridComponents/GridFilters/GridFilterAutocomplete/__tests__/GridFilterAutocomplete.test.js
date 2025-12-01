import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GridFilterAutocomplete from '..';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationStatusesApi'
);

jest.mock('@kitman/common/src/utils/i18n', () => ({
  t: (key) => key,
}));

const mockOptions = [
  { id: 1, name: 'Available' },
  { id: 2, name: 'Suspended' },
];

const mockUseOptionsQuery = jest.fn(() => ({
  data: mockOptions,
}));

describe('GridFilterAutocomplete', () => {
  const defaultProps = {
    param: 'discipline_status',
    defaultValue: '',
    value: '',
    label: 'Status',
    placeholder: 'Status',
    onChange: jest.fn(),
    useOptionsQuery: mockUseOptionsQuery,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Autocomplete with options', () => {
    render(<GridFilterAutocomplete {...defaultProps} />);
    const input = screen.getByPlaceholderText('Status');
    expect(input).toBeInTheDocument();
  });

  it('calls onChange with selected option', async () => {
    render(<GridFilterAutocomplete {...defaultProps} />);
    const input = screen.getByPlaceholderText('Status');

    fireEvent.mouseDown(input); // open dropdown
    const option = await screen.findByText('Suspended');
    fireEvent.click(option);

    await waitFor(() => {
      expect(defaultProps.onChange).toHaveBeenCalledWith({
        id: 2,
        name: 'Suspended',
      });
    });
  });

  it('calls onChange with defaultValue when cleared', async () => {
    render(<GridFilterAutocomplete {...defaultProps} value={2} />);
    const input = screen.getByPlaceholderText('Status');

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(defaultProps.onChange).toHaveBeenCalledWith('');
    });
  });

  it('getResetValue returns correct default', () => {
    const ref = React.createRef();
    render(<GridFilterAutocomplete {...defaultProps} ref={ref} />);
    expect(ref.current.getResetValue()).toEqual('');
  });

  it('getParm returns correct id', () => {
    const ref = React.createRef();
    render(<GridFilterAutocomplete {...defaultProps} ref={ref} />);
    expect(ref.current.getParam()).toBe('discipline_status');
  });

  it('getIsFilterApplied returns false when value is not set', () => {
    const ref = React.createRef();
    render(<GridFilterAutocomplete {...defaultProps} ref={ref} />);
    expect(ref.current.getIsFilterApplied()).toBe(false);
  });

  it('getIsFilterApplied returns true when value is set', () => {
    const ref = React.createRef();
    const localProps = {
      ...defaultProps,
      value: 1,
    };
    render(<GridFilterAutocomplete {...localProps} ref={ref} />);
    expect(ref.current.getIsFilterApplied()).toBe(true);
  });

  it('renders the override options when passed in', async () => {
    const ref = React.createRef();
    const localOptions = [
      { id: 1, name: 'Local option 1' },
      { id: 2, name: 'Local option 2' },
    ];
    const props = {
      param: 'localOption',
      defaultValue: '',
      value: '',
      label: 'Local options',
      placeholder: 'Local options',
      optionsOverride: localOptions,
      onChange: jest.fn(),
    };
    render(<GridFilterAutocomplete {...props} ref={ref} />);
    const input = screen.getByPlaceholderText('Local options');
    fireEvent.mouseDown(input);
    const overrideOption = await screen.findByText('Local option 1');
    expect(overrideOption).toBeInTheDocument();
  });
});
