import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChoiceEntryQuestion from '..';

describe('<ChoiceEntryQuestion />', () => {
  const props = {
    choiceOptions: [
      { value: 'other', label: 'other', optionalText: true },
      { value: 'SGIDNumber', label: 'choice label 2', optionalText: false },
    ],
    choiceLabel: 'Dispenser',
    renderOptionalTextField: false,
    choiceValue: '',
    choiceOnChange: jest.fn(),
    optionalTextInputValue: '',
    optionalTextLabel: null,
    isOptionalTextInvalid: false,
    isSelectInvalid: false,
    isSelectDisabled: false,
    optionalTextInputOnChange: jest.fn(),
  };

  it('renders the label', async () => {
    render(<ChoiceEntryQuestion {...props} />);

    const findByText = await screen.findByText('Dispenser');
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

    await waitFor(() =>
      expect(screen.getByText('Dispenser')).toBeInTheDocument()
    );

    // Click to open select
    await userEvent.click(screen.getByRole('textbox'));

    // Click to choose item
    await waitFor(() => {
      screen.getByText('other');
    });

    await userEvent.click(screen.getByText('other'));

    await expect(props.choiceOnChange).toHaveBeenCalledTimes(1);
  });

  it('renders invalid CSS when optional choice is invalid', async () => {
    const { container } = render(
      <ChoiceEntryQuestion
        {...props}
        isOptionalTextInvalid
        renderOptionalTextField
      />
    );

    expect(container.getElementsByClassName('inputText--invalid')).toHaveLength(
      1
    );
  });
});
