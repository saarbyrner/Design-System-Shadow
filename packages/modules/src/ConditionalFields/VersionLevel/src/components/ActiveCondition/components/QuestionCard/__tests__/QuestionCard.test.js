import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import {
  MOCK_QUESTION,
  MOCK_QUESTION_WITH_FOLLOWUP_QUESTIONS,
  MOCK_ACTIVE_CONDITION,
  MOCK_QUESTION_DATE,
} from '@kitman/modules/src/ConditionalFields/shared/utils/test_utils.mock';

import QuestionCard from '..';

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
    allConditions: [MOCK_ACTIVE_CONDITION],
    requestStatus: 'SUCCESS',
    flattenedNames: [],
  },
});

describe('<QuestionCard />', () => {
  const props = {
    question: MOCK_QUESTION,
    index: 0,
    isPublished: false,
    t: i18nextTranslateStub(),
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders expected form fields', () => {
    render(
      <Provider store={defaultStore}>
        <QuestionCard {...props} />
      </Provider>
    );
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
  });
  describe('[COMPUTED]', () => {
    it('renders question data', () => {
      render(
        <Provider store={defaultStore}>
          <QuestionCard {...props} />
        </Provider>
      );

      expect(
        screen.getByRole('textbox', { name: 'Question name' })
      ).toHaveValue(props.question.name);
      expect(screen.getByRole('textbox', { name: 'Question' })).toHaveValue(
        props.question.question
      );
      expect(screen.getByRole('textbox', { name: 'Option 1' })).toHaveValue(
        props.question.question_options[0].value
      );
      expect(screen.getByRole('textbox', { name: 'Option 2' })).toHaveValue(
        props.question.question_options[1].value
      );
      expect(
        screen.queryByRole('heading', { name: 'Follow-up question 1.1' })
      ).not.toBeInTheDocument();
    });

    it('renders + followup button when expected', async () => {
      render(
        <Provider store={defaultStore}>
          <QuestionCard
            {...props}
            question={MOCK_QUESTION_WITH_FOLLOWUP_QUESTIONS}
          />
        </Provider>
      );

      const followUpButtons = screen.getAllByRole('button', {
        name: '+ follow-up',
      });
      expect(followUpButtons.length).toBe(3);
    });
    it('does not render + followup button when expected', () => {
      render(
        <Provider
          store={storeFake({
            globalApi: {},
            conditionBuildViewSlice: {
              activeCondition: MOCK_ACTIVE_CONDITION,
              allConditions: [MOCK_ACTIVE_CONDITION],
              requestStatus: 'SUCCESS',
              flattenedNames: [],
            },
          })}
        >
          <QuestionCard
            {...props}
            question={MOCK_QUESTION_WITH_FOLLOWUP_QUESTIONS}
            isPublished
          />
        </Provider>
      );

      expect(
        screen.queryByRole('button', { name: '+ follow-up' })
      ).not.toBeInTheDocument();
    });
    it('renders followup second level questions when expected', () => {
      render(
        <Provider store={defaultStore}>
          <QuestionCard
            {...props}
            question={MOCK_QUESTION_WITH_FOLLOWUP_QUESTIONS}
          />
        </Provider>
      );

      const followUpSecondLevel = screen.getByDisplayValue(
        'follow up second level'
      );

      expect(followUpSecondLevel).toBeInTheDocument();
    });
    it('renders date prompt when question_type in date', () => {
      render(
        <Provider store={defaultStore}>
          <QuestionCard {...props} question={MOCK_QUESTION_DATE} />
        </Provider>
      );

      expect(
        screen.queryByText('A date selector will show when answering')
      ).toBeInTheDocument();
    });
  });
});
