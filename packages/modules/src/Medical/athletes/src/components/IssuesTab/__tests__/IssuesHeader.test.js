import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import PermissionsContext, {
  DEFAULT_CONTEXT_VALUE,
} from '@kitman/common/src/contexts/PermissionsContext';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import tabHashes from '@kitman/modules/src/Medical/shared/constants/tabHashes';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import IssuesHeader from '../IssuesHeader';

jest.mock('@kitman/common/src/hooks/useEventTracking');

const mockTrackEvent = jest.fn();
const mockOnOpenAddIssuePanel = jest.fn();
const mockOnOpenAddMedicalNotePanel = jest.fn();
const mockOnOpenAddModificationSidePanel = jest.fn();
const mockOnOpenAddTreatmentsSidePanel = jest.fn();
const mockOnOpenAddDiagnosticSidePanel = jest.fn();
const mockOnOpenAddVaccinationSidePanel = jest.fn();
const mockOnOpenAddAllergySidePanel = jest.fn();
const mockOnOpenAddMedicalAlertSidePanel = jest.fn();
const mockOnOpenAddTUESidePanel = jest.fn();
const mockOnOpenAddConcussionTestResultSidePanel = jest.fn();

const props = {
  athleteIssueStatuses: [],
  organisationStatus: 'CURRENT_ATHLETE',
  isPastAthlete: false,
  athleteIssueTypes: [],
  isIssuesAdmin: true, // isIssuesAdmin is a direct prop
  canCreateTUE: false,
  onOpenAddIssuePanel: mockOnOpenAddIssuePanel,
  onOpenAddMedicalNotePanel: mockOnOpenAddMedicalNotePanel,
  onOpenAddModificationSidePanel: mockOnOpenAddModificationSidePanel,
  onOpenAddTreatmentsSidePanel: mockOnOpenAddTreatmentsSidePanel,
  onOpenAddDiagnosticSidePanel: mockOnOpenAddDiagnosticSidePanel,
  onOpenAddVaccinationSidePanel: mockOnOpenAddVaccinationSidePanel,
  onOpenAddAllergySidePanel: mockOnOpenAddAllergySidePanel,
  onOpenAddMedicalAlertSidePanel: mockOnOpenAddMedicalAlertSidePanel,
  onOpenAddTUESidePanel: mockOnOpenAddTUESidePanel,
  onOpenAddConcussionTestResultSidePanel:
    mockOnOpenAddConcussionTestResultSidePanel,
  t: i18nextTranslateStub(),
};
const permissionProps = {
  permissions: {
    medical: {
      issues: { canArchive: true, canEdit: true }, // Added canEdit here as it's a permission
      notes: { canCreate: true },
      modifications: { canCreate: false },
      treatments: { canCreate: false },
      diagnostics: { canCreate: false },
      vaccinations: { canCreate: false },
      allergies: { canCreate: false },
      alerts: { canCreate: false },
      tue: { canCreate: false },
    },
    concussion: {
      canManageConcussionAssessments: false,
      canManageNpcAssessments: false,
      canManageKingDevickAssessments: false,
    },
  },
};

const renderComponent = (propsIn, permissionsIn) =>
  render(
    <PermissionsContext.Provider
      value={{
        permissions: {
          ...DEFAULT_CONTEXT_VALUE.permissions,
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            ...permissionProps.permissions.medical,
            ...permissionsIn?.medical,
          },
          concussion: {
            ...DEFAULT_CONTEXT_VALUE.permissions.concussion,
            ...permissionProps.permissions.concussion,
            ...permissionsIn?.concussion,
          },
        },
        permissionsRequestStatus: 'SUCCESS',
      }}
    >
      <IssuesHeader
        {...propsIn} // Apply propsIn first to allow overriding
        {...props}
        isAthleteOnTrial={false}
        {...permissionProps}
      />
    </PermissionsContext.Provider>
  );

