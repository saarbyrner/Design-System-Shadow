import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { GRID_ROW_FIELD_KEYS as FIELD_KEYS } from '@kitman/components/src/DocumentSplitter/src/shared/consts';
import useAthletesIssues from '@kitman/modules/src/Medical/shared/hooks/useAthletesIssues';
import IssuesCell from '../IssuesCell';

// Set up i18n for translations
setI18n(i18n);

// Mock the useAthletesIssues hook
jest.mock('@kitman/modules/src/Medical/shared/hooks/useAthletesIssues');

describe('IssuesCell', () => {
  let user;
  let mockOnUpdateRowCallback;
  let mockParams;

  const mockIssueOptions = [
    {
      id: 1,
      label: 'Nov 09, 2024 - Issue A',
      type: 'Injury',
      group: 'Open injury/illness',
    },
    {
      id: 2,
      label: 'Nov 10, 2024 - Issue B',
      type: 'Illness',
      group: 'Open injury/illness',
    },
    {
      id: 3,
      label: 'Nov 11, 2024 - Issue C',
      type: 'ChronicInjury',
      group: 'Chronic conditions',
    },
  ];

  beforeEach(() => {
    user = userEvent.setup();
    mockOnUpdateRowCallback = jest.fn();
    mockParams = {
      id: 'row1',
      row: {
        player: { id: 'player123' },
        associatedIssues: [],
      },
    };

    // Default mock implementation for useAthletesIssues
    useAthletesIssues.mockReturnValue({
      issueOptions: mockIssueOptions,
      requestStatus: 'SUCCESS',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls onUpdateRowCallback with expected values upon clicking an option in the autocomplete dropdown', async () => {
    render(
      <IssuesCell
        params={mockParams}
        onUpdateRowCallback={mockOnUpdateRowCallback}
      />
    );

    // The useEffect in IssuesCell will call onUpdateRowCallback on initial render
    // We need to wait for this initial call to complete and then clear the mock
    // so we can test the onChange callback specifically.
    await waitFor(() => {
      expect(mockOnUpdateRowCallback).toHaveBeenCalledWith({
        rowId: 'row1',
        data: { [FIELD_KEYS.associatedIssues]: [] },
      });
    });
    mockOnUpdateRowCallback.mockClear();

    // Find the Autocomplete input by its label
    const autocompleteInputs = screen.getAllByLabelText('Injury/Illness');

    // Click the input to open the dropdown
    await user.click(autocompleteInputs[0]);

    // Select an option from the dropdown
    const optionToSelect = screen.getByText('Nov 09, 2024 - Issue A');
    await user.click(optionToSelect);

    // Verify onUpdateRowCallback was called with the selected value
    await waitFor(() => {
      expect(mockOnUpdateRowCallback).toHaveBeenCalledTimes(1);
      expect(mockOnUpdateRowCallback).toHaveBeenCalledWith({
        rowId: 'row1',
        data: { [FIELD_KEYS.associatedIssues]: [mockIssueOptions[0]] },
      });
    });
  });

  it('renders expected text labels', async () => {
    // Simulate no options available to check "No issues" text
    useAthletesIssues.mockReturnValue({
      issueOptions: [],
      requestStatus: 'SUCCESS',
    });

    render(
      <IssuesCell
        params={mockParams}
        onUpdateRowCallback={mockOnUpdateRowCallback}
      />
    );

    // Check for the "Injury/Illness" label
    const input = screen.getByLabelText('Injury/Illness');
    expect(input).toBeInTheDocument();

    // Click the input to open the dropdown and reveal "No issues" text
    await user.click(input);
    expect(screen.getByText('No issues')).toBeInTheDocument();
  });

  it('resets stored associatedIssues when athlete changes', async () => {
    const initialParams = {
      id: 'row1',
      row: {
        player: { id: 'player123' },
        associatedIssues: [
          {
            id: 1,
            label: 'Nov 09, 2024 - Issue A',
            type: 'Injury',
            group: 'Open injury/illness',
          },
        ],
      },
    };

    const { rerender } = render(
      <IssuesCell
        params={initialParams}
        onUpdateRowCallback={mockOnUpdateRowCallback}
      />
    );

    // Expect initial call from useEffect
    await waitFor(() => {
      expect(mockOnUpdateRowCallback).toHaveBeenCalledWith({
        rowId: 'row1',
        data: { [FIELD_KEYS.associatedIssues]: [] },
      });
    });
    mockOnUpdateRowCallback.mockClear();

    // Simulate athlete change by changing player id in params
    const newParams = {
      id: 'row1',
      row: {
        player: { id: 'player456' },
        associatedIssues: [
          {
            id: 1,
            label: 'Nov 09, 2024 - Issue A',
            type: 'Injury',
            group: 'Open injury/illness',
          },
        ],
      },
    };

    rerender(
      <IssuesCell
        params={newParams}
        onUpdateRowCallback={mockOnUpdateRowCallback}
        shouldShowError={false}
        shouldDisable={false}
      />
    );

    // Expect onUpdateRowCallback to be called again with an empty array due to useEffect
    await waitFor(() => {
      expect(mockOnUpdateRowCallback).toHaveBeenCalledTimes(1);
      expect(mockOnUpdateRowCallback).toHaveBeenCalledWith({
        rowId: 'row1',
        data: { [FIELD_KEYS.associatedIssues]: [] },
      });
    });
  });

  it('shows loading state when requestStatus is PENDING and not disabled', () => {
    useAthletesIssues.mockReturnValue({
      issueOptions: [],
      requestStatus: 'PENDING',
    });

    render(
      <IssuesCell
        params={mockParams}
        onUpdateRowCallback={mockOnUpdateRowCallback}
        shouldShowError={false}
        shouldDisable={false}
      />
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument(); // Autocomplete loading indicator
  });

  it('does not show loading state when disabled', () => {
    useAthletesIssues.mockReturnValue({
      issueOptions: [],
      requestStatus: 'PENDING',
    });

    render(
      <IssuesCell
        params={mockParams}
        onUpdateRowCallback={mockOnUpdateRowCallback}
        shouldDisable // Component is disabled
      />
    );

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('is disabled when shouldDisable is true', () => {
    render(
      <IssuesCell
        params={mockParams}
        onUpdateRowCallback={mockOnUpdateRowCallback}
        shouldDisable
      />
    );

    expect(screen.getByLabelText('Injury/Illness')).toBeDisabled();
  });

  it('is disabled when params.row.player.id is null', () => {
    const paramsWithoutPlayerId = {
      id: 'row1',
      row: {
        player: null, // No player ID
        associatedIssues: [],
      },
    };

    render(
      <IssuesCell
        params={paramsWithoutPlayerId}
        onUpdateRowCallback={mockOnUpdateRowCallback}
      />
    );

    expect(screen.getByLabelText('Injury/Illness')).toBeDisabled();
  });

  it('shows error state when shouldShowError is true', () => {
    render(
      <IssuesCell
        params={mockParams}
        onUpdateRowCallback={mockOnUpdateRowCallback}
        shouldShowError
      />
    );

    // Check for the error state on the input element.
    // MUI Autocomplete applies an 'aria-invalid' attribute or 'Mui-error' class.
    const autocompleteInput = screen.getByLabelText('Injury/Illness');
    expect(autocompleteInput).toHaveAttribute('aria-invalid', 'true');
  });
});
