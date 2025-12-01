import { render, screen } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import ConfirmationDialogContent from '../ConfirmationDialogContent';

setI18n(i18n);

describe('ConfirmationDialogContent', () => {
  const defaultProps = {
    athleteName: 'John Doe',
    athleteAvatarUrl: 'https://example.com/avatar.jpg',
    pendingChanges: {},
    changeStatuses: {},
    changeErrors: {},
    saving: false,
    t: i18nextTranslateStub(),
  };

  it('should render athlete information correctly', () => {
    render(<ConfirmationDialogContent {...defaultProps} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should display "No changes detected" when no pending changes', () => {
    render(<ConfirmationDialogContent {...defaultProps} />);
    expect(screen.getByText('No changes detected')).toBeInTheDocument();
  });

  it('should render pending changes with issue details', () => {
    const pendingChanges = {
      'Aug 20, 2025': [
        {
          issueId: '1',
          issueName: 'Ankle Sprain',
          previousLabel: 'Active',
          newLabel: 'Recovered',
          dateLabel: 'Aug 20, 2025',
        },
        {
          issueId: '2',
          issueName: 'Hamstring Strain',
          previousLabel: 'Under Treatment',
          newLabel: 'Active',
          dateLabel: 'Aug 20, 2025',
        },
      ],
    };

    const props = {
      ...defaultProps,
      pendingChanges,
    };

    render(<ConfirmationDialogContent {...props} />);

    expect(screen.getByText('Ankle Sprain')).toBeInTheDocument();
    expect(screen.getByText('Hamstring Strain')).toBeInTheDocument();
    expect(screen.getByText('Recovered')).toBeInTheDocument();
    expect(screen.getByText('Under Treatment')).toBeInTheDocument();
    expect(screen.getAllByText('Active')).toHaveLength(2);
    expect(screen.getAllByText('→')).toHaveLength(2);
  });

  it('should display status date correctly', () => {
    const pendingChanges = {
      'Aug 20, 2025': [
        {
          issueId: '1',
          issueName: 'Ankle Sprain',
          previousLabel: 'Active',
          newLabel: 'Recovered',
          dateLabel: 'Aug 20, 2025',
        },
      ],
    };

    const props = {
      ...defaultProps,
      pendingChanges,
    };

    render(<ConfirmationDialogContent {...props} />);

    expect(screen.getByText('Status date: Aug 20, 2025')).toBeInTheDocument();
  });

  it('should show loading spinner when saving and status is loading', () => {
    const pendingChanges = {
      'Aug 20, 2025': [
        {
          issueId: '1',
          issueName: 'Ankle Sprain',
          previousLabel: 'Active',
          newLabel: 'Recovered',
          dateLabel: 'Aug 20, 2025',
        },
      ],
    };

    const changeStatuses = {
      1: 'PENDING',
    };

    const props = {
      ...defaultProps,
      pendingChanges,
      changeStatuses,
      saving: true,
    };

    render(<ConfirmationDialogContent {...props} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should show success icon when status is success', () => {
    const pendingChanges = {
      'Aug 20, 2025': [
        {
          issueId: '1',
          issueName: 'Ankle Sprain',
          previousLabel: 'Active',
          newLabel: 'Recovered',
          dateLabel: 'Aug 20, 2025',
        },
      ],
    };

    const changeStatuses = {
      1: 'SUCCESS',
    };

    const props = {
      ...defaultProps,
      pendingChanges,
      changeStatuses,
    };

    render(<ConfirmationDialogContent {...props} />);

    expect(screen.getByTestId('CheckIcon')).toBeInTheDocument();
  });

  it('should show error icon when status is error', () => {
    const pendingChanges = {
      'Aug 20, 2025': [
        {
          issueId: '1',
          issueName: 'Ankle Sprain',
          previousLabel: 'Active',
          newLabel: 'Recovered',
          dateLabel: 'Aug 20, 2025',
        },
      ],
    };

    const changeStatuses = {
      1: 'FAILURE',
    };

    const props = {
      ...defaultProps,
      pendingChanges,
      changeStatuses,
      saving: true,
    };

    render(<ConfirmationDialogContent {...props} />);

    expect(screen.getByTestId('CloseIcon')).toBeInTheDocument();
  });

  it('should display error message when there is an error', () => {
    const pendingChanges = {
      'Aug 20, 2025': [
        {
          issueId: '1',
          issueName: 'Ankle Sprain',
          previousLabel: 'Active',
          newLabel: 'Recovered',
          dateLabel: 'Aug 20, 2025',
        },
      ],
    };

    const changeStatuses = {
      1: 'FAILURE',
    };

    const changeErrors = {
      1: 'Failed to update status',
    };

    const props = {
      ...defaultProps,
      pendingChanges,
      changeStatuses,
      changeErrors,
      saving: true,
    };

    render(<ConfirmationDialogContent {...props} />);

    expect(screen.getByText('Failed to update status')).toBeInTheDocument();
    expect(screen.getAllByTestId('CloseIcon')).toHaveLength(2);
  });

  it('should handle multiple dates with multiple changes', () => {
    const pendingChanges = {
      'Aug 20, 2025': [
        {
          issueId: '1',
          issueName: 'Ankle Sprain',
          previousLabel: 'Active',
          newLabel: 'Recovered',
          dateLabel: 'Aug 20, 2025',
        },
      ],
      'Aug 21, 2025': [
        {
          issueId: '2',
          issueName: 'Hamstring Strain',
          previousLabel: 'Under Treatment',
          newLabel: 'Active',
          dateLabel: 'Aug 21, 2025',
        },
      ],
    };

    const props = {
      ...defaultProps,
      pendingChanges,
    };

    render(<ConfirmationDialogContent {...props} />);

    expect(screen.getByText('Ankle Sprain')).toBeInTheDocument();
    expect(screen.getByText('Hamstring Strain')).toBeInTheDocument();
  });

  it('should not show status icons when not saving and status is not success', () => {
    const pendingChanges = {
      'Aug 20, 2025': [
        {
          issueId: '1',
          issueName: 'Ankle Sprain',
          previousLabel: 'Active',
          newLabel: 'Recovered',
          dateLabel: 'Aug 20, 2025',
        },
      ],
    };

    const changeStatuses = {
      1: 'PENDING',
    };

    const props = {
      ...defaultProps,
      pendingChanges,
      changeStatuses,
      saving: false,
    };

    render(<ConfirmationDialogContent {...props} />);

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('CheckIcon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('CloseIcon')).not.toBeInTheDocument();
  });

  it('should handle mixed success and error statuses together', () => {
    const pendingChanges = {
      'Aug 20, 2025': [
        {
          issueId: '1',
          issueName: 'Ankle Sprain',
          previousLabel: 'Active',
          newLabel: 'Recovered',
          dateLabel: 'Aug 20, 2025',
        },
        {
          issueId: '2',
          issueName: 'Hamstring Strain',
          previousLabel: 'Under Treatment',
          newLabel: 'Active',
          dateLabel: 'Aug 20, 2025',
        },
        {
          issueId: '3',
          issueName: 'Knee Injury',
          previousLabel: 'Active',
          newLabel: 'Under Treatment',
          dateLabel: 'Aug 20, 2025',
        },
      ],
    };

    const changeStatuses = {
      1: 'SUCCESS',
      2: 'FAILURE',
      3: 'PENDING',
    };

    const changeErrors = {
      2: 'Failed to update hamstring status',
    };

    const props = {
      ...defaultProps,
      pendingChanges,
      changeStatuses,
      changeErrors,
      saving: true,
    };

    render(<ConfirmationDialogContent {...props} />);

    expect(screen.getByText('Ankle Sprain')).toBeInTheDocument();
    expect(screen.getByText('Hamstring Strain')).toBeInTheDocument();
    expect(screen.getByText('Knee Injury')).toBeInTheDocument();

    // Should show success icon for first issue
    expect(screen.getByTestId('CheckIcon')).toBeInTheDocument();

    // Should show loading spinner for third issue
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Should show error icons for second issue (one in status and one in error message)
    expect(screen.getAllByTestId('CloseIcon')).toHaveLength(2);

    // Should show error message for second issue
    expect(
      screen.getByText('Failed to update hamstring status')
    ).toBeInTheDocument();
  });
});
