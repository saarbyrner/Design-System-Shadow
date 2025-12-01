import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import SecurityAndPrivacySettings from '../index';

describe('Organisation Settings <SecurityAndPrivacySettings /> component', () => {
  let user;
  let baseProps;

  beforeEach(() => {
    user = userEvent.setup();
    baseProps = {
      privacyPolicyActionState: 'LOADED',
      privacyPolicyText: '<p>This is the policy.</p>',
      privacyPolicyIsActive: true,
      fetchPrivacyPolicy: jest.fn(),
      fetchPrivacyPolicyIsActive: jest.fn(),
      onConfirmUpdatePrivacyPolicy: jest.fn(),
      onEditingPolicy: jest.fn(),
      savePrivacyPolicyIsActive: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('renders the PrivacyPolicySettings component with the correct title', () => {
    render(<SecurityAndPrivacySettings {...baseProps} />);

    expect(screen.getByText('Privacy policy')).toBeInTheDocument();
  });

  it('passes props down and renders the policy text and toggle state correctly', () => {
    render(<SecurityAndPrivacySettings {...baseProps} />);

    // Verify that the policy text passed as a prop is rendered.
    expect(screen.getByText('This is the policy.')).toBeInTheDocument();
    expect(screen.getByText('Display in Athlete app')).toBeInTheDocument();

    const toggle = screen.getByRole('switch');
    expect(toggle).toBeChecked();
  });

  it('calls the fetch actions on initial mount', () => {
    render(<SecurityAndPrivacySettings {...baseProps} />);

    // The child component calls these functions in its useEffect hook.
    // Verifying they are called ensures the parent has rendered the child.
    expect(baseProps.fetchPrivacyPolicy).toHaveBeenCalledTimes(1);
    expect(baseProps.fetchPrivacyPolicyIsActive).toHaveBeenCalledTimes(1);
  });

  it('calls the savePrivacyPolicyIsActive prop when the toggle is clicked', async () => {
    render(<SecurityAndPrivacySettings {...baseProps} />);

    const toggle = screen.getByRole('switch');
    await user.click(toggle);

    // Verifies that the callback prop from the parent is passed down and executed.
    expect(baseProps.savePrivacyPolicyIsActive).toHaveBeenCalledTimes(1);
    // It should be called with the opposite of the current state.
    expect(baseProps.savePrivacyPolicyIsActive).toHaveBeenCalledWith(false);
  });
});
