// @flow
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import type { DateRange } from '@kitman/common/src/types';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import { getAthleteIssues } from '@kitman/services';
import type { ConcussionPermissions } from '@kitman/common/src/contexts/PermissionsContext/concussion/types';
import type { MedicalPermissions } from '@kitman/common/src/contexts/PermissionsContext/medical/types';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import {
  ToastDialog,
  useToasts,
} from '@kitman/components/src/Toast/KitmanDesignSystem';
import type { ToastId } from '@kitman/components/src/types';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import {
  determineMedicalLevelAndTab,
  getDocumentActionElement,
} from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';
import { getDefaultDateRange } from '@kitman/modules/src/Medical/shared/utils';
import getAthleteIssueStatuses from '@kitman/modules/src/Medical/rosters/src/services/getAthleteIssueStatuses';
import type { AthleteIssueStatuses } from '@kitman/modules/src/Medical/rosters/src/services/getAthleteIssueStatuses';
import AddIssueSidePanel from '@kitman/modules/src/Medical/rosters/src/containers/AddIssueSidePanel';
import {
  openAddIssuePanel,
  selectIssueType,
} from '@kitman/modules/src/Medical/rosters/src/redux/actions';
import AddDiagnosticSidePanel from '@kitman/modules/src/Medical/shared/containers/AddDiagnosticSidePanel';
import AddMedicalNoteSidePanel from '@kitman/modules/src/Medical/shared/containers/AddMedicalNoteSidePanel';
import AddModificationSidePanel from '@kitman/modules/src/Medical/shared/containers/AddModificationSidePanel';
import AddAllergySidePanel from '@kitman/modules/src/Medical/shared/containers/AddAllergySidePanel';
import AddMedicalAlertSidePanel from '@kitman/modules/src/Medical/shared/containers/AddMedicalAlertSidePanel';
import AddProcedureSidePanel from '@kitman/modules/src/Medical/shared/containers/AddProcedureSidePanel';
import AddVaccinationSidePanel from '@kitman/modules/src/Medical/shared/containers/AddVaccinationSidePanel';
import AddConcussionTestResultSidePanel from '@kitman/modules/src/Medical/shared/containers/AddConcussionTestResultSidePanel';
import AddTreatmentsSidePanel from '@kitman/modules/src/Medical/shared/containers/AddTreatmentsSidePanel';
import AddTUESidePanel from '@kitman/modules/src/Medical/shared/containers/AddTUESidePanel';
import useSessionMedicalFilters from '@kitman/modules/src/Medical/shared/hooks/useSessionMedicalFilters';
import {
  openAddDiagnosticSidePanel,
  openAddMedicalNotePanel,
  openAddModificationSidePanel,
  openAddAllergySidePanel,
  openAddMedicalAlertSidePanel,
  openAddProcedureSidePanel,
  openAddVaccinationSidePanel,
  openAddConcussionTestResultsSidePanel,
  openAddTreatmentsSidePanel,
  openAddTUESidePanel,
} from '@kitman/modules/src/Medical/shared/redux/actions';
import type {
  Issue,
  IssueType,
  RequestStatus,
} from '@kitman/modules/src/Medical/shared/types';
import AddMedicalDocumentSidePanel from '@kitman/modules/src/Medical/shared/containers/AddMedicalDocumentSidePanel';
import AthleteConstraints from '@kitman/modules/src/Medical/shared/components/AthleteConstraints';
import AddMedicalFileSidePanel from '@kitman/modules/src/Medical/shared/containers/AddMedicalFileSidePanel';

import { IssuesHeaderTranslated as IssuesHeader } from './IssuesHeader';
import { OpenIssuesTableTranslated as OpenIssuesTable } from './OpenIssuesTable';
import { ClosedIssuesTableTranslated as ClosedIssuesTable } from './ClosedIssuesTable';
import { athleteIssueTypes, setDefaultSquadForPastAthlete } from '../../utils';
import { ChronicIssuesTableTranslated as ChronicIssuesTable } from './ChronicIssuesTable';
import { ClosedChronicIssuesTableTranslated as ClosedChronicIssuesTable } from './ClosedChronicIssuesTable';
import ArchiveIssueModalContainer from './ArchiveIssueModal/ArchiveIssueModalContainer';
import { ArchivedIssuesTableTranslated as ArchivedIssuesTable } from './ArchivedIssuesTable';
import useChronicIssues from './hooks/useChronicIssues';

type Props = {
  athleteId: number,
  athleteData: AthleteData,
  permissions: {
    medical: MedicalPermissions,
    concussion: ConcussionPermissions,
  },
  enableReloadData: Function,
  hiddenFilters: Array<string>,
};

type Filter = {|
  search: string,
  issueType: ?IssueType,
  injuryStatusIds: Array<number>,
  date_range: ?DateRange,
|};

