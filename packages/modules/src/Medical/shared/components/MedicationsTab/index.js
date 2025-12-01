/* eslint-disable no-nested-ternary */
// @flow
import { useState, useEffect } from 'react';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import {
  getAthleteMedications,
  getOrganisation,
  getMedications,
} from '@kitman/services';
import _xor from 'lodash/xor';
import type { RequestStatus } from '@kitman/common/src/types';
import { IconButton, GenericIframe } from '@kitman/components';
import getNotifications from '@kitman/services/src/services/medical/getNotifications';
import { isCanceledError } from '@kitman/common/src/utils/services';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useGetMedicationProvidersQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { AttachmentsViewerModalTranslated as AttachmentsViewerModal } from '@kitman/modules/src/shared/AttachmentsViewerModal';
import { zIndices } from '@kitman/common/src/variables';
import { useIssue } from '../../contexts/IssueContext';
import MedicationFilters from '../../containers/MedicationFilters';
import { getDefaultDrFirstMedicationsFilters } from '../../utils';
import useCurrentUser from '../../hooks/useGetCurrentUser';
import type { DrFirstMedicationsFilter } from '../../types';
import useSessionMedicalFilters from '../../hooks/useSessionMedicalFilters';
import MedicationCardList from './components/MedicationCardList/index';
import MedicationTypeSelector from './components/MedicationTypeSelector';
import AddMedicationSidePanel from '../../containers/AddMedicationSidePanel';
import styles from './styles';
import useMedications from '../../hooks/useMedications';
import type { DrFirstMedicationsDataResponse } from '../../types/medical';
import ArchiveMedicationModalContainer from './components/ArchiveMedicationModal/ArchiveMedicationModalContainer/index';

export type Props = {
  athleteId: number,
  hiddenFilters?: Array<string>,
  scopeToLevel?: string,
  athleteExternalId: string,
  includesToggle: boolean,
  playerLevel?: boolean,
  onOpenDispenseMedicationsSidePanel: Function,
  onFavoriteMedicationStart: Function,
  onFavoriteMedicationSuccess: Function,
  onFavoriteMedicationFailure: Function,
};

