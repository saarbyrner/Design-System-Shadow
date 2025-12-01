// @flow
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import { TabBar } from '@kitman/playbook/components';
import { getAthleteData } from '@kitman/services';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { athleteMedicalExport } from '@kitman/services/src/services/exports';
import { ToastDialog } from '@kitman/components/src/Toast/KitmanDesignSystem';
import type { ConcussionAssessmentResultType } from '@kitman/modules/src/Medical/shared/types/medical/ConcussionAssessmentResult';
import {
  SQUADS_FILTER,
  TRIAL_ATHLETE_HIDDEN_ELEMENTS,
} from '@kitman/modules/src/Medical/shared/constants/elementTags';
import { getTabStyles } from '@kitman/modules/src/Medical/shared/constants/tabStyles';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import {
  determineMedicalLevelAndTab,
  getDocumentActionElement,
} from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';

import useHandleAncillaryRangeData from '@kitman/modules/src/Medical/shared/utils/useHandleAncillaryRangeData';
import AddConcussionTestResultSidePanel from '@kitman/modules/src/Medical/shared/containers/AddConcussionTestResultSidePanel';
import { TransferRecordContextProvider } from '@kitman/modules/src/Medical/shared/contexts/TransferRecordContext';
import { RehabTabTranslated as RehabTab } from '@kitman/modules/src/Medical/shared/components/RehabTab';
import { RehabProvider } from '@kitman/modules/src/Medical/shared/components/RehabTab/RehabContext/index';
import { useIssue } from '@kitman/modules/src/Medical/shared/contexts/IssueContext';
import { MedicalNotesTabTranslated as MedicalNotesTab } from '@kitman/modules/src/Medical/shared/components/MedicalNotesTab';
import { ModificationsTabTranslated as ModificationsTab } from '@kitman/modules/src/Medical/shared/components/ModificationsTab';
import TreatmentsTabContainer from '@kitman/modules/src/Medical/shared/containers/TreatmentsTab';
import DiagnosticTabContainer from '@kitman/modules/src/Medical/shared/containers/DiagnosticsTab';
import ProceduresTabContainer from '@kitman/modules/src/Medical/shared/containers/ProceduresTab';
import FormsTabContainer from '@kitman/modules/src/Medical/shared/containers/FormsTab';
import MedicationsTabContainer from '@kitman/modules/src/Medical/shared/containers/MedicationsTab';
import { InjuryExportSidePanelTranslated as InjuryExportSidePanel } from '@kitman/modules/src/Medical/shared/components/InjuryExportSidePanel';
import { AncillaryRangeSidePanelTranslated as AncillaryRangeSidePanel } from '@kitman/modules/src/Medical/shared/components/AncillaryRangeSidePanel';
import Toasts from '@kitman/modules/src/Medical/shared/containers/Toasts';

import {
  openAddDiagnosticSidePanel,
  openAddMedicalNotePanel,
  openAddModificationSidePanel,
  openAddAllergySidePanel,
  openAddMedicalAlertSidePanel,
  openAddMedicationSidePanel,
  openAddProcedureSidePanel,
  openAddTreatmentsSidePanel,
  openAddConcussionTestResultsSidePanel,
  openAddConcussionAssessmentSidePanel,
  openAddTUESidePanel,
  openWorkersCompSidePanel,
  openOshaFormSidePanel,
} from '@kitman/modules/src/Medical/shared/redux/actions';
import { getCodingSystemFromIssue } from '@kitman/modules/src/Medical/shared/utils';
import type { RequestStatus } from '@kitman/modules/src/Medical/shared/types';
import useAthleteMedicalAlerts from '@kitman/modules/src/Medical/shared/hooks/useAthleteMedicalAlerts';
import MedicalFilesTab from '@kitman/modules/src/Medical/shared/components/MedicalFilesTab';
import useExports from '@kitman/modules/src/Medical/shared/hooks/useExports';

import { AppHeaderTranslated as AppHeader } from './AppHeader';
import { ChronicIssueTabTranslated as ChronicIssueTab } from './ChronicIssueTab';
import { AssessmentTabTranslated as AssessmentTab } from './AssessmentTab';
import IssueTab from './IssueTab';
import style from './style';

type Props = {
  isPlayerSelectOpen: boolean,
};

