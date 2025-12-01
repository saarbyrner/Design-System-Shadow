// @flow
import { useState, useEffect, useMemo, useCallback } from 'react';
import { withNamespaces } from 'react-i18next';
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import { TabBar } from '@kitman/playbook/components';
import { getAthleteData } from '@kitman/services';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { athleteMedicalExport } from '@kitman/services/src/services/exports';
import { ToastDialog } from '@kitman/components/src/Toast/KitmanDesignSystem';
import { AthleteDataContext } from '@kitman/common/src/contexts/AthleteDataContext/AthleteDataContext';
import {
  SQUADS_FILTER,
  TRIAL_ATHLETE_HIDDEN_ELEMENTS,
} from '@kitman/modules/src/Medical/shared/constants/elementTags';
import { getTabStyles } from '@kitman/modules/src/Medical/shared/constants/tabStyles';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useHandleAncillaryRangeData from '@kitman/modules/src/Medical/shared/utils/useHandleAncillaryRangeData';
import { MedicalNotesTabTranslated as MedicalNotesTab } from '@kitman/modules/src/Medical/shared/components/MedicalNotesTab';
import { ModificationsTabTranslated as ModificationsTab } from '@kitman/modules/src/Medical/shared/components/ModificationsTab';
import TreatmentsTabContainer from '@kitman/modules/src/Medical/shared/containers/TreatmentsTab';
import DiagnosticTabContainer from '@kitman/modules/src/Medical/shared/containers/DiagnosticsTab';
import ProceduresTabContainer from '@kitman/modules/src/Medical/shared/containers/ProceduresTab';
import ConcussionTabContainer from '@kitman/modules/src/Medical/shared/containers/ConcussionsTab';
import AthleteDetailsTabContainer from '@kitman/modules/src/Medical/shared/containers/AthleteDetailsTab';
import { TransferRecordContextProvider } from '@kitman/modules/src/Medical/shared/contexts/TransferRecordContext';
import { RehabTabTranslated as RehabTab } from '@kitman/modules/src/Medical/shared/components/RehabTab';
import { RehabProvider } from '@kitman/modules/src/Medical/shared/components/RehabTab/RehabContext/index';
import FormsTabContainer from '@kitman/modules/src/Medical/shared/containers/FormsTab';
import MedicationsTabContainer from '@kitman/modules/src/Medical/shared/containers/MedicationsTab';
import Toasts from '@kitman/modules/src/Medical/shared/containers/Toasts';
import type { RequestStatus } from '@kitman/modules/src/Medical/shared/types';
import useAthleteMedicalAlerts from '@kitman/modules/src/Medical/shared/hooks/useAthleteMedicalAlerts';
import MedicalHistoryTab from '@kitman/modules/src/Medical/shared/components/MedicalHistoryTab';
import useExports from '@kitman/modules/src/Medical/shared/hooks/useExports';
import MedicalFilesTab from '@kitman/modules/src/Medical/shared/components/MedicalFilesTab';
import tabHashes from '@kitman/modules/src/Medical/shared/constants/tabHashes';
import { InjuryExportSidePanelTranslated as InjuryExportSidePanel } from '@kitman/modules/src/Medical/shared/components/InjuryExportSidePanel';
import { AncillaryRangeSidePanelTranslated as AncillaryRangeSidePanel } from '@kitman/modules/src/Medical/shared/components/AncillaryRangeSidePanel';

import { AppHeaderTranslated as AppHeader } from './AppHeader';
import IssuesTab from './IssuesTab';
import style from './style';

type Props = {
  athleteId: number,
  isPlayerSelectOpen: boolean,
};

