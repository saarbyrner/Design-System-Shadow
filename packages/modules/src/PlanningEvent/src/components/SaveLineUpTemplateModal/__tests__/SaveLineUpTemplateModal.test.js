import { render, fireEvent } from '@testing-library/react';
import { SaveLineUpTemplateModalTranslated as SaveLineUpTemplateModal } from '..';

describe('SaveLineUpTemplateModal', () => {
  it('renders without errors', () => {
    const { container } = render(
      <SaveLineUpTemplateModal
        show
        setShow={jest.fn()}
        onConfirm={jest.fn()}
        t={(v) => v}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('triggers the onConfirm function when Save button is clicked', () => {
    const onConfirmMock = jest.fn();
    const { getByText, getByLabelText } = render(
      <SaveLineUpTemplateModal
        show
        setShow={jest.fn()}
        onConfirm={onConfirmMock}
      />
    );

    const saveButton = getByText('Save');
    const nameInput = getByLabelText('Line-up template name');

    fireEvent.change(nameInput, { target: { value: 'Test Line-up' } });
    fireEvent.click(saveButton);

    expect(onConfirmMock).toHaveBeenCalledTimes(1);
    expect(onConfirmMock).toHaveBeenCalledWith('Test Line-up');
  });

  it('clears the name input after Save button is clicked', () => {
    const { getByText, getByLabelText } = render(
      <SaveLineUpTemplateModal
        show
        setShow={jest.fn()}
        onConfirm={jest.fn()}
        t={(v) => v}
      />
    );

    const saveButton = getByText('Save');
    const nameInput = getByLabelText('Line-up template name');

    fireEvent.change(nameInput, { target: { value: 'Test Line-up' } });
    fireEvent.click(saveButton);

    expect(nameInput.value).toBe('');
  });

  it('disables the Save button when the name input is empty', () => {
    const onConfirmMock = jest.fn();

    const { getByText } = render(
      <SaveLineUpTemplateModal
        show
        setShow={jest.fn()}
        onConfirm={jest.fn()}
        t={(v) => v}
      />
    );

    fireEvent.click(getByText('Save'));

    expect(onConfirmMock).toHaveBeenCalledTimes(0);
  });
});
