import { screen, waitFor, fireEvent } from '@testing-library/react';

import { renderWithUserEventSetup } from '@kitman/common/src/utils/test_utils';

import DataSourcePanel from '../index';

describe('Risk Advisor <DataSourcePanel /> component', () => {
  const mockToggleDataSourcePanel = jest.fn();
  const mockOnSaveDataSources = jest.fn();
  const mockT = (key) => key;

  const defaultProps = {
    isOpen: true,
    requestStatus: 'SUCCESS',
    dataSources: {
      catapult: 'Catapult',
      kitman: 'Kitman',
    },
    excludedSources: [],
    toggleDataSourcePanel: mockToggleDataSourcePanel,
    onSaveDataSources: mockOnSaveDataSources,
    t: mockT,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    renderWithUserEventSetup(<DataSourcePanel {...defaultProps} />);

    expect(screen.getByText('Edit data sources')).toBeInTheDocument();
  });

  describe('when loading the initial data', () => {
    it('renders a loader', () => {
      renderWithUserEventSetup(
        <DataSourcePanel {...defaultProps} requestStatus="PENDING" />
      );

      expect(screen.getByTestId('DelayedLoadingFeedback')).toBeInTheDocument();
    });
  });

  it('updates the variable with the excluded sources', async () => {
    const { user } = renderWithUserEventSetup(
      <DataSourcePanel {...defaultProps} />
    );

    // Find the Kitman checkbox and uncheck it
    const kitmanCheckbox = screen.getByRole('checkbox', { name: 'Kitman' });
    await user.click(kitmanCheckbox);

    // Click the Save button
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    expect(mockOnSaveDataSources).toHaveBeenCalledWith(['kitman']);
    expect(mockOnSaveDataSources).toHaveBeenCalledTimes(1);
  });

  it('disables the save button when no source is selected to include', () => {
    renderWithUserEventSetup(
      <DataSourcePanel
        {...defaultProps}
        excludedSources={['kitman', 'catapult']}
      />
    );

    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeDisabled();
  });

  it('filters the data source options', async () => {
    renderWithUserEventSetup(<DataSourcePanel {...defaultProps} />);

    // Find the search input and type 'ca'
    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'ca' } });

    // Wait for filtering to occur and check that only Catapult checkbox is visible
    await waitFor(() => {
      expect(
        screen.getByRole('checkbox', { name: 'Catapult' })
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByRole('checkbox', { name: 'Kitman' })
    ).not.toBeInTheDocument();
  });
});