const App = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const { issue, issueType, isChronicIssue } = useIssue();
  const { trackEvent } = useEventTracking();
  const [issueIsConcussionType, setIssueIsConcussionType] = useState(false);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const [athleteData, setAthleteData] = useState<AthleteData>({});
  const [tabHash, setTabHash] = useState<string>(window.location.hash);
  const [reloadNotes, setReloadNotes] = useState(false);
  const [reloadModifications, setReloadModifications] = useState(false);
  const [reloadTreatments, setReloadTreatments] = useState(false);
  const [reloadDiagnostics, setReloadDiagnostics] = useState(false);
  const [reloadProcedures, setReloadProcedures] = useState(false);
  const [reloadForms, setReloadForms] = useState(false);
  const [reloadHeader, setReloadHeader] = useState(false);
  const [reloadSpecificConcussionTables, setReloadSpecificConcussionTables] =
    useState<Array<ConcussionAssessmentResultType>>([]);
  const [isMedicalDocumentPanelOpen, setIsMedicalDocumentPanelOpen] =
    useState<boolean>(false);
  const [isMedicalFilePanelOpen, setIsMedicalFilePanelOpen] =
    useState<boolean>(false);
  const [athleteSquadId, setAthleteSquadId] = useState<number>(0);
  const [injurySidePanelOpen, setInjurySidePanelOpen] = useState(false);
  const [ancillaryRangeSidePanelOpen, setAncillaryRangeSidePanelOpen] =
    useState(false);

  const isExportEnabled =
    window.featureFlags['medical-export-zip'] &&
    permissions.medical.issues.canExport;
  const { toasts, closeToast, exportReports } = useExports(
    null,
    isExportEnabled
  );

  const {
    handleAncillaryRangeData,
    closeToast: closeAncillaryToast,
    toasts: ancillaryToasts,
    ancillaryStatus,
  } = useHandleAncillaryRangeData();

  const allToasts = [...toasts, ...ancillaryToasts];

  const issueId = isChronicIssue
    ? `chronic_${issue.id}`
    : `${issueType}_${issue.id}`;

  const { fetchAthleteMedicalAlerts, athleteMedicalAlerts } =
    useAthleteMedicalAlerts();
  const loadAthleteData = () => {
    getAthleteData(parseInt(issue.athlete_id, 10)).then(
      (fetchedAthleteData) => {
        setAthleteData(fetchedAthleteData);
        if (permissions.medical.alerts.canView) {
          fetchAthleteMedicalAlerts({
            filters: {
              athlete_id: fetchedAthleteData.id,
              archived: false,
            },
            resetList: true,
          });
        }
        setRequestStatus('SUCCESS');
      },
      () => setRequestStatus('FAILURE')
    );
  };

  useEffect(() => {
    loadAthleteData();
  }, [issue]);

  useEffect(() => {
    setReloadNotes(tabHash === '#medical_notes');
    setReloadModifications(tabHash === '#modifications');
    setReloadTreatments(tabHash === '#treatments');
    setReloadDiagnostics(tabHash === '#diagnostics');
    setReloadProcedures(tabHash === '#procedures');
    setReloadForms(tabHash === '#forms');
  }, [tabHash]);

  useEffect(() => {
    if (!issue) {
      return;
    }
    const codingSystem = getCodingSystemFromIssue(issue);
    if (!codingSystem) {
      setIssueIsConcussionType(false);
      return;
    }
    setIssueIsConcussionType(codingSystem.groups?.includes('concussion'));
  }, [issue]);

  useEffect(() => {
    if (reloadHeader) {
      loadAthleteData();
    }
  }, [reloadHeader]);

  useEffect(() => {
    if (athleteData?.squad_names && athleteData?.squad_names.length > 0) {
      setAthleteSquadId(athleteData?.squad_names[0].id);
    }
  }, [athleteData]);

  const dispatch = useDispatch();

  const initialTab = useRef();

  const getHiddenFilters = useCallback(
    (tabSpecificHiddenFilters: Array<string>) => {
      const hiddenFilters = [...tabSpecificHiddenFilters];
      if (athleteData?.constraints?.organisation_status === 'TRIAL_ATHLETE') {
        return hiddenFilters.concat(TRIAL_ATHLETE_HIDDEN_ELEMENTS);
      }
      return hiddenFilters;
    },
    [athleteData]
  );

  const getChronicIssueTabTitle = () => {
    let title;
    if (issueType === 'Injury' && issue.onset_type?.name === 'Chronic') {
      title = props.t('Overview');
    } else {
      title = props.t('Illness overview');
    }
    return title;
  };

  const tabPanes = useMemo(
    () =>
      [
        {
          title: getChronicIssueTabTitle(),
          content: (
            <ChronicIssueTab
              athleteId={issue.athlete_id}
              athleteData={athleteData}
              issueId={issueId}
              reloadAthleteData={setReloadHeader}
              isMedicalFilePanelOpen={isMedicalFilePanelOpen}
              setIsMedicalFilePanelOpen={setIsMedicalFilePanelOpen}
            />
          ),
          tabHash: '#issue',
          visible: isChronicIssue,
        },
        {
          title:
            issueType === 'Injury'
              ? props.t('Injury overview')
              : props.t('Illness overview'),
          content: (
            <IssueTab
              athleteId={issue.athlete_id}
              athleteData={athleteData}
              reloadData={setReloadHeader}
              issueId={`${issueType}_${issue.id}`}
              isMedicalDocumentPanelOpen={isMedicalDocumentPanelOpen}
              setIsMedicalDocumentPanelOpen={setIsMedicalDocumentPanelOpen}
              isMedicalFilePanelOpen={isMedicalFilePanelOpen}
              setIsMedicalFilePanelOpen={setIsMedicalFilePanelOpen}
              hiddenFilters={getHiddenFilters([])}
            />
          ),
          tabHash: '#issue',
          visible: !isChronicIssue,
        },
        {
          title: props.t('Rehab'),
          content: (
            <TransferRecordContextProvider
              playerTransferRecord={athleteData?.org_last_transfer_record}
            >
              <RehabProvider>
                <RehabTab
                  issueOccurrenceId={issue.id}
                  issueOccurrenceDate={issue.occurrence_date}
                  issueType={
                    isChronicIssue
                      ? 'Emr::Private::Models::ChronicIssue'
                      : issueType
                  }
                  athleteId={issue.athlete_id}
                  athleteName={athleteData.fullname}
                  inMaintenance={false}
                  isChronicIssue={isChronicIssue}
                  hiddenFilters={getHiddenFilters([])}
                />
              </RehabProvider>
            </TransferRecordContextProvider>
          ),
          tabHash: '#rehab',
          visible:
            window.featureFlags['rehab-tab-injury'] &&
            permissions.rehab.canView,
        },
        {
          title: props.t('Notes'),
          content: (
            <MedicalNotesTab
              athleteId={issue.athlete_id}
              reloadData={reloadNotes}
              hiddenFilters={getHiddenFilters([SQUADS_FILTER])}
              scopeToLevel="issue"
            />
          ),
          tabHash: '#medical_notes',
          visible: permissions.medical.notes.canView,
        },
        {
          title: props.t('Modifications'),
          content: (
            <ModificationsTab
              athleteId={issue.athlete_id}
              athleteData={athleteData}
              reloadData={reloadModifications}
              reloadAthleteData={setReloadHeader}
              issueId={issueId}
              hiddenFilters={getHiddenFilters([SQUADS_FILTER])}
              scopeToLevel="issue"
              isMedicalDocumentPanelOpen={isMedicalDocumentPanelOpen}
              setIsMedicalDocumentPanelOpen={setIsMedicalDocumentPanelOpen}
              isMedicalFilePanelOpen={isMedicalFilePanelOpen}
              setIsMedicalFilePanelOpen={setIsMedicalFilePanelOpen}
            />
          ),
          tabHash: '#modifications',
          visible: permissions.medical.modifications.canView,
        },
        {
          title: props.t('Treatments'),
          content: (
            <TreatmentsTabContainer
              athleteId={issue.athlete_id}
              athleteData={athleteData}
              reloadData={reloadTreatments}
              reloadAthleteData={setReloadHeader}
              issueId={issueId}
              hiddenFilters={getHiddenFilters([SQUADS_FILTER])}
              scopeToLevel="issue"
              isMedicalDocumentPanelOpen={isMedicalDocumentPanelOpen}
              setIsMedicalDocumentPanelOpen={setIsMedicalDocumentPanelOpen}
              isMedicalFilePanelOpen={isMedicalFilePanelOpen}
              setIsMedicalFilePanelOpen={setIsMedicalFilePanelOpen}
            />
          ),
          tabHash: '#treatments',
          visible: permissions.medical.treatments.canView,
        },
        {
          title: props.t('Assessments'),
          content: (
            <AssessmentTab
              athleteId={issue.athlete_id}
              athleteData={athleteData}
              issueId={issueId}
              reloadAthleteData={setReloadHeader}
              permissions={permissions.concussion}
              onAddConcussionAssessment={() => {
                dispatch(
                  openAddConcussionAssessmentSidePanel({
                    isAthleteSelectable: false,
                  })
                );
              }}
              onOpenAddConcussionTestResultSidePanel={(testProtocol) =>
                dispatch(
                  openAddConcussionTestResultsSidePanel({
                    testProtocol,
                    isAthleteSelectable: false,
                  })
                )
              }
              reloadDataByType={
                tabHash === '#concussion' ? reloadSpecificConcussionTables : []
              }
              onReloadInitiated={() => {
                setReloadSpecificConcussionTables([]);
              }}
              scopeToLevel="issue"
              isMedicalDocumentPanelOpen={isMedicalDocumentPanelOpen}
              setIsMedicalDocumentPanelOpen={setIsMedicalDocumentPanelOpen}
              isMedicalFilePanelOpen={isMedicalFilePanelOpen}
              setIsMedicalFilePanelOpen={setIsMedicalFilePanelOpen}
            />
          ),
          tabHash: '#concussion',
          visible:
            window.featureFlags['concussion-medical-area'] &&
            issueIsConcussionType &&
            (permissions.concussion.canManageConcussionAssessments ||
              permissions.concussion.canViewConcussionAssessments ||
              permissions.concussion.canViewNpcAssessments ||
              permissions.concussion.canViewKingDevickAssessments),
        },
        {
          title: props.t('Diagnostics'),
          content: (
            <DiagnosticTabContainer
              athleteData={athleteData}
              athleteId={issue.athlete_id}
              reloadData={reloadDiagnostics}
              reloadAthleteData={setReloadHeader}
              issueId={issueId}
              hiddenFilters={getHiddenFilters([SQUADS_FILTER])}
              scopeToLevel="issue"
              isMedicalDocumentPanelOpen={isMedicalDocumentPanelOpen}
              setIsMedicalDocumentPanelOpen={setIsMedicalDocumentPanelOpen}
              isMedicalFilePanelOpen={isMedicalFilePanelOpen}
              setIsMedicalFilePanelOpen={setIsMedicalFilePanelOpen}
            />
          ),
          tabHash: '#diagnostics',
          visible: permissions.medical.diagnostics.canView,
        },
        {
          title: props.t('Forms'),
          content: (
            <FormsTabContainer
              formCategory="medical"
              athleteId={issue.athlete_id}
              chronicIssueId={isChronicIssue ? issue.id : undefined}
              injuryOccurenceId={
                issueType === 'Injury' && !isChronicIssue ? issue.id : undefined
              }
              illnessOccurenceId={
                issueType === 'Illness' && !isChronicIssue
                  ? issue.id
                  : undefined
              }
              reloadData={reloadForms}
            />
          ),
          tabHash: '#forms',
          visible:
            !window.featureFlags['medical-forms-new-endpoints'] &&
            window.featureFlags['medical-forms-tab-iteration-1'] &&
            permissions.medical.forms.canView,
        },
        {
          title: props.t('Medications'),
          content: (
            <MedicationsTabContainer
              {...props}
              athleteId={issue.athlete_id}
              includesToggle
              onOpenDispenseMedicationsSidePanel={() => {
                dispatch(
                  openAddMedicationSidePanel({ isAthleteSelectable: false })
                );
              }}
              scopeToLevel="issue"
              hiddenFilters={getHiddenFilters([])}
            />
          ),
          tabHash: '#medications',
          visible:
            window.featureFlags['dr-first-integration'] ||
            window.featureFlags['medications-general-availability'],
        },
        {
          title: props.t('Procedures'),
          content: (
            <ProceduresTabContainer
              athleteId={issue.athlete_id}
              athleteData={athleteData}
              reloadData={reloadProcedures}
              reloadAthleteData={setReloadHeader}
              issueId={issueId}
              hiddenFilters={getHiddenFilters([SQUADS_FILTER])}
              scopeToLevel="issue"
              isMedicalDocumentPanelOpen={isMedicalDocumentPanelOpen}
              setIsMedicalDocumentPanelOpen={setIsMedicalDocumentPanelOpen}
              isMedicalFilePanelOpen={isMedicalFilePanelOpen}
              setIsMedicalFilePanelOpen={setIsMedicalFilePanelOpen}
            />
          ),
          tabHash: '#procedures',
          visible:
            window.featureFlags['medical-procedure'] &&
            permissions.medical.procedures.canView,
        },
        {
          title: props.t('Documents'),
          content: (
            <MedicalFilesTab
              {...props}
              athleteId={issue.athlete_id}
              athleteData={athleteData}
              issueId={issueId}
              reloadAthleteData={setReloadHeader}
              hiddenFilters={getHiddenFilters([])}
              scopeToLevel="issue"
              isMedicalFilePanelOpen={isMedicalFilePanelOpen}
              setIsMedicalFilePanelOpen={setIsMedicalFilePanelOpen}
            />
          ),
          tabHash: '#files',
          visible:
            window.featureFlags['medical-documents-files-area'] &&
            permissions.medical.documents.canView,
        },
      ]
        .filter((tab) => tab.visible)
        .map((tab, index) => ({ ...tab, tabKey: index.toString() })),
    [
      issueIsConcussionType,
      athleteData,
      isMedicalDocumentPanelOpen,
      isMedicalFilePanelOpen,
      athleteSquadId,
      issue,
    ]
  );

  initialTab.current =
    tabPanes.find((tabPane) => tabPane.tabHash === window.location.hash)
      ?.tabKey || '0';

  if (requestStatus === 'PENDING') {
    return <DelayedLoadingFeedback />;
  }

  if (requestStatus === 'FAILURE') {
    return <AppStatus status="error" />;
  }
  const onCloseToast = (id) => {
    const exportToast = toasts.find((toast) => toast.id === id);
    if (exportToast) {
      closeToast(id);
      return;
    }

    const ancillaryToast = ancillaryToasts.find((toast) => toast.id === id);
    if (ancillaryToast) {
      closeAncillaryToast(id);
    }
  };

  return (
    <div css={style.gridLayout}>
      <div
        className="issueMedicalProfile"
        css={[
          style.content,
          ...(props.isPlayerSelectOpen ? [style.shiftContent] : []),
        ]}
      >
        <AppHeader
          hiddenFilters={getHiddenFilters([])}
          openInjuryExportSidePanel={() => setInjurySidePanelOpen(true)}
          openAncillaryRangeSidePanel={() =>
            setAncillaryRangeSidePanelOpen(true)
          }
          athleteMedicalAlerts={athleteMedicalAlerts}
          isConcussion={issueIsConcussionType}
          athleteData={athleteData}
          tabHash={tabHash}
          onOpenAddDiagnosticSidePanel={() =>
            dispatch(openAddDiagnosticSidePanel({ isAthleteSelectable: false }))
          }
          onOpenAddMedicalNotePanel={() =>
            dispatch(
              openAddMedicalNotePanel({
                isAthleteSelectable: false,
                isDuplicatingNote: false,
              })
            )
          }
          onOpenAddModificationSidePanel={() =>
            dispatch(
              openAddModificationSidePanel({ isAthleteSelectable: false })
            )
          }
          onOpenAddMedicationSidePanel={() =>
            dispatch(openAddMedicationSidePanel({ isAthleteSelectable: false }))
          }
          onOpenAddMedicalAlertSidePanel={() =>
            dispatch(
              openAddMedicalAlertSidePanel({ isAthleteSelectable: false })
            )
          }
          onOpenAddAllergySidePanel={() =>
            dispatch(openAddAllergySidePanel({ isAthleteSelectable: false }))
          }
          onOpenAddProcedureSidePanel={() =>
            dispatch(openAddProcedureSidePanel({ isAthleteSelectable: false }))
          }
          onOpenAddTreatmentsSidePanel={() =>
            dispatch(
              openAddTreatmentsSidePanel({
                isAthleteSelectable: false,
                isDuplicatingTreatment: false,
              })
            )
          }
          onOpenAddTUESidePanel={() =>
            dispatch(openAddTUESidePanel({ isAthleteSelectable: false }))
          }
          onOpenAddConcussionTestResultSidePanel={(testProtocol) =>
            dispatch(
              openAddConcussionTestResultsSidePanel({
                testProtocol,
                isAthleteSelectable: false,
              })
            )
          }
          onOpenAddWorkersCompSidePanel={() => {
            dispatch(openWorkersCompSidePanel());
          }}
          onOpenAddOshaFormSidePanel={() => {
            dispatch(openOshaFormSidePanel());
          }}
          setIsMedicalDocumentPanelOpen={setIsMedicalDocumentPanelOpen}
          setIsMedicalFilePanelOpen={(value: boolean) => {
            setIsMedicalFilePanelOpen(value);
            trackEvent(performanceMedicineEventNames.clickAddMedicalDocument, {
              ...determineMedicalLevelAndTab(),
              ...getDocumentActionElement('Add menu'),
            });
          }}
        />
        <TabBar
          variant="scrollable"
          tabs={tabPanes}
          value={tabHash || tabPanes[0]?.tabHash}
          onChange={(value) => {
            window.location.replace(value);
            setTabHash(value);
          }}
          customStyles={getTabStyles('issue', tabHash)}
        />
        {window.featureFlags['concussion-medical-area'] &&
          tabHash !== '#concussion' &&
          issueIsConcussionType &&
          (permissions.concussion.canManageConcussionAssessments ||
            permissions.concussion.canManageKingDevickAssessments ||
            permissions.concussion.canManageNpcAssessments) && (
            <AddConcussionTestResultSidePanel
              athleteId={issue.athlete_id}
              onAssessmentAdded={(
                assessmentResultType: ConcussionAssessmentResultType
              ) => {
                const tablesToUpdate = new Set([
                  ...reloadSpecificConcussionTables,
                  assessmentResultType,
                ]);
                setReloadSpecificConcussionTables([...tablesToUpdate]);
              }}
            />
          )}
        <Toasts />
        <ToastDialog toasts={allToasts} onCloseToast={onCloseToast} />
      </div>
      {window.featureFlags['injury-export-side-panel'] && (
        <InjuryExportSidePanel
          {...props}
          selectedIssue={issue}
          selectedIssueType={issueType}
          onExportAthleteIssuesData={(
            dateRange,
            associatedIssuesInjuries,
            entityFilters,
            noteTypes,
            unrelatedEntities,
            isPrinterFriendly,
            skipNotification
          ) => {
            exportReports(() =>
              athleteMedicalExport({
                athleteId: issue.athlete_id,
                name: `${athleteData.fullname.replace(
                  /,/g,
                  ''
                )} Medical Export.zip`,
                startDate: dateRange?.start_date || null,
                endDate: dateRange?.end_date || null,
                issues: associatedIssuesInjuries || null,
                entityFilters: entityFilters || null,
                noteTypes: noteTypes || null,
                unrelatedEntities: unrelatedEntities || null,
                isPrinterFriendly: isPrinterFriendly || null,
                skipNotification: skipNotification || null,
              })
            );
          }}
          isOpen={injurySidePanelOpen}
          onClose={() => setInjurySidePanelOpen(false)}
          athleteId={athleteData.id}
          athleteData={athleteData}
        />
      )}
      {window.featureFlags['nfl-ancillary-data'] && (
        <AncillaryRangeSidePanel
          {...props}
          isOpen={ancillaryRangeSidePanelOpen}
          onAncillaryRangeData={(ancillaryRangeValues) =>
            handleAncillaryRangeData(
              ancillaryRangeValues,
              athleteData.id,
              athleteData
            )
          }
          ancillaryStatus={ancillaryStatus}
          onClose={() => setAncillaryRangeSidePanelOpen(false)}
          athleteId={athleteData.id}
          athleteData={athleteData}
        />
      )}
      <div css={style.slideout} id="issueMedicalProfile-Slideout" />
    </div>
  );
};

export const AppTranslated = withNamespaces()(App);
export default App;