const ISSUES_PER_PAGE = 20;

const getFilterWithValues = (filter: Filter) => {
  let filterWithValues = {};

  Object.entries(filter).forEach(([key, value]) => {
    if (value) {
      const filterKey = key === 'date_range' ? 'dateRange' : key;

      filterWithValues = {
        ...filterWithValues,
        [`${filterKey}`]: value,
      };
    }
  });

  return filterWithValues;
};

const IssuesTab = (props: Props) => {
  const { trackEvent } = useEventTracking();
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);
  const [athleteIssueStatuses, setAthleteIssueStatuses] =
    useState<AthleteIssueStatuses>([]);
  const [athleteOpenIssues, setAthleteOpenIssues] = useState<Array<Issue>>([]);
  const [athleteClosedIssues, setAthleteClosedIssues] = useState<Array<Issue>>(
    []
  );
  const [archivedIssues, setArchivedIssues] = useState<Array<Issue>>([]);

  const [isMedicalDocumentPanelOpen, setIsMedicalDocumentPanelOpen] =
    useState<boolean>(false);

  const [showArchivedIssues, setShowArchivedIssues] = useState<boolean>(false);
  const [showArchiveModal, setShowArchiveModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<Issue>({});
  const [isMedicalFilePanelOpen, setIsMedicalFilePanelOpen] =
    useState<boolean>(false);
  const isAthleteOnTrial =
    props.athleteData?.constraints?.organisation_status === 'TRIAL_ATHLETE';

  // Initialise date range based on the active date picker.
  // When the custom date range picker is enabled, default to no date filter
  // so that all issues are shown until the user selects a range.
  const isCustomDatePickerEnabled = window.getFlag(
    'pm-date-range-picker-custom'
  );
  const INITIAL_FILTER = {
    search: '',
    issueType: null,
    injuryStatusIds: [],
    date_range: isCustomDatePickerEnabled ? null : getDefaultDateRange(),
  };

  // Persist date_range only when using the legacy picker.
  // With the custom picker enabled, do not persist date_range so an empty picker
  // does not silently apply a stored date filter.
  const fieldsToPersist = isCustomDatePickerEnabled ? [] : ['date_range'];
  const [filter, setFilter] = useSessionMedicalFilters<Filter>(
    () => INITIAL_FILTER,
    fieldsToPersist
  );
  const [nextClosedIssuesPage, setNextClosedIssuesPage] = useState<
    number | null
  >(null);

  const addIssueRequestStatus = useSelector(
    (state) => state.addIssuePanel.requestStatus
  );

  const dispatch = useDispatch();
  const { organisation } = useOrganisation();
  const { toasts, toastDispatch } = useToasts();
  const { athleteChronicIssues, athleteClosedChronicIssues } = useChronicIssues(
    props.athleteId
  );

  const isRequestPending = requestStatus === 'PENDING';

  const getIssues = () => {
    const filterWithValues = getFilterWithValues(filter);

    setRequestStatus('PENDING');
    setNextClosedIssuesPage(null);

    Promise.all([
      getAthleteIssues({
        athleteId: props.athleteId,
        issueStatus: 'open',
        ...filterWithValues,
      }),
      getAthleteIssues({
        athleteId: props.athleteId,
        issueStatus: 'closed',
        issuesPerPage: ISSUES_PER_PAGE,
        ...filterWithValues,
      }),
      getAthleteIssues({
        athleteId: props.athleteId,
        issueStatus: 'archived',
        issuesPerPage: ISSUES_PER_PAGE,
        ...(filter.date_range ? { dateRange: filter.date_range } : {}),
      }),
    ]).then(
      ([
        fetchedAthleteOpenIssues,
        fetchedAthleteClosedIssues,
        fetchedAthleteArchivedIssues,
      ]) => {
        setAthleteOpenIssues(fetchedAthleteOpenIssues.issues || []);
        setAthleteClosedIssues(fetchedAthleteClosedIssues.issues || []);
        setArchivedIssues(fetchedAthleteArchivedIssues.issues || []);
        setNextClosedIssuesPage(
          fetchedAthleteClosedIssues.meta?.next_page || null
        );
        setRequestStatus('SUCCESS');
        setIsInitialDataLoaded(true);
      },
      () => setRequestStatus('FAILURE')
    );
  };

  useEffect(() => {
    if (props.athleteId) {
      getAthleteIssueStatuses()
        .then((fetchedAthleteIssueStatuses) => {
          setAthleteIssueStatuses(fetchedAthleteIssueStatuses);
        })
        .catch(() => setRequestStatus('FAILURE'));
      getIssues();
    }
  }, [props.athleteId]);

  useEffect(() => {
    if (!isInitialDataLoaded) {
      return;
    }

    getIssues();
  }, [filter]);

  useEffect(() => {
    if (addIssueRequestStatus !== 'success') {
      return;
    }

    setRequestStatus('PENDING');

    getAthleteIssues({
      athleteId: props.athleteId,
      issueStatus: 'open',
    }).then(
      (fetchedAthleteOpenIssues) => {
        setAthleteOpenIssues(fetchedAthleteOpenIssues.issues || []);
        setRequestStatus('SUCCESS');
      },
      () => setRequestStatus('FAILURE')
    );
  }, [addIssueRequestStatus, props.athleteId]);

  const fetchMoreIssues = () => {
    const filterWithValues = getFilterWithValues(filter);

    setRequestStatus('PENDING');

    getAthleteIssues({
      athleteId: props.athleteId,
      issueStatus: 'closed',
      issuesPage: nextClosedIssuesPage,
      issuesPerPage: ISSUES_PER_PAGE,
      ...filterWithValues,
    }).then(
      (fetchedAthleteClosedIssues) => {
        setAthleteClosedIssues((prevAthleteClosedIssues) => [
          ...prevAthleteClosedIssues,
          ...(fetchedAthleteClosedIssues.issues || []),
        ]);
        setNextClosedIssuesPage(
          fetchedAthleteClosedIssues.meta?.next_page || null
        );
        setRequestStatus('SUCCESS');
      },
      () => setRequestStatus('FAILURE')
    );
  };

  const buildFilter = (filterType: string, filterValue: $Values<Filter>) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [filterType]: filterValue,
    }));
  };

  if (!isInitialDataLoaded && isRequestPending) {
    return <DelayedLoadingFeedback />;
  }

  if (requestStatus === 'FAILURE') {
    return <AppStatus status="error" />;
  }

  const closeToast = (id: ToastId) => {
    toastDispatch({
      type: 'REMOVE_TOAST_BY_ID',
      id,
    });
  };

  return (
    <AthleteConstraints athleteId={props.athleteId}>
      {({ organisationStatus }) => (
        <div className="athleteMedicalProfileIssuesTab">
          <IssuesHeader
            isPastAthlete={organisationStatus === 'PAST_ATHLETE'}
            hiddenFilters={props.hiddenFilters}
            isLoading={isRequestPending}
            athleteIssueTypes={athleteIssueTypes}
            athleteIssueStatuses={athleteIssueStatuses}
            dateRange={filter.date_range}
            onFilterBySearch={(searchQuery) =>
              buildFilter('search', searchQuery)
            }
            onFilterByType={(issueType) => buildFilter('issueType', issueType)}
            onFilterByStatus={(statusIds) =>
              buildFilter('injuryStatusIds', statusIds)
            }
            onFilterByDateRange={(dateRange) =>
              buildFilter('date_range', dateRange)
            }
            onOpenAddDiagnosticSidePanel={() =>
              dispatch(
                openAddDiagnosticSidePanel({ isAthleteSelectable: false })
              )
            }
            onOpenAddIssuePanel={({ isChronicCondition }) => {
              dispatch(
                openAddIssuePanel({
                  athleteId: props.athleteId,
                  ...(organisationStatus === 'PAST_ATHLETE' && {
                    squadId: setDefaultSquadForPastAthlete(
                      organisation.id,
                      props.athleteData.squad_names
                    ),
                  }),
                  positionId: props.athleteData.position_id,
                  isAthleteSelectable: false,
                  athleteData: props.athleteData,
                })
              );
              // Note: this is important to open the chronic condition panel
              if (isChronicCondition) {
                dispatch(selectIssueType('CHRONIC_INJURY'));
              }
            }}
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
            onOpenAddAllergySidePanel={() =>
              dispatch(openAddAllergySidePanel({ isAthleteSelectable: false }))
            }
            onOpenAddMedicalAlertSidePanel={() =>
              dispatch(
                openAddMedicalAlertSidePanel({ isAthleteSelectable: false })
              )
            }
            onOpenAddProcedureSidePanel={() =>
              dispatch(
                openAddProcedureSidePanel({ isAthleteSelectable: false })
              )
            }
            onOpenAddVaccinationSidePanel={() =>
              dispatch(
                openAddVaccinationSidePanel({ isAthleteSelectable: false })
              )
            }
            onOpenAddConcussionTestResultSidePanel={(testProtocol) =>
              dispatch(
                openAddConcussionTestResultsSidePanel({
                  testProtocol,
                  isAthleteSelectable: false,
                })
              )
            }
            onOpenAddTreatmentsSidePanel={() =>
              dispatch(
                openAddTreatmentsSidePanel({
                  isAthleteSelectable: true,
                  isDuplicatingTreatment: false,
                })
              )
            }
            onOpenAddTUESidePanel={() =>
              dispatch(openAddTUESidePanel({ isAthleteSelectable: true }))
            }
            setIsMedicalDocumentPanelOpen={setIsMedicalDocumentPanelOpen}
            setIsMedicalFilePanelOpen={(value: boolean) => {
              setIsMedicalFilePanelOpen(value);
              trackEvent(
                performanceMedicineEventNames.clickAddMedicalDocument,
                {
                  ...determineMedicalLevelAndTab(),
                  ...getDocumentActionElement('Add menu'),
                }
              );
            }}
            showArchivedIssues={showArchivedIssues}
            isAthleteOnTrial={isAthleteOnTrial}
            setShowArchivedIssues={setShowArchivedIssues}
            permissions={props.permissions}
          />

          {window.featureFlags['archive-injury'] && showArchivedIssues && (
            <ArchivedIssuesTable issues={archivedIssues} />
          )}
          {!showArchivedIssues && (
            <>
              <OpenIssuesTable
                athleteId={props.athleteId}
                issues={athleteOpenIssues}
                setShowArchiveModal={setShowArchiveModal}
                setSelectedRow={setSelectedRow}
                permissions={props.permissions.medical}
                isAthleteOnTrial={isAthleteOnTrial}
              />
              {window.featureFlags['chronic-injury-illness'] && (
                <ChronicIssuesTable
                  athleteId={props.athleteId}
                  issues={athleteChronicIssues}
                />
              )}

              <ClosedIssuesTable
                athleteId={props.athleteId}
                issues={athleteClosedIssues}
                isLoading={isRequestPending}
                isFullyLoaded={!nextClosedIssuesPage}
                fetchMoreIssues={fetchMoreIssues}
                setShowArchiveModal={setShowArchiveModal}
                setSelectedRow={setSelectedRow}
                permissions={props.permissions.medical}
                isPastAthlete={organisationStatus === 'PAST_ATHLETE'}
                isAthleteOnTrial={isAthleteOnTrial}
              />
              {window.featureFlags['chronic-injury-illness'] &&
                window.featureFlags['chronic-conditions-resolution'] && (
                  <ClosedChronicIssuesTable
                    athleteId={props.athleteId}
                    issues={athleteClosedChronicIssues}
                    isPastAthlete={organisationStatus === 'PAST_ATHLETE'}
                  />
                )}
            </>
          )}

          <AddDiagnosticSidePanel athleteId={props.athleteId} />
          <AddIssueSidePanel
            athleteId={props.athleteId}
            permissions={props.permissions}
          />
          <AddMedicalNoteSidePanel athleteId={props.athleteId} />
          <AddModificationSidePanel athleteId={props.athleteId} />
          <AddAllergySidePanel
            athleteId={props.athleteId}
            enableReloadData={props.enableReloadData}
          />
          <AddMedicalAlertSidePanel
            athleteId={props.athleteId}
            enableReloadData={props.enableReloadData}
          />
          <AddProcedureSidePanel athleteId={props.athleteId} />
          <AddVaccinationSidePanel athleteId={props.athleteId} />
          {(props.permissions.concussion.canManageConcussionAssessments ||
            props.permissions.concussion.canManageKingDevickAssessments ||
            props.permissions.concussion.canManageNpcAssessments) && (
            <AddConcussionTestResultSidePanel athleteId={props.athleteId} />
          )}
          <AddTreatmentsSidePanel athleteId={props.athleteId} />
          {window.getFlag('pm-show-tue') && (
            <AddTUESidePanel athleteId={props.athleteId} />
          )}
          {props.permissions.medical.documents.canCreate && (
            <AddMedicalDocumentSidePanel
              isPanelOpen={isMedicalDocumentPanelOpen}
              setIsPanelOpen={setIsMedicalDocumentPanelOpen}
              disablePlayerSelection={false}
              athleteId={props.athleteId}
              issueId={null}
            />
          )}
          <ArchiveIssueModalContainer
            isOpen={showArchiveModal}
            setShowArchiveModal={setShowArchiveModal}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            athleteId={props.athleteId}
            getIssues={getIssues}
            toastAction={toastDispatch}
          />
          {props.permissions.medical.documents.canCreate && (
            <AddMedicalFileSidePanel
              isPanelOpen={isMedicalFilePanelOpen}
              setIsPanelOpen={setIsMedicalFilePanelOpen}
              disablePlayerSelection
              athleteId={props.athleteId}
              issueId={null}
              toastAction={toastDispatch}
              toasts={toasts}
            />
          )}
          <ToastDialog toasts={toasts} onCloseToast={closeToast} />
        </div>
      )}
    </AthleteConstraints>
  );
};

export default IssuesTab;
