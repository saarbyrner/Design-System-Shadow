import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import PrivacyPolicySettings from '../index';

describe('Organisation Settings <PrivacyPolicySettings /> component', () => {
  let user;
  let baseProps;

  beforeEach(() => {
    user = userEvent.setup();
    baseProps = {
      policyIsActive: false,
      policyText: undefined,
      actionState: 'LOADING',
      fetchPrivacyPolicy: jest.fn(),
      fetchPrivacyPolicyIsActive: jest.fn(),
      onEditingPolicy: jest.fn(),
      onChangePolicy: jest.fn(),
      savePrivacyPolicyIsActive: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('renders the setting widget with the correct title', () => {
    render(<PrivacyPolicySettings {...baseProps} />);

    expect(screen.getByText('Privacy policy')).toBeInTheDocument();
  });

  it('renders an off toggle switch when policyIsActive is false', () => {
    render(<PrivacyPolicySettings {...baseProps} />);

    expect(screen.getByText('Display in Athlete app')).toBeInTheDocument();

    const toggle = screen.getByRole('switch');

    expect(toggle).not.toBeChecked();
  });

  it('renders an enabled and on toggle switch when policyIsActive is true and text exists', () => {
    render(
      <PrivacyPolicySettings
        {...baseProps}
        policyIsActive
        actionState="LOADED"
        policyText="<p>Some policy text</p>"
      />
    );
    expect(screen.getByText('Display in Athlete app')).toBeInTheDocument();

    const toggle = screen.getByRole('switch');

    expect(toggle).toBeChecked();
    expect(toggle).toBeEnabled();
  });

  it('renders the toggle switch disabled when there is no policy text', () => {
    render(<PrivacyPolicySettings {...baseProps} policyText={null} />);

    const toggle = screen.getByRole('switch');

    expect(toggle).toBeDisabled();
  });

  it('renders "No policy set" when text is not set and state is LOADED', () => {
    render(<PrivacyPolicySettings {...baseProps} actionState="LOADED" />);

    expect(screen.getByText('No policy set')).toBeInTheDocument();
  });

  it('renders the policy text when set and state is LOADED', () => {
    render(
      <PrivacyPolicySettings
        {...baseProps}
        actionState="LOADED"
        policyText="<p>test</p>"
      />
    );

    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('calls onEditingPolicy when the Edit button is clicked', async () => {
    render(<PrivacyPolicySettings {...baseProps} actionState="LOADED" />);

    const editButton = screen.getByRole('button', { name: 'Edit' });

    await user.click(editButton);

    expect(baseProps.onEditingPolicy).toHaveBeenCalledWith(true);
  });

  describe('when editing the policy', () => {
    beforeEach(() => {
      baseProps.actionState = 'EDITING';
    });

    it('renders a disabled save button initially', () => {
      render(<PrivacyPolicySettings {...baseProps} />);

      const saveButton = screen.getByRole('button', { name: 'Save' });

      expect(saveButton).toBeDisabled();
    });

    it('renders content on RichTextEditor', async () => {
      render(<PrivacyPolicySettings {...baseProps} />);

      // The actual RichTextEditor component renders a content-editable div with a role of "textbox"
      const editor = screen.getByRole('textbox');

      fireEvent.change(editor, {
        target: { innerHTML: '<p>Edited content</p>' },
      });

      expect(editor).toHaveTextContent('Edited content');
    });

    it('calls onEditingPolicy(false) when cancel is clicked', async () => {
      render(<PrivacyPolicySettings {...baseProps} />);

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });

      await user.click(cancelButton);

      expect(baseProps.onEditingPolicy).toHaveBeenCalledWith(false);
    });
  });
});
