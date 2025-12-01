import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  groupAthletesByName,
  groupAthletesByAvailability,
  groupAthletesByScreening,
  groupAthletesByPosition,
  groupAthletesByPositionGroup,
  sendIntercomMessage,
} from '@kitman/common/src/utils';
import { buildAthletes, buildVariables } from '../test_utils';
import { checkedVariables as createCheckedVariables } from '../../utils';
import NoVariablesContainer from '../../containers/NoVariables';

jest.mock('@kitman/common/src/utils', () => ({
  ...jest.requireActual('@kitman/common/src/utils'),
  sendIntercomMessage: jest.fn(),
}));

describe('QuestionnaireManager <NoVariables /> Container', () => {
  let preloadedState;
  const athletes = buildAthletes(5);
  const variables = buildVariables(5);

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test

    const groupedAthletes = {
      position: groupAthletesByPosition(athletes),
      positionGroup: groupAthletesByPositionGroup(athletes),
      availability: groupAthletesByAvailability(athletes),
      last_screening: groupAthletesByScreening(athletes),
      name: groupAthletesByName(athletes),
    };

    // Define a base preloaded state for the Redux store
    preloadedState = {
      athletes: {
        all: athletes,
        grouped: groupedAthletes,
        currentlyVisible: groupedAthletes.name,
        groupBy: 'name',
      },
      variables: {
        currentlyVisible: variables,
      },
      checkedVariables: createCheckedVariables(athletes),
    };
  });

  it('is not visible when there are visible variables', () => {
    renderWithRedux(<NoVariablesContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // The component renders but is hidden via CSS, so we check for visibility.
    const messageContainer = screen
      .getByText(/no questionnaire variables/i)
      .closest('.noResultsMessage');

    expect(messageContainer).not.toHaveClass('noResultsMessage--isVisible');
  });

  it('is visible and displays the correct message when there are no variables', () => {
    // Override the state for this specific test
    preloadedState.variables.currentlyVisible = [];

    renderWithRedux(<NoVariablesContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    const message = screen.getByText(/no questionnaire variables/i);
    expect(message).toBeVisible();
    expect(
      screen.getByText(/there are setup for this organisation\./i)
    ).toBeInTheDocument();
  });

  it('calls sendIntercomMessage when the "Please contact us" link is clicked', async () => {
    const user = userEvent.setup();
    preloadedState.variables.currentlyVisible = []; // Make the component visible

    renderWithRedux(<NoVariablesContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    const contactLink = screen.getByRole('link', { name: 'Please contact us' });
    await user.click(contactLink);

    expect(sendIntercomMessage).toHaveBeenCalledTimes(1);
    expect(sendIntercomMessage).toHaveBeenCalledWith(
      expect.stringContaining(
        'Can you help me setup some questionnaire variables on my account?'
      )
    );
  });
});
