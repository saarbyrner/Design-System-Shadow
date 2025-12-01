import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import PermissionsContext, {
  DEFAULT_CONTEXT_VALUE,
} from '@kitman/common/src/contexts/PermissionsContext';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import tabHashes from '@kitman/modules/src/Medical/shared/constants/tabHashes';
import { useGetAthleteDataQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import RosterOverviewGrid from '../RosterOverviewGrid';

jest.mock('@kitman/common/src/hooks/useEventTracking');

jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/redux/services/medicalShared'
    ),
    useGetAthleteDataQuery: jest.fn(),
  })
);

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical', () => ({
  ...jest.requireActual(
    '@kitman/modules/src/Medical/shared/redux/services/medical'
  ),
}));

const mockTrackEvent = jest.fn();

const defaultProps = {
  fetchMoreData: jest.fn(),
  grid: {
    columns: [
      {
        row_key: 'athlete',
        name: 'Athlete',
        readonly: true,
        id: 1,
        default: true,
      },
      {
        row_key: 'open_injuries_illnesses',
        name: 'Open Injury/ Illness',
        readonly: true,
        id: 2,
        default: true,
      },
      {
        row_key: 'squad',
        name: 'Squad',
        readonly: true,
        id: 3,
        default: true,
      },
      {
        row_key: 'latest_note',
        name: 'Latest Note',
        readonly: true,
        id: 4,
        default: true,
      },
      {
        row_key: 'cardiac_screening',
        name: 'Cardiac screening',
        id: 5,
      },
    ],
    rows: [
      {
        id: 1,
        athlete: {
          avatar_url: 'john_do_avatar.jpg',
          fullname: 'John Doh',
          availability: 'unavailable',
          position: 'Scrum Half',
        },
        availability_status: {
          availability: 'unavailable',
          unavailable_since: '45 days',
        },
        cardiac_status: {
          status: 'Complete',
          completion_date: '2023-07-25',
          expiration_date: '2024-07-25',
        },
        open_injuries_illnesses: {
          has_more: false,
          issues: [
            {
              id: 1,
              issue_id: 10,
              name: 'Sore Ankle',
              status: 'unavailable',
            },
          ],
        },
        latest_note: {
          title: 'Note 1234',
          date: 'Nov 21, 22',
          content: 'Blah blah blah',
          restricted_annotation: false,
        },
        squad: [{ name: 'Blah', primary: true }],
      },
      {
        id: 2,
        athlete: {
          avatar_url: 'jane_do_avatar.jpg',
          fullname: 'Jane Doh',
          availability: 'injured',
          position: 'Fly Half',
        },
        availability_status: {
          availability: 'unavailable',
          unavailable_since: '45 days',
        },
        open_injuries_illnesses: {
          has_more: false,
          issues: [
            {
              id: 2,
              issue_id: 11,
              name: 'Broken Ankle',
              status: 'unavailable',
            },
          ],
        },
        latest_note: {
          title: 'Note 2345',
          date: 'Nov 22, 22',
          content: 'Blah blah blah aaah',
          restricted_annotation: false,
        },
        squad: [
          { name: 'Blah', primary: true },
          { name: 'Blabbedy', primary: false },
        ],
      },
    ],
    next_id: null,
  },
  isLoading: false,
  onOpenAddIssuePanel: jest.fn(),
  onOpenAddMedicalNotePanel: jest.fn(),
  onOpenAddModificationSidePanel: jest.fn(),
  onOpenAddVaccinationSidePanel: jest.fn(),
  onOpenAddDiagnosticSidePanel: jest.fn(),
  onOpenAddAllergySidePanel: jest.fn(),
  onOpenAddMedicalAlertSidePanel: jest.fn(),
  onOpenAddProcedureSidePanel: jest.fn(),
  onOpenAddTUESidePanel: jest.fn(),
  onOpenAddTreatmentsSidePanel: jest.fn(),
  t: i18nextTranslateStub(),
};

const renderComponent = ({
  props = defaultProps,
  permissions = DEFAULT_CONTEXT_VALUE.permissions,
} = {}) => {
  const component = (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
      <PermissionsContext.Provider
        value={{
          permissions: {
            ...DEFAULT_CONTEXT_VALUE.permissions,
            ...permissions,
          },
          permissionsRequestStatus: 'SUCCESS',
        }}
      >
        <RosterOverviewGrid {...props} />
      </PermissionsContext.Provider>
    </LocalizationProvider>
  );

  return renderWithRedux(component, {
    useGlobalStore: false,
    preloadedState: { globalApi: {}, medicalApi: {} },
  });
};

