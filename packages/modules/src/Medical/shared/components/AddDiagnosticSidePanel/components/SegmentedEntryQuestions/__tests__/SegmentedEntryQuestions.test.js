import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SegmentedEntryQuestions from '..';

describe('<SegmentedEntryQuestions />', () => {
  const props = {
    question: {
      required: true,
      diagnostic_type_question_choices: [
        { id: 1, name: 'choice label 1', optional_text: 'false' },
        { id: 2, name: 'choice label 2', optional_text: 'false' },
      ],
    },
    questionLabel: 'Test question label',
    askOnEntryIndex: 1,
    choiceValue: 1,
    choiceOnChange: jest.fn(),
  };

  it('renders the label', async () => {
    render(<SegmentedEntryQuestions {...props} />);

    const findByText = await screen.findByText('Test question label');
    expect(findByText).toBeInTheDocument();
  });

  it('calls choiceOnChange prop when user selects', async () => {
    render(<SegmentedEntryQuestions {...props} />);

    await userEvent.click(screen.getByText('choice label 2'));
    await expect(props.choiceOnChange).toHaveBeenCalledTimes(1);
  });
});
