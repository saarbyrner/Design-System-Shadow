import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { inputTypes } from '../utils';
import { EditableLabel } from '../EditableLabel';

describe('<EditableLabel />', () => {
  const props = {
    inputType: inputTypes.Input,
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    onOpenDrill: jest.fn(),
    value: 'value',
  };

  it('shows prop `value` if prop `label` isn’t passed', async () => {
    render(<EditableLabel {...props} />);

    const buttonLabel = screen.getByText(props.value);
    expect(buttonLabel).toBeInTheDocument();

    const button = buttonLabel.parentNode;
    expect(button).toBeInTheDocument();

    const editIcon = button.querySelector('.icon-edit');
    expect(editIcon).toBeInTheDocument();
  });

  it('shows prop `label` if it’s passed', async () => {
    const label = 'label';
    render(<EditableLabel {...props} label={label} />);

    const buttonLabel = screen.getByText(label);
    expect(buttonLabel).toBeInTheDocument();
  });

  it('opens the input with controls if prop `isEdited` is truthy', async () => {
    render(<EditableLabel {...props} isEdited />);

    const input = screen.getByDisplayValue(props.value);
    expect(input).toBeInTheDocument();

    const inputControls = input.parentNode;

    const submitButtonLabel = inputControls.querySelector('.icon-check');
    expect(submitButtonLabel).toBeInTheDocument();
    const cancelButtonLabel = inputControls.querySelector('.icon-close');
    expect(cancelButtonLabel).toBeInTheDocument();
  });

  it('uses <textarea /> with controls if prop `inputType` is ‘textarea’ and if prop `isEdited` is truthy', async () => {
    render(
      <EditableLabel {...props} inputType={inputTypes.Textarea} isEdited />
    );

    const input = document.querySelector('textarea');
    expect(input).toBeInTheDocument();
  });

  it('uses <Select /> with controls if prop `inputType` is ‘select’ and if prop `isEdited` is truthy', async () => {
    render(
      <EditableLabel
        {...props}
        inputType={inputTypes.Select}
        options={[]}
        isEdited
      />
    );

    const input = document.querySelector('.kitmanReactSelect');
    expect(input).toBeInTheDocument();
  });

  it('shows prop `editLabel` as the label if prop `isEdited` is truthy', async () => {
    const editLabel = 'edit label';
    render(<EditableLabel {...props} editLabel={editLabel} isEdited />);

    const label = screen.getByText(editLabel);
    expect(label).toBeInTheDocument();
  });

  it('opens the input with controls on the value click', async () => {
    const user = userEvent.setup();
    render(<EditableLabel {...props} />);

    const button = screen.getByText(props.value).parentNode;
    await user.click(button);

    const input = screen.getByDisplayValue(props.value);
    expect(input).toBeInTheDocument();

    const inputControls = input.parentNode;

    const submitButtonLabel = inputControls.querySelector('.icon-check');
    expect(submitButtonLabel).toBeInTheDocument();
    const cancelButtonLabel = inputControls.querySelector('.icon-close');
    expect(cancelButtonLabel).toBeInTheDocument();
  });

  it('shows prop `editLabel` as the label for the click', async () => {
    const editLabel = 'edit label';
    const user = userEvent.setup();
    render(<EditableLabel {...props} editLabel={editLabel} />);

    const button = screen.getByText(props.value).parentNode;
    await user.click(button);

    const label = screen.getByText(editLabel);
    expect(label).toBeInTheDocument();
  });

  it('calls prop `onSubmit` with a submitted value', async () => {
    const user = userEvent.setup();
    const newValue = 'new value';
    render(<EditableLabel {...props} />);

    const button = screen.getByText(props.value).parentNode;
    await user.click(button);

    const input = screen.getByDisplayValue(props.value);
    await user.clear(input);
    fireEvent.change(input, { target: { value: newValue } });

    const submitButton =
      input.parentNode.querySelector('.icon-check').parentNode;
    await user.click(submitButton);

    expect(props.onSubmit).toHaveBeenCalledWith(newValue);
  });

  it('calls prop `onCancel` on the cancel button', async () => {
    const user = userEvent.setup();
    render(<EditableLabel {...props} />);

    const button = screen.getByText(props.value).parentNode;
    await user.click(button);

    const input = screen.getByDisplayValue(props.value);
    const cancelButton =
      input.parentNode.querySelector('.icon-close').parentNode;
    await user.click(cancelButton);

    expect(props.onCancel).toHaveBeenCalled();
  });

  it('calls prop `onOpenDrill` on the wrapper click', async () => {
    const user = userEvent.setup();
    render(<EditableLabel {...props} />);

    await user.click(screen.getByTestId('EditableLabelWrapper'));

    expect(props.onOpenDrill).toHaveBeenCalled();
  });
});
