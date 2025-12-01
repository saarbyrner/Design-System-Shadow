import { screen, within } from '@testing-library/react';
import {
  storeFake,
  renderWithProvider,
} from '@kitman/common/src/utils/test_utils';
import CoachesReportTab from '../CoachesReportTab';

describe('Coaches Report Container', () => {
  let component;
  const props = {
    permissions: {
      medical: {
        availability: {
          canView: true,
          canEdit: true,
        },
        issues: {
          canView: true,
          canEdit: true,
          canCreate: true,
          canExport: true,
          canArchive: false,
        },
      },
    },
  };
  const initialStore = storeFake({
    app: { commentsGridRequestStatus: 'SUCCESS' },
    commentsFilters: {
      athlete_name: '',
      positions: [],
      squads: [8],
      availabilities: [],
      issues: [],
    },
    commentsGrid: {
      columns: [],
      next_id: 80524,
      rows: [
        {
          id: 40211,
          athlete: {
            fullname: 'Tomas Albornoz',
            position: 'Second Row',
            avatar_url:
              'https://kitman-staging.imgix.net/kitman-staff/kitman-staff_189778?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&mark64=aHR0cHM6Ly9hc3NldHMuaW1naXgubmV0L350ZXh0P2JnPTk1MjQyZjM4JnR4dDY0PU1nJnR4dGFsaWduPWNlbnRlciZ0eHRjbHI9ZmZmJnR4dGZvbnQ9QXZlbmlyK05leHQrQ29uZGVuc2VkK01lZGl1bSZ0eHRwYWQ9NSZ0eHRzaGFkPTImdHh0c2l6ZT0xNiZ3PTM2&markalign=left%2Cbottom&markfit=max&markpad=0&w=100',
            availability: 'unavailable',
            extended_attributes: {},
          },
          availability_status: {
            availability: 'unavailable',
            unavailable_since: '296 days',
          },
          open_injuries_illnesses: {
            has_more: false,
            issues: [
              {
                id: 2,
                issue_id: 104187,
                name: 'Jul 25, 2023 - test22',
                status: 'Not affecting availability (medical attention)',
                causing_unavailability: false,
                issue_type: 'Injury',
              },
              {
                id: 1,
                issue_id: 104186,
                name: 'Jul 19, 2023 - Test tomas',
                status: 'Not affecting availability (medical attention)',
                causing_unavailability: false,
                issue_type: 'Injury',
              },
              {
                id: 13899,
                issue_id: 13900,
                name: 'Oct  6, 2022 - Abcess Ankle (excl. Joint) [Left]',
                status: 'Causing unavailability (time-loss)',
                causing_unavailability: true,
                issue_type: 'Illness',
              },
            ],
          },
          availability_comment: '',
        },
        {
          id: 97521,
          athlete: {
            fullname: 'Akanksha 2 Athlete',
            position: 'Second Row',
            avatar_url:
              'https://kitman-staging.imgix.net/kitman-staff/kitman-staff_189778?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&mark64=aHR0cHM6Ly9hc3NldHMuaW1naXgubmV0L350ZXh0P2JnPTk1MjQyZjM4JnR4dDY0PU1nJnR4dGFsaWduPWNlbnRlciZ0eHRjbHI9ZmZmJnR4dGZvbnQ9QXZlbmlyK05leHQrQ29uZGVuc2VkK01lZGl1bSZ0eHRwYWQ9NSZ0eHRzaGFkPTImdHh0c2l6ZT0xNiZ3PTM2&markalign=left%2Cbottom&markfit=max&markpad=0&w=100',
            availability: 'unavailable',
            extended_attributes: {},
          },
          availability_status: {
            availability: 'unavailable',
            unavailable_since: null,
          },
          open_injuries_illnesses: {
            has_more: false,
            issues: [],
          },
          availability_comment: 'ssss',
        },
        {
          id: 97524,
          athlete: {
            fullname: 'Akanksha5 Athlete',
            position: 'Second Row',
            avatar_url:
              'https://kitman-staging.imgix.net/kitman-staff/kitman-staff_189778?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&mark64=aHR0cHM6Ly9hc3NldHMuaW1naXgubmV0L350ZXh0P2JnPTk1MjQyZjM4JnR4dDY0PU1nJnR4dGFsaWduPWNlbnRlciZ0eHRjbHI9ZmZmJnR4dGZvbnQ9QXZlbmlyK05leHQrQ29uZGVuc2VkK01lZGl1bSZ0eHRwYWQ9NSZ0eHRzaGFkPTImdHh0c2l6ZT0xNiZ3PTM2&markalign=left%2Cbottom&markfit=max&markpad=0&w=100',
            availability: 'unavailable',
            extended_attributes: {},
          },
          availability_status: {
            availability: 'unavailable',
            unavailable_since: null,
          },
          open_injuries_illnesses: {
            has_more: false,
            issues: [],
          },
          availability_comment: '',
        },
      ],
    },
  });

  const componentRender = (mockStore) =>
    renderWithProvider(<CoachesReportTab {...props} />, mockStore);

  beforeEach(() => {
    window.featureFlags = { 'nfl-coaches-report': true };
    component = componentRender(initialStore, 1);
  });

  afterEach(() => {
    window.featureFlags = {};
    component = undefined;
  });

  it('renders the component structure', async () => {
    const container = component.getByTestId('CoachesReportTab|Container');

    expect(container).toBeInTheDocument();
    expect(container.querySelector('h3')).toHaveTextContent('Coaches Report');
    expect(container.querySelector('table')).toBeInTheDocument();

    // Verifies prop data used
    expect(container.querySelectorAll('table tr')).toHaveLength(4);
    expect(
      container.querySelectorAll('table tr')[1].querySelector('td')
    ).toHaveTextContent('Tomas AlbornozSecond Row');
  });

  it('renders the Kitman filters when coaches-report-v2 FF is OFF', () => {
    window.featureFlags = { 'coaches-report-v2': false };
    const container = component.getByTestId('CoachesReportTab|Container');
    componentRender(initialStore);

    expect(
      within(container).getByTestId('CoachesReport|DesktopFiltersKitman')
    ).toBeInTheDocument();
  });

  it('renders the MUI filters when coaches-report-v2 FF is ON', async () => {
    window.featureFlags = { 'coaches-report-v2': true };
    componentRender(initialStore);

    expect(
      screen.getByTestId('CoachesReport|DesktopFiltersMui')
    ).toBeInTheDocument();
  });

  it('renders the Note Creation header when coaches-report-v2 FF is ON and checkboxes in DataGrid selected', async () => {
    window.featureFlags = { 'coaches-report-v2': true };
    componentRender(initialStore);

    expect(
      screen.getByTestId('CoachesReport|DesktopFiltersMui')
    ).toBeInTheDocument();
  });

  // Extensive testing on the sub components used in this container file can be found at the level of each component
});
