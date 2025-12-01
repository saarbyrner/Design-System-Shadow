// @flow
import { useState, useEffect } from 'react';
import moment from 'moment';
import $ from 'jquery';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { colors } from '@kitman/common/src/variables';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import useCSVExport from '@kitman/common/src/hooks/useCSVExport';
import { exportDiagnosticBilling } from '@kitman/services';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import { AppStatus } from '@kitman/components';
import { ToastDialog } from '@kitman/components/src/Toast/KitmanDesignSystem';
import _xor from 'lodash/xor';
import { isCanceledError } from '@kitman/common/src/utils/services';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useIssue } from '../../contexts/IssueContext';
import DiagnosticFilters from '../../containers/DiagnosticFilters';
import AddDiagnosticSidePanel from '../../containers/AddDiagnosticSidePanel';
import MedicalSidePanels from '../../containers/MedicalSidePanels';
import AddDiagnosticAttachmentSidePanel from '../../containers/AddDiagnosticAttachmentSidePanel';
import AddDiagnosticLinkSidePanel from '../../containers/AddDiagnosticLinkSidePanel';
import {
  getDefaultDiagnosticFilters,
  defaultDiagnosticsBillingFileName,
} from '../../utils';
import useDiagnostics from '../../hooks/useDiagnostics';
import useCurrentUser from '../../hooks/useGetCurrentUser';
import { DiagnosticsCardListTranslated as DiagnosticsCardList } from './components/DiagnosticCardList';
import ArchiveDiagnosticModalContainer from './components/ArchiveDiagnosticModal/ArchiveDiagnosticModalContainer';
import { DiagnosticTabFormContextProvider } from './contexts/DiagnosticTabFormContext';
import { BulkActionsContextProvider } from './contexts/BulkActions';
import type { RequestStatus, DiagnosticFilter } from '../../types';
import useExports from '../../hooks/useExports';
import useSessionMedicalFilters from '../../hooks/useSessionMedicalFilters';
import { useDiagnostic } from '../../contexts/DiagnosticContext';

type Props = {
  reloadData: boolean,
  reloadAthleteData?: (boolean) => void,
  athleteId?: number,
  athleteName?: string,
  issueId?: string | null,
  openAddDiagnosticAttachmentSidePanel: Function,
  openAddDiagnosticLinkSidePanel: Function,
  showAvatar?: boolean,
  hiddenFilters?: ?Array<string>,
  athleteExternalId?: string,
  diagnosticReasons: Array<{
    value: number,
    label: string,
    isInjuryIllness: boolean,
  }>,
  athleteData?: AthleteData,
  scopeToLevel?: string,
  isMedicalDocumentPanelOpen?: boolean,
  setIsMedicalDocumentPanelOpen?: (boolean) => void,
  isMedicalFilePanelOpen?: boolean,
  setIsMedicalFilePanelOpen?: (boolean) => void,
  openAddDiagnosticSidePanel: (options: {
    diagnosticId: number,
    isAthleteSelectable: boolean,
    athleteId: number,
  }) => void,
};

const style = {
  wrapper: css`
    min-height: 100%;
  `,
  noDiagnosticsText: css`
    color: ${colors.grey_200};
    font-size: 14px;
    font-weight: normal;
    min-height: 500px;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: center;
  `,
};

