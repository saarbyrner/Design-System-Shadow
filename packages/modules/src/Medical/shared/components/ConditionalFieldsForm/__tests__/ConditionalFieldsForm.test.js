import { render, screen } from '@testing-library/react';
import selectEvent from 'react-select-event';

import ConditionalFieldsForm from '@kitman/modules/src/Medical/shared/components/ConditionalFieldsForm';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

jest.mock(
  '@kitman/modules/src/Medical/rosters/src/services/getConditionalFields',
  () => ({
    getFollowUpQuestions: jest.fn(),
  })
);

const {
  getFollowUpQuestions,
} = require('@kitman/modules/src/Medical/rosters/src/services/getConditionalFields');

describe('<ConditionalFieldsForm />', () => {
  const mockedQuestions = [
    {
      id: 123,
      parent_question_id: null,
      question: 'Favourite animal?',
      question_type: 'multiple-choice',
      order: 1,
      question_metadata: [
        { value: 'Wombats', order: 2 },
        { value: 'Koalas', order: 1 },
      ],
    },
    {
      id: 456,
      parent_question_id: null,
      question: 'Name every timtam flavour.',
      question_type: 'free-text',
      order: 2,
      question_metadata: [],
    },
  ];

  const baseProps = {
    initialQuestions: mockedQuestions,
    conditionalFieldsAnswers: [
      { question_id: 123, value: 'Koalas' },
      { question_id: 456, value: 'Chocolate' },
    ],
    onChange: jest.fn(),
    onQuestionRemoval: jest.fn(),
    validQuestionEvent: true,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('renders the correct form', () => {
    render(<ConditionalFieldsForm {...baseProps} />);

    expect(screen.getByLabelText('Favourite animal?')).toBeInTheDocument();
    expect(screen.getByText('Name every timtam flavour.')).toBeInTheDocument();
  });

  test('loads follow-up when answering a question', async () => {
    getFollowUpQuestions.mockResolvedValue({
      questions: [
        {
          id: 33,
          parent_question_id: 123,
          question: 'Follow up question?',
          question_type: 'multiple-choice',
          order: 1,
          question_metadata: [
            { value: 'Choice 1', order: 1 },
            { value: 'Choice 2', order: 2 },
          ],
        },
      ],
    });

    render(<ConditionalFieldsForm {...baseProps} />);

    const select = screen.getByLabelText('Favourite animal?');
    await selectEvent.openMenu(select, { container: document.body });
    await selectEvent.select(select, 'Wombats', { container: document.body });

    expect(await screen.findByText('Follow up question?')).toBeInTheDocument();
  });

  test('does not render questions when validQuestionEvent is false', () => {
    render(<ConditionalFieldsForm {...baseProps} validQuestionEvent={false} />);
    expect(
      screen.queryByLabelText('Favourite animal?')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText('Name every timtam flavour.')
    ).not.toBeInTheDocument();
  });
});
