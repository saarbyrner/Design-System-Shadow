import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as services from '@kitman/modules/src/analysis/Dashboard/redux/services/medical';
import { BooleanFilter, withSelectFilter } from '../FilterDefinitions';

jest.mock('@kitman/modules/src/analysis/Dashboard/redux/services/medical');

const MOCK_RETURN_VALUE = {
  data: [
    { id: 1, name: 'Option 1', activities: [{ id: 1, name: 'Activity' }] },
    {
      id: 2,
      name: 'Option 2',
      activities: [{ id: 1, name: 'Activity 2' }],
    },
  ],
  isFetching: false,
  isLoading: false,
  isSuccess: true,
};

describe('withSelectFilter HOC', () => {
  const defaultProps = {
    label: 'Classification',
    value: undefined,
    queryArgs: [],
    onChange: jest.fn(),
    onClickRemove: jest.fn(),
  };

  const mockDataProcessor = jest.fn((data) =>
    data.map(({ id, name }) => ({
      label: name,
      value: id,
    }))
  );

  const TestComponent = withSelectFilter({
    useQuery: services.useGetActivityGroupsQuery,
    dataProcessor: mockDataProcessor,
  });

  beforeEach(() => {
    jest.clearAllMocks();

    services.useGetActivityGroupsQuery.mockReturnValue(MOCK_RETURN_VALUE);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('calls useQuery with correct arguments', () => {
    render(<TestComponent {...defaultProps} />);

    expect(services.useGetActivityGroupsQuery).toHaveBeenCalledWith(
      ...defaultProps.queryArgs
    );
  });

  it('processes data correctly with dataProcessor', () => {
    render(<TestComponent {...defaultProps} />);

    expect(mockDataProcessor).toHaveBeenCalledTimes(1);
    expect(mockDataProcessor).toHaveBeenCalledWith(MOCK_RETURN_VALUE.data);
  });

  it('passes correct props to SelectFilter', () => {
    render(<TestComponent {...defaultProps} />);

    expect(screen.getByText(defaultProps.label)).toBeVisible();
    expect(screen.getByLabelText('Option 1')).toBeVisible();
    expect(screen.getByLabelText('Option 2')).toBeVisible();
  });
});

describe('<BooleanFilter>', () => {
  const defaultProps = {
    label: 'Recurrence',
    onChange: jest.fn(),
    onClickRemove: jest.fn(),
    options: [
      { label: 'New Injury', value: false },
      { label: 'Recurrence', value: true },
    ],
  };

  it('renders with the correct label', () => {
    render(<BooleanFilter {...defaultProps} />);

    expect(screen.getByLabelText(defaultProps.label)).toBeVisible();
  });

  it('displays the correct options', () => {
    render(<BooleanFilter {...defaultProps} />);

    expect(screen.getByLabelText('Recurrence')).toBeVisible();
    expect(screen.getByLabelText('New Injury')).toBeVisible();
  });

  it('handles value change correctly with handleChange', async () => {
    const user = userEvent.setup();
    render(<BooleanFilter {...defaultProps} />);

    const newInjury = screen.getByText('New Injury');
    await user.click(newInjury);

    expect(defaultProps.onChange).toHaveBeenCalledWith(false);
  });

  it('filters out null values from passed value', () => {
    const modifiedProps = { ...defaultProps, value: null };
    render(<BooleanFilter {...modifiedProps} />);

    const selectFilter = screen.getByLabelText('Recurrence');
    expect(selectFilter).not.toHaveValue('value', null);
  });
});
