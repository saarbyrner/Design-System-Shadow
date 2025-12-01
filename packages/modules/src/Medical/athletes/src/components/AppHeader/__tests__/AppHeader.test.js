import { screen } from '@testing-library/react';
import {
  renderWithUserEventSetup,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import {
  usePermissions,
  DEFAULT_CONTEXT_VALUE,
} from '@kitman/common/src/contexts/PermissionsContext';
import { data as mockAthleteData } from '@kitman/services/src/mocks/handlers/getAthleteData';
import AppHeader from '@kitman/modules/src/Medical/athletes/src/components/AppHeader';

jest.mock('@kitman/common/src/contexts/PermissionsContext', () => ({
  ...jest.requireActual('@kitman/common/src/contexts/PermissionsContext'),
  usePermissions: jest.fn(),
}));

const mockOnExportAthleteIssuesData = jest.fn();

const defaultProps = {
  athleteData: { ...mockAthleteData, org_last_transfer_record: null },
  onExportAthleteIssuesData: mockOnExportAthleteIssuesData,
  t: i18nextTranslateStub(),
};

const checkDetailsAreDisplayed = (details) => {
  Object.keys(details).forEach((key) => {
    expect(
      screen.getByRole('heading', { name: key, level: 4 })
    ).toBeInTheDocument();
    expect(screen.getByText(details[key])).toBeInTheDocument();
  });
};

const renderComponent = (props = defaultProps) =>
  renderWithUserEventSetup(<AppHeader {...props} />);

describe('<AppHeader />', () => {
  beforeEach(() => {
    usePermissions.mockReturnValue({
      permissions: DEFAULT_CONTEXT_VALUE.permissions,
      permissionsRequestStatus: 'SUCCESS',
    });
  });
  it('renders the correct content', () => {
    renderComponent();

    // team link
    expect(screen.getByRole('link', { name: 'Team' })).toHaveAttribute(
      'href',
      '/medical/rosters'
    );

    // avatar
    expect(screen.getByAltText('John Doe')).toHaveAttribute(
      'src',
      'https://kitman-staging.imgix.net/avatar.jpg'
    );

    const details = {
      'Date of birth': '12 Oct 1990',
      Age: '31',
      Country: 'Ireland',
      Height: '-',
      Status: 'unavailable',
      Positions: 'Back',
      Team: 'International Squad, Academy Squad',
      'Open injury/ illness': '2',
    };

    checkDetailsAreDisplayed(details);
  });

  it('renders the nfl player id only when it exists', () => {
    expect.hasAssertions();

    renderComponent({
      ...defaultProps,
      athleteData: {
        ...defaultProps.athleteData,
        extended_attributes: {
          nfl_player_id: 12345,
        },
      },
    });

    const details = {
      'NFL Player ID': '12345',
      'Date of birth': '12 Oct 1990',
    };

    checkDetailsAreDisplayed(details);
  });

  it('render correct team link when the athlete is a past athlete', () => {
    renderComponent({
      ...defaultProps,
      athleteData: mockAthleteData,
    });

    expect(screen.getByRole('link', { name: 'Team' })).toHaveAttribute(
      'href',
      '/medical/rosters#past_athletes'
    );
  });

  describe('[permissions] permissions.medical.allergies.canView', () => {
    beforeEach(() => {
      usePermissions.mockReturnValue({
        permissions: {
          ...DEFAULT_CONTEXT_VALUE.permissions,
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            allergies: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical.allergies,
              canView: true,
            },
          },
        },
        permissionsRequestStatus: 'SUCCESS',
      });
    });

    it('renders the correct content', () => {
      const allergies = [
        {
          id: 21,
          display_name: 'Ibuprofen allergy',
          severity: 'mild',
        },
        {
          id: 87,
          display_name: 'Peanut allergy',
          severity: 'severe',
        },
      ];

      renderComponent({
        ...defaultProps,
        athleteData: {
          ...defaultProps.athleteData,
          allergies,
        },
      });

      expect(screen.getByText(allergies[0].display_name)).toBeInTheDocument();
      expect(screen.getByText(allergies[1].display_name)).toBeInTheDocument();
    });
  });

  describe('[permissions] permissions.medical.issues.canExport', () => {
    beforeEach(() => {
      usePermissions.mockReturnValue({
        permissions: {
          ...DEFAULT_CONTEXT_VALUE.permissions,
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            issues: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical.issues,
              canExport: true,
            },
          },
        },
        permissionsRequestStatus: 'SUCCESS',
      });
    });

    it('renders the correct content', async () => {
      const { user } = renderComponent();

      const exportButton = screen.getByRole('button', { name: 'Export' });

      expect(exportButton).toBeInTheDocument();

      await user.click(exportButton);

      expect(mockOnExportAthleteIssuesData).toHaveBeenCalledTimes(1);
    });
  });

  describe('[permissions] general.ancillaryRange.canManage', () => {
    beforeEach(() => {
      usePermissions.mockReturnValue({
        permissions: {
          ...DEFAULT_CONTEXT_VALUE.permissions,
          general: {
            ...DEFAULT_CONTEXT_VALUE.permissions.general,
            ancillaryRange: {
              ...DEFAULT_CONTEXT_VALUE.permissions.general.ancillaryRange,
              canManage: true,
            },
          },
        },
        permissionsRequestStatus: 'SUCCESS',
      });
    });

    it('renders the Ancillary range button', () => {
      renderComponent();

      const ancillaryRangeButton = screen.getByRole('button', {
        name: 'Ancillary range',
      });

      expect(ancillaryRangeButton).toBeInTheDocument();
    });

    it('does render the Ancillary range button for on trial athletes', () => {
      renderComponent({
        ...defaultProps,
        athleteData: {
          ...mockAthleteData,
          constraints: {
            organisation_status: 'TRIAL_ATHLETE',
          },
        },
      });

      const ancillaryRangeButton = screen.queryByRole('button', {
        name: 'Ancillary range',
      });

      expect(ancillaryRangeButton).toBeInTheDocument();
    });
  });
});