describe('<RosterOverviewGrid />', () => {
  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: mockTrackEvent });
    useGetAthleteDataQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    });
  });

  describe('Mixpanel Events', () => {
    it('[TRACK-EVENT] - tracks Add -> Injury/Illness event', async () => {
      const user = userEvent.setup();

      renderComponent({
        permissions: {
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            issues: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical.issues,
              canCreate: true,
            },
          },
        },
      });

      const meatballMenus = screen.getAllByRole('button');

      const meatballMenu = meatballMenus[1];

      expect(meatballMenu).toBeInTheDocument();

      await user.click(meatballMenu);

      const injuryIllnessButton = screen.getByRole('button', {
        name: 'Add injury/ illness',
      });

      expect(injuryIllnessButton).toBeInTheDocument();

      await user.click(injuryIllnessButton);

      expect(mockTrackEvent).toHaveBeenCalledWith(
        'Click athlete row meatball -> Injury/Illness',
        {
          athleteId: 2,
        }
      );
    });

    it('[TRACK-EVENT] - clickAddMedicalNote', async () => {
      const user = userEvent.setup();

      renderComponent({
        permissions: {
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            notes: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical.notes,
              canCreate: true,
            },
          },
        },
      });

      const meatballMenus = screen.getAllByRole('button');

      const meatballMenu = meatballMenus[1];

      expect(meatballMenu).toBeInTheDocument();

      await user.click(meatballMenu);

      const addNoteButton = screen.getByRole('button', {
        name: 'Add note',
      });

      expect(addNoteButton).toBeInTheDocument();

      await user.click(addNoteButton);

      expect(mockTrackEvent).toHaveBeenCalledWith(
        performanceMedicineEventNames.clickAddMedicalNote,
        {
          level: 'team',
          tab: tabHashes.OVERVIEW,
          actionElement: 'Row meatball',
        }
      );
    });
  });

  describe('rendering content', () => {
    it('passes the correct grid columns to dataGrid with default permissions', () => {
      renderComponent();
      expect(screen.getAllByRole('columnheader').length).toBe(3);
      expect(
        screen.getByRole('columnheader', { name: 'Athlete' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Squad' })
      ).toBeInTheDocument();
    });

    it('passes the correct grid columns to dataGrid when permissions.medical.issues.canView is true', () => {
      renderComponent({
        permissions: {
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            issues: { canView: true },
          },
        },
      });
      expect(screen.getAllByRole('columnheader').length).toBe(4);
      expect(
        screen.getByRole('columnheader', { name: 'Athlete' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Open Injury/ Illness' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Squad' })
      ).toBeInTheDocument();
    });

    it('passes the correct grid columns to dataGrid when permissions.medical.availability.canView is true', () => {
      window.setFlag('availability-info-disabled', false);
      renderComponent({
        permissions: {
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            availability: { canView: true },
          },
        },
      });
      expect(
        screen.getByRole('columnheader', { name: 'Athlete' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('columnheader', { name: 'Availability Status' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Squad' })
      ).toBeInTheDocument();
      expect(screen.getAllByRole('columnheader').length).toBe(4);
    });

    it('passes the correct grid columns to dataGrid when permissions.medical.notes.canView is true and feature flag emr-show-latest-note-column is enabled', () => {
      window.featureFlags = { 'emr-show-latest-note-column': true };
      renderComponent({
        permissions: {
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            notes: { canView: true },
          },
        },
      });
      expect(screen.getAllByRole('columnheader').length).toBe(4);
      expect(
        screen.getByRole('columnheader', { name: 'Athlete' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Latest Note' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Squad' })
      ).toBeInTheDocument();
      window.featureFlags = { 'emr-show-latest-note-column': false };
    });

    it('passes the correct grid columns to dataGrid when permissions.medical.allergies.canView is true', () => {
      renderComponent({
        permissions: {
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            allergies: { canView: true },
          },
        },
      });
      expect(screen.getAllByRole('columnheader').length).toBe(4);
      expect(
        screen.getByRole('columnheader', { name: 'Athlete' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Allergies' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Squad' })
      ).toBeInTheDocument();
    });

    it('passes the correct grid columns to dataGrid when permissions.medical.diagnostics.canView is true and feature flag cardiac-screening-v1 is enabled', () => {
      window.featureFlags = { 'cardiac-screening-v1': true };
      renderComponent({
        permissions: {
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            diagnostics: { canView: true },
          },
        },
      });
      expect(screen.getAllByRole('columnheader').length).toBe(4);
      expect(
        screen.getByRole('columnheader', { name: 'Athlete' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Cardiac screening' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Squad' })
      ).toBeInTheDocument();
      window.featureFlags = { 'cardiac-screening-v1': false };
    });

    it('passes the correct grid columns to dataGrid with full permissions', () => {
      window.featureFlags = { 'availability-info-disabled': false };
      renderComponent({
        permissions: {
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            issues: { canView: true },
            availability: { canView: true },
            notes: { canView: true },
            allergies: { canView: true },
          },
        },
      });
      expect(screen.getAllByRole('columnheader').length).toBe(6);
      expect(
        screen.getByRole('columnheader', { name: 'Athlete' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Availability Status' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Open Injury/ Illness' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Allergies' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Squad' })
      ).toBeInTheDocument();
      window.featureFlags = { 'availability-info-disabled': true };
    });

    it('does not render the availability column when feature flag availability-info-disabled is enabled', () => {
      window.featureFlags = { 'availability-info-disabled': true };
      renderComponent({
        permissions: {
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            availability: { canView: true },
          },
        },
      });
      expect(screen.getAllByRole('columnheader').length).toBe(3);
      expect(
        screen.getByRole('columnheader', { name: 'Athlete' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Squad' })
      ).toBeInTheDocument();
      window.featureFlags = { 'availability-info-disabled': false };
    });
  });

  describe('dataGrid row actions', () => {
    it('passes the correct row actions when permissions.medical.issues.canCreate is true', async () => {
      const user = userEvent.setup();
      renderComponent({
        permissions: {
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            issues: { canCreate: true },
          },
        },
      });

      const meatballMenus = screen.getAllByRole('button');
      const meatballMenu = meatballMenus[1];
      expect(meatballMenu).toBeInTheDocument();

      await user.click(meatballMenu);

      const injuryIllnessButton = screen.getByRole('button', {
        name: 'Add injury/ illness',
      });
      expect(injuryIllnessButton).toBeInTheDocument();

      await user.click(injuryIllnessButton);
      expect(defaultProps.onOpenAddIssuePanel).toHaveBeenCalledTimes(1);
    });

    it('passes the correct row actions when permissions.medical.notes.canCreate is true', async () => {
      const user = userEvent.setup();
      renderComponent({
        permissions: {
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            notes: { canCreate: true },
          },
        },
      });

      const meatballMenus = screen.getAllByRole('button');
      const meatballMenu = meatballMenus[1];
      expect(meatballMenu).toBeInTheDocument();

      await user.click(meatballMenu);

      const addNoteButton = screen.getByRole('button', { name: 'Add note' });
      expect(addNoteButton).toBeInTheDocument();

      await user.click(addNoteButton);
      expect(defaultProps.onOpenAddMedicalNotePanel).toHaveBeenCalledTimes(1);
    });

    it('passes the correct row actions when permissions.medical.modifications.canCreate is true', async () => {
      const user = userEvent.setup();
      renderComponent({
        permissions: {
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            modifications: { canCreate: true },
          },
        },
      });

      const meatballMenus = screen.getAllByRole('button');
      const meatballMenu = meatballMenus[1];
      expect(meatballMenu).toBeInTheDocument();

      await user.click(meatballMenu);

      const addModificationButton = screen.getByRole('button', {
        name: 'Add modification',
      });
      expect(addModificationButton).toBeInTheDocument();

      await user.click(addModificationButton);
      expect(defaultProps.onOpenAddModificationSidePanel).toHaveBeenCalledTimes(
        1
      );
    });

    it('passes the correct row actions when permissions.medical.treatments.canCreate is true', async () => {
      const user = userEvent.setup();
      renderComponent({
        permissions: {
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            treatments: { canCreate: true },
          },
        },
      });

      const meatballMenus = screen.getAllByRole('button');
      const meatballMenu = meatballMenus[1];
      expect(meatballMenu).toBeInTheDocument();

      await user.click(meatballMenu);

      const addTreatmentButton = screen.getByRole('button', {
        name: 'Add treatment',
      });
      expect(addTreatmentButton).toBeInTheDocument();

      await user.click(addTreatmentButton);
      expect(defaultProps.onOpenAddTreatmentsSidePanel).toHaveBeenCalledTimes(
        1
      );
    });

    it('passes the correct row actions when permissions.medical.diagnostics.canCreate is true', async () => {
      const user = userEvent.setup();
      renderComponent({
        permissions: {
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            diagnostics: { canCreate: true },
          },
        },
      });

      const meatballMenus = screen.getAllByRole('button');
      const meatballMenu = meatballMenus[1];
      expect(meatballMenu).toBeInTheDocument();

      await user.click(meatballMenu);

      const addDiagnosticButton = screen.getByRole('button', {
        name: 'Add diagnostic',
      });
      expect(addDiagnosticButton).toBeInTheDocument();

      await user.click(addDiagnosticButton);
      expect(defaultProps.onOpenAddDiagnosticSidePanel).toHaveBeenCalledTimes(
        1
      );
    });

    it('passes the correct row actions when permissions.medical.vaccinations.canCreate is true', async () => {
      const user = userEvent.setup();
      renderComponent({
        permissions: {
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            vaccinations: { canCreate: true },
          },
        },
      });

      const meatballMenus = screen.getAllByRole('button');
      const meatballMenu = meatballMenus[1];
      expect(meatballMenu).toBeInTheDocument();

      await user.click(meatballMenu);

      const addVaccinationButton = screen.getByRole('button', {
        name: 'Add vaccination',
      });
      expect(addVaccinationButton).toBeInTheDocument();

      await user.click(addVaccinationButton);
      expect(defaultProps.onOpenAddVaccinationSidePanel).toHaveBeenCalledTimes(
        1
      );
    });

    it('passes the correct row actions when permissions.medical.allergies.canCreate is true', async () => {
      const user = userEvent.setup();
      renderComponent({
        permissions: {
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            allergies: { canCreate: true },
          },
        },
      });

      const meatballMenus = screen.getAllByRole('button');
      const meatballMenu = meatballMenus[1];
      expect(meatballMenu).toBeInTheDocument();

      await user.click(meatballMenu);

      const addAllergyButton = screen.getByRole('button', {
        name: 'Add allergy',
      });
      expect(addAllergyButton).toBeInTheDocument();

      await user.click(addAllergyButton);
      expect(defaultProps.onOpenAddAllergySidePanel).toHaveBeenCalledTimes(1);
    });

    it('passes the correct row actions when permissions.medical.alerts.canCreate is true and feature flag medical-alerts-side-panel is enabled', async () => {
      window.featureFlags = { 'medical-alerts-side-panel': true };
      const user = userEvent.setup();
      renderComponent({
        permissions: {
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            alerts: { canCreate: true },
          },
        },
      });

      const meatballMenus = screen.getAllByRole('button');
      const meatballMenu = meatballMenus[1];
      expect(meatballMenu).toBeInTheDocument();

      await user.click(meatballMenu);

      const addMedicalAlertButton = screen.getByRole('button', {
        name: 'Add medical alert',
      });
      expect(addMedicalAlertButton).toBeInTheDocument();

      await user.click(addMedicalAlertButton);
      expect(defaultProps.onOpenAddMedicalAlertSidePanel).toHaveBeenCalledTimes(
        1
      );
      window.featureFlags = { 'medical-alerts-side-panel': false };
    });

    describe('[feature-flag] pm-show-tue', () => {
      afterEach(() => {
        window.setFlag('pm-show-tue', false);
      });

      it('passes the correct row actions when flag is true and permissions.medical.tue.canCreate is true', async () => {
        window.setFlag('pm-show-tue', true);
        const user = userEvent.setup();
        renderComponent({
          permissions: {
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              tue: { canCreate: true },
            },
          },
        });

        const meatballMenus = screen.getAllByRole('button');
        const meatballMenu = meatballMenus[1];
        expect(meatballMenu).toBeInTheDocument();

        await user.click(meatballMenu);

        const addTUEButton = screen.getByRole('button', { name: 'Add TUE' });
        expect(addTUEButton).toBeInTheDocument();

        await user.click(addTUEButton);
        expect(defaultProps.onOpenAddTUESidePanel).toHaveBeenCalledTimes(1);
      });

      it('does not pass the TUE row action when flag is false', async () => {
        window.setFlag('roster-player-injury-status-update', true);
        window.setFlag('pm-show-tue', false);
        const user = userEvent.setup();
        renderComponent({
          permissions: {
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              tue: { canCreate: true },
              issues: { canCreate: true, canView: true },
            },
          },
        });

        const meatballMenus = screen.getAllByRole('button');
        const meatballMenu = meatballMenus[1];
        expect(meatballMenu).toBeInTheDocument();

        await user.click(meatballMenu);

        const addTUEButton = screen.queryByRole('button', { name: 'Add TUE' });
        expect(addTUEButton).not.toBeInTheDocument();
      });
    });

    it('passes the correct row actions when permissions.medical.procedures.canCreate is true and feature flag medical-procedure is enabled', async () => {
      window.featureFlags = { 'medical-procedure': true };
      const user = userEvent.setup();
      renderComponent({
        permissions: {
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            procedures: { canCreate: true },
          },
        },
      });

      const meatballMenus = screen.getAllByRole('button');
      const meatballMenu = meatballMenus[1];
      expect(meatballMenu).toBeInTheDocument();

      await user.click(meatballMenu);

      const addProcedureButton = screen.getByRole('button', {
        name: 'Add procedure',
      });
      expect(addProcedureButton).toBeInTheDocument();

      await user.click(addProcedureButton);
      expect(defaultProps.onOpenAddProcedureSidePanel).toHaveBeenCalledTimes(1);
      window.featureFlags = { 'medical-procedure': false };
    });

    it('passes the correct row actions when permissions.medical.issues.canCreate is true and feature flag chronic-injury-illness is enabled', async () => {
      window.featureFlags = { 'chronic-injury-illness': true };
      const user = userEvent.setup();
      renderComponent({
        permissions: {
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            issues: { canCreate: true },
          },
        },
      });

      const meatballMenus = screen.getAllByRole('button');
      const meatballMenu = meatballMenus[1];
      expect(meatballMenu).toBeInTheDocument();

      await user.click(meatballMenu);

      const addInjuryIllnessButton = screen.getByRole('button', {
        name: 'Add injury/ illness',
      });
      expect(addInjuryIllnessButton).toBeInTheDocument();

      await user.click(addInjuryIllnessButton);
      expect(defaultProps.onOpenAddIssuePanel).toHaveBeenCalledTimes(1);

      defaultProps.onOpenAddIssuePanel.mockClear();

      await user.click(meatballMenu);

      const addChronicConditionButton = screen.getByRole('button', {
        name: 'Add chronic condition',
      });
      expect(addChronicConditionButton).toBeInTheDocument();

      await user.click(addChronicConditionButton);
      expect(defaultProps.onOpenAddIssuePanel).toHaveBeenCalledTimes(1);
      window.featureFlags = { 'chronic-injury-illness': false };
    });

    describe('[feature-flag] roster-player-injury-status-update', () => {
      afterEach(() => {
        window.setFlag('roster-player-injury-status-update', false);
      });

      it('passes the correct row actions when permissions.medical.issues.canEdit is true', async () => {
        window.setFlag('roster-player-injury-status-update', true);
        const user = userEvent.setup();
        renderComponent({
          permissions: {
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              issues: { canEdit: true, canView: true },
            },
          },
        });

        const meatballMenus = screen.getAllByRole('button');
        const meatballMenu = meatballMenus[1];
        expect(meatballMenu).toBeInTheDocument();

        await user.click(meatballMenu);

        const changeStatusButton = screen.getByRole('button', {
          name: 'Change status',
        });
        expect(changeStatusButton).toBeInTheDocument();

        await user.click(changeStatusButton);

        expect(
          screen.getByRole('button', { name: 'Cancel' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Update' })
        ).toBeInTheDocument();
      });

      it('does not show change status action when permissions.medical.issues.canEdit is false', async () => {
        window.setFlag('roster-player-injury-status-update', true);
        const user = userEvent.setup();
        renderComponent({
          permissions: {
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              issues: { canEdit: false, canCreate: true },
            },
          },
        });

        const meatballMenus = screen.getAllByRole('button');
        const meatballMenu = meatballMenus[1];
        expect(meatballMenu).toBeInTheDocument();

        await user.click(meatballMenu);

        const changeStatusButton = screen.queryByRole('button', {
          name: 'Change status',
        });
        expect(changeStatusButton).not.toBeInTheDocument();
      });

      it('does not show change status action when roster-player-injury-status-update feature flag is disabled', async () => {
        window.setFlag('roster-player-injury-status-update', false);
        renderComponent({
          permissions: {
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              issues: { canEdit: true, canView: true },
            },
          },
        });

        const meatballMenus = screen.queryAllByRole('button');
        expect(meatballMenus).toEqual([]);
      });

      it('shows change status action when roster-player-injury-status-update feature flag is enabled', async () => {
        window.setFlag('roster-player-injury-status-update', true);
        const user = userEvent.setup();
        renderComponent({
          permissions: {
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              issues: { canEdit: true, canView: true },
            },
          },
        });

        const meatballMenus = screen.getAllByRole('button');
        const meatballMenu = meatballMenus[1];
        expect(meatballMenu).toBeInTheDocument();

        await user.click(meatballMenu);

        const changeStatusButton = screen.getByRole('button', {
          name: 'Change status',
        });
        expect(changeStatusButton).toBeInTheDocument();
      });
    });
  });

  describe('open issues edit mode', () => {
    beforeEach(() => {
      window.setFlag('roster-player-injury-status-update', true);
    });

    it('passes editing state to OpenIssues component when change status is clicked', async () => {
      const user = userEvent.setup();
      renderComponent({
        permissions: {
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            issues: { canEdit: true, canView: true },
          },
        },
      });

      expect(
        screen.queryByRole('button', { name: 'Cancel' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Update' })
      ).not.toBeInTheDocument();

      const meatballMenus = screen.getAllByRole('button');
      const meatballMenu = meatballMenus[1];
      await user.click(meatballMenu);

      const changeStatusButton = screen.getByRole('button', {
        name: 'Change status',
      });
      await user.click(changeStatusButton);

      expect(
        screen.getByRole('button', { name: 'Cancel' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Update' })
      ).toBeInTheDocument();
    });

    it('cancels edit mode when cancel button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent({
        permissions: {
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            issues: { canEdit: true, canView: true },
          },
        },
      });

      const meatballMenus = screen.getAllByRole('button');
      const meatballMenu = meatballMenus[1];
      await user.click(meatballMenu);

      const changeStatusButton = screen.getByRole('button', {
        name: 'Change status',
      });
      await user.click(changeStatusButton);

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      expect(cancelButton).toBeInTheDocument();

      await user.click(cancelButton);

      expect(
        screen.queryByRole('button', { name: 'Cancel' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Update' })
      ).not.toBeInTheDocument();
    });

    it('only allows editing one row at a time', async () => {
      const user = userEvent.setup();
      renderComponent({
        permissions: {
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            issues: { canEdit: true, canView: true },
          },
        },
      });

      const meatballMenus = screen.getAllByRole('button');
      const firstMeatballMenu = meatballMenus[0];
      await user.click(firstMeatballMenu);

      let changeStatusButton = screen.getByRole('button', {
        name: 'Change status',
      });
      await user.click(changeStatusButton);

      expect(
        screen.getByRole('button', { name: 'Cancel' })
      ).toBeInTheDocument();
      expect(screen.getByText('Sore Ankle')).toBeInTheDocument();

      const updatedMeatballMenus = screen
        .getAllByRole('button')
        .filter((btn) => btn.getAttribute('aria-expanded') === 'false');

      const secondMeatballMenu = updatedMeatballMenus[0];
      await user.click(secondMeatballMenu);

      changeStatusButton = screen.getByRole('button', {
        name: 'Change status',
      });
      await user.click(changeStatusButton);

      expect(
        screen.getByRole('button', { name: 'Cancel' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Update' })
      ).toBeInTheDocument();

      expect(screen.getByText('Broken Ankle')).toBeInTheDocument();
    });
  });

  describe('dataGrid row data', () => {
    it('renders player position only in athlete column when player id does not exist', () => {
      renderComponent();
      const positions = screen.getAllByTestId('positionRow');
      expect(positions[0]).toHaveTextContent('Scrum Half');
    });

    it('renders player id and position in athlete column when player id exists', () => {
      const props = {
        ...defaultProps,
        grid: {
          ...defaultProps.grid,
          rows: [
            {
              ...defaultProps.grid.rows[0],
              player_id: '123456',
            },
          ],
        },
      };
      renderComponent({ props });
      const position = screen.getByTestId('positionRow');
      expect(position).toHaveTextContent('123456 - Scrum Half');
    });
  });
});
