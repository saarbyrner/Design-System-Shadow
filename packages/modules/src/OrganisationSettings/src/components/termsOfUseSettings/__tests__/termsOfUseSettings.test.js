import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import TermsOfUsePolicySettings from '../index';

describe('Organisation Settings <TermsOfUsePolicySettings /> component', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      termsOfUsePolicyIsActive: false,
      termsOfUsePolicyText: undefined,
      termsOfUsePolicyActionState: 'LOADING',
      fetchTermsOfUsePolicy: jest.fn(),
      fetchTermsOfUsePolicyIsActive: jest.fn(),
      onEditingPolicy: jest.fn(),
      onConfirmUpdateTermsOfUsePolicy: jest.fn(),
      saveTermsOfUsePolicyIsActive: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('renders the setting widget with the correct title', () => {
    render(<TermsOfUsePolicySettings {...baseProps} />);

    expect(screen.getByText('Terms of Use policy')).toBeInTheDocument();
  });

  it('calls fetch actions on initial mount', () => {
    render(<TermsOfUsePolicySettings {...baseProps} />);

    expect(baseProps.fetchTermsOfUsePolicy).toHaveBeenCalledTimes(1);
    expect(baseProps.fetchTermsOfUsePolicyIsActive).toHaveBeenCalledTimes(1);
  });

  it('renders an off toggle switch when policyIsActive is false', () => {
    render(<TermsOfUsePolicySettings {...baseProps} />);

    expect(
      screen.getByText('Use custom Terms of Use policy')
    ).toBeInTheDocument();
    const toggle = screen.getByRole('switch');

    expect(toggle).not.toBeChecked();
  });

  it('renders a checked switch when termsOfUsePolicyIsActive is true and text exists', () => {
    render(
      <TermsOfUsePolicySettings
        {...baseProps}
        termsOfUsePolicyIsActive
        actionState="LOADED"
        policyText="<p>Some policy text</p>"
      />
    );
    const row = screen
      .getByText('Use custom Terms of Use policy')
      .closest('tr');
    const toggle = within(row).getByRole('switch');

    expect(toggle).toBeChecked();
  });

  it('renders the toggle switch disabled when there is no policy text', () => {
    render(
      <TermsOfUsePolicySettings {...baseProps} termsOfUsePolicyText={null} />
    );
    const row = screen
      .getByText('Use custom Terms of Use policy')
      .closest('tr');
    const toggle = within(row).getByRole('switch');

    expect(toggle).toBeDisabled();
  });

  it('renders "No policy set" when text is not set and state is LOADED and there is no policy text', () => {
    render(
      <TermsOfUsePolicySettings
        {...baseProps}
        termsOfUsePolicyActionState="LOADED"
        termsOfUsePolicyText={null}
      />
    );

    expect(screen.getByText('No policy set')).toBeInTheDocument();
  });

  it('renders the policy text when set and state is LOADED', () => {
    render(
      <TermsOfUsePolicySettings
        {...baseProps}
        termsOfUsePolicyActionState="LOADED"
        termsOfUsePolicyText="<p>test</p>"
      />
    );
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('calls onEditingPolicy when the Edit button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TermsOfUsePolicySettings
        {...baseProps}
        termsOfUsePolicyActionState="LOADED"
      />
    );

    const editButton = screen.getByRole('button', { name: 'Edit' });

    await user.click(editButton);

    expect(baseProps.onEditingPolicy).toHaveBeenCalledWith(true);
  });

  describe('when editing the policy', () => {
    beforeEach(() => {
      baseProps.termsOfUsePolicyActionState = 'EDITING';
    });

    it('renders a disabled save button initially', () => {
      render(<TermsOfUsePolicySettings {...baseProps} />);

      const saveButton = screen.getByRole('button', { name: 'Save' });

      expect(saveButton).toBeDisabled();
    });

    it('calls onEditingPolicy(false) when cancel is clicked', async () => {
      const user = userEvent.setup();

      render(<TermsOfUsePolicySettings {...baseProps} />);

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });

      await user.click(cancelButton);

      expect(baseProps.onEditingPolicy).toHaveBeenCalledWith(false);
    });
  });
});
