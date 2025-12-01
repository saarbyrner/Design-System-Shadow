// @flow
import { useState, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';

import { colors } from '@kitman/common/src/variables';
import { TabBar } from '@kitman/playbook/components';
import { getTabStyles } from '@kitman/modules/src/Medical/shared/constants/tabStyles';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { DiagnosticContextProvider } from '@kitman/modules/src/Medical/shared/contexts/DiagnosticContext';

import { AppHeaderTranslated as AppHeader } from './AppHeader';
import RosterOverviewTab from '../containers/RosterOverviewTab';
import CoachesReportTab from '../containers/CoachesReportTab';
import AddIssueSidePanel from '../containers/AddIssueSidePanel';
import Toasts from '../../../shared/containers/Toasts';
import { MedicalNotesTabTranslated as MedicalNotesTab } from '../../../shared/components/MedicalNotesTab';
import MedicalFilesTab from '../../../shared/components/MedicalFilesTab';
import { ModificationsTabTranslated as ModificationsTab } from '../../../shared/components/ModificationsTab';
import { ReportsTabTranslated as ReportsTab } from './ReportsTab';
import TreatmentsTabContainer from '../../../shared/containers/TreatmentsTab';
import DiagnosticTabContainer from '../../../shared/containers/DiagnosticsTab';
import ProceduresTabContainer from '../../../shared/containers/ProceduresTab';
import AllergiesTabContainer from '../../../shared/containers/AllergiesTab';
import FormsTabContainer from '../../../shared/containers/FormsTab';
import ConcussionTabContainer from '../../../shared/containers/ConcussionsTab';
import PastAthletesTabContainer from '../../../shared/containers/PastAthletesTab';
import CoachesReportRefactorTabContainer from '../../../shared/containers/CoachesReportRefactorTab';
import InactiveAthletesTabContainer from '../../../shared/containers/InactiveAthletesTab';
import { AthleteTryoutsTabTranslated as AthleteTryoutsTab } from '../../../shared/components/AthleteTryoutsTab';
import AthleteRosterTabContainer from '../../../shared/containers/AthleteRosterTabContainer';
import tabHashes from '../../../shared/constants/tabHashes';

type Props = {
  isPlayerSelectOpen: boolean,
  athleteId: number,
};

const style = {
  content: {
    backgroundColor: colors.neutral_100,
    minHeight: 'calc(100vh - 50px)',
  },
  shiftContent: {
    paddingLeft: '269px',
  },
};

const App = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();

  const [activeTab, setActiveTab] = useState<string>(window.location.hash);

  const diagnosticSidePanelState = useSelector(
    (state) => state.addDiagnosticSidePanel
  );

  const tabPanes = useMemo(
    () =>
      [
        {
          title: props.t('Team'),
          content: window.getFlag('roster-tab-v2') ? (
            <AthleteRosterTabContainer />
          ) : (
            <RosterOverviewTab scopeToLevel="roster" />
          ),
          tabHash: tabHashes.OVERVIEW,
          visible: true,
        },
        {
          title: props.t('Notes'),
          content: (
            <MedicalNotesTab
              reloadData={activeTab === tabHashes.MEDICAL_NOTES}
              scopeToLevel="roster"
            />
          ),
          tabHash: tabHashes.MEDICAL_NOTES,
          visible:
            permissions.medical.notes.canView &&
            window.getFlag('emr-show-latest-note-column'),
        },
        {
          title: props.t('Modifications'),
          content: (
            <ModificationsTab
              reloadData={activeTab === tabHashes.MODIFICATIONS}
              scopeToLevel="roster"
            />
          ),
          tabHash: tabHashes.MODIFICATIONS,
          visible: permissions.medical.modifications.canView,
        },
        {
          title: props.t('Concussions'),
          content: (
            <ConcussionTabContainer
              reloadData={activeTab === tabHashes.CONCUSSION}
            />
          ),
          tabHash: tabHashes.CONCUSSION,
          visible:
            window.getFlag('concussion-web-team-tab') &&
            (permissions.concussion.canManageConcussionAssessments ||
              permissions.concussion.canViewConcussionAssessments),
        },
        {
          title: props.t('Forms'),
          content: (
            <FormsTabContainer
              formCategory="medical"
              reloadData={activeTab === tabHashes.FORMS}
            />
          ),
          tabHash: tabHashes.FORMS,
          visible:
            window.getFlag('medical-forms-tab-iteration-1') &&
            permissions.medical.forms.canView,
        },
        {
          title: props.t('Treatments'),
          content: (
            <TreatmentsTabContainer
              reloadData={activeTab === tabHashes.TREATMENTS}
            />
          ),
          tabHash: tabHashes.TREATMENTS,
          visible: permissions.medical.treatments.canView,
        },
        {
          title: props.t('Diagnostics'),
          content: (
            <DiagnosticContextProvider
              athleteId={diagnosticSidePanelState?.athleteId}
              diagnosticId={diagnosticSidePanelState?.initialInfo?.diagnosticId}
            >
              <DiagnosticTabContainer
                reloadData={activeTab === tabHashes.DIAGNOSTICS}
                showAvatar
                scopeToLevel="roster"
                athleteId={props.athleteId}
              />
            </DiagnosticContextProvider>
          ),
          tabHash: tabHashes.DIAGNOSTICS,
          visible: permissions.medical.diagnostics.canView,
        },
        {
          title: props.t('Procedures'),
          content: (
            <ProceduresTabContainer
              reloadData={activeTab === tabHashes.PROCEDURES}
              scopeToLevel="roster"
            />
          ),
          tabHash: tabHashes.PROCEDURES,
          visible:
            window.getFlag('medical-procedure') &&
            permissions.medical.procedures.canCreate,
        },
        {
          title: props.t('Reports'),
          content: <ReportsTab />,
          tabHash: tabHashes.REPORTS,
          visible:
            window.getFlag('quality-report-exports') &&
            permissions.medical.issues.canExport,
        },
        {
          title: props.t('Medical Flags'),
          content: (
            <AllergiesTabContainer
              {...props}
              reloadData={tabHashes === tabHashes.MEDICAL_FLAGS}
              showAvatar
            />
          ),
          tabHash: tabHashes.MEDICAL_FLAGS,
          visible:
            permissions.medical.allergies.canViewNewAllergy ||
            permissions.medical.alerts.canView,
        },
        {
          title: props.t('Shared Players'),
          content: (
            <AthleteTryoutsTab reloadData={tabHashes === tabHashes.TRYOUTS} />
          ),
          tabHash: tabHashes.TRYOUTS,
          visible:
            window.getFlag('nfl-player-tryout') &&
            permissions.medical.athletes.canView &&
            permissions.general.tryoutAthletes.canView,
        },
        {
          title: props.t('Past Athletes'),
          content: <PastAthletesTabContainer />,
          tabHash: tabHashes.PAST_ATHLETES,
          visible:
            window.getFlag('nfl-player-movement-trade') &&
            permissions.medical.athletes.canView &&
            permissions.general.pastAthletes.canView,
        },
        {
          title: props.t('Inactive Athletes'),
          content: (
            <InactiveAthletesTabContainer
              reloadData={activeTab === tabHashes.INACTIVE_ATHLETES}
            />
          ),
          tabHash: tabHashes.INACTIVE_ATHLETES,
          visible:
            window.getFlag('inactive-athletes-tab-perf-med') &&
            permissions.medical.athletes.canView &&
            permissions.general.inactiveAthletes.canView,
        },
        {
          title: props.t('Documents'),
          content: (
            <MedicalFilesTab {...props} athleteId={null} issueId={null} />
          ),
          tabHash: tabHashes.FILES,
          visible:
            window.getFlag('medical-documents-files-area') &&
            permissions.medical.documents.canView,
        },
        {
          title: props.t('Coaches Report'),
          content: <CoachesReportTab permissions={permissions} />,
          tabHash: tabHashes.COACHES_REPORT,
          visible:
            window.getFlag('nfl-comments-tab') &&
            permissions.medical.notes.canView,
        },
        {
          title: props.t('Daily Status Report'),
          content: (
            <CoachesReportRefactorTabContainer permissions={permissions} />
          ),
          tabHash: tabHashes.COACHES_REPORT_REFACTOR,
          visible:
            window.getFlag('coaches-report-refactor') &&
            permissions.medical.notes.canView,
        },
      ]
        .filter((tab) => tab.visible)
        .map((tab, index) => ({ ...tab, tabKey: index.toString() })),
    [props, activeTab, permissions, diagnosticSidePanelState]
  );

  return (
    <div
      className="medical"
      css={[
        style.content,
        ...(props.isPlayerSelectOpen ? [style.shiftContent] : []),
      ]}
    >
      <AppHeader />
      <TabBar
        variant="scrollable"
        tabs={tabPanes}
        value={activeTab || tabPanes[0]?.tabHash}
        onChange={(value) => {
          window.location.replace(value);
          setActiveTab(value);
        }}
        customStyles={getTabStyles('team', activeTab)}
      />
      <AddIssueSidePanel permissions={permissions} />
      <Toasts />
    </div>
  );
};

export const AppTranslated = withNamespaces()(App);
export default App;
