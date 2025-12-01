import { screen } from '@testing-library/react';
import {
  usePermissions,
  DEFAULT_CONTEXT_VALUE,
} from '@kitman/common/src/contexts/PermissionsContext';

import {
  renderWithUserEventSetup,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import { data as mockAthleteData } from '@kitman/services/src/mocks/handlers/getAthleteData';
import { data as mockIssueData } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssue';
import moment from 'moment-timezone';
import tabHashes from '@kitman/modules/src/Medical/shared/constants/tabHashes';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { useIssue } from '@kitman/modules/src/Medical/shared/contexts/IssueContext';
import { mockedChronicIssueContextValue } from '@kitman/modules/src/Medical/shared/contexts/IssueContext/utils/mocks';
import AppHeader from '../index';

jest.mock('@kitman/common/src/hooks/useEventTracking');
jest.mock('@kitman/modules/src/Medical/shared/contexts/IssueContext');
jest.mock('@kitman/common/src/contexts/PermissionsContext', () => ({
  ...jest.requireActual('@kitman/common/src/contexts/PermissionsContext'),
  usePermissions: jest.fn(),
}));

describe('<AppHeader />', () => {
  const trackEventMock = jest.fn();
  moment.tz.setDefault('UTC');
  const fakeDate = moment('2022-01-15').toDate();

  beforeEach(() => {
    window.setFlag('pm-show-tue', false);
    useEventTracking.mockReturnValue({ trackEvent: trackEventMock });
    usePermissions.mockReturnValue({
      permissions: DEFAULT_CONTEXT_VALUE.permissions,
      permissionsRequestStatus: 'SUCCESS',
    });
    useIssue.mockReturnValue({
      issue: mockIssueData.issue,
      issueType: 'Injury',
      requestStatus: 'SUCCESS',
    });
  });

  const defaultProps = {
    isConcussion: true,
    athleteData: { id: 1, ...mockAthleteData },
    tabHash: '',
    t: i18nextTranslateStub(),
  };

  const renderComponent = (props = defaultProps) =>
    renderWithUserEventSetup(<AppHeader {...props} />);

  describe('with default mock issue', () => {
    describe('default permissions', () => {
      it('renders the correct content', () => {
        renderComponent();

        expect(
          screen.getByRole('link', { name: 'Player overview' })
        ).toHaveAttribute('href', '/medical/athletes/1');

        const avatar = screen.getByRole('img');
        expect(avatar).toHaveAttribute(
          'src',
          'https://kitman-staging.imgix.net/avatar.jpg'
        );
        expect(avatar).toHaveAttribute('alt', 'John Doe');

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
          'John Doe - Ankle Fracture'
        );
      });
    });

    describe('[permissions] permissions.medical.notes.canCreate', () => {
      beforeEach(() => {
        usePermissions.mockReturnValue({
          permissions: {
            ...DEFAULT_CONTEXT_VALUE.permissions,
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              notes: { canCreate: true },
              issues: {
                canEdit: true,
              },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        });
      });

      it('renders the correct content', async () => {
        const onOpenAddMedicalNotePanelMock = jest.fn();

        const { user } = renderComponent({
          ...defaultProps,
          onOpenAddMedicalNotePanel: onOpenAddMedicalNotePanelMock,
        });

        const addButton = screen.getByRole('button', { name: 'Add' });
        expect(addButton).toBeInTheDocument();
        await user.click(addButton);

        const noteButton = screen.getByRole('button', { name: 'Note' });
        expect(noteButton).toBeInTheDocument();
        await user.click(noteButton);

        expect(trackEventMock).toHaveBeenCalledTimes(1);
        expect(trackEventMock).toHaveBeenCalledWith(
          performanceMedicineEventNames.clickAddMedicalNote,
          { actionElement: 'Add menu', level: 'issue', tab: '#issue' }
        );
        expect(onOpenAddMedicalNotePanelMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('[permissions] permissions.medical.modifications.canCreate and Athlete is not a past player', () => {
      beforeEach(() => {
        usePermissions.mockReturnValue({
          permissions: {
            ...DEFAULT_CONTEXT_VALUE.permissions,
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              modifications: {
                canCreate: true,
              },
              issues: {
                canEdit: true,
              },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        });
      });

      it('renders the correct content', async () => {
        const onOpenAddModificationSidePanelMock = jest.fn();

        const { user } = renderComponent({
          ...defaultProps,
          onOpenAddModificationSidePanel: onOpenAddModificationSidePanelMock,
          athleteData: {
            ...defaultProps.athleteData,
            org_last_transfer_record: {
              transfer_type: 'Trade',
              joined_at: null,
              left_at: null,
              data_sharing_consent: true,
            },
          },
        });
        const addButton = screen.getByRole('button', { name: 'Add' });
        expect(addButton).toBeInTheDocument();
        await user.click(addButton);

        const modificationButton = screen.getByRole('button', {
          name: 'Modification',
        });
        expect(modificationButton).toBeInTheDocument();
        await user.click(modificationButton);
        expect(onOpenAddModificationSidePanelMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('[permissions] permissions.medical.treatments.canCreate', () => {
      beforeEach(() => {
        usePermissions.mockReturnValue({
          permissions: {
            ...DEFAULT_CONTEXT_VALUE.permissions,
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              treatments: {
                canCreate: true,
              },
              issues: {
                canEdit: true,
              },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        });
      });

      it('renders the correct content', async () => {
        const onOpenAddTreatmentsSidePanelMock = jest.fn();

        const { user } = renderComponent({
          ...defaultProps,
          onOpenAddTreatmentsSidePanel: onOpenAddTreatmentsSidePanelMock,
        });

        const addButton = screen.getByRole('button', { name: 'Add' });
        expect(addButton).toBeInTheDocument();
        await user.click(addButton);

        const treatmentButton = screen.getByRole('button', {
          name: 'Treatment',
        });
        expect(treatmentButton).toBeInTheDocument();
        await user.click(treatmentButton);

        expect(onOpenAddTreatmentsSidePanelMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('[permissions] permissions.medical.tue.canCreate', () => {
      beforeEach(() => {
        window.setFlag('pm-show-tue', true);
        usePermissions.mockReturnValue({
          permissions: {
            ...DEFAULT_CONTEXT_VALUE.permissions,
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              tue: {
                canCreate: true,
              },
              issues: {
                canEdit: true,
              },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        });
      });

      afterEach(() => {
        window.setFlag('pm-show-tue', false);
      });

      it('does not render the TUE button in the Add menu', async () => {
        const { user } = renderComponent();

        const addButton = screen.getByRole('button', { name: 'Add' });
        expect(addButton).toBeInTheDocument();
        await user.click(addButton);

        const tueButton = screen.queryByRole('button', {
          name: 'TUE',
        });
        expect(tueButton).not.toBeInTheDocument();
      });
    });

    describe('[permissions] permissions.medical.diagnostics.canCreate', () => {
      beforeEach(() => {
        usePermissions.mockReturnValue({
          permissions: {
            ...DEFAULT_CONTEXT_VALUE.permissions,
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              diagnostics: {
                canCreate: true,
              },
              issues: {
                canEdit: true,
              },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        });
      });

      it('renders the correct content', async () => {
        const onOpenAddDiagnosticSidePanelMock = jest.fn();

        const { user } = renderComponent({
          ...defaultProps,
          onOpenAddDiagnosticSidePanel: onOpenAddDiagnosticSidePanelMock,
        });

        const addButton = screen.getByRole('button', { name: 'Add' });
        expect(addButton).toBeInTheDocument();
        await user.click(addButton);

        const diagnosticButton = screen.getByRole('button', {
          name: 'Diagnostic',
        });
        expect(diagnosticButton).toBeInTheDocument();
        await user.click(diagnosticButton);

        expect(onOpenAddDiagnosticSidePanelMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('[permissions] permissions.medical.allergies.canCreate and Athlete is not past player', () => {
      beforeEach(() => {
        usePermissions.mockReturnValue({
          permissions: {
            ...DEFAULT_CONTEXT_VALUE.permissions,
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              allergies: {
                canCreate: true,
              },
              issues: {
                canEdit: true,
              },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        });
      });

      it('renders the correct content', async () => {
        const onOpenAddAllergySidePanelMock = jest.fn();

        const { user } = renderComponent({
          ...defaultProps,
          onOpenAddAllergySidePanel: onOpenAddAllergySidePanelMock,
          athleteData: {
            ...defaultProps.athleteData,
            org_last_transfer_record: {
              transfer_type: 'Trade',
              joined_at: null,
              left_at: null,
              data_sharing_consent: true,
            },
          },
        });

        const addButton = screen.getByRole('button', { name: 'Add' });
        expect(addButton).toBeInTheDocument();
        await user.click(addButton);

        const allergyButton = screen.getByRole('button', {
          name: 'Allergy',
        });
        expect(allergyButton).toBeInTheDocument();
        await user.click(allergyButton);
        expect(onOpenAddAllergySidePanelMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('[permissions] permissions.medical.allergies.canView', () => {
      beforeEach(() => {
        usePermissions.mockReturnValue({
          permissions: {
            ...DEFAULT_CONTEXT_VALUE.permissions,
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              allergies: {
                canView: true,
              },
              issues: {
                canEdit: true,
              },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        });
      });

      it('renders the correct content', async () => {
        const onOpenAddAllergySidePanelMock = jest.fn();

        const { user } = renderComponent({
          ...defaultProps,
          onOpenAddAllergySidePanel: onOpenAddAllergySidePanelMock,
          athleteData: {
            ...defaultProps.athleteData,
            allergies: [
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
            ],
          },
        });
        expect(screen.getByText('Ibuprofen allergy')).toBeInTheDocument();
        expect(screen.getByText('Peanut allergy')).toBeInTheDocument();

        const addButton = screen.getByRole('button', { name: 'Add' });
        expect(addButton).toBeInTheDocument();
        await user.click(addButton);

        const allergyButton = screen.queryByRole('button', {
          name: 'Allergy',
        });
        expect(allergyButton).not.toBeInTheDocument();
      });
    });

    describe('[feature-flag] concussion-medical-area', () => {
      beforeEach(() => {
        window.featureFlags['concussion-medical-area'] = true;
        usePermissions.mockReturnValue({
          permissions: {
            ...DEFAULT_CONTEXT_VALUE.permissions,
            concussion: {
              ...DEFAULT_CONTEXT_VALUE.permissions.concussion,
              canManageConcussionAssessments: true,
              canManageNpcAssessments: true,
              canManageKingDevickAssessments: true,
            },
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              issues: {
                canEdit: true,
              },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        });
      });

      afterEach(() => {
        window.featureFlags['concussion-medical-area'] = false;
      });

      it('renders the correct content', async () => {
        const onOpenAddConcussionTestResultSidePanelMock = jest.fn();

        const { user } = renderComponent({
          ...defaultProps,
          onOpenAddConcussionTestResultSidePanel:
            onOpenAddConcussionTestResultSidePanelMock,
          isConcussion: true,
        });
        const addButton = screen.getByRole('button', { name: 'Add' });
        expect(addButton).toBeInTheDocument();
        await user.click(addButton);

        const concussionTestButton = screen.getByRole('button', {
          name: 'Concussion test',
        });
        expect(concussionTestButton).toBeInTheDocument();
        await user.hover(concussionTestButton);

        expect(screen.getByText('King-Devick')).toBeInTheDocument();
        const npcButton = screen.getByText('Near point of convergence (NPC)');
        expect(npcButton).toBeInTheDocument();
        await user.click(npcButton);
        expect(onOpenAddConcussionTestResultSidePanelMock).toHaveBeenCalledWith(
          'NPC'
        );
      });

      it('does not render concussion test menu option when isConcussion false', async () => {
        const { user } = renderComponent({
          ...defaultProps,
          isConcussion: false,
        });
        const addButton = screen.getByRole('button', { name: 'Add' });
        expect(addButton).toBeInTheDocument();
        await user.click(addButton);

        const concussionTestButton = screen.queryByRole('button', {
          name: 'Concussion test',
        });
        expect(concussionTestButton).not.toBeInTheDocument();
        expect(
          screen.queryByText('Near point of convergence (NPC)')
        ).not.toBeInTheDocument();
        expect(screen.queryByText('King-Devick')).not.toBeInTheDocument();
      });
    });

    it('does not render the tooltip when there is no issue admin permission', () => {
      renderComponent({
        ...defaultProps,
        isIssuesAdmin: false,
      });
      const addButton = screen.queryByRole('button', { name: 'Add' });
      expect(addButton).not.toBeInTheDocument();
    });

    it('does not render the tooltip when the tab is medical note', () => {
      renderComponent({
        ...defaultProps,
        tabHash: tabHashes.MEDICAL_NOTES,
      });
      const addButton = screen.queryByRole('button', { name: 'Add' });
      expect(addButton).not.toBeInTheDocument();
    });

    it('does not render the tooltip when the tab is rehab note', () => {
      renderComponent({
        ...defaultProps,
        tabHash: tabHashes.REHAB,
      });
      const addButton = screen.queryByRole('button', { name: 'Add' });
      expect(addButton).not.toBeInTheDocument();
    });

    describe('Set a fake date', () => {
      beforeEach(() => {
        jest.useFakeTimers().setSystemTime(fakeDate);
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      it('does render the day of injury when the tab is rehab', () => {
        renderComponent({
          ...defaultProps,
          tabHash: tabHashes.REHAB,
        });

        expect(
          screen.getByText('Date of Injury: Jan 13, 2022 (2 days)')
        ).toBeInTheDocument();
      });

      describe('[feature-flag] update-perf-med-headers', () => {
        beforeEach(() => {
          window.featureFlags['update-perf-med-headers'] = true;
        });

        afterEach(() => {
          window.featureFlags['update-perf-med-headers'] = false;
        });

        it('does render the day of injury', () => {
          renderComponent();

          expect(
            screen.getByText('Date of Injury: Jan 13, 2022 (2 days)')
          ).toBeInTheDocument();
        });
      });
    });

    describe('[feature-flag] include-bamic-on-injury', () => {
      beforeEach(() => {
        window.featureFlags['include-bamic-on-injury'] = true;
        usePermissions.mockReturnValue({
          permissions: {
            ...DEFAULT_CONTEXT_VALUE.permissions,
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              issues: {
                canEdit: true,
              },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        });
      });

      afterEach(() => {
        window.featureFlags['include-bamic-on-injury'] = false;
      });

      it('renders the bamic grade beside the athlete name', () => {
        renderComponent();

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
          'John Doe - Ankle Fracture - Grade 2b'
        );
      });

      it('renders the bamic grade beside the athlete name without a site', () => {
        useIssue.mockReturnValue({
          issue: {
            ...mockIssueData.issue,
            bamic_grade: {
              grade: '3',
            },
          },
          issueType: 'Injury',
          requestStatus: 'SUCCESS',
        });

        renderComponent();

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
          'John Doe - Ankle Fracture - Grade 3b'
        );
      });

      describe('when no grade is present', () => {
        beforeEach(() => {
          useIssue.mockReturnValue({
            issue: {
              ...mockIssueData.issue,
              bamic_grade: null,
            },
            issueType: 'Injury',
            requestStatus: 'SUCCESS',
          });
        });

        it('does not render the bamic grade beside the athlete name', () => {
          renderComponent();

          expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
            'John Doe - Ankle Fracture'
          );
        });
      });
    });

    describe('[feature-flag] injury-illness-name', () => {
      beforeEach(() => {
        window.featureFlags['injury-illness-name'] = true;
        usePermissions.mockReturnValue({
          permissions: {
            ...DEFAULT_CONTEXT_VALUE.permissions,
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              issues: {
                canEdit: true,
              },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        });
      });

      afterEach(() => {
        window.featureFlags['injury-illness-name'] = false;
      });

      describe('when viewing an issue created by the current organisation', () => {
        describe('when the issue has a title', () => {
          it('renders the EditableInput with the title as a value', () => {
            renderComponent();

            const heading = screen.getByRole('heading', { level: 2 });
            expect(heading).toHaveTextContent('John Doe - Ankle Fracture');
            expect(
              heading.querySelector('i').className.includes('icon-edit')
            ).toEqual(true);
          });
        });

        describe('when chronic issue has a title', () => {
          beforeEach(() => {
            useIssue.mockReturnValue({
              issue: {
                ...mockedChronicIssueContextValue.issue,
                bamic_grade: null,
              },
              isChronicIssue: true,
              requestStatus: 'SUCCESS',
            });
          });

          it('renders the EditableInput with the title as a value', () => {
            renderComponent();

            const heading = screen.getByRole('heading', { level: 2 });
            expect(heading).toHaveTextContent('John Doe - My Chronic');
            expect(
              heading.querySelector('i').className.includes('icon-edit')
            ).toEqual(true);
          });
        });

        describe('when the issue does not have a title', () => {
          beforeEach(() => {
            useIssue.mockReturnValue({
              issue: mockIssueData.issueWithTitle,
              issueType: 'Injury',
              requestStatus: 'SUCCESS',
            });
          });

          it('renders the EditableInput with the pathology as the value', () => {
            renderComponent();
            const heading = screen.getByRole('heading', { level: 2 });
            expect(heading).toHaveTextContent('John Doe - Issue Title');
            expect(
              heading.querySelector('i').className.includes('icon-edit')
            ).toEqual(true);
          });
        });

        it('hides the edit icon if user does not exist', () => {
          usePermissions.mockReturnValue({
            permissions: {
              ...DEFAULT_CONTEXT_VALUE.permissions,
              medical: {
                ...DEFAULT_CONTEXT_VALUE.permissions.medical,
                issues: {
                  canEdit: false,
                },
              },
            },
            permissionsRequestStatus: 'SUCCESS',
          });

          renderComponent();

          const heading = screen.getByRole('heading', { level: 2 });
          expect(heading).toHaveTextContent('John Doe - Ankle Fracture');

          expect(heading.querySelector('i')).not.toBeInTheDocument();
        });
      });

      describe('when viewing an issue that is read only', () => {
        beforeEach(() => {
          useIssue.mockReturnValue({
            issue: mockIssueData.issueWithTitle,
            issueType: 'Injury',
            requestStatus: 'SUCCESS',
            isReadOnly: true,
          });
        });

        describe('when the issue has a title', () => {
          it('does not render the EditableInput regardless of permissions', () => {
            renderComponent();
            const heading = screen.getByRole('heading', { level: 2 });
            expect(heading).toHaveTextContent('John Doe - Issue Title');
            expect(heading.querySelector('i')).not.toBeInTheDocument();
          });
        });
      });
    });

    describe('when the issue is read only', () => {
      beforeEach(() => {
        useIssue.mockReturnValue({
          issue: mockIssueData.issueWithTitle,
          issueType: 'Injury',
          requestStatus: 'SUCCESS',
          isReadOnly: true,
        });
      });

      it('hides the edit button when the issue isReadOnly, regardless of permissions', async () => {
        renderComponent();
        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toHaveTextContent('John Doe - Issue Title');
        expect(heading.querySelector('i')).not.toBeInTheDocument();
      });
    });
  });

  describe('adjusted default mock issue', () => {
    describe('[permissions] permissions.medical.workersComp.canEdit', () => {
      describe('[feature-flag] workers-comp', () => {
        beforeEach(() => {
          usePermissions.mockReturnValue({
            permissions: {
              ...DEFAULT_CONTEXT_VALUE.permissions,
              medical: {
                ...DEFAULT_CONTEXT_VALUE.permissions.medical,
                workersComp: {
                  canView: true,
                  canEdit: true,
                },
                issues: {
                  canEdit: true,
                },
              },
            },
            permissionsRequestStatus: 'SUCCESS',
          });
          window.featureFlags['workers-comp'] = true;
        });

        afterEach(() => {
          window.featureFlags['workers-comp'] = false;
        });

        it('should render Workers Comp if feature flag exists and workers comp issue status does not exist', async () => {
          useIssue.mockReturnValue({
            issue: { ...mockIssueData.issue, workers_comp: {} },
            issueType: 'Injury',
            requestStatus: 'SUCCESS',
          });

          const onOpenAddWorkersCompSidePanelMock = jest.fn();

          const { user } = renderComponent({
            ...defaultProps,
            onOpenAddWorkersCompSidePanel: onOpenAddWorkersCompSidePanelMock,
          });

          const addButton = screen.getByRole('button', { name: 'Add' });
          expect(addButton).toBeInTheDocument();
          await user.click(addButton);

          const workersCompButton = screen.getByRole('button', {
            name: "Workers' comp claim",
          });
          expect(workersCompButton).toBeInTheDocument();
          await user.click(workersCompButton);

          expect(onOpenAddWorkersCompSidePanelMock).toHaveBeenCalledTimes(1);
        });

        it('should not render Workers Comp if feature flag exists but workers comp issue status exists', async () => {
          useIssue.mockReturnValue({
            issue: {
              ...mockIssueData.issue,
              workers_comp: { status: 'draft' },
            },
            issueType: 'Injury',
            requestStatus: 'SUCCESS',
          });

          const { user } = renderComponent();

          const addButton = screen.getByRole('button', { name: 'Add' });
          expect(addButton).toBeInTheDocument();
          await user.click(addButton);

          const workersCompButton = screen.queryByRole('button', {
            name: "Workers' comp claim",
          });
          expect(workersCompButton).not.toBeInTheDocument();
        });

        it('should not render Workers Comp if feature flag exists but permission is canView', async () => {
          usePermissions.mockReturnValue({
            permissions: {
              ...DEFAULT_CONTEXT_VALUE.permissions,
              medical: {
                ...DEFAULT_CONTEXT_VALUE.permissions.medical,
                workersComp: {
                  canView: true,
                  canEdit: false,
                },
                issues: {
                  canEdit: true,
                },
              },
            },
            permissionsRequestStatus: 'SUCCESS',
          });

          const { user } = renderComponent();

          const addButton = screen.getByRole('button', { name: 'Add' });
          expect(addButton).toBeInTheDocument();
          await user.click(addButton);

          const workersCompButton = screen.queryByRole('button', {
            name: "Workers' comp claim",
          });
          expect(workersCompButton).not.toBeInTheDocument();
        });
      });

      describe('[feature-flag] pm-mls-emr-demo-froi', () => {
        beforeEach(() => {
          usePermissions.mockReturnValue({
            permissions: {
              ...DEFAULT_CONTEXT_VALUE.permissions,
              medical: {
                ...DEFAULT_CONTEXT_VALUE.permissions.medical,
                workersComp: {
                  canView: true,
                  canEdit: true,
                },
                issues: {
                  canEdit: true,
                },
              },
            },
            permissionsRequestStatus: 'SUCCESS',
          });
          window.featureFlags['pm-mls-emr-demo-froi'] = true;
        });

        afterEach(() => {
          window.featureFlags['pm-mls-emr-demo-froi'] = false;
        });

        it('should render FROI if feature flag exists and workers comp issue status does not exist', async () => {
          useIssue.mockReturnValue({
            issue: { ...mockIssueData.issue, workers_comp: {} },
            issueType: 'Injury',
            requestStatus: 'SUCCESS',
          });

          const onOpenAddWorkersCompSidePanelMock = jest.fn();

          const { user } = renderComponent({
            ...defaultProps,
            onOpenAddWorkersCompSidePanel: onOpenAddWorkersCompSidePanelMock,
          });

          const addButton = screen.getByRole('button', { name: 'Add' });
          expect(addButton).toBeInTheDocument();
          await user.click(addButton);

          const froiButton = screen.getByRole('button', {
            name: 'FROI',
          });
          expect(froiButton).toBeInTheDocument();
          await user.click(froiButton);

          expect(onOpenAddWorkersCompSidePanelMock).toHaveBeenCalledTimes(1);
        });

        it('should not render FROI if feature flag exists but workers comp issue status exists', async () => {
          useIssue.mockReturnValue({
            issue: {
              ...mockIssueData.issue,
              workers_comp: { status: 'draft' },
            },
            issueType: 'Injury',
            requestStatus: 'SUCCESS',
          });

          const { user } = renderComponent();

          const addButton = screen.getByRole('button', { name: 'Add' });
          expect(addButton).toBeInTheDocument();
          await user.click(addButton);

          const froiButton = screen.queryByRole('button', {
            name: 'FROI',
          });
          expect(froiButton).not.toBeInTheDocument();
        });

        it('should not render FROI if feature flag exists but permission is canView', async () => {
          usePermissions.mockReturnValue({
            permissions: {
              ...DEFAULT_CONTEXT_VALUE.permissions,
              medical: {
                ...DEFAULT_CONTEXT_VALUE.permissions.medical,
                workersComp: {
                  canView: true,
                  canEdit: false,
                },
                issues: {
                  canEdit: true,
                },
              },
            },
            permissionsRequestStatus: 'SUCCESS',
          });

          const { user } = renderComponent();

          const addButton = screen.getByRole('button', { name: 'Add' });
          expect(addButton).toBeInTheDocument();
          await user.click(addButton);

          const froiButton = screen.queryByRole('button', {
            name: 'FROI',
          });
          expect(froiButton).not.toBeInTheDocument();
        });
      });
    });

    describe('[permissions] permissions.medical.osha.canEdit', () => {
      describe('[feature-flag] osha-form', () => {
        beforeEach(() => {
          window.featureFlags['osha-form'] = true;
          usePermissions.mockReturnValue({
            permissions: {
              ...DEFAULT_CONTEXT_VALUE.permissions,
              medical: {
                ...DEFAULT_CONTEXT_VALUE.permissions.medical,
                osha: { canEdit: true, canView: true },
                issues: {
                  canEdit: true,
                },
              },
            },
            permissionsRequestStatus: 'SUCCESS',
          });
        });

        afterEach(() => {
          window.featureFlags['osha-form'] = false;
        });

        it('should render OSHA Form 301 if feature flag exists and osha issue status does not exist', async () => {
          useIssue.mockReturnValue({
            issue: { ...mockIssueData.issue, osha: {} },
            issueType: 'Injury',
            requestStatus: 'SUCCESS',
          });

          const onOpenAddOshaFormSidePanelMock = jest.fn();

          const { user } = renderComponent({
            ...defaultProps,
            onOpenAddOshaFormSidePanel: onOpenAddOshaFormSidePanelMock,
          });

          const addButton = screen.getByRole('button', { name: 'Add' });
          expect(addButton).toBeInTheDocument();
          await user.click(addButton);

          const workersCompButton = screen.getByRole('button', {
            name: 'OSHA Form 301',
          });
          expect(workersCompButton).toBeInTheDocument();
          await user.click(workersCompButton);

          expect(onOpenAddOshaFormSidePanelMock).toHaveBeenCalledTimes(1);
        });

        it('should not render OSHA Form 301 if feature flag exists but osha issue status exists', async () => {
          useIssue.mockReturnValue({
            issue: { ...mockIssueData.issue, osha: { status: 'draft' } },
            issueType: 'Injury',
            requestStatus: 'SUCCESS',
          });

          const onOpenAddOshaFormSidePanelMock = jest.fn();

          const { user } = renderComponent({
            ...defaultProps,
            onOpenAddOshaFormSidePanel: onOpenAddOshaFormSidePanelMock,
          });

          const addButton = screen.getByRole('button', { name: 'Add' });
          expect(addButton).toBeInTheDocument();
          await user.click(addButton);

          const workersCompButton = screen.queryByRole('button', {
            name: 'OSHA Form 301',
          });
          expect(workersCompButton).not.toBeInTheDocument();
        });

        it('should not render OSHA Form 301 if feature flag exists but permission is canView', async () => {
          usePermissions.mockReturnValue({
            permissions: {
              ...DEFAULT_CONTEXT_VALUE.permissions,
              medical: {
                ...DEFAULT_CONTEXT_VALUE.permissions.medical,
                osha: { canEdit: false, canView: true },
                issues: {
                  canEdit: true,
                },
              },
            },
            permissionsRequestStatus: 'SUCCESS',
          });

          useIssue.mockReturnValue({
            issue: { ...mockIssueData.issue, osha: {} },
            issueType: 'Injury',
            requestStatus: 'SUCCESS',
          });

          const onOpenAddOshaFormSidePanelMock = jest.fn();

          const { user } = renderComponent({
            ...defaultProps,
            onOpenAddOshaFormSidePanel: onOpenAddOshaFormSidePanelMock,
          });

          const addButton = screen.getByRole('button', { name: 'Add' });
          expect(addButton).toBeInTheDocument();
          await user.click(addButton);

          const workersCompButton = screen.queryByRole('button', {
            name: 'OSHA Form 301',
          });
          expect(workersCompButton).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('[PLAYER MOVEMENT]', () => {
    beforeEach(() => {
      window.featureFlags['medical-alerts-side-panel'] = true;
      window.featureFlags['medical-procedure'] = true;

      useIssue.mockReturnValue({
        issue: { ...mockIssueData.issue },
        issueType: 'Injury',
        requestStatus: 'SUCCESS',
      });
    });

    afterEach(() => {
      window.featureFlags['medical-alerts-side-panel'] = false;
      window.featureFlags['medical-procedure'] = false;
    });

    it('renders the correct options in the dropdown for a past athlete regardless of permissions and feature flags (ie wont render options that are inaccessible to past players)', async () => {
      usePermissions.mockReturnValue({
        permissions: {
          ...DEFAULT_CONTEXT_VALUE.permissions,
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            issues: { canEdit: true },
            notes: { canCreate: true },
            diagnostics: { canCreate: true },
            treatments: { canCreate: true },
            procedures: { canCreate: true },
          },
        },
        permissionsRequestStatus: 'SUCCESS',
      });

      const { user } = renderComponent();

      const addButton = screen.getByRole('button', { name: 'Add' });
      expect(addButton).toBeInTheDocument();
      await user.click(addButton);

      expect(screen.getByRole('button', { name: 'Note' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Diagnostic' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Treatment' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Procedure' })
      ).toBeInTheDocument();
    });
  });

  describe('files - [permissions] permissions.medical.documents.canCreate', () => {
    describe('[feature-flag] medical-documents-files-area', () => {
      beforeEach(() => {
        window.featureFlags['medical-documents-files-area'] = true;
      });

      afterEach(() => {
        window.featureFlags['medical-documents-files-area'] = false;
      });

      it('renders the correct content', async () => {
        usePermissions.mockReturnValue({
          permissions: {
            ...DEFAULT_CONTEXT_VALUE.permissions,
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              documents: { canCreate: true },
              issues: {
                canEdit: true,
              },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        });

        const setIsMedicalFilePanelOpenMock = jest.fn();

        const { user } = renderComponent({
          ...defaultProps,
          setIsMedicalFilePanelOpen: setIsMedicalFilePanelOpenMock,
        });

        const addButton = screen.getByRole('button', { name: 'Add' });
        expect(addButton).toBeInTheDocument();
        await user.click(addButton);

        const fileButton = screen.getByRole('button', {
          name: 'File',
        });
        expect(fileButton).toBeInTheDocument();
        await user.click(fileButton);

        expect(setIsMedicalFilePanelOpenMock).toHaveBeenCalledWith(true);
      });

      it('renders no menu items', async () => {
        usePermissions.mockReturnValue({
          permissions: {
            ...DEFAULT_CONTEXT_VALUE.permissions,
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              documents: { canCreate: false },
              issues: {
                canEdit: true,
              },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        });

        const { user } = renderComponent();

        const addButton = screen.getByRole('button', { name: 'Add' });
        expect(addButton).toBeInTheDocument();
        await user.click(addButton);

        const fileButton = screen.queryByRole('button', {
          name: 'File',
        });
        expect(fileButton).not.toBeInTheDocument();
      });
    });
  });

  describe('[permissions] general.ancillaryRange.canManage', () => {
    beforeEach(() => {
      window.featureFlags['nfl-ancillary-data'] = true;
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

    afterEach(() => {
      window.featureFlags['nfl-ancillary-data'] = false;
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