type Notification = {
  report_count: number,
  message_count: number,
};
const MedicationsTab = (props: I18nProps<Props>) => {
  const { athleteId } = props;
  const [athleteUrl, setAthleteUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { currentUser, fetchCurrentUser } = useCurrentUser();
  const { issue, issueType, isChronicIssue } = useIssue();
  const { id: issueId } = issue;
  const [selectedMedication, setSelectedMedication] =
    useState<DrFirstMedicationsDataResponse | null>(null);
  const [organisation, setOrganisation] = useState<any>(null);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const persistedFilters = _xor(
    ['date_range', 'status', 'provider'],
    props.hiddenFilters
  );
  const [medicationType, setMedicationType] = useState<
    'overview' | 'management' | 'internal'
  >('overview');
  const [actionType, setActionType] = useState<'Dispense' | 'Log'>('Log');
  const [archiveModalOpen, setArchiveModalOpen] = useState<boolean>(false);
  const [archiveAthleteId, setArchiveAthleteId] = useState<number | null>(null);
  const [archiveMedicationId, setArchiveMedicationId] = useState<number | null>(
    null
  );
  const injuryIllnessId = window.location.pathname.split('/').pop();
  const [notifications, setNotifications] = useState<Notification>({});
  const [viewAttachmentsModalOpen, setViewAttachmentsModalOpen] =
    useState<boolean>(false);

  const clearSelectedMedication = () => setSelectedMedication(null);

  const isInjuryIllnessPage = () => {
    if (window.location.pathname.includes('injuries')) {
      return `/injuries/${injuryIllnessId}`;
    }
    if (window.location.pathname.includes('illnesses')) {
      return `/illnesses/${injuryIllnessId}`;
    }
    if (window.location.pathname.includes('chronic_issues')) {
      return `/chronic_issues/${injuryIllnessId}`;
    }
    return '';
  };

  const isDrFirstIntegrationOn = window.featureFlags['dr-first-integration'];

  const routeChange = (type: 'message' | 'report') => {
    const path = `/medical/athletes/${
      props.athleteId
    }${isInjuryIllnessPage()}/notifications#${type}`;
    window.location.href = path;
  };

  const [filters, setFilters] =
    useSessionMedicalFilters<DrFirstMedicationsFilter>(
      () =>
        getDefaultDrFirstMedicationsFilters({
          athleteId: props.athleteId,
          issueType: isChronicIssue ? 'ChronicIssue' : `${issueType}Occurrence`,
          issueId,
        }),
      persistedFilters,
      props.scopeToLevel
    );

  const {
    medications,
    fetchMedications,
    resetMedications,
    resetNextPage,
    nextPage,
  } = useMedications();

  const reloadDrFirst = () => {
    getAthleteMedications(athleteId)
      .then((data) => {
        setAthleteUrl(data.url);
      })
      .catch((error) => {
        setErrorMessage(
          error.responseJSON?.message ||
            props.t('Something went wrong, contact support')
        );
      });
  };

  const getNextMedications = useDebouncedCallback(
    ({ resetList = false } = {}) => {
      if (resetList) {
        resetMedications();
      }
      setRequestStatus('PENDING');

      fetchMedications(filters, resetList)
        .then(() => setRequestStatus('SUCCESS'))
        .catch((error) =>
          isCanceledError(error)
            ? setRequestStatus('PENDING')
            : setRequestStatus('FAILURE')
        );
    },
    400
  );

  useEffect(() => {
    fetchCurrentUser();
    getOrganisation()
      .then((currentOrg) => {
        setOrganisation(currentOrg);
        setRequestStatus('SUCCESS');
      })
      .catch(() => setRequestStatus('FAILURE'));
    getMedications(athleteId).catch((error) => {
      setErrorMessage(
        error.responseJSON?.message ||
          props.t('Something went wrong, contact support')
      );
    });
    getNotifications()
      .then((res) => {
        setNotifications(res);
      })
      .catch((error) => {
        setErrorMessage(
          error.responseJSON?.message ||
            props.t('Something went wrong, contact support')
        );
      });
    if (isDrFirstIntegrationOn) {
      reloadDrFirst();
    }

    return () => {
      getNextMedications?.cancel?.();
    };
  }, [getNextMedications]);

  const { refetch: refetchMedicationProviders } =
    useGetMedicationProvidersQuery();

  const resetDrFirstMedications = () => {
    resetNextPage();
    getNextMedications({ resetList: true });
    refetchMedicationProviders();
  };

  useEffect(() => {
    resetDrFirstMedications();
  }, [filters]);

  useEffect(() => {
    // This is needed for when using PlayerSelector as filters don't update with change of athlete
    // or issue. Still persisting filters, so only athlete & issue needs changing.
    // $FlowIgnore Constructing object to match initial filter
    setFilters((prevFilters) => ({
      ...prevFilters,
      athlete_id: props.athleteId,
      issue_id: issueId,
      issue_type: isChronicIssue ? 'ChronicIssue' : `${issueType}Occurrence`,
    }));

    // Initialise error message and reload dr first details
    setErrorMessage('');
    if (isDrFirstIntegrationOn) {
      reloadDrFirst();
    }
  }, [medicationType, props.athleteId, issue]);

  return (
    <div css={styles.medicationsTableContainer}>
      <AddMedicationSidePanel
        {...props}
        athleteId={props.athleteId}
        resetDrFirstMedications={resetDrFirstMedications}
        isEditing={!!selectedMedication}
        selectedMedication={selectedMedication}
        clearSelectedMedication={clearSelectedMedication}
        actionType={actionType}
        setActionType={setActionType}
      />
      {archiveModalOpen && (
        <ArchiveMedicationModalContainer
          isOpen={archiveModalOpen}
          athleteId={archiveAthleteId}
          medicationId={archiveMedicationId}
          onClose={() => setArchiveModalOpen(false)}
          onPressEscape={() => setArchiveModalOpen(false)}
          onReloadData={resetDrFirstMedications}
        />
      )}
      <div css={styles.actionButtons}>
        {props.includesToggle && (
          <MedicationTypeSelector
            {...props}
            medicationType={medicationType}
            setMedicationType={setMedicationType}
          />
        )}
        {isDrFirstIntegrationOn && (
          <div css={styles.actionButtonWrapper}>
            <div css={styles.iconButtonWrapper}>
              <IconButton
                icon="icon-alarm"
                isSmall
                isBorderless
                isDarkIcon
                onClick={() => routeChange('report')}
              />
              {notifications.report_count ? (
                <div css={styles.badge}>{notifications.report_count}</div>
              ) : null}
            </div>

            <div css={styles.iconButtonWrapper}>
              <IconButton
                icon="icon-messaging"
                isSmall
                isBorderless
                onClick={() => routeChange('message')}
                isDarkIcon
              />
              {notifications.message_count ? (
                <>
                  {notifications.message_count > 99 ? (
                    <div css={styles.largeBadge}>
                      99
                      <span className="icon-add" css={styles.icon} />
                    </div>
                  ) : (
                    <div css={styles.badge}>{notifications.message_count}</div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
      {medicationType === 'overview' || medicationType === 'internal' ? (
        <>
          <MedicationFilters
            athleteExternalId={props.athleteExternalId}
            athleteId={props.athleteId || null}
            currentUser={currentUser}
            setRequestStatus={setRequestStatus}
            currentOrganisation={organisation}
            filters={filters}
            hiddenFilters={props.hiddenFilters}
            onChangeFilter={(updatedFilter) => setFilters(updatedFilter)}
            onOpenDispenseMedicationsSidePanel={
              props.onOpenDispenseMedicationsSidePanel
            }
          />
          <MedicationCardList
            {...props}
            medications={medications}
            requestStatus={requestStatus}
            playerLevel={props.playerLevel}
            issue={issue}
            hasMoreMedications={nextPage !== null}
            onViewSelectedMedicationAttachments={() =>
              setViewAttachmentsModalOpen(true)
            }
            onReachingEnd={getNextMedications}
            onOpenDispenseMedicationsSidePanel={
              props.onOpenDispenseMedicationsSidePanel
            }
            setSelectedMedication={setSelectedMedication}
            onFavoriteMedicationStart={props.onFavoriteMedicationStart}
            onFavoriteMedicationSuccess={props.onFavoriteMedicationSuccess}
            onFavoriteMedicationFailure={props.onFavoriteMedicationFailure}
            onOpenArchiveMedicationModal={(medicationId) => {
              setArchiveMedicationId(medicationId);
              setArchiveAthleteId(props.athleteId);
              setArchiveModalOpen(true);
            }}
          />
          {selectedMedication && selectedMedication.attachments?.length > 0 && (
            <AttachmentsViewerModal
              open={viewAttachmentsModalOpen}
              onClose={() => {
                clearSelectedMedication();
                setViewAttachmentsModalOpen(false);
              }}
              attachments={selectedMedication.attachments?.filter(
                (attachment) =>
                  attachment.confirmed && attachment.archived_at === null
              )}
              sx={{
                zIndex: zIndices.modal,
              }}
            />
          )}
        </>
      ) : isDrFirstIntegrationOn &&
        medicationType === 'management' &&
        athleteUrl &&
        !errorMessage ? (
        <GenericIframe
          src={athleteUrl}
          title="Kitman Labs Dr. First Integration"
          isLoading={requestStatus === 'PENDING'}
          id="Medications|Iframe"
        />
      ) : (
        <h3>{errorMessage}</h3>
      )}
    </div>
  );
};

export default MedicationsTab;
