import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChoiceEntryQuestion from '..';

describe('<ChoiceEntryQuestion />', () => {
  const props = {
    question: {
      required: true,
      diagnostic_type_question_choices: [
        { id: 1, name: 'choice label 1', optional_text: 'false' },
        { id: 2, name: 'choice label 2', optional_text: 'true' },
      ],
    },
    askOnEntryIndex: 1,
    renderOptionalTextField: false,
    choiceValue: 1,
    questionType: 'choice',
    choiceOnChange: jest.fn(),
    optionalTextInputValue: '',
    optionalTextLabel: null,
    isOptionalTextInvalid: false,
    isSelectInvalid: false,
    questionLabel: 'Test question label',
    optionalTextInputOnChange: jest.fn(),
  };

  it('renders the label', async () => {
    render(<ChoiceEntryQuestion {...props} />);

    const findByText = await screen.findByText('Test question label');
    expect(findByText).toBeInTheDocument();
  });

  it('renders OptionalTextField when render prop is true', () => {
    const { container } = render(
      <ChoiceEntryQuestion {...props} renderOptionalTextField />
    );
    expect(
      container.getElementsByClassName('inputText--kitmanDesignSystem')
    ).toHaveLength(1);
  });

  it('calls choiceOnChange prop when user selects', async () => {
    render(<ChoiceEntryQuestion {...props} />);
    // Click to open select
    await userEvent.click(screen.getByRole('textbox'));
    // Click to choose item
    await userEvent.click(screen.getByText('choice label 2'));

    await expect(props.choiceOnChange).toHaveBeenCalledTimes(1);
  });

  it('Shows optional text when not required', async () => {
    const { container } = render(
      <ChoiceEntryQuestion
        {...props}
        question={{ ...props.question, required: false }}
      />
    );

    expect(
      container.getElementsByClassName(
        'kitmanReactSelect__optionalOrRequiredFieldText'
      )
    ).toHaveLength(1);
  });

  it('renders invalid CSS when invalid', async () => {
    const { container } = render(
      <ChoiceEntryQuestion {...props} isSelectInvalid />
    );

    expect(
      container.getElementsByClassName('kitmanReactSelect--invalid')
    ).toHaveLength(1);
  });
});
