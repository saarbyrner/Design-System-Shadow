import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { Dropdown } from '@kitman/components';
import groupByOptions from '@kitman/common/src/utils/groupByOptions';
import GroupSelector from '../../containers/GroupSelector';

// Mock the Dropdown component to test props
jest.mock('@kitman/components', () => ({
  Dropdown: jest.fn(({ items, value, label }) => (
    <div data-testid="dropdown">
      <div data-testid="dropdown-label">{label}</div>
      <div data-testid="dropdown-value">{value}</div>
      <div data-testid="dropdown-items">{JSON.stringify(items)}</div>
    </div>
  )),
}));

// Mock the groupByOptions utility
jest.mock('@kitman/common/src/utils/groupByOptions');

// Mock i18n
jest.mock('@kitman/common/src/utils/i18n', () => ({
  t: (key) => key,
}));

describe('GroupSelector', () => {
  const groupBy = 'availability';
  const mockGroupByOptions = [
    { value: 'availability', label: 'Availability' },
    { value: 'position', label: 'Position' },
  ];

  const preloadedState = {
    athletes: {
      groupBy,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    groupByOptions.mockReturnValue(mockGroupByOptions);
  });

  it('renders', () => {
    renderWithRedux(<GroupSelector />, {
      preloadedState,
      useGlobalStore: false,
    });

    // Verify the component renders
    expect(screen.getByTestId('dropdown')).toBeInTheDocument();
  });

  it('sets props correctly', () => {
    renderWithRedux(<GroupSelector />, {
      preloadedState,
      useGlobalStore: false,
    });

    // Verify the props are passed correctly to Dropdown
    expect(screen.getByTestId('dropdown-label')).toHaveTextContent('Group By');
    expect(screen.getByTestId('dropdown-value')).toHaveTextContent(groupBy);
    expect(screen.getByTestId('dropdown-items')).toHaveTextContent(
      JSON.stringify(mockGroupByOptions)
    );

    // Verify the mock was called with the expected props
    expect(Dropdown).toHaveBeenCalledWith(
      expect.objectContaining({
        items: mockGroupByOptions,
        value: 'availability',
        label: 'Group By',
      }),
      {}
    );
  });
});
