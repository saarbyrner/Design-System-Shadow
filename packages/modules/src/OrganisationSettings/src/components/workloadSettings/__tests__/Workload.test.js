import { render, within, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import WorkloadSettings from '../index';

// Mock the child component to focus on the WorkloadSettings logic
jest.mock('../../workloadDefaultSettings', () => ({
  WorkloadDefaultSettingsTranslated: ({ workloadType }) => (
    <div>WorkloadDefaultSettings: {workloadType}</div>
  ),
}));

describe('Organisation Settings <WorkloadSettings /> component', () => {
  let user;
  let baseProps;

  beforeEach(() => {
    user = userEvent.setup();
    baseProps = {
      groupedWorkloadOptions: [
        { name: 'Kitman', isGroupOption: true },
        { name: 'RPE x Duration', id: 'kitman|workload' },
        { name: 'Catapult', isGroupOption: true },
        { name: 'Total Distance', id: 'catapult|total_distance' },
      ],
      primaryWorkloadVariableId: 'kitman|workload',
      secondaryWorkloadVariableId: 'catapult|total_distance',
      gameParticipationLevels: [{ id: 1, name: 'Came on as sub' }],
      trainingParticipationLevels: [{ id: 2, name: 'Modified' }],
      onChangePrimaryVariable: jest.fn(),
      onChangeSecondaryVariable: jest.fn(),
      gameRpeCollection: { kioskApp: false, athleteApp: false },
      trainingRpeCollection: { kioskApp: false, athleteApp: false },
      onChangeRpeCollection: jest.fn(),
      onParticipationLevelNameChange: jest.fn(),
      onIncludeInGroupCalculationChange: jest.fn(),
      onRestoreDefaults: jest.fn(),
      onSaveForm: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('should render the session defaults section title correctly', () => {
    render(<WorkloadSettings {...baseProps} />);
    expect(
      screen.getByText('Session - Participation & RPE collection')
    ).toBeInTheDocument();
  });

  it('renders the workload variable dropdowns and default settings sections', () => {
    render(<WorkloadSettings {...baseProps} />);

    // Check for dropdowns by their labels
    expect(screen.getByText('Primary workload variable')).toBeInTheDocument();
    expect(screen.getByText('Secondary workload variable')).toBeInTheDocument();

    // Check that child components are rendered
    expect(
      screen.getByText('WorkloadDefaultSettings: GAME')
    ).toBeInTheDocument();
    expect(
      screen.getByText('WorkloadDefaultSettings: TRAINING_SESSION')
    ).toBeInTheDocument();
  });

  it('renders the correct initial values in the dropdowns', () => {
    render(<WorkloadSettings {...baseProps} />);

    // The selected value text should be visible for each dropdown
    expect(screen.getByText('RPE x Duration')).toBeInTheDocument();
    expect(screen.getByText('Total Distance')).toBeInTheDocument();
  });

  it('calls the correct callback when the primary variable is changed', async () => {
    render(<WorkloadSettings {...baseProps} />);
    // Find the dropdown's trigger button by its visible text
    const dropdownTrigger = screen.getByRole('button', {
      name: 'RPE x Duration',
    });
    await user.click(dropdownTrigger);

    // Find the list item for the desired option by its accessible name
    const newOption = await screen
      .getAllByText('Total Distance')[0]
      .closest('div');
    // Clicking the list item will trigger the onClick on its child div
    await user.click(newOption);

    expect(baseProps.onChangePrimaryVariable).toHaveBeenCalledTimes(1);
    expect(baseProps.onChangePrimaryVariable).toHaveBeenCalledWith(
      'catapult|total_distance'
    );
  });

  it('calls the correct callback when the secondary variable is changed', async () => {
    render(<WorkloadSettings {...baseProps} />);
    // Find the dropdown's trigger button by its visible text
    const dropdownTrigger = screen.getByRole('button', {
      name: 'Total Distance',
    });
    await user.click(dropdownTrigger);

    const newOption = await screen
      .getAllByText('RPE x Duration')[1]
      .closest('div');

    // Clicking the list item will trigger the onClick on its child div
    await user.click(newOption);

    expect(baseProps.onChangeSecondaryVariable).toHaveBeenCalledTimes(1);
    expect(baseProps.onChangeSecondaryVariable).toHaveBeenCalledWith(
      'kitman|workload'
    );
  });

  it('calls the correct callback when save is clicked', async () => {
    render(<WorkloadSettings {...baseProps} />);

    const saveButton = screen.getByRole('button', { name: 'Save' });

    await user.click(saveButton);

    expect(baseProps.onSaveForm).toHaveBeenCalledTimes(1);
  });

  it('calls the correct callback when restore defaults is confirmed', async () => {
    render(<WorkloadSettings {...baseProps} />);

    const restoreButton = screen.getByText('Restore Defaults');

    await user.click(restoreButton);

    // A confirmation modal should appear
    const confirmModal = screen.getByTestId('AppStatus-warning');

    expect(
      within(confirmModal).getByText('Restore Defaults?')
    ).toBeInTheDocument();

    // Click the confirm button within the modal
    const confirmButton = within(confirmModal).getByRole('button', {
      name: 'Restore',
    });

    await user.click(confirmButton);

    expect(baseProps.onRestoreDefaults).toHaveBeenCalledTimes(1);
  });
});