const App = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const [athleteData, setAthleteData] = useState<AthleteData>({});
  const [activeTab, setActiveTab] = useState<string>(window.location.hash);
  const [reloadHeader, setReloadHeader] = useState(false);
  const [athleteSquadId, setAthleteSquadId] = useState<number>(0);
  const [injurySidePanelOpen, setInjuryPanelOpen] = useState<boolean>(false);
  const [ancillaryRangeSidePanelOpen, setAncillaryRangeSidePanelOpen] =
    useState(false);
  const { fetchAthleteMedicalAlerts, athleteMedicalAlerts } =
    useAthleteMedicalAlerts();

  const loadAthleteData = useCallback(() => {
    getAthleteData(props.athleteId).then(
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
  }, [permissions.medical.alerts.canView, props.athleteId]);

  const filter = {
    athlete_id: props.athleteId,
    date_range: null,
    squads: [],
  };

  const isExportEnabled =
    window.featureFlags['medical-export-zip'] &&
    permissions.medical.issues.canExport;
  const { exportReports, toasts, closeToast } = useExports(
    filter,
    isExportEnabled
  );

  const {
    handleAncillaryRangeData,
    closeToast: closeAncillaryToast,
    toasts: ancillaryToasts,
    ancillaryStatus,
  } = useHandleAncillaryRangeData();

  const allToasts = [...toasts, ...ancillaryToasts];

  useEffect(() => {
    if (athleteData?.squad_names && athleteData?.squad_names.length > 0) {
      setAthleteSquadId(athleteData?.squad_names[0].id);
    }
  }, [athleteData]);

  useEffect(() => {
    loadAthleteData();
  }, [loadAthleteData]);

  useEffect(() => {
    if (reloadHeader) {
      loadAthleteData();
    }
  }, [loadAthleteData, reloadHeader]);

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

  const tabPanes = useMemo(
    () =>
      [
        {
          title: props.t('Injury/ Illness'),
          content: (
            <IssuesTab
              athleteId={props.athleteId}
              athleteData={athleteData}
              permissions={permissions}
              enableReloadData={setReloadHeader}
              hiddenFilters={getHiddenFilters([])}
            />
          ),
          tabHash: tabHashes.ISSUES,
          visible: permissions.medical.issues.canView,
        },
        {
          title: props.t('Notes'),
          content: (
            <MedicalNotesTab
              athleteId={props.athleteId}
              reloadData={activeTab === tabHashes.MEDICAL_NOTES}
              hiddenFilters={getHiddenFilters([SQUADS_FILTER])}
              scopeToLevel="athlete"
            />
          ),
          tabHash: tabHashes.MEDICAL_NOTES,
          visible: permissions.medical.notes.canView,
        },
        {
          title: props.t('Modifications'),
          content: (
            <ModificationsTab
              athleteId={props.athleteId}
              reloadData={activeTab === tabHashes.MODIFICATIONS}
              hiddenFilters={getHiddenFilters([SQUADS_FILTER])}
              scopeToLevel="athlete"
            />
          ),
          tabHash: tabHashes.MODIFICATIONS,
          visible: permissions.medical.modifications.canView,
        },
        {
          title: props.t('Treatments'),
          content: (
            <TreatmentsTabContainer
              athleteId={props.athleteId}
              athleteName={athleteData.fullname}
              reloadData={activeTab === tabHashes.TREATMENTS}
              hiddenFilters={getHiddenFilters([SQUADS_FILTER])}
              scopeToLevel="athlete"
            />
          ),
          tabHash: tabHashes.TREATMENTS,
          visible: permissions.medical.treatments.canView,
        },
        {
          title: props.t('Diagnostics'),
          content: (
            <DiagnosticTabContainer
              athleteId={props.athleteId}
              athleteData={athleteData}
              athleteExternalId={athleteData.external_id}
              athleteName={athleteData.fullname}
              reloadData={activeTab === tabHashes.DIAGNOSTICS}
              hiddenFilters={getHiddenFilters([SQUADS_FILTER])}
              scopeToLevel="athlete"
            />
          ),
          tabHash: tabHashes.DIAGNOSTICS,
          visible: permissions.medical.diagnostics.canView,
        },
        {
          title: props.t('Medical history'),
          content: (
            <MedicalHistoryTab
              athleteId={props.athleteId}
              hiddenFilters={getHiddenFilters([SQUADS_FILTER])}
            />
          ),
          tabHash: tabHashes.MEDICAL_HISTORY,
          visible:
            window.featureFlags['performance-medicine-medical-history'] &&
            (permissions.medical.tue.canView ||
              permissions.medical.vaccinations.canView),
        },
        {
          title: props.t('Athlete details'),
          content: (
            <AthleteDetailsTabContainer
              athleteId={props.athleteId}
              reloadData={activeTab === tabHashes.ATHLETE_DETAILS}
              athleteData={athleteData}
              athleteDataRequestStatus={requestStatus}
            />
          ),
          tabHash: tabHashes.ATHLETE_DETAILS,
          visible:
            window.featureFlags['athlete-details-in-performance-medicine'],
        },
        {
          title: props.t('Maintenance'),
          content: (
            <TransferRecordContextProvider
              playerTransferRecord={athleteData?.org_last_transfer_record}
            >
              <RehabProvider>
                <RehabTab
                  athleteId={athleteData.id}
                  athleteName={athleteData.fullname}
                  inMaintenance
                  hiddenFilters={getHiddenFilters([])}
                />
              </RehabProvider>
            </TransferRecordContextProvider>
          ),
          tabHash: tabHashes.MAINTENANCE,
          visible:
            window.featureFlags['rehab-tab-athlete'] &&
            permissions.rehab.canView,
        },
        {
          title: props.t('Concussions'),
          content: <ConcussionTabContainer athleteId={props.athleteId} />,
          tabHash: tabHashes.CONCUSSION,
          visible:
            window.featureFlags['concussion-web-iteration-2'] &&
            (permissions.concussion.canManageConcussionAssessments ||
              permissions.concussion.canViewConcussionAssessments),
        },
        {
          title: props.t('Forms'),
          content: (
            <FormsTabContainer
              formCategory="medical"
              athleteId={props.athleteId}
              reloadData={activeTab === tabHashes.FORMS}
            />
          ),
          tabHash: tabHashes.FORMS,
          visible:
            window.featureFlags['medical-forms-tab-iteration-1'] &&
            permissions.medical.forms.canView,
        },
        {
          title: props.t('Medications'),
          content: (
            <MedicationsTabContainer
              {...props}
              athleteId={props.athleteId}
              includesToggle
              playerLevel
              scopeToLevel="athlete"
              hiddenFilters={getHiddenFilters([])}
            />
          ),
          tabHash: tabHashes.MEDICATIONS,
          visible:
            window.featureFlags['dr-first-integration'] ||
            window.featureFlags['medications-general-availability'],
        },
        {
          title: props.t('Procedures'),
          content: (
            <ProceduresTabContainer
              reloadData={activeTab === tabHashes.PROCEDURES}
              athleteId={props.athleteId}
              athleteExternalId={athleteData.external_id}
              athleteName={athleteData.fullname}
              hiddenFilters={getHiddenFilters([SQUADS_FILTER])}
              scopeToLevel="athlete"
              athleteData={athleteData}
            />
          ),
          tabHash: tabHashes.PROCEDURES,
          visible:
            window.featureFlags['medical-procedure'] &&
            permissions.medical.procedures.canView,
        },
        {
          title: props.t('Documents'),
          content: (
            <MedicalFilesTab
              {...props}
              athleteId={props.athleteId}
              hiddenFilters={getHiddenFilters([])}
              issueId={null}
              athleteData={athleteData}
            />
          ),
          tabHash: tabHashes.FILES,
          visible:
            window.featureFlags['medical-documents-files-area'] &&
            permissions.medical.documents.canView,
        },
      ]
        .filter((tab) => tab.visible)
        .map((tab, index) => ({ ...tab, tabKey: index.toString() })),
    [
      activeTab,
      athleteData,
      permissions,
      props,
      requestStatus,
      athleteSquadId,
      getHiddenFilters,
    ]
  );

  useEffect(() => {
    const abortController = new AbortController();

    const forceSetActiveTab = (targetHash: string) => {
      if (activeTab !== targetHash) {
        const tabHash = tabPanes.find(
          (tabPane) => tabPane.visible && tabPane.tabHash === targetHash
        )?.tabHash;
        if (tabHash) {
          setActiveTab(tabHash);
        }
      }
    };

    const handleWindowHashChange = (event) => {
      const targetHash = new URL(event.newURL).hash;
      forceSetActiveTab(targetHash);
    };

    const handleNavigationTabChange = (event) => {
      if (event.destination.sameDocument) {
        const targetHash = new URL(event.destination.url).hash;
        forceSetActiveTab(targetHash);
      }
    };

    const supportsNavigation = !!window.navigation;

    if (supportsNavigation) {
      window.navigation.addEventListener(
        'navigate',
        handleNavigationTabChange,
        { signal: abortController.signal }
      );
    } else {
      window.addEventListener('hashchange', handleWindowHashChange, {
        signal: abortController.signal,
      });
    }

    return () => {
      abortController.abort();
    };
  }, [tabPanes, activeTab]);

  const onExportAthleteIssuesData = (
    dateRange,
    associatedIssuesInjuries,
    entityFilters,
    noteTypes,
    unrelatedEntities,
    isPrinterFriendly,
    skipNotification
  ) => {
    if (window.featureFlags['medical-export-zip']) {
      exportReports(() =>
        athleteMedicalExport({
          athleteId: props.athleteId,
          name: `${athleteData.fullname.replace(/,/g, '')} Medical Export.zip`,
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
    } else {
      window.open(
        `/athletes/${props.athleteId}/injuries/export?scope_to_org=true`,
        '_blank'
      );
    }
  };

  if (requestStatus === 'PENDING') {
    return <DelayedLoadingFeedback />;
  }

  if (requestStatus === 'FAILURE') {
    return <AppStatus status="error" />;
  }

  return (
    <AthleteDataContext.Provider value={athleteData}>
      <div
        css={[
          style.gridLayout,
          ...(props.isPlayerSelectOpen ? [style.shiftContent] : []),
        ]}
      >
        <div className="athleteMedicalProfile" css={style.content}>
          <AppHeader
            athleteData={athleteData}
            openInjuryExportSidePanel={() => setInjuryPanelOpen(true)}
            openAncillaryRangeSidePanel={() =>
              setAncillaryRangeSidePanelOpen(true)
            }
            onExportAthleteIssuesData={onExportAthleteIssuesData}
            athleteMedicalAlerts={athleteMedicalAlerts}
          />
          <TabBar
            variant="scrollable"
            tabs={tabPanes}
            value={activeTab || tabPanes[0]?.tabHash}
            onChange={(value) => {
              window.location.replace(value);
            }}
            customStyles={getTabStyles('athlete', activeTab)}
          />
          <Toasts />
          <ToastDialog toasts={allToasts} onCloseToast={onCloseToast} />
        </div>
        <div css={style.slideout} id="issueMedicalProfile-Slideout" />
      </div>
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
      {window.featureFlags['injury-export-side-panel'] && (
        <InjuryExportSidePanel
          {...props}
          onExportAthleteIssuesData={onExportAthleteIssuesData}
          isOpen={injurySidePanelOpen}
          onClose={() => setInjuryPanelOpen(false)}
          athleteData={athleteData}
        />
      )}
    </AthleteDataContext.Provider>
  );
};

export const AppTranslated = withNamespaces()(App);
export default App;
