import { render, screen, fireEvent, within } from '@testing-library/react';
import i18n from 'i18next';
import { setI18n } from 'react-i18next';
import useApproveRegistration from '@kitman/modules/src/LeagueOperations/shared/components/ApproveRegistrationPanel/hooks/useApproveRegistration';
import useRegistrationStatus from '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationStatus';
import RegistrationApprovalForm from '../components/RegistrationApprovalForm';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/components/ApproveRegistrationPanel/hooks/useApproveRegistration'
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationStatus'
);

setI18n(i18n);

describe('RegistrationApprovalForm', () => {
  const mockOnAddAnnotation = jest.fn();
  const mockOnApplyStatus = jest.fn();
  const mockApprovalOptions = [
    { value: 'approve', label: 'Approve' },
    { value: 'reject', label: 'Reject' },
  ];
  const mockRegistrationStatuses = [{ value: 'pending', label: 'Pending' }];

  beforeEach(() => {
    useApproveRegistration.mockReturnValue({
      onAddAnnotation: mockOnAddAnnotation,
      onApplyStatus: mockOnApplyStatus,
      approvalOptions: mockApprovalOptions,
    });

    useRegistrationStatus.mockReturnValue({
      registrationFilterStatuses: mockRegistrationStatuses,
      isSuccessRegistrationApplicationStatuses: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    render(<RegistrationApprovalForm />);
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Note/i)).toBeInTheDocument();
  });

  it('should call onApplyStatus when a new status is selected', () => {
    render(<RegistrationApprovalForm />);

    fireEvent.mouseDown(screen.getByLabelText(/Status/i));

    const listbox = within(screen.getByRole('listbox'));
    fireEvent.click(listbox.getByText(/Approve/i));

    expect(mockOnApplyStatus).toHaveBeenCalledWith({ status: 'approve' });
  });

  it('should call onAddAnnotation when a note is entered', () => {
    render(<RegistrationApprovalForm />);

    fireEvent.change(screen.getByLabelText(/Note/i), {
      target: { value: 'This is a note' },
    });

    expect(mockOnAddAnnotation).toHaveBeenCalledWith({
      annotation: 'This is a note',
    });
  });

  it('should call onApplyStatus when featureFlag is true with a new status', () => {
    useRegistrationStatus.mockReturnValue({
      registrationApplicationStatus: mockRegistrationStatuses,
      isSuccessRegistrationApplicationStatuses: true,
    });

    render(<RegistrationApprovalForm />);

    fireEvent.mouseDown(screen.getByLabelText(/Status/i));

    const listbox = within(screen.getByRole('listbox'));
    fireEvent.click(listbox.getByText(/Pending/i));

    expect(mockOnApplyStatus).toHaveBeenCalledWith({ status: 'pending' });
  });
});
