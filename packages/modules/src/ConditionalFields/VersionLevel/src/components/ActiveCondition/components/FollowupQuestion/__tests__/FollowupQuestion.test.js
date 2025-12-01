import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import {
  MOCK_QUESTION,
  MOCK_ACTIVE_CONDITION,
  MOCK_QUESTION_WITH_FOLLOWUP_QUESTIONS,
} from '@kitman/modules/src/ConditionalFields/shared/utils/test_utils.mock';

import FollowupQuestion from '..';

jest.mock('@kitman/components/src/DelayedLoadingFeedback');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  globalApi: {},
  conditionBuildViewSlice: {
    activeCondition: { ...MOCK_ACTIVE_CONDITION, id: 16 },
    allConditions: [{ ...MOCK_ACTIVE_CONDITION, id: 16 }],
    requestStatus: 'SUCCESS',
    flattenedNames: [],
  },
});
const defaultProps = {
  question: MOCK_QUESTION,
  index: 0,
  isPublished: true,
  parentQuestion: 'What is your name?',
  parentQuestionNumbering: '1.1',
  options: MOCK_QUESTION_WITH_FOLLOWUP_QUESTIONS.question_options,
  t: i18nextTranslateStub(),
};

const renderWithProviders = (store = defaultStore, props = defaultProps) => {
  render(
    <Provider store={store}>
      <FollowupQuestion {...props} />
    </Provider>
  );
};

describe('<FollowupQuestion />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders expected form fields', async () => {
    renderWithProviders();

    expect(screen.getByText(/Question type/i)).toBeInTheDocument();

    expect(
      screen.getByRole('textbox', { name: 'Question name' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Question' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Multiple choice' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Open question' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Date' })).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Option 1' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Option 2' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '+ option' })
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('FollowupQuestion|HeaderTitle')
    ).toHaveTextContent(`Follow-up to question 1`);
    expect(
      screen.getByTestId('FollowupQuestion|HeaderQuestion')
    ).toHaveTextContent(`What is your name?`);
  });

  it('renders + followup button inside followup question', async () => {
    renderWithProviders(defaultStore, {
      ...defaultProps,
      question: MOCK_QUESTION_WITH_FOLLOWUP_QUESTIONS,
      isPublished: false,
    });
    const followUpButtons = screen.getAllByRole('button', {
      name: '+ follow-up',
    });
    expect(followUpButtons.length).toBe(3);
  });
  it('renders followup second level', async () => {
    renderWithProviders(defaultStore, {
      ...defaultProps,
      question: MOCK_QUESTION_WITH_FOLLOWUP_QUESTIONS,
      isPublished: false,
    });

    const followUpSecondLevel = screen.getByDisplayValue(
      'follow up second level'
    );

    expect(followUpSecondLevel).toBeInTheDocument();
  });
  describe('[COMPUTED]', () => {
    it('renders question data', async () => {
      renderWithProviders();

      expect(
        screen.getByRole('textbox', { name: 'Question name' })
      ).toHaveValue(defaultProps.question.name);
      expect(screen.getByRole('textbox', { name: 'Question' })).toHaveValue(
        defaultProps.question.question
      );
      expect(screen.getByRole('textbox', { name: 'Option 1' })).toHaveValue(
        defaultProps.question.question_options[0].value
      );
      expect(screen.getByRole('textbox', { name: 'Option 2' })).toHaveValue(
        defaultProps.question.question_options[1].value
      );
    });
  });
});
