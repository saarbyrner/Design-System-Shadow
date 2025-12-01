import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setI18n } from 'react-i18next';

import i18n from '@kitman/common/src/utils/i18n';
import { OpenIssuesTranslated as OpenIssues } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/OpenIssues';
import { getInjuryStatuses } from '@kitman/services';
import getOpenIssuesForAthlete from '@kitman/modules/src/Medical/rosters/src/services/getOpenIssuesForAthlete';
import getAthleteIssues from '@kitman/services/src/services/medical/getAthleteIssue';
import createIssueEvent from '@kitman/services/src/services/medical/createIssueEvent';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';

jest.mock('@kitman/common/src/contexts/PermissionsContext', () => {
  const actual = jest.requireActual(
    '@kitman/common/src/contexts/PermissionsContext'
  );
  return {
    ...actual,
    usePermissions: () => ({
      permissions: {
        medical: {
          issues: { canEdit: true },
          availability: { canView: true },
        },
      },
    }),
  };
});

jest.mock('@kitman/services', () => ({
  getInjuryStatuses: jest.fn(),
  getPermissions: jest.fn().mockResolvedValue({}),
}));

jest.mock(
  '@kitman/modules/src/Medical/rosters/src/services/getOpenIssuesForAthlete'
);
jest.mock('@kitman/services/src/services/medical/getAthleteIssue');
jest.mock('@kitman/services/src/services/medical/createIssueEvent');
jest.mock('@kitman/modules/src/vanillaToasts/toast');
jest.mock(
  '@kitman/playbook/components/wrappers/MovementAwareDatePicker',
  () => {
    return function MockMovementAwareDatePicker(props) {
      return (
        <input
          data-testid="date-picker"
          value={props.value || ''}
          onChange={(e) => props.onChange(e.target.value)}
          disabled={props.disabled}
          placeholder={props.placeholder}
        />
      );
    };
  }
);

const issues = [
  {
    id: 101,
    name: 'Hamstring',
    issue_type: 'Injury',
    status: 'Active',
    status_id: null,
    causing_unavailability: true,
  },
];

describe('OpenIssues', () => {
  beforeAll(() => {
    setI18n(i18n);
  });

  beforeEach(() => {
    jest.clearAllMocks();

    getInjuryStatuses.mockResolvedValue([
      { id: 10, description: 'Under Treatment', is_resolver: false },
      { id: 20, description: 'Recovered', is_resolver: true },
    ]);

    getAthleteIssues.mockResolvedValue({
      id: 1,
      occurrence_date: '2025-08-01',
      events: [{ event_date: '2025-08-10' }],
    });

    getOpenIssuesForAthlete.mockResolvedValue({
      issues,
      hasMore: false,
    });
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      athleteId: 1,
      athleteName: 'John Doe',
      athleteAvatarUrl: '',
      openIssues: issues,
      hasMore: false,
      isEditing: true,
    };

    return renderWithProviders(<OpenIssues {...defaultProps} {...props} />);
  };

  it('auto closes the confirmation modal on success only updates and reloads issues', async () => {
    createIssueEvent.mockResolvedValue({});

    renderComponent();

    await screen.findByText('Select status');

    const placeholder = screen.getByText('Select status');
    const control = placeholder
      .closest('.kitmanReactSelect')
      .querySelector('.kitmanReactSelect__control');

    await userEvent.click(control);

    const option = await screen.findByText('Under Treatment');

    await userEvent.click(option);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Update' })).toBeEnabled();
    });

    const updateBtn = screen.getByRole('button', { name: 'Update' });
    await userEvent.click(updateBtn);

    expect(
      await screen.findByText('Are you sure you want to update the status?')
    ).toBeInTheDocument();

    const modalUpdateBtn = screen.getByRole('button', { name: 'Update' });
    await userEvent.click(modalUpdateBtn);

    await waitFor(() => {
      expect(
        screen.queryByText('Are you sure you want to update the status?')
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(getOpenIssuesForAthlete).toHaveBeenCalled();
    });
  });

  it('keeps modal open if any validation errors occurs', async () => {
    createIssueEvent.mockRejectedValue({
      response: {
        data: { data: [{ message: 'Failed to update' }] },
      },
    });

    renderComponent();

    await screen.findByText('Select status');

    const placeholder = screen.getByText('Select status');
    const control = placeholder
      .closest('.kitmanReactSelect')
      .querySelector('.kitmanReactSelect__control');

    await userEvent.click(control);

    const option = await screen.findByText('Under Treatment');

    await userEvent.click(option);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Update' })).toBeEnabled();
    });

    const updateBtn = screen.getByRole('button', { name: 'Update' });
    await userEvent.click(updateBtn);

    expect(
      await screen.findByText('Are you sure you want to update the status?')
    ).toBeInTheDocument();

    const modalUpdateBtn = screen.getByRole('button', { name: 'Update' });
    await userEvent.click(modalUpdateBtn);

    expect(await screen.findByText('Failed to update')).toBeInTheDocument();

    const okBtn = await screen.findByRole('button', { name: 'OK' });
    await userEvent.click(okBtn);

    await waitFor(() => {
      expect(screen.queryByText('Failed to update')).not.toBeInTheDocument();
    });

    const editUpdateBtn = screen.getByRole('button', { name: 'Update' });
    expect(editUpdateBtn).toBeEnabled();
  });

  it('shows validation error when selecting the occurrence date for preliminary injuries', async () => {
    const preliminaryIssues = [
      {
        id: 101,
        name: 'Hamstring',
        issue_type: 'Injury',
        status: 'Active',
        status_id: null,
        causing_unavailability: true,
        preliminary_status_complete: false,
      },
    ];

    renderComponent({ openIssues: preliminaryIssues });

    await screen.findByText('Select status');
    await waitFor(() => {
      expect(screen.getByTestId('date-picker')).toBeEnabled();
    });

    const datePicker = screen.getByTestId('date-picker');
    fireEvent.change(datePicker, { target: { value: '2025-08-01' } });

    expect(
      await screen.findByText(
        'You cannot select the same date as the current injury date'
      )
    ).toBeInTheDocument();
  });

  it('does not show validation error when selecting the occurrence date for non-preliminary injuries', async () => {
    const nonPreliminaryIssues = [
      {
        id: 101,
        name: 'Hamstring',
        issue_type: 'Injury',
        status: 'Active',
        status_id: null,
        causing_unavailability: true,
        preliminary_status_complete: true,
      },
    ];

    renderComponent({ openIssues: nonPreliminaryIssues });

    await screen.findByText('Select status');
    await waitFor(() => {
      expect(screen.getByTestId('date-picker')).toBeEnabled();
    });

    const datePicker = screen.getByTestId('date-picker');
    fireEvent.change(datePicker, { target: { value: '2025-08-01' } });

    await waitFor(() => {
      expect(
        screen.queryByText(
          'You cannot select the same date as the current injury date'
        )
      ).not.toBeInTheDocument();
    });
  });
});