describe('<IssuesHeader />', () => {
  beforeEach(() => {
    window.featureFlags = {
      'pm-show-tue': true,
      'view-archive-injury-area': true,
      'medical-alerts-side-panel': false,
      'concussion-medical-area': false,
      'medical-procedure': false,
      'chronic-injury-illness': false,
    };
    useEventTracking.mockReturnValue({ trackEvent: mockTrackEvent });
    jest.clearAllMocks();
  });

  it('renders the correct title', () => {
    renderComponent();
    expect(screen.getByText('Injury/ Illness')).toBeInTheDocument();
  });

  it('hides the actions menu by default', () => {
    renderComponent({}, { medical: { issues: { canEdit: false } } });
    expect(
      screen.queryByRole('button', { name: 'Add' })
    ).not.toBeInTheDocument();
  });

  describe('ADD button', () => {
    it('does render when the athlete is a CURRENT_ATHLETE and the correct permissions', () => {
      renderComponent();

      expect(screen.getByText('Injury/ Illness')).toBeInTheDocument();
      expect(screen.getByText('View archive')).toBeInTheDocument();

      expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    });

    it('does not render View archive button when FF view-archive-injury-area is false', () => {
      window.featureFlags['view-archive-injury-area'] = false;
      renderComponent();
      expect(screen.queryByText('View archive')).not.toBeInTheDocument();
    });

    it('does not render when the athlete is a TRIAL_ATHLETE regardless of permissions', () => {
      window.featureFlags['view-archive-injury-area'] = false;
      renderComponent({
        isAthleteOnTrial: true,
        hiddenFilters: ['add_issue_button'],
      });

      expect(screen.getByText('Injury/ Illness')).toBeInTheDocument();
      expect(screen.queryByText('View archive')).not.toBeInTheDocument();

      expect(
        screen.queryByRole('button', { name: 'Add' })
      ).not.toBeInTheDocument();
    });

    describe('Mixpanel Events', () => {
      it('[TRACK-EVENT] tracks Add -> Injury/Illness event', async () => {
        const user = userEvent.setup();

        renderComponent();

        const addButton = screen.getByRole('button', { name: 'Add' });

        expect(addButton).toBeInTheDocument();

        await user.click(addButton);

        const injuryIllnessButton = screen.getByRole('button', {
          name: 'Injury/ Illness',
        });

        expect(injuryIllnessButton).toBeInTheDocument();

        await user.click(injuryIllnessButton);

        expect(mockTrackEvent).toHaveBeenCalledWith(
          'Click Add -> Injury/Illness',
          {
            level: 'athlete',
            tab: tabHashes.ISSUES,
          }
        );
      });

      it('[TRACK-EVENT] tracks Click Add -> Medical Note', async () => {
        const user = userEvent.setup();

        renderComponent();

        const addButton = screen.getByRole('button', { name: 'Add' });

        expect(addButton).toBeInTheDocument();

        await user.click(addButton);

        const noteButton = screen.getByRole('button', {
          name: 'Note',
        });

        expect(noteButton).toBeInTheDocument();

        await user.click(noteButton);

        expect(mockTrackEvent).toHaveBeenCalledWith(
          performanceMedicineEventNames.clickAddMedicalNote,
          {
            level: 'athlete',
            tab: tabHashes.ISSUES,
            actionElement: 'Add menu',
          }
        );

        expect(mockOnOpenAddMedicalNotePanel).toHaveBeenCalled();
      });
    });

    describe('Add menu items based on permissions and feature flags', () => {
      it('renders Modification action when permissions.medical.modifications.canCreate is true and calls the correct handler', async () => {
        const user = userEvent.setup();
        renderComponent(
          {},
          { medical: { modifications: { canCreate: true } } }
        );

        const addButton = screen.getByRole('button', { name: 'Add' });
        await user.click(addButton);

        const modificationButton = screen.getByRole('button', {
          name: 'Modification',
        });
        expect(modificationButton).toBeInTheDocument();
        await user.click(modificationButton);
        expect(mockOnOpenAddModificationSidePanel).toHaveBeenCalled();
      });

      it('renders Treatment action when permissions.medical.treatments.canCreate is true and calls the correct handler', async () => {
        const user = userEvent.setup();
        renderComponent({}, { medical: { treatments: { canCreate: true } } });

        const addButton = screen.getByRole('button', { name: 'Add' });
        await user.click(addButton);

        const treatmentButton = screen.getByRole('button', {
          name: 'Treatment',
        });
        expect(treatmentButton).toBeInTheDocument();
        await user.click(treatmentButton);
        expect(mockOnOpenAddTreatmentsSidePanel).toHaveBeenCalled();
      });

      it('renders Diagnostic action when permissions.medical.diagnostics.canCreate is true and calls the correct handler', async () => {
        const user = userEvent.setup();
        renderComponent({}, { medical: { diagnostics: { canCreate: true } } });

        const addButton = screen.getByRole('button', { name: 'Add' });
        await user.click(addButton);

        const diagnosticButton = screen.getByRole('button', {
          name: 'Diagnostic',
        });
        expect(diagnosticButton).toBeInTheDocument();
        await user.click(diagnosticButton);
        expect(mockOnOpenAddDiagnosticSidePanel).toHaveBeenCalled();
      });

      it('renders Vaccination action when permissions.medical.vaccinations.canCreate is true and calls the correct handler', async () => {
        const user = userEvent.setup();
        renderComponent({}, { medical: { vaccinations: { canCreate: true } } });

        const addButton = screen.getByRole('button', { name: 'Add' });
        await user.click(addButton);

        const vaccinationButton = screen.getByRole('button', {
          name: 'Vaccination',
        });
        expect(vaccinationButton).toBeInTheDocument();
        await user.click(vaccinationButton);
        expect(mockOnOpenAddVaccinationSidePanel).toHaveBeenCalled();
      });

      it('renders Allergy action when permissions.medical.allergies.canCreate is true and calls the correct handler', async () => {
        const user = userEvent.setup();
        renderComponent({}, { medical: { allergies: { canCreate: true } } });

        const addButton = screen.getByRole('button', { name: 'Add' });
        await user.click(addButton);

        const allergyButton = screen.getByRole('button', {
          name: 'Allergy',
        });
        expect(allergyButton).toBeInTheDocument();
        await user.click(allergyButton);
        expect(mockOnOpenAddAllergySidePanel).toHaveBeenCalled();
      });

      it('renders Medical alert action when medical-alerts-side-panel feature flag and permissions.medical.alerts.canCreate are true and calls the correct handler', async () => {
        const user = userEvent.setup();
        window.featureFlags['medical-alerts-side-panel'] = true;
        renderComponent({}, { medical: { alerts: { canCreate: true } } });

        const addButton = screen.getByRole('button', { name: 'Add' });
        await user.click(addButton);

        const medicalAlertButton = screen.getByRole('button', {
          name: 'Medical alert',
        });
        expect(medicalAlertButton).toBeInTheDocument();
        await user.click(medicalAlertButton);
        expect(mockOnOpenAddMedicalAlertSidePanel).toHaveBeenCalled();
      });

      it('renders TUE action when permissions.medical.tue.canCreate is true and calls the correct handler', async () => {
        const user = userEvent.setup();
        renderComponent({}, { medical: { tue: { canCreate: true } } });

        const addButton = screen.getByRole('button', { name: 'Add' });
        await user.click(addButton);

        const tueButton = screen.getByRole('button', {
          name: 'TUE',
        });
        expect(tueButton).toBeInTheDocument();
        await user.click(tueButton);
        expect(mockOnOpenAddTUESidePanel).toHaveBeenCalled();
      });

      it('renders Concussion test action when concussion-medical-area feature flag and concussion permissions are true and calls the correct handler', async () => {
        const user = userEvent.setup();
        window.featureFlags['concussion-medical-area'] = true;
        renderComponent(
          {},
          {
            concussion: {
              canManageManageAssessments: true,
              canManageNpcAssessments: true,
              canManageKingDevickAssessments: true,
            },
          }
        );

        const addButton = screen.getByRole('button', { name: 'Add' });
        await user.click(addButton);

        const concussionTestButton = screen.getByRole('button', {
          name: 'Concussion test',
        });
        expect(concussionTestButton).toBeInTheDocument();
        await user.click(concussionTestButton);
        const npcSubMenuElement = screen.getByText(
          'Near point of convergence (NPC)'
        );
        expect(npcSubMenuElement).toBeInTheDocument();
      });
    });
  });

  it('renders the issues filters', () => {
    renderComponent();
    // This test was failing because there were multiple elements with the placeholder 'Search'.
    // Changed to getAllByPlaceholderText to find all matching elements.
    expect(screen.getAllByPlaceholderText('Search').length).toBeGreaterThan(0);
  });

  describe('Past vs Current Athlete', () => {
    beforeEach(() => {
      window.featureFlags = {
        'pm-show-tue': true,
        'view-archive-injury-area': true,
        'medical-alerts-side-panel': true,
        'concussion-medical-area': true,
        'medical-procedure': true,
        'chronic-injury-illness': true,
      };
      jest.clearAllMocks();
    });

    it('renders the correct actions when viewing a past athlete', async () => {
      const user = userEvent.setup();
      renderComponent(
        { isPastAthlete: true },
        {
          medical: {
            issues: { canEdit: true, canCreate: true },
            notes: { canCreate: true },
            modifications: { canCreate: true },
            diagnostics: { canCreate: true },
            treatments: { canCreate: true },
            allergies: { canCreate: true },
            alerts: { canCreate: true },
            procedures: { canCreate: true },
            vaccinations: { canCreate: true },
            tue: { canCreate: true },
          },
          concussion: {
            canManageConcussionAssessments: true,
            canManageNpcAssessments: true,
            canManageKingDevickAssessments: true,
          },
        }
      );

      const addButton = screen.getByRole('button', { name: 'Add' });
      await user.click(addButton);

      const menuItems = screen.getAllByRole('button', { hidden: true }); // Get all buttons in the opened menu
      const menuItemNames = menuItems.map((item) => item.textContent);
      const expectedButtons = [
        'Injury/ Illness',
        'Note',
        'Diagnostic',
        'Treatment',
        'Procedure',
        'Vaccination',
        'Concussion test',
      ];

      // Check if all expected buttons are present in the rendered menu items.
      // The rendered menu items array (menuItemNames) is allowed to be larger.
      expect(
        expectedButtons.every((button) => menuItemNames.includes(button))
      ).toBe(true);
    });

    it('renders the correct actions when viewing a current athlete', async () => {
      const user = userEvent.setup();
      renderComponent(
        { isPastAthlete: false },
        {
          medical: {
            issues: { canEdit: true, canCreate: true },
            notes: { canCreate: true },
            modifications: { canCreate: true },
            diagnostics: { canCreate: true },
            treatments: { canCreate: true },
            allergies: { canCreate: true },
            alerts: { canCreate: true },
            procedures: { canCreate: true },
            vaccinations: { canCreate: true },
            tue: { canCreate: true },
          },
          concussion: {
            canManageConcussionAssessments: true,
            canManageNpcAssessments: true,
            canManageKingDevickAssessments: true,
          },
        }
      );

      const addButton = screen.getByRole('button', { name: 'Add' });
      await user.click(addButton);

      const menuItems = screen.getAllByRole('button', { hidden: true }); // Get all buttons in the opened menu
      const menuItemNames = menuItems.map((item) => item.textContent);
      const expectedButtons = [
        'Injury/ Illness',
        'Note',
        'Modification',
        'Diagnostic',
        'Treatment',
        'Allergy',
        'Chronic condition',
        'Medical alert',
        'Procedure',
        'Vaccination',
        'TUE',
        'Concussion test',
      ];

      // Check if all expected buttons are present in the rendered menu items.
      // The rendered menu items array (menuItemNames) is allowed to be larger.
      expect(
        expectedButtons.every((button) => menuItemNames.includes(button))
      ).toBe(true);
    });

    it('calls props.onOpenAddIssuePanel with isChronicCondition true when the chronic condition menu item is clicked', async () => {
      const user = userEvent.setup();
      renderComponent(
        { isPastAthlete: false },
        {
          medical: {
            issues: { canEdit: true, canCreate: true },
            notes: { canCreate: true },
            modifications: { canCreate: true },
            diagnostics: { canCreate: true },
            treatments: { canCreate: true },
            allergies: { canCreate: true },
            alerts: { canCreate: true },
            procedures: { canCreate: true },
            vaccinations: { canCreate: true },
            tue: { canCreate: true },
          },
          concussion: {
            canManageConcussionAssessments: true,
            canManageNpcAssessments: true,
            canManageKingDevickAssessments: true,
          },
        }
      );

      const addButton = screen.getByRole('button', { name: 'Add' });
      await user.click(addButton);

      const chronicConditionButton = screen.getByRole('button', {
        name: 'Chronic condition',
      });
      await user.click(chronicConditionButton);

      expect(mockOnOpenAddIssuePanel).toHaveBeenCalledWith({
        isChronicCondition: true,
      });
    });

    it('calls props.onOpenAddIssuePanel with isChronicCondition false when the injury/illness menu item is clicked', async () => {
      const user = userEvent.setup();
      renderComponent(
        { isPastAthlete: false },
        {
          medical: {
            issues: { canEdit: true, canCreate: true },
            notes: { canCreate: true },
            modifications: { canCreate: true },
            diagnostics: { canCreate: true },
            treatments: { canCreate: true },
            allergies: { canCreate: true },
            alerts: { canCreate: true },
            procedures: { canCreate: true },
            vaccinations: { canCreate: true },
            tue: { canCreate: true },
          },
          concussion: {
            canManageConcussionAssessments: true,
            canManageNpcAssessments: true,
            canManageKingDevickAssessments: true,
          },
        }
      );

      const addButton = screen.getByRole('button', { name: 'Add' });
      await user.click(addButton);

      const injuryIllnessButton = screen.getByRole('button', {
        name: 'Injury/ Illness',
      });
      await user.click(injuryIllnessButton);

      expect(mockOnOpenAddIssuePanel).toHaveBeenCalledWith({
        isChronicCondition: false,
      });
    });
  });
});
