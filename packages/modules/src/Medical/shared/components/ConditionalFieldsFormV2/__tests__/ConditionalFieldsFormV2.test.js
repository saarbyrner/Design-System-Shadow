import { render, screen } from '@testing-library/react';
import selectEvent from 'react-select-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';

import { data } from '@kitman/services/src/mocks/handlers/medical/getConditionalFieldsForm';

import ConditionalFieldsFormV2 from '..';

describe('<ConditionalFieldsFormV2 />', () => {
  const props = {
    conditions: data.conditions,
    conditionalFieldsAnswers: [],
    onChange: jest.fn(),
    validQuestionEvent: true,
    t: i18nextTranslateStub(),
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('displays basic form with header and info prompt', () => {
    render(<ConditionalFieldsFormV2 {...props} />);

    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
      'Logic builder'
    );
  });
  it('displays questions list correctly', () => {
    render(<ConditionalFieldsFormV2 {...props} />);

    // ensure each each condition's question list is rendered
    props.conditions.forEach((condition) => {
      condition.questions.forEach(({ question }) => {
        expect(screen.getByText(`${question.question}`)).toBeInTheDocument();
      });
    });
  });

  it('does not display the questions list when validQuestionEvent is false', () => {
    render(<ConditionalFieldsFormV2 {...props} validQuestionEvent={false} />);

    // ensure each each condition's question list is rendered
    props.conditions.forEach((condition) => {
      condition.questions.forEach(({ question }) => {
        expect(
          screen.queryByText(`${question.question}`)
        ).not.toBeInTheDocument();
      });
    });
  });

  it('displays correct options in select', async () => {
    const user = userEvent.setup();
    render(<ConditionalFieldsFormV2 {...props} />);

    const selectWithFollowupQuestions = screen.getByLabelText(
      'How do you like OSICS-10?'
    );

    selectEvent.openMenu(selectWithFollowupQuestions);

    // ensure the select list is shown
    const optionsForSelectWithFollowupQuestions =
      props.conditions[0].questions[0].question.question_metadata;

    const selectedOption = optionsForSelectWithFollowupQuestions[0];

    optionsForSelectWithFollowupQuestions.forEach((option) => {
      expect(screen.getByText(option.value)).toBeInTheDocument();
    });

    // Click on a parent
    await user.click(screen.getByText(selectedOption.value));

    expect(props.onChange).toHaveBeenCalledWith([
      {
        answers: [],
        question_id: props.conditions[0].questions[0].question.id,
        screening_ruleset_version_id:
          props.conditions[0].screening_ruleset_version_id,
        value: [selectedOption.value],
      },
    ]);

    // ensure each each condition's question list is rendered
    props.conditions.forEach((condition) => {
      condition.questions.forEach(({ question }) => {
        expect(screen.getByText(`${question.question}`)).toBeInTheDocument();
      });
    });
  });
  it('displays followup questions to selected option', async () => {
    const optionsForSelectWithFollowupQuestions =
      props.conditions[0].questions[0].question.question_metadata;

    const selectedOption = optionsForSelectWithFollowupQuestions[0];

    // pre-select option 'LOVE'
    render(
      <ConditionalFieldsFormV2
        {...props}
        conditionalFieldsAnswers={[
          {
            question_id: props.conditions[0].questions[0].question.id,
            screening_ruleset_version_id:
              props.conditions[0].screening_ruleset_version_id,
            value: [selectedOption.value],
          },
        ]}
      />
    );

    expect(screen.getByText('Why do you love it?')).toBeInTheDocument();
  });
  it('displays followup answer of selected option', async () => {
    // pre-select parent option with 'Artificial grass'
    const optionsForSelectWithFollowupQuestions =
      props.conditions[5].questions[0].question.question_metadata;

    const selectedParentOption = optionsForSelectWithFollowupQuestions[0];

    const children = props.conditions[5].questions[0].children;

    const selectedChildOption =
      props.conditions[5].questions[0].children[0].question
        .question_metadata[0];

    render(
      <ConditionalFieldsFormV2
        {...props}
        conditionalFieldsAnswers={[
          {
            question_id: props.conditions[5].questions[0].question.id,
            screening_ruleset_version_id:
              props.conditions[0].screening_ruleset_version_id,
            value: [selectedParentOption.value],
          },
          {
            question_id: children[0].question.id,
            screening_ruleset_version_id:
              props.conditions[0].screening_ruleset_version_id,
            value: [selectedChildOption.value],
          },
        ]}
      />
    );

    const parentAnswer = screen.getByText(selectedParentOption.value);
    // displays followup question select
    const followupSelect = screen.getByLabelText(children[0].question.question);
    const followupAnswer = screen.getByText(selectedChildOption.value);

    expect(parentAnswer).toBeInTheDocument();

    expect(followupSelect).toBeInTheDocument();
    expect(followupAnswer).toBeInTheDocument();
  });

  it('displays all followup questions to a single trigger option', async () => {
    const optionsForSelectWithFollowupQuestions =
      props.conditions[6].questions[0].question.question_metadata;

    const selectedOption = optionsForSelectWithFollowupQuestions[0];

    // pre-select option 'yes'
    render(
      <ConditionalFieldsFormV2
        {...props}
        conditionalFieldsAnswers={[
          {
            question_id: props.conditions[6].questions[0].question.id,
            screening_ruleset_version_id:
              props.conditions[0].screening_ruleset_version_id,
            value: [selectedOption.value],
          },
        ]}
      />
    );

    expect(screen.getByText('how come?')).toBeInTheDocument();
    expect(
      screen.getByText('question, tell me what you think about this?')
    ).toBeInTheDocument();
    expect(screen.getByText('another open question?')).toBeInTheDocument();
    expect(screen.getByText('last question?')).toBeInTheDocument();
  });

  it('calls props.onChange with updated answers when a question is changed', async () => {
    const questionWithChildren = props.conditions[0].questions[0]; // "How do you like OSICS-10?"
    const initialAnswer = {
      question_id: questionWithChildren.question.id,
      screening_ruleset_version_id:
        props.conditions[0].screening_ruleset_version_id,
      value: ['LOVE'],
    };
    const childQuestion = questionWithChildren.children[0].question; // "Why do you love it?"
    const childAnswer = {
      question_id: childQuestion.id,
      screening_ruleset_version_id:
        props.conditions[0].screening_ruleset_version_id,
      value: ['Because it is great'],
    };

    render(
      <ConditionalFieldsFormV2
        {...props}
        conditionalFieldsAnswers={[initialAnswer, childAnswer]}
      />
    );

    const selectElement = screen.getByLabelText(
      questionWithChildren.question.question
    );
    selectEvent.openMenu(selectElement);

    // Change the answer to 'HATE'
    await userEvent.click(screen.getByText('HATE'));

    // Expect props.onChange to be called with the updated answer for the parent
    // and without the answer for the child question
    expect(props.onChange).toHaveBeenCalledWith([
      {
        answers: [],
        question_id: questionWithChildren.question.id,
        screening_ruleset_version_id:
          props.conditions[0].screening_ruleset_version_id,
        value: ['HATE'],
      },
    ]);
  });

  it('calls props.onChange with updated answers when a question is cleared', async () => {
    const user = userEvent.setup();

    const questionWithChildren = props.conditions[0].questions[0]; // "How do you like OSICS-10?"
    const initialAnswer = {
      question_id: questionWithChildren.question.id,
      screening_ruleset_version_id:
        props.conditions[0].screening_ruleset_version_id,
      value: ['LOVE'],
    };
    const childQuestion = questionWithChildren.children[0].question; // "Why do you love it?"
    const childAnswer = {
      question_id: childQuestion.id,
      screening_ruleset_version_id:
        props.conditions[0].screening_ruleset_version_id,
      value: ['Because it is great'],
    };

    render(
      <ConditionalFieldsFormV2
        {...props}
        conditionalFieldsAnswers={[initialAnswer, childAnswer]}
      />
    );
    // Use selection text to Find and click the clear button
    const selection = screen.getByText('LOVE');
    const clearButton = selection.parentNode.parentNode.querySelector(
      '.kitmanReactSelect__clear-indicator'
    );
    expect(clearButton).toBeInTheDocument();
    expect(clearButton).toBeVisible();

    await user.click(clearButton);

    // Expect props.onChange to be called with an empty array, as both parent and child answers should be removed
    expect(props.onChange).toHaveBeenCalledWith([]);
  });
});
