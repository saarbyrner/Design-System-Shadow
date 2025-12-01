import { render, screen, within, waitFor } from '@testing-library/react';
import { VirtuosoMockContext } from 'react-virtuoso';
import selectEvent from 'react-select-event';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useEnrichedAthletesIssues from '@kitman/modules/src/Medical/shared/hooks/useEnrichedAthletesIssues';
import LinkExercisesPanel from '../index';

jest.mock('@kitman/components/src/DelayedLoadingFeedback');
jest.mock('@kitman/modules/src/Medical/shared/hooks/useEnrichedAthletesIssues');

describe('<LinkExercisesPanel />', () => {
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
    useEnrichedAthletesIssues.mockReturnValue({
      enrichedAthleteIssues: [
        {
          label: 'Prior injury/illness',
          options: [
            {
              value: 'Injury_2',
              label: 'Sep 13, 2020 - Ankle Fracture (Left)',
            },
          ],
        },
      ],
    });
    i18nextTranslateStub();
  });

  const onClickCloseButtonSpy = jest.fn();
  const onLinkCompleteSpy = jest.fn();

  const props = {
    isOpen: true,
    athleteId: 1,
    issueOccurrenceId: null,
    issueType: null,
    selectedExercises: [1, 2],
    onLinkComplete: onLinkCompleteSpy,
    onClose: onClickCloseButtonSpy,
    addToastMessage: jest.fn(),
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

  it('displays the correct content', () => {
    render(
      <Provider store={store}>
        <LinkExercisesPanel {...props} />
      </Provider>
    );

    expect(screen.getByText('Link to Injury / Illness')).toBeInTheDocument();

    const athleteSelector = screen.getByTestId(
      'LinkExercisePanel|AthleteSelector'
    );
    expect(athleteSelector).toBeInTheDocument();
    expect(within(athleteSelector).getByText('Player')).toBeInTheDocument();

    const associatedInjuries = screen.getByTestId(
      'LinkExercisePanel|AssociatedInjuries'
    );
    expect(associatedInjuries).toBeInTheDocument();
    expect(
      within(associatedInjuries).getByText('Injury / illness')
    ).toBeInTheDocument();
  });

  it('triggers callback from the close button', async () => {
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <LinkExercisesPanel {...props} />
      </Provider>
    );
    const buttons = await screen.findAllByRole('button');

    await user.click(buttons[0]);
    expect(onClickCloseButtonSpy).toHaveBeenCalled();
  });

  it('triggers callback from the Link button', async () => {
    const user = userEvent.setup();
    render(
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 2000, itemHeight: 50 }}
      >
        <Provider store={store}>
          <LinkExercisesPanel {...props} />
        </Provider>
      </VirtuosoMockContext.Provider>
    );

    const actionButtonsContainer = screen.getByTestId(
      'LinkExercisePanel|Actions'
    );
    expect(actionButtonsContainer).toBeInTheDocument();
    const linkButton = await within(actionButtonsContainer).findByRole(
      'button'
    );

    expect(linkButton).toBeInTheDocument();
    expect(linkButton).toBeDisabled();

    const selectLabel = screen.queryByLabelText('Injury / illness');
    selectEvent.openMenu(selectLabel);
    await waitFor(() => {
      expect(screen.queryByText('No options')).not.toBeInTheDocument();
    });

    expect(
      screen.getByText('Sep 13, 2020 - Ankle Fracture (Left)')
    ).toBeInTheDocument();
    await selectEvent.select(selectLabel, [
      'Sep 13, 2020 - Ankle Fracture (Left)',
    ]);

    expect(linkButton).toBeEnabled();

    await user.click(linkButton);

    await waitFor(() => {
      expect(onLinkCompleteSpy).toHaveBeenCalled();
    });
  });

  it('calls useEnrichedAthletesIssues with correct parameters', () => {
    render(
      <Provider store={store}>
        <LinkExercisesPanel {...props} />
      </Provider>
    );

    expect(useEnrichedAthletesIssues).toHaveBeenCalledWith({
      athleteId: props.athleteId,
      useOccurrenceId: true,
      includeIssueHook: false,
      customIssueFilter: null,
      includeGroupedHook: false,
      detailedIssue: false,
      includeOccurrenceType: false,
    });
  });
});
