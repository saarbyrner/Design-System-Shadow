import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { useGetActiveSquadQuery } from '@kitman/common/src/redux/global/services/globalApi';
import ControlsContainer from '../../containers/Controls';
import * as questionnaireActions from '../../actions';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('../../actions');

describe('QuestionnaireManager <Controls /> Container', () => {
  let preloadedState;

  beforeEach(() => {
    jest.clearAllMocks();

    useGetActiveSquadQuery.mockReturnValue({
      data: { id: 1, name: 'Default Squad' },
      isSuccess: true,
    });

    // Define a base preloaded state for the Redux store
    preloadedState = {
      athletes: {
        groupBy: 'last_screening',
        searchTerm: 'Appleseed',
        squadFilter: '20',
      },
      variables: {
        selectedPlatform: 'well_being',
      },
      templateData: {
        name: 'Daily Screening',
      },
      variablePlatforms: [
        { name: 'Well-being', value: 'well_being' },
        { name: 'MSK', value: 'msk' },
      ],
      squadOptions: {
        squads: [
          { id: '10', title: 'Leinster Senior' },
          { id: '20', title: 'Leinster A' },
          { id: 'all', title: 'All Squads' },
        ],
      },
    };
  });

  it('renders and maps state to props correctly', () => {
    renderWithRedux(<ControlsContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // Verify template name is displayed
    expect(
      screen.getByRole('heading', { name: 'Daily Screening' })
    ).toBeInTheDocument();

    // Verify search term is in the input
    expect(screen.getByDisplayValue('Appleseed')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Leinster A' })
    ).toBeInTheDocument(); // Selected squad
    expect(
      screen.getByRole('button', { name: 'Screening' })
    ).toBeInTheDocument(); // Group by
  });

  it('maps dispatch to props and calls setSquadFilter with null when "All Squads" is selected', async () => {
    const user = userEvent.setup();
    renderWithRedux(<ControlsContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // Find the squad dropdown by its current value
    const squadDropdown = screen.getByRole('button', { name: 'Leinster A' });

    await user.click(squadDropdown);

    // Select the "All Squads" option
    const allSquadsOption = await screen.findByText('All Squads');
    await user.click(allSquadsOption);

    // Verify the correct action was dispatched
    expect(questionnaireActions.setSquadFilter).toHaveBeenCalledTimes(1);
    // The container logic should convert 'all' to null
    expect(questionnaireActions.setSquadFilter).toHaveBeenCalledWith(null);
  });

  it('maps dispatch to props and calls setPlatform when a platform is changed', async () => {
    const user = userEvent.setup();
    renderWithRedux(<ControlsContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    const mskRadioButton = screen.getByText('MSK');
    await user.click(mskRadioButton);

    expect(questionnaireActions.setPlatform).toHaveBeenCalledTimes(1);
    expect(questionnaireActions.setPlatform).toHaveBeenCalledWith('msk');
  });
});
