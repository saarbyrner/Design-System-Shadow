import { render, screen, fireEvent, within } from '@testing-library/react';
import i18n from 'i18next';
import { setI18n } from 'react-i18next';

import useRegistrationStatus from '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationStatus';
import useManageSection from '../hooks/useManageSection';
import ApprovalForm from '../components/ApprovalForm';

jest.mock('../hooks/useManageSection');
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationStatus'
);

setI18n(i18n);

describe('ApprovalForm', () => {
  const mockOnAddAnnotation = jest.fn();
  const mockOnApplyStatus = jest.fn();
  const mockApprovalOptions = [
    { value: 'approve', label: 'Approve' },
    { value: 'reject', label: 'Reject' },
  ];
  const mockSectionStatus = [{ value: 'pending', label: 'Pending' }];

  beforeEach(() => {
    useManageSection.mockReturnValue({
      isSectionApprovable: true,
      approvalOptions: mockApprovalOptions,
      onApplyStatus: mockOnApplyStatus,
      onAddAnnotation: mockOnAddAnnotation,
    });

    useRegistrationStatus.mockReturnValue({
      sectionStatuses: mockSectionStatus,
      isSuccessSectionStatuses: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the form when isSectionApprovable is true', () => {
    render(<ApprovalForm />);

    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Note/i)).toBeInTheDocument();
  });

  it('should not render the form when isSectionApprovable is false', () => {
    useManageSection.mockReturnValue({
      isSectionApprovable: false,
      approvalOptions: [],
      onApplyStatus: jest.fn(),
      onAddAnnotation: jest.fn(),
    });

    const { container } = render(<ApprovalForm />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should call onApplyStatus with useManageSection data', () => {
    useRegistrationStatus.mockReturnValue({
      sectionStatuses: mockSectionStatus,
      isSuccessSectionStatuses: false,
    });

    render(<ApprovalForm />);
    fireEvent.mouseDown(screen.getByLabelText(/Status/i));

    const listbox = within(screen.getByRole('listbox'));
    fireEvent.click(listbox.getByText(/Approve/i));

    expect(mockOnApplyStatus).toHaveBeenCalledWith({ newStatus: 'approve' });
  });

  it('should call onAddAnnotation when a note is entered', () => {
    render(<ApprovalForm />);

    fireEvent.change(screen.getByLabelText(/Note/i), {
      target: { value: 'This is a note' },
    });

    expect(mockOnAddAnnotation).toHaveBeenCalledWith({
      annotation: 'This is a note',
    });
  });

  it('should call onApplyStatus with useRegistrationStatus data', () => {
    render(<ApprovalForm />);

    fireEvent.mouseDown(screen.getByLabelText(/Status/i));

    const listbox = within(screen.getByRole('listbox'));
    fireEvent.click(listbox.getByText(/Pending/i));

    expect(mockOnApplyStatus).toHaveBeenCalledWith({ newStatus: 'pending' });
  });
});
