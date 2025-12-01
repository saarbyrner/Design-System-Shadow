import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AskOnEntryComponent from '..';

describe('<AskOnEntryComponent />', () => {
  const props = {
    index: 1,
    formState: { queuedDiagnostics: [{ answers: [] }] },
    choiceOnChange: jest.fn(),
    optionalTextInputOnChange: jest.fn(),
    isValidationCheckAllowed: false,
    t: i18nextTranslateStub(),
  };

  it('renders the choice case when expected', async () => {
    render(
      <AskOnEntryComponent
        {...props}
        questions={[
          {
            label: 'Choice question',
            id: 1,
            question_type: 'choice',
            required: true,
            diagnostic_type_question_choices: [
              { id: 1, name: 'choice label 1', optional_text: 'false' },
              { id: 2, name: 'choice label 2', optional_text: 'true' },
            ],
          },
        ]}
      />
    );

    const questionLabel = await screen.findByText('Choice question');
    expect(questionLabel).toBeInTheDocument();
  });

  it('renders the text case when expected', async () => {
    render(
      <AskOnEntryComponent
        {...props}
        questions={[
          {
            label: 'Text question',
            id: 2,
            question_type: 'text',
            required: false,
          },
        ]}
      />
    );

    const findByText = await screen.findByText('Text question');
    expect(findByText).toBeInTheDocument();
  });
  it('renders the date case when expected', async () => {
    render(
      <AskOnEntryComponent
        {...props}
        questions={[
          {
            label: 'Date question',
            id: 3,
            question_type: 'datetime',
            required: false,
          },
        ]}
      />
    );

    const findByText = await screen.findByText('Date question');
    expect(findByText).toBeInTheDocument();
  });
});
