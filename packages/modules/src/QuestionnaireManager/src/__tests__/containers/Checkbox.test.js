import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { buildAthletes } from '@kitman/common/src/utils/test_utils';
import { checkedVariables as createCheckedVariables } from '../../utils';
import CheckboxContainer from '../../containers/Checkbox';
import * as questionnaireActions from '../../actions';

jest.mock('../../actions');

describe('QuestionnaireManager <Checkbox /> Container', () => {
  let preloadedState;
  const athletes = buildAthletes(1);
  const athleteId = athletes[0].id;
  const currentVariableId = 'tv_222';

  beforeEach(() => {
    jest.clearAllMocks();

    // Define a base preloaded state for the Redux store
    preloadedState = {
      // checkedVariables is created by a utility, we can replicate that
      checkedVariables: createCheckedVariables(athletes),
    };
  });

  it('renders and maps state to an unchecked checkbox correctly', () => {
    // The initial state from checkedVariables will not have `tv_222`, so it should be unchecked.
    renderWithRedux(
      <CheckboxContainer
        athleteId={athleteId}
        currentVariableId={currentVariableId}
      />,
      {
        useGlobalStore: false,
        preloadedState,
      }
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('renders and maps state to a checked checkbox correctly', () => {
    // Modify the state to make this specific checkbox checked
    preloadedState.checkedVariables[athleteId][currentVariableId] = true;

    renderWithRedux(
      <CheckboxContainer
        athleteId={athleteId}
        currentVariableId={currentVariableId}
      />,
      {
        useGlobalStore: false,
        preloadedState,
      }
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('maps dispatch to props and calls the toggleVariable action when clicked', async () => {
    const user = userEvent.setup();
    renderWithRedux(
      <CheckboxContainer
        athleteId={athleteId}
        currentVariableId={currentVariableId}
      />,
      {
        useGlobalStore: false,
        preloadedState,
      }
    );

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    // Verify that the toggleVariable action was dispatched with the correct arguments
    expect(questionnaireActions.toggleVariable).toHaveBeenCalledTimes(1);
    expect(questionnaireActions.toggleVariable).toHaveBeenCalledWith(
      athleteId,
      currentVariableId
    );
  });
});
