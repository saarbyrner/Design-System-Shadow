import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import {
  useSaveConditionMutation,
  useSaveFollowupQuestionsMutation,
} from '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields';
import { MOCK_ACTIVE_CONDITION } from '@kitman/modules/src/ConditionalFields/shared/utils/test_utils.mock';

import FollowupQuestionHeader from '..';

jest.mock(
  '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields'
);
jest.mock('@kitman/components/src/DelayedLoadingFeedback');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  conditionBuildViewSlice: {
    activeCondition: MOCK_ACTIVE_CONDITION,
    allConditions: [MOCK_ACTIVE_CONDITION],
  },
  conditionalFieldsApi: {
    useSaveConditionMutation: jest.fn(),
    useSaveFollowupQuestionsMutation: jest.fn(),
  },
});

const defaultProps = {
  parentQuestionNumbering: '1.1.1',
  parentQuestion: 'What is your name?',
  t: i18nextTranslateStub(),
};

const renderWithProviders = (store = defaultStore, props = defaultProps) => {
  render(
    <Provider store={store}>
      <FollowupQuestionHeader {...props} />
    </Provider>
  );
};
describe('<FollowupQuestionHeader/>', () => {
  beforeEach(() => {
    useSaveConditionMutation.mockReturnValue([{}, {}]);
    useSaveFollowupQuestionsMutation.mockReturnValue([{}, {}]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders header title with parentQuestionNumbering', () => {
    renderWithProviders();
    expect(
      screen.getByTestId('FollowupQuestion|HeaderTitle')
    ).toHaveTextContent(`Follow-up to question 1.1.1`);
  });
  it('renders header with parentQuestion', () => {
    renderWithProviders();
    expect(
      screen.getByTestId('FollowupQuestion|HeaderQuestion')
    ).toHaveTextContent(`What is your name?`);
  });
});
