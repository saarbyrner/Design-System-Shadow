import { screen } from '@testing-library/react';
import LocalizationProvider from '@kitman/playbook/providers/wrappers/LocalizationProvider';
import { renderWithUserEventSetup } from '@kitman/common/src/utils/test_utils';
import Card from '..';

describe('Card', () => {
  const renderComponent = ({ children = 'content', ...restProps } = {}) => {
    return renderWithUserEventSetup(
      <LocalizationProvider>
        <Card
          title="title"
          editForm={<div>Edit form</div>}
          isFormEditable
          {...restProps}
        >
          {children}
        </Card>
      </LocalizationProvider>
    );
  };
  it('renders correctly', () => {
    renderComponent();

    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('shows the edit view when Edit button is clicked', async () => {
    const { user } = renderComponent();

    const editButton = screen.getByText('Edit');
    await user.click(editButton);

    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Edit form')).toBeInTheDocument();
  });

  it('disables cancel and save button when isSubmitting is true', async () => {
    const { user } = renderComponent({ isSubmitting: true });

    const editButton = screen.getByText('Edit');
    await user.click(editButton);

    expect(screen.getByText('Cancel')).toBeDisabled();
    expect(screen.getByText('Loading...')).toBeDisabled();
  });

  it('disables save button when isFormValid is false', async () => {
    const { user } = renderComponent({ isFormValid: false });

    const editButton = screen.getByText('Edit');
    await user.click(editButton);
    expect(screen.getByText('Save')).toBeDisabled();
  });

  it('calls onSubmitForm when click on save', async () => {
    const onSubmitForm = jest.fn();
    const { user } = renderComponent({ isFormValid: true, onSubmitForm });

    const editButton = screen.getByText('Edit');
    await user.click(editButton);

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);
    expect(onSubmitForm).toHaveBeenCalled();
  });

  it('calls onResetForm when click on cancel', async () => {
    const onResetForm = jest.fn();
    const { user } = renderComponent({ isFormValid: true, onResetForm });

    await user.click(screen.getByText('Edit'));
    await user.click(screen.getByText('Cancel'));
    expect(onResetForm).toHaveBeenCalled();
  });

  it('shows edit button when isFormEditable is true', () => {
    renderComponent({ isFormEditable: true });
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('hides edit button when isFormEditable is false', () => {
    renderComponent({ isFormEditable: false });
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });
});
