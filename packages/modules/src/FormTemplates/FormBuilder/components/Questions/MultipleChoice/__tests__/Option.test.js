import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { getMultipleChoiceQuestionTranslations } from '../utils/helpers';
import Option from '../Option';

describe('<Option />', () => {
  const props = {
    choiceIndex: 1,
    choice: {
      value: 'Good',
      label: 'Good',
      score: 5,
      color: '#f6c7ad',
    },
    onChangeColor: jest.fn(),
    onChangeScore: jest.fn(),
    onChangeOptionName: jest.fn(),
    onDeleteOption: jest.fn(),
  };
  const translations = getMultipleChoiceQuestionTranslations();

  it('should render and call callbacks', async () => {
    const user = userEvent.setup();
    render(<Option {...props} />);

    const optionInput = screen.getByLabelText(
      `${translations.option} ${props.choiceIndex + 1}`
    );

    expect(optionInput).toBeInTheDocument();
    expect(optionInput).toHaveValue(props.choice.label);

    await user.type(optionInput, '1');

    expect(props.onChangeOptionName).toHaveBeenCalledWith('Good1');

    // delete button
    const deleteOptionButton = screen.getByRole('button', {
      name: /delete/i,
    });

    expect(deleteOptionButton).toBeInTheDocument();
    expect(deleteOptionButton).toBeEnabled();

    await user.click(deleteOptionButton);

    expect(props.onDeleteOption).toHaveBeenCalled();

    // score
    const scoreInput = screen.getByLabelText(translations.weightedScore);
    expect(scoreInput).toBeInTheDocument();
    expect(scoreInput).toBeEnabled();
    expect(scoreInput).toHaveValue(props.choice.score.toString());

    await user.type(scoreInput, 'g'); // NaN
    expect(scoreInput).toHaveValue(props.choice.score.toString());
    expect(props.onChangeScore).not.toHaveBeenCalled();

    const newScore = 6;
    await user.clear(scoreInput);
    await user.keyboard(newScore.toString());
    const newValueString = props.choice.score.toString() + newScore.toString();
    expect(props.onChangeScore).toHaveBeenCalledWith(+newValueString);

    // color
    const colorInput = screen.getByLabelText(translations.color);
    expect(colorInput).toBeInTheDocument();
    expect(colorInput).toBeEnabled();
    expect(colorInput).toHaveValue(props.choice.color);
  });
});
