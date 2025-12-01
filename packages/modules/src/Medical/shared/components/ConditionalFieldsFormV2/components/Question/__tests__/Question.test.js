import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import selectEvent from 'react-select-event';
import userEvent from '@testing-library/user-event';
import moment from 'moment-timezone';

import {
  MOCK_RESPONSE_SELECT_QUESTION,
  MOCK_RESPONSE_TEXT_QUESTION,
  MOCK_RESPONSE_DATE_QUESTION,
  MOCK_RESPONSE_QUESTION_WITH_FOLLOWUPS,
  MOCK_DATE,
} from '@kitman/modules/src/ConditionalFields/shared/utils/test_utils.mock';
import Question from '..';

jest.mock('@kitman/components/src/DatePicker');

describe('<Question />', () => {
  const props = {
    ques: MOCK_RESPONSE_SELECT_QUESTION,
    conditionalFieldsAnswers: [],
    onChange: jest.fn(),
    onClear: jest.fn(),
  };

  beforeEach(() => {
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.tz.setDefault();
    jest.restoreAllMocks();
    cleanup();
  });

  it('renders free text question', async () => {
    render(<Question {...props} ques={MOCK_RESPONSE_TEXT_QUESTION} />);

    const { question } = MOCK_RESPONSE_TEXT_QUESTION;

    const freeTextQuestion = screen.getByRole('textbox');
    expect(freeTextQuestion).toBeInTheDocument();

    expect(screen.getByText(question.question)).toBeInTheDocument();

    await userEvent.type(freeTextQuestion, 'x');

    expect(props.onChange).toHaveBeenCalledWith({
      quest: MOCK_RESPONSE_TEXT_QUESTION,
      answer: { question_id: question.id, value: ['x'] },
    });
  });

  it('renders date question', async () => {
    render(<Question {...props} ques={MOCK_RESPONSE_DATE_QUESTION} />);

    const { question } = MOCK_RESPONSE_DATE_QUESTION;

    const dateQuestion = screen.getByLabelText(question.question);
    expect(dateQuestion).toBeInTheDocument();

    await fireEvent.change(dateQuestion, {
      target: { value: MOCK_DATE },
    });

    expect(props.onChange).toHaveBeenCalledWith({
      quest: MOCK_RESPONSE_DATE_QUESTION,
      answer: {
        question_id: question.id,
        value: [MOCK_DATE],
      },
    });
  });

  it('renders basic select question', async () => {
    render(<Question {...props} />);

    const { question } = props.ques;

    const basicSelect = screen.getByLabelText(question.question);

    expect(basicSelect).toBeInTheDocument();

    selectEvent.openMenu(basicSelect);

    // ensure the select list is shown
    const optionsForBasicSelect = question.question_metadata;

    const selectedOption = optionsForBasicSelect[0];

    optionsForBasicSelect.forEach((option) => {
      expect(screen.getByText(option.value)).toBeInTheDocument();
    });

    // ensure onClick works with correct payload
    await userEvent.click(screen.getByText(selectedOption.value));

    expect(props.onChange).toHaveBeenCalledWith({
      quest: props.ques,
      answer: { question_id: question.id, value: [selectedOption.value] },
    });
  });

  describe('answers flow', () => {
    it('renders textarea answer', async () => {
      const { question } = MOCK_RESPONSE_TEXT_QUESTION;

      render(
        <Question
          {...props}
          ques={MOCK_RESPONSE_TEXT_QUESTION}
          conditionalFieldsAnswers={[
            {
              question_id: question.id,
              value: ['free text value'],
              screening_ruleset_version_id: 666,
            },
          ]}
        />
      );

      const freeTextQuestion = screen.getByRole('textbox');

      expect(freeTextQuestion).toBeInTheDocument();
      expect(freeTextQuestion).toHaveValue('free text value');
    });
    it('renders date answer', async () => {
      const { question } = MOCK_RESPONSE_DATE_QUESTION;

      render(
        <Question
          {...props}
          ques={MOCK_RESPONSE_DATE_QUESTION}
          conditionalFieldsAnswers={[
            {
              question_id: question.id,
              value: [MOCK_DATE],
              screening_ruleset_version_id: 666,
            },
          ]}
        />
      );

      const dateQuestion = screen.getByLabelText(question.question);
      expect(dateQuestion).toBeInTheDocument();

      expect(dateQuestion).toHaveValue(MOCK_DATE);
    });
    it('renders select answer', async () => {
      const { question } = MOCK_RESPONSE_QUESTION_WITH_FOLLOWUPS;

      const optionsForSelect = question.question_metadata;

      const selectedOption = optionsForSelect[0];

      render(
        <Question
          {...props}
          ques={MOCK_RESPONSE_QUESTION_WITH_FOLLOWUPS}
          conditionalFieldsAnswers={[
            {
              question_id: question.id,
              value: [selectedOption.value],
              screening_ruleset_version_id: 666,
            },
          ]}
        />
      );
      const selectComponent = screen.getByLabelText(question.question);

      expect(selectComponent).toBeInTheDocument();

      const selectAnswer = screen.getByText(selectedOption.value);

      expect(selectAnswer).toBeInTheDocument();
    });
  });

  describe('V2 answers array flow', () => {
    it('renders textarea answer', async () => {
      const { question } = MOCK_RESPONSE_TEXT_QUESTION;

      render(
        <Question
          {...props}
          ques={MOCK_RESPONSE_TEXT_QUESTION}
          conditionalFieldsAnswers={[
            {
              question_id: question.id,
              answers: [
                {
                  value: 'free text value',
                },
              ],
              screening_ruleset_version_id: 666,
            },
          ]}
        />
      );

      const freeTextQuestion = screen.getByRole('textbox');

      expect(freeTextQuestion).toBeInTheDocument();
      expect(freeTextQuestion).toHaveValue('free text value');
    });
    it('renders date answer', async () => {
      const { question } = MOCK_RESPONSE_DATE_QUESTION;

      render(
        <Question
          {...props}
          ques={MOCK_RESPONSE_DATE_QUESTION}
          conditionalFieldsAnswers={[
            {
              question_id: question.id,
              answers: [
                {
                  value: MOCK_DATE,
                },
              ],
              screening_ruleset_version_id: 666,
            },
          ]}
        />
      );

      const dateQuestion = screen.getByLabelText(question.question);
      expect(dateQuestion).toBeInTheDocument();

      expect(dateQuestion).toHaveValue(MOCK_DATE);
    });
    it('renders select answer', async () => {
      const { question } = MOCK_RESPONSE_QUESTION_WITH_FOLLOWUPS;

      const optionsForSelect = question.question_metadata;

      const selectedOption = optionsForSelect[0];

      render(
        <Question
          {...props}
          ques={MOCK_RESPONSE_QUESTION_WITH_FOLLOWUPS}
          conditionalFieldsAnswers={[
            {
              question_id: question.id,
              answers: [{ value: selectedOption.value }],
              screening_ruleset_version_id: 666,
            },
          ]}
        />
      );
      const selectComponent = screen.getByLabelText(question.question);

      expect(selectComponent).toBeInTheDocument();

      const selectAnswer = screen.getByText(selectedOption.value);

      expect(selectAnswer).toBeInTheDocument();
    });
  });

  describe('V2 answers array with null value flow', () => {
    it('renders textarea empty string answer', async () => {
      const { question } = MOCK_RESPONSE_TEXT_QUESTION;

      render(
        <Question
          {...props}
          ques={MOCK_RESPONSE_TEXT_QUESTION}
          conditionalFieldsAnswers={[
            {
              question_id: question.id,
              answers: [
                {
                  value: '', // Test empty string
                },
              ],
              screening_ruleset_version_id: 666,
            },
          ]}
        />
      );

      const freeTextQuestion = screen.getByRole('textbox');

      expect(freeTextQuestion).toBeInTheDocument();
      expect(freeTextQuestion).toHaveValue('');
    });
    it('renders textarea null answer', async () => {
      const { question } = MOCK_RESPONSE_TEXT_QUESTION;

      render(
        <Question
          {...props}
          ques={MOCK_RESPONSE_TEXT_QUESTION}
          conditionalFieldsAnswers={[
            {
              question_id: question.id,
              answers: [
                {
                  value: null, // Test null
                },
              ],
              screening_ruleset_version_id: 666,
            },
          ]}
        />
      );

      const freeTextQuestion = screen.getByRole('textbox');

      expect(freeTextQuestion).toBeInTheDocument();
      expect(freeTextQuestion).toHaveValue('');
    });
    it('renders empty string date answer', async () => {
      const { question } = MOCK_RESPONSE_DATE_QUESTION;

      render(
        <Question
          {...props}
          ques={MOCK_RESPONSE_DATE_QUESTION}
          conditionalFieldsAnswers={[
            {
              question_id: question.id,
              answers: [
                {
                  value: '',
                },
              ],
              screening_ruleset_version_id: 666,
            },
          ]}
        />
      );

      const dateQuestion = screen.getByLabelText(question.question);
      expect(dateQuestion).toBeInTheDocument();

      expect(dateQuestion).toHaveValue('');
    });
    it('renders null date answer', async () => {
      const { question } = MOCK_RESPONSE_DATE_QUESTION;

      render(
        <Question
          {...props}
          ques={MOCK_RESPONSE_DATE_QUESTION}
          conditionalFieldsAnswers={[
            {
              question_id: question.id,
              answers: [
                {
                  value: null,
                },
              ],
              screening_ruleset_version_id: 666,
            },
          ]}
        />
      );

      const dateQuestion = screen.getByLabelText(question.question);
      expect(dateQuestion).toBeInTheDocument();

      expect(dateQuestion).toHaveValue('');
    });
    it('renders empty string select answer', async () => {
      const { question } = MOCK_RESPONSE_QUESTION_WITH_FOLLOWUPS;

      const optionsForSelect = question.question_metadata;
      const selectedOption = optionsForSelect[0];

      render(
        <Question
          {...props}
          ques={MOCK_RESPONSE_QUESTION_WITH_FOLLOWUPS}
          conditionalFieldsAnswers={[
            {
              question_id: question.id,
              answers: [{ value: '' }],
              screening_ruleset_version_id: 666,
            },
          ]}
        />
      );
      const selectComponent = screen.getByLabelText(question.question);

      expect(selectComponent).toBeInTheDocument();

      const selectAnswer = screen.queryByText(selectedOption.value);

      expect(selectAnswer).not.toBeInTheDocument();
    });
    it('renders null select answer', async () => {
      const { question } = MOCK_RESPONSE_QUESTION_WITH_FOLLOWUPS;

      const optionsForSelect = question.question_metadata;
      const selectedOption = optionsForSelect[0];

      render(
        <Question
          {...props}
          ques={MOCK_RESPONSE_QUESTION_WITH_FOLLOWUPS}
          conditionalFieldsAnswers={[
            {
              question_id: question.id,
              answers: [{ value: null }],
              screening_ruleset_version_id: 666,
            },
          ]}
        />
      );
      const selectComponent = screen.getByLabelText(question.question);

      expect(selectComponent).toBeInTheDocument();

      const selectAnswer = screen.queryByText(selectedOption.value);

      expect(selectAnswer).not.toBeInTheDocument();
    });
  });
});
