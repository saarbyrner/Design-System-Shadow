import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import UpdatePrivacyPolicyModal from '../UpdatePrivacyPolicyModal';

describe('Organisation Settings <UpdatePrivacyPolicyModal /> component', () => {
  let user;
  let baseProps;

  beforeEach(() => {
    user = userEvent.setup();
    baseProps = {
      isOpen: true,
      onSave: jest.fn(),
      onClose: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('renders the modal with the correct title and content', () => {
    render(<UpdatePrivacyPolicyModal {...baseProps} />);

    // Check for the modal's title
    expect(
      screen.getByRole('heading', { name: 'Update privacy policy' })
    ).toBeInTheDocument();

    // Check for the descriptive content
    expect(
      screen.getByText(
        'This update will prompt all athletes to acknowledge the new privacy policy text in the Athlete app.'
      )
    ).toBeInTheDocument();
  });

  it('renders the Save and Cancel buttons', () => {
    render(<UpdatePrivacyPolicyModal {...baseProps} />);

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('calls the onSave callback when the Save button is clicked', async () => {
    render(<UpdatePrivacyPolicyModal {...baseProps} />);

    const saveButton = screen.getByRole('button', { name: 'Save' });

    await user.click(saveButton);

    expect(baseProps.onSave).toHaveBeenCalledTimes(1);
  });

  it('calls the onClose callback when the Cancel button is clicked', async () => {
    render(<UpdatePrivacyPolicyModal {...baseProps} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    await user.click(cancelButton);

    expect(baseProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls the onClose callback when the modal close icon is clicked', async () => {
    render(<UpdatePrivacyPolicyModal {...baseProps} />);

    await user.click(
      screen.getByRole('button', {
        name: /cancel/i,
      })
    );
    expect(baseProps.onClose).toHaveBeenCalledTimes(1);
  });
});
