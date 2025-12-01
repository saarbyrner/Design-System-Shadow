import { render, fireEvent, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import UpdateTermsOfUsePolicyModal from '../UpdateTermsOfUsePolicyModal';

describe('UpdateTermsOfUsePolicyModal', () => {
  const props = {
    isOpen: true,
    onSave: jest.fn(),
    onClose: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('render the modal', () => {
    render(<UpdateTermsOfUsePolicyModal {...props} />);
    expect(screen.getByText('Update Terms of Use policy')).toBeInTheDocument();
  });

  it('has a Save button', () => {
    render(<UpdateTermsOfUsePolicyModal {...props} />);
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('calls the correct props when the save button is clicked', () => {
    render(<UpdateTermsOfUsePolicyModal {...props} />);
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    expect(props.onSave).toHaveBeenCalled();
  });

  it('has a Cancel button', () => {
    render(<UpdateTermsOfUsePolicyModal {...props} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls the correct props when the cancel button is clicked', () => {
    render(<UpdateTermsOfUsePolicyModal {...props} />);
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(props.onClose).toHaveBeenCalled();
  });

  it('calls the correct props when closing the modal', () => {
    props.onClose.mockReset();
    render(<UpdateTermsOfUsePolicyModal {...props} />);
    const closeButton = screen.getAllByRole('button')[0];
    fireEvent.click(closeButton);
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });
});
