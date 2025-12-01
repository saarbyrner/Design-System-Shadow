import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import {
  determineMedicalLevelAndTab,
  getIssueType,
} from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';
import { archiveMedicalInjuryOrIllness } from '@kitman/services/src/services/medical';
import ArchiveIssueModal from '../ArchiveIssueModal';
import {
  mockIssue,
  mockArchiveReasonOptions,
} from './mocks/ArchivedIssueModal';

jest.mock('@kitman/common/src/hooks/useEventTracking');
jest.mock('@kitman/services/src/services/medical');

const mockTrackEvent = jest.fn();

describe('<ArchiveIssueModal />', () => {
  const props = {
    isOpen: true,
    setShowArchiveModal: jest.fn(),
    archiveModalOptions: mockArchiveReasonOptions,
    selectedRow: mockIssue,
    athleteId: 123,
    getIssues: jest.fn(),
    toastAction: jest.fn(),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: mockTrackEvent });
    archiveMedicalInjuryOrIllness.mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('modal header renders correctly', async () => {
    render(<ArchiveIssueModal {...props} />);

    expect(screen.getByText('Archive injury/issue')).toBeInTheDocument();
  });

  it('modal description renders correctly', async () => {
    render(<ArchiveIssueModal {...props} />);

    expect(
      screen.getByText(
        'Please provide the reason why this issue or injury is being archived'
      )
    ).toBeInTheDocument();
  });

  it('modal select correctly rendered', async () => {
    render(<ArchiveIssueModal {...props} />);

    expect(screen.getByText('Reason for archiving:')).toBeInTheDocument();
  });

  it('modal buttons rendered correctly', async () => {
    render(<ArchiveIssueModal {...props} />);

    expect(screen.getByText('Archive')).toBeInTheDocument();
    expect(screen.getByText('Archive').closest('button')).toBeDisabled();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Cancel').closest('button')).toBeEnabled();
  });

  it('[TRACK-EVENT] - tracks Injury/Illness Archived event on successful archive', async () => {
    const user = userEvent.setup();
    render(<ArchiveIssueModal {...props} />);

    expect(screen.getByText('Reason for archiving:')).toBeInTheDocument();

    const inputElement = screen.getByLabelText('Reason for archiving:');
    const footer = screen.getByTestId('Modal|Footer');

    await user.click(inputElement);

    await user.click(screen.getByText('Duplicate'));

    const buttons = within(footer).getAllByRole('button', { hidden: true });
    expect(buttons).toHaveLength(2);
    const archiveButton = buttons[1];
    await user.click(archiveButton);

    expect(archiveMedicalInjuryOrIllness).toHaveBeenCalledTimes(1);
    expect(mockTrackEvent).toHaveBeenCalledWith(
      performanceMedicineEventNames.injuryIllnessArchived,
      {
        ...determineMedicalLevelAndTab(),
        ...getIssueType(props.selectedRow.issue_type),
      }
    );
  });

  it('displays an error message when the archive request returns a 422 error', async () => {
    const user = userEvent.setup();
    archiveMedicalInjuryOrIllness.mockRejectedValue({
      response: {
        status: 422,
        data: {
          data: [{ message: 'This issue cannot be archived.' }],
        },
      },
    });

    render(<ArchiveIssueModal {...props} />);

    const inputElement = screen.getByLabelText('Reason for archiving:');
    const footer = screen.getByTestId('Modal|Footer');

    await user.click(inputElement);
    await user.click(screen.getByText('Duplicate'));

    const buttons = within(footer).getAllByRole('button', { hidden: true });
    expect(buttons).toHaveLength(2);
    const archiveButton = buttons[1];
    await user.click(archiveButton);

    expect(archiveMedicalInjuryOrIllness).toHaveBeenCalledTimes(1);
    expect(props.toastAction).toHaveBeenCalledWith({
      type: 'UPDATE_TOAST',
      toast: {
        id: props.selectedRow.id,
        title: `${props.selectedRow.full_pathology} - This issue cannot be archived.`,
        status: 'ERROR',
      },
    });
  });

  it('displays a generic error message when the archive request returns a non-422 error', async () => {
    const user = userEvent.setup();
    archiveMedicalInjuryOrIllness.mockRejectedValue({
      response: {
        status: 500,
      },
    });

    render(<ArchiveIssueModal {...props} />);

    const inputElement = screen.getByLabelText('Reason for archiving:');
    const footer = screen.getByTestId('Modal|Footer');

    await user.click(inputElement);
    await user.click(screen.getByText('Duplicate'));

    const buttons = within(footer).getAllByRole('button', { hidden: true });

    expect(buttons).toHaveLength(2);
    const archiveButton = buttons[1];
    await user.click(archiveButton);

    expect(archiveMedicalInjuryOrIllness).toHaveBeenCalledTimes(1);
    expect(props.toastAction).toHaveBeenCalledWith({
      type: 'UPDATE_TOAST',
      toast: {
        id: props.selectedRow.id,
        title: `${props.selectedRow.full_pathology} - An unknown error occurred.`,
        status: 'ERROR',
      },
    });
  });
});