const DiagnosticsTab = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const { currentUser, fetchCurrentUser } = useCurrentUser();

  const { issue, issueType, isChronicIssue } = useIssue();
  const { id: issueId } = issue;

  const { organisation, organisationRequestStatus } = useOrganisation();

  const [archiveModalOpen, setArchiveModalOpen] = useState<boolean>(false);
  const [archiveAthleteId, setArchiveAthleteId] = useState<number | null>(null);
  const [archiveDiagnosticId, setArchiveDiagnosticId] = useState<number | null>(
    null
  );

  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');

  const persistedFilters = _xor(
    [
      'diagnostic_type_ids',
      'date_range',
      'squads',
      'statuses',
      'diagnostic_reason_ids',
      'diagnostic_location_ids',
    ],
    props.hiddenFilters
  );
  const [filters, setFilters] = useSessionMedicalFilters<DiagnosticFilter>(
    () => {
      return getDefaultDiagnosticFilters({
        athleteId: props.athleteId || null,
        issueType,
        issueId: issueId || null,
        isChronic: isChronicIssue,
      });
    },
    persistedFilters,
    props.scopeToLevel
  );

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const [exportData, setExportData] = useState({});
  const exportAthleteTitle = props.athleteName ? `${props.athleteName}` : '';
  const formattedStartDate =
    filters.date_range !== null
      ? moment(filters.date_range.start_date).format('YYYYMMDD')
      : '';
  const formattedEndDate =
    filters.date_range !== null
      ? moment(filters.date_range.end_date).format('YYYYMMDD')
      : '';
  const exportDateRange =
    filters.date_range !== null
      ? `${exportAthleteTitle}_${formattedStartDate}-${formattedEndDate}`
      : `${exportAthleteTitle}`;
  const exportCSV = useCSVExport(exportDateRange, exportData.data, {
    fields: exportData.fields,
  });

  const isExportEnabled =
    window.featureFlags['export-billing-buttons-team-level'] &&
    permissions.medical.issues.canExport;
  const {
    requestStatus: exportRequestStatus,
    exportReports,
    toasts,
    isToastDisplayed,
    closeToast,
  } = useExports(filters, isExportEnabled);

  const {
    diagnosticsRequestStatus,
    diagnostics,
    fetchDiagnostics,
    resetDiagnostics,
    resetNextPage,
    nextPage,
  } = useDiagnostics();
  const { diagnostic } = useDiagnostic();

  useEffect(() => {
    if (exportData.data && exportData.fields) {
      exportCSV();
    }
  }, [exportData]);

  const getNextDiagnostics = useDebouncedCallback(
    ({ resetList = false } = {}) => {
      if (resetList) {
        resetDiagnostics();
      }
      setRequestStatus('PENDING');

      fetchDiagnostics(filters, resetList)
        .then(() => {
          setRequestStatus('SUCCESS');
        })
        .catch((error) =>
          isCanceledError(error)
            ? setRequestStatus('PENDING')
            : setRequestStatus('FAILURE')
        );
    },
    400
  );

  useEffect(() => {
    return () => {
      // Do any clean up including debounces
      getNextDiagnostics?.cancel?.();
    };
  }, [getNextDiagnostics]);

  const buildDiagnostics = () => {
    resetNextPage();
    getNextDiagnostics({ resetList: true });
  };

  useEffect(() => {
    buildDiagnostics();
  }, [filters]);

  useEffect(() => {
    if (!props.reloadData) {
      return;
    }
    buildDiagnostics();
  }, [props.reloadData]);

  useEffect(() => {
    // This is needed for when using PlayerSelector as filters don't update with change of athlete
    // or issue. Still persisting filters, so only athlete & issue needs changing.
    // $FlowIgnore Constructing object to match initial filter
    setFilters((prevFilters) => ({
      ...prevFilters,
      athlete_id: props.athleteId,
      ...(issueId &&
        issueType && {
          issue_occurrence: {
            id: issueId,
            type: isChronicIssue
              ? 'Emr::Private::Models::ChronicIssue'
              : issueType.toLowerCase(),
          },
        }),
    }));
  }, [props.athleteId, issue]);

  const getDiagnosticsExportData = () => {
    if (props.athleteId) {
      $.ajax({
        method: 'POST',
        url: `/medical/athletes/${props.athleteId}/diagnostics/export`,
        contentType: 'application/json',
      }).then(({ data, fields }) => {
        setExportData({ data, fields });
      });
    }
  };

  return (
    <DiagnosticTabFormContextProvider>
      <BulkActionsContextProvider>
        <div css={style.wrapper}>
          <DiagnosticFilters
            contentLoaded={diagnosticsRequestStatus === 'SUCCESS'}
            athleteData={props.athleteData}
            athleteExternalId={props.athleteExternalId}
            athleteId={props.athleteId}
            issue={issue}
            issueId={issueId}
            issueType={issueType}
            currentUser={currentUser}
            setRequestStatus={setRequestStatus}
            diagnostics={diagnostics}
            diagnosticReasons={props.diagnosticReasons}
            organizationRequestStatus={organisationRequestStatus}
            currentOrganisation={organisation}
            filters={filters}
            hiddenFilters={props.hiddenFilters}
            isExporting={exportRequestStatus === 'PENDING' || isToastDisplayed}
            onClickDownloadDiagnostics={getDiagnosticsExportData}
            exportDiagnosticBilling={() =>
              exportReports(() =>
                exportDiagnosticBilling({
                  dateRange: filters.date_range,
                  squadIds: filters.squads,
                  name: defaultDiagnosticsBillingFileName,
                })
              )
            }
            onChangeFilter={(updatedFilter) => setFilters(updatedFilter)}
            showDownloadDiagnostics={!!props.athleteId}
            onSavedReviewDiagnostics={() =>
              getNextDiagnostics({ resetList: true })
            }
            onSaveReconciledDiagnostics={() =>
              getNextDiagnostics({ resetList: true })
            }
          />
          {window.featureFlags['medical-global-add-button-fix'] &&
          props.scopeToLevel === 'issue' ? (
            <MedicalSidePanels
              athleteId={props.athleteId}
              athleteData={props.athleteData}
              issueId={props.issueId}
              reloadAthleteData={props.reloadAthleteData}
              isMedicalDocumentPanelOpen={props.isMedicalDocumentPanelOpen}
              setIsMedicalDocumentPanelOpen={
                props.setIsMedicalDocumentPanelOpen
              }
              isMedicalFilePanelOpen={props.isMedicalFilePanelOpen}
              setIsMedicalFilePanelOpen={props.setIsMedicalFilePanelOpen}
              onSidePanelAction={() => getNextDiagnostics({ resetList: true })}
            />
          ) : (
            <AddDiagnosticSidePanel
              athleteId={props.athleteId}
              diagnosticToUpdate={diagnostic}
              onSaveDiagnostic={() => getNextDiagnostics({ resetList: true })}
            />
          )}
          <AddDiagnosticAttachmentSidePanel
            athleteId={props.athleteId}
            onSaveAttachment={() => getNextDiagnostics({ resetList: true })}
          />
          <AddDiagnosticLinkSidePanel
            athleteId={props.athleteId}
            onSaveLink={() => getNextDiagnostics({ resetList: true })}
          />
          <DiagnosticsCardList
            currentOrganisation={organisation}
            diagnostics={diagnostics}
            athleteId={props.athleteId}
            diagnosticReasons={props.diagnosticReasons}
            currentUser={currentUser}
            setRequestStatus={setRequestStatus}
            onReachingEnd={getNextDiagnostics}
            isLoading={requestStatus === 'PENDING'}
            nextPage={nextPage}
            showAthleteInformation={!props.athleteId}
            onCheckedReviewDiagnostics={() =>
              getNextDiagnostics({ resetList: true })
            }
            openAddDiagnosticAttachmentSidePanel={(diagnosticId, athleteId) => {
              props.openAddDiagnosticAttachmentSidePanel({
                diagnosticId,
                athleteId,
              });
            }}
            openAddDiagnosticLinkSidePanel={(diagnosticId, athleteId) => {
              props.openAddDiagnosticLinkSidePanel({
                diagnosticId,
                athleteId,
              });
            }}
            onOpenArchiveDiagnosticModal={(diagnosticId, athleteId) => {
              setArchiveDiagnosticId(diagnosticId);
              setArchiveAthleteId(athleteId);
              setArchiveModalOpen(true);
            }}
            openAddDiagnosticSidePanel={props.openAddDiagnosticSidePanel}
            showAvatar={props.showAvatar}
          />
          {archiveModalOpen && (
            <ArchiveDiagnosticModalContainer
              isOpen={archiveModalOpen}
              athleteId={archiveAthleteId}
              diagnosticId={archiveDiagnosticId}
              onClose={() => setArchiveModalOpen(false)}
              onPressEscape={() => setArchiveModalOpen(false)}
              onReloadData={buildDiagnostics}
            />
          )}
          {requestStatus === 'SUCCESS' && diagnostics.length === 0 && (
            <div css={style.noDiagnosticsText}>
              {props.t('No diagnostics for this period')}
            </div>
          )}
          {requestStatus === 'FAILURE' && <AppStatus status="error" />}
          <ToastDialog toasts={toasts} onCloseToast={closeToast} />
        </div>
      </BulkActionsContextProvider>
    </DiagnosticTabFormContextProvider>
  );
};

export const DiagnosticsTabTranslated: ComponentType<Props> =
  withNamespaces()(DiagnosticsTab);
export default DiagnosticsTab;
