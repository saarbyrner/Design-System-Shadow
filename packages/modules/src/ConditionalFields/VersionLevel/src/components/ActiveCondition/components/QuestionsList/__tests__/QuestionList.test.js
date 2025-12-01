import { render, screen, act } from '@testing-library/react';
import { Provider } from 'react-redux';

import QuestionList from '..';
import { MOCK_CONDITIONS } from '../../../../../../../shared/utils/test_utils.mock';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  global: {
    useGetOrganisationQuery: jest.fn(),
    useGlobal: jest.fn(),
  },
  conditionalFieldsApi: {
    useFetchVersionQuery: jest.fn(),
    useUpdateOwnerRulesetMutation: jest.fn(),
  },
  conditionBuildViewSlice: {
    activeCondition: MOCK_CONDITIONS[0],
    allConditions: MOCK_CONDITIONS,
    flattenedNames: [],
  },
});

const CURRENT_QUESTION_FROM_ACTIVE_CONDITION = MOCK_CONDITIONS[0].questions;

describe('<QuestionsList />', () => {
  const props = {};

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('[requestStatus]', () => {
    it('[SUCCESS] renders the correct content', async () => {
      await act(async () => {
        render(
          <Provider store={defaultStore}>
            <QuestionList {...props} />
          </Provider>
        );
      });

      // QuestionHeader
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
        'Ask'
      );
      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
        `Question 1`
      );

      // QuestionCard
      expect(
        screen.getByRole('textbox', { name: 'Question name' })
      ).toHaveValue(CURRENT_QUESTION_FROM_ACTIVE_CONDITION.name);
      expect(screen.getByRole('textbox', { name: 'Question' })).toHaveValue(
        CURRENT_QUESTION_FROM_ACTIVE_CONDITION.question
      );
    });
  });
});
