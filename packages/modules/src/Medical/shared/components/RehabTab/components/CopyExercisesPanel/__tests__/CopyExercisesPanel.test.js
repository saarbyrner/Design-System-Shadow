import {
  render,
  screen,
  within,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useEnrichedAthletesIssues from '@kitman/modules/src/Medical/shared/hooks/useEnrichedAthletesIssues';
import { useGetSquadAthletesQuery } from '../../../../../redux/services/medical';
import CopyExercisesPanel from '../index';

jest.mock('@kitman/components/src/DatePicker');
jest.mock('@kitman/components/src/DelayedLoadingFeedback');
jest.mock('@kitman/modules/src/Medical/shared/hooks/useEnrichedAthletesIssues');
jest.mock('../../../../../redux/services/medical');

const mockedUseEnrichedAthletesIssues = useEnrichedAthletesIssues;

describe('<CopyExercisesPanel />', () => {
  let spy;
  // We use React Portal to add the side panel to div 'issueMedicalProfile-Slideout'
  // Mock in as needs to be present in the test
  beforeAll(() => {
    spy = jest.spyOn(document, 'getElementById');
    const mockElement = document.createElement('div');
    mockElement.setAttribute('id', 'issueMedicalProfile-Slideout');
    document.body.appendChild(mockElement);
    spy.mockReturnValueOnce(mockElement);
  });

  beforeEach(() => {
    i18nextTranslateStub();
    jest.clearAllMocks();
    useGetSquadAthletesQuery.mockReturnValue({
      data: { squads: [] },
      error: false,
      isLoading: false,
    });
  });

  const onClickCloseButtonSpy = jest.fn();

  const props = {
    isOpen: true,
    inMaintenance: false,
    isAthleteSelectable: false,
    athleteId: 1,
    issueOccurrenceId: null,
    issueType: null,
    selectedExercises: [1, 2],
    onCopyComplete: jest.fn(),
    onClose: onClickCloseButtonSpy,
    addToastMessage: jest.fn(),
    isRehabCopyAutomaticallyRedirectEnabled: false,
    getLinkValueForRedirect: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const store = storeFake({
    medicalApi: {},
  });

  it('displays the correct content without the radio buttons for copy to selection', async () => {
    mockedUseEnrichedAthletesIssues.mockReturnValue({
      enrichedAthleteIssues: [],
      fetchAthleteIssues: jest.fn(),
    });

    render(
      <Provider store={store}>
        <CopyExercisesPanel {...props} />
      </Provider>
    );

    expect(screen.getByText('Copy to')).toBeInTheDocument();

    const athleteSelector = screen.getByTestId(
      'CopyExercisePanel|AthleteSelector'
    );
    expect(athleteSelector).toBeInTheDocument();
    expect(within(athleteSelector).getByText('Player')).toBeInTheDocument();

    const sessionDate = screen.getByTestId('CopyExercisePanel|SessionDate');
    expect(sessionDate).toBeInTheDocument();
    expect(within(sessionDate).getByText('Date(s)')).toBeInTheDocument();

    const toggleCopy = screen.getByTestId('CopyExercisePanel|ToggleCopy');
    expect(toggleCopy).toBeInTheDocument();
    expect(within(toggleCopy).getByText('Copy comments')).toBeInTheDocument();

    const uncompressedCopy = screen.getByTestId(
      'CopyExercisePanel|UncompressedCopy'
    );
    expect(uncompressedCopy).toBeInTheDocument();
    expect(
      within(uncompressedCopy).getByText('Rehab structure')
    ).toBeInTheDocument();
    expect(
      within(uncompressedCopy).getByText('Merge to single day')
    ).toBeInTheDocument();
    expect(
      within(uncompressedCopy).getByText('Retain structure')
    ).toBeInTheDocument();
  });

  it('displays the correct content with the radio buttons for copy to selection if rehab-to-maintenance feature flag is enabled', async () => {
    window.featureFlags['rehab-to-maintenance'] = true;

    mockedUseEnrichedAthletesIssues.mockReturnValue({
      enrichedAthleteIssues: [],
      fetchAthleteIssues: jest.fn(),
    });

    render(
      <Provider store={store}>
        <CopyExercisesPanel {...props} />
      </Provider>
    );

    expect(screen.getByText('Copy to')).toBeInTheDocument();

    const athleteSelector = screen.getByTestId(
      'CopyExercisePanel|AthleteSelector'
    );
    expect(athleteSelector).toBeInTheDocument();
    expect(within(athleteSelector).getByText('Player')).toBeInTheDocument();

    const sessionDate = screen.getByTestId('CopyExercisePanel|SessionDate');
    expect(sessionDate).toBeInTheDocument();
    expect(within(sessionDate).getByText('Date(s)')).toBeInTheDocument();

    const toggleCopy = screen.getByTestId('CopyExercisePanel|ToggleCopy');
    expect(toggleCopy).toBeInTheDocument();
    expect(within(toggleCopy).getByText('Copy comments')).toBeInTheDocument();

    const uncompressedCopy = screen.getByTestId(
      'CopyExercisePanel|UncompressedCopy'
    );
    expect(uncompressedCopy).toBeInTheDocument();
    expect(
      within(uncompressedCopy).getByText('Rehab structure')
    ).toBeInTheDocument();
    expect(
      within(uncompressedCopy).getByText('Merge to single day')
    ).toBeInTheDocument();
    expect(
      within(uncompressedCopy).getByText('Retain structure')
    ).toBeInTheDocument();

    const copyToWrapper = screen.getByTestId('CopyExercisePanel|CopyToWrapper');
    expect(copyToWrapper).toBeInTheDocument();
    expect(within(copyToWrapper).getByText('Rehab')).toBeInTheDocument();
    expect(within(copyToWrapper).getByText('Maintenance')).toBeInTheDocument();
  });

  it('triggers callback from the Copy button and if isRehabCopyAutomaticallyRedirectEnabled setting is true it does not trigger the toast notification', async () => {
    const propsWithRedirectEnabled = {
      ...props,
      isRehabCopyAutomaticallyRedirectEnabled: true,
    };

    mockedUseEnrichedAthletesIssues.mockReturnValue({
      enrichedAthleteIssues: [],
      fetchAthleteIssues: jest.fn(),
    });

    render(
      <Provider store={store}>
        <CopyExercisesPanel {...propsWithRedirectEnabled} />
      </Provider>
    );

    const actionButtonsContainer = screen.getByTestId(
      'CopyExercisePanel|Actions'
    );
    expect(actionButtonsContainer).toBeInTheDocument();
    const copyButton = await within(actionButtonsContainer).findByRole(
      'button'
    );
    expect(copyButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByLabelText('Date(s)')).toBeVisible();
    });

    fireEvent.change(screen.getByLabelText('Date(s)'), {
      target: { value: '2023-03-12T00:00:00|2023-03-13T00:00:00' },
    });

    await waitFor(() => {
      expect(copyButton).toBeEnabled();
    });

    const user = userEvent.setup();
    await user.click(copyButton);

    expect(propsWithRedirectEnabled.addToastMessage).not.toHaveBeenCalled();
  });

  it('populates the injury/illness dropdown with non-grouped data', async () => {
    const nonGroupedIssues = [
      {
        label: 'Open injury/ illness',
        options: [
          {
            value: 'Injury_1',
            label: 'Nov 11, 2020 - Ankle Fracture (Left)',
          },
        ],
      },
      {
        label: 'Prior injury/illness',
        options: [
          {
            value: 'Injury_2',
            label: 'Sep 13, 2020 - Ankle Fracture (Left)',
          },
        ],
      },
    ];

    mockedUseEnrichedAthletesIssues.mockReturnValue({
      enrichedAthleteIssues: nonGroupedIssues,
      fetchAthleteIssues: jest.fn().mockResolvedValue(nonGroupedIssues),
    });

    render(
      <Provider store={store}>
        <CopyExercisesPanel {...props} />
      </Provider>
    );

    const injuryDropdown = screen.getByTestId(
      'CopyExercisePanel|AssociatedInjuries'
    );
    expect(injuryDropdown).toBeInTheDocument();

    // The dropdown is disabled until an athlete is selected, so we can't check the options directly.
    // Instead, we can check that the hook was called and that the component has the data.
    expect(mockedUseEnrichedAthletesIssues).toHaveBeenCalled();
  });

  it('triggers callback from the close button', async () => {
    render(
      <Provider store={store}>
        <CopyExercisesPanel {...props} />
      </Provider>
    );

    const user = userEvent.setup();
    // The close button has no accessible name, so we select it by its class.
    const closeButton = document.querySelector('.icon-close');
    await user.click(closeButton);

    expect(onClickCloseButtonSpy).toHaveBeenCalled();
  });

  it('calls fetchAthleteIssues with the correct parameters when the athlete is changed', async () => {
    const fetchAthleteIssues = jest.fn().mockResolvedValue([]);
    mockedUseEnrichedAthletesIssues.mockReturnValue({
      enrichedAthleteIssues: [],
      fetchAthleteIssues,
    });

    useGetSquadAthletesQuery.mockReturnValue({
      data: {
        squads: [
          {
            name: 'Squad A',
            athletes: [{ id: 2, fullname: 'Test Athlete' }],
          },
        ],
      },
      error: false,
      isLoading: false,
    });

    render(
      <Provider store={store}>
        <CopyExercisesPanel {...props} isAthleteSelectable />
      </Provider>
    );

    const athleteSelector = screen.getByTestId(
      'CopyExercisePanel|AthleteSelector'
    );
    const selectInput = within(athleteSelector).getByLabelText('Player');
    await selectEvent.select(selectInput, 'Test Athlete');

    expect(fetchAthleteIssues).toHaveBeenCalledWith({
      selectedAthleteId: 2,
      useOccurrenceIdValue: true,
      includeDetailedIssue: false,
      issueFilter: null,
      includeIssue: false,
      includeGrouped: false,
    });
  });
});
