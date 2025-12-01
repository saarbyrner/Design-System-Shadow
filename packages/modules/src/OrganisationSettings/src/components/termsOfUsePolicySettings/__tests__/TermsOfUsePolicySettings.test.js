import { render, fireEvent, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import TermsOfUsePolicySettings from '../index';

describe('Organisation Settings <TermsOfUsePolicySettings /> component', () => {
  const props = {
    policyIsActive: false,
    policyText: undefined,
    actionState: 'LOADING',
    fetchTermsOfUsePolicy: jest.fn(),
    fetchTermsOfUsePolicyIsActive: jest.fn(),
    onEditingPolicy: jest.fn(),
    onChangePolicy: jest.fn(),
    saveTermsOfUsePolicyIsActive: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('renders the setting widget', () => {
    render(<TermsOfUsePolicySettings {...props} />);
    expect(screen.getByText('Terms of Use policy')).toBeInTheDocument();
  });

  it('renders an off toggle switch when policyIsActive is false', () => {
    render(<TermsOfUsePolicySettings {...props} />);
    const toggleSwitch = screen.getByRole('switch', { checked: false });
    expect(toggleSwitch).toBeInTheDocument();
  });

  it('renders an enabled and on toggle switch when policyIsActive is true', () => {
    render(
      <TermsOfUsePolicySettings
        {...props}
        policyIsActive
        actionState="LOADED"
        policyText="test"
      />
    );
    const toggleSwitch = screen.getByRole('switch', {
      checked: true,
      disabled: false,
    });
    expect(toggleSwitch).toBeInTheDocument();
  });

  it('renders the toggle switch disabled and off when there is no policy text', () => {
    render(<TermsOfUsePolicySettings {...props} />);
    const toggleSwitch = screen.getByRole('switch', {
      checked: false,
      disabled: true,
    });
    expect(toggleSwitch).toBeInTheDocument();
  });

  it('renders "No policy set" when not set', () => {
    render(<TermsOfUsePolicySettings {...props} actionState="LOADED" />);
    expect(screen.getByText('No policy set')).toBeInTheDocument();
  });

  it('renders the policy text when set', () => {
    render(
      <TermsOfUsePolicySettings
        {...props}
        actionState="LOADED"
        policyText="<p>test</p>"
      />
    );
    expect(screen.queryByText('No policy set')).not.toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('renders clickable Edit text', () => {
    render(<TermsOfUsePolicySettings {...props} actionState="LOADED" />);
    const editButton = screen.getByText('Edit');
    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);
    expect(props.onEditingPolicy).toHaveBeenCalled();
  });

  it('renders a disabled save button if starting to edit the policy', () => {
    render(<TermsOfUsePolicySettings {...props} actionState="EDITING" />);
    const cancelButton = screen.getByText('Cancel');
    const saveButton = screen.getAllByRole('button')[7];

    expect(saveButton).toHaveTextContent('Save');
    expect(cancelButton).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });
});
