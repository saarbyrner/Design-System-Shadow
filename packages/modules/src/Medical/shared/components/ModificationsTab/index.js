// @flow
import { useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';
import { AppStatus } from '@kitman/components';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import _xor from 'lodash/xor';
import { colors } from '@kitman/common/src/variables';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { RequestStatus, ModificationFilters } from '../../types';
import { getModificationNotesFilter } from '../../utils';
import { useIssue } from '../../contexts/IssueContext';
import useModificationNotes from '../../hooks/useModificationNotes';
import ModificationsFilters from '../../containers/ModificationsFilters';
import AddModificationSidePanel from '../../containers/AddModificationSidePanel';
import MedicalSidePanels from '../../containers/MedicalSidePanels';
import { InfiniteScrollLayoutTranslated as InfiniteScrollLayout } from '../InfiniteScrollLayout';
import { ModificationNoteCardTranslated as ModificationNoteCard } from './ModificationNoteCard';
import useSessionMedicalFilters from '../../hooks/useSessionMedicalFilters';
import type { MedicalNote } from '../../types/medical';

type Props = {
  athleteId?: number,
  athleteData?: AthleteData,
  issueId?: string | null,
  reloadData: boolean,
  reloadAthleteData?: (boolean) => void,
  hiddenFilters?: Array<string>,
  scopeToLevel?: string,
  isMedicalDocumentPanelOpen?: boolean,
  setIsMedicalDocumentPanelOpen?: (boolean) => void,
  isMedicalFilePanelOpen?: boolean,
  setIsMedicalFilePanelOpen?: (boolean) => void,
};

const style = {
  wrapper: css`
    min-height: 540px;
  `,
  noModificationText: css`
    color: ${colors.grey_200};
    font-size: 14px;
    font-weight: normal;
    line-height: 20px;
    margin-top: 24px;
    text-align: center;
  `,
};

const ModificationsTab = (props: I18nProps<Props>) => {
  const { issue, issueType, isChronicIssue } = useIssue();
  const { id: issueId } = issue;

  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const persistedFilters = _xor(['date_range', 'squads'], props.hiddenFilters);
  const [filters, setFilters] = useSessionMedicalFilters<ModificationFilters>(
    () => {
      const updatedIssueType = isChronicIssue
        ? 'Emr::Private::Models::ChronicIssue'
        : issueType.toLowerCase();

      const modificationFilter: Object = {
        athleteId: props.athleteId || null,
        isModification: true,
      };

      if (issueId && issueType) {
        modificationFilter.issueId = issueId;
        modificationFilter.issueType = updatedIssueType;
      }

      return getModificationNotesFilter(modificationFilter);
    },
    persistedFilters,
    props.scopeToLevel
  );

  const {
    modificationNotes,
    fetchModificationNotes,
    lastModificationNoteUpdatedByStatusId,
    expireModificationNote,
    resetModificationNotes,
    resetNextPage,
    nextPage,
  } = useModificationNotes({
    withPagination: true,
  });

  const isFullyLoaded = !(requestStatus === 'PENDING') && !nextPage;

  const getNextModifications = useDebouncedCallback(
    ({ resetList = false } = {}) => {
      if (resetList) {
        resetModificationNotes();
      }

      setRequestStatus('PENDING');

      fetchModificationNotes(filters, resetList)
        .then(() => setRequestStatus('SUCCESS'))
        .catch(() => {
          setRequestStatus('FAILURE');
        });
    },
    400
  );

  useEffect(() => {
    return () => {
      // Do any clean up including debounces
      getNextModifications?.cancel?.();
    };
  }, [getNextModifications]);

  const buildModifications = () => {
    resetModificationNotes();
    resetNextPage();
    getNextModifications({ resetList: true });
  };

  useEffect(() => {
    buildModifications();
  }, [filters]);

  useEffect(() => {
    if (!props.reloadData) {
      return;
    }

    buildModifications();
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

  const deactivateModification = (modificationId: number) => {
    setRequestStatus('PENDING');

    expireModificationNote(modificationId)
      .then(() => setRequestStatus('SUCCESS'))
      .catch(() => setRequestStatus('FAILURE'));
  };

  const canRenderActions = (modification: MedicalNote) => {
    if (modification.constraints?.read_only) return false;

    return !modification.expired;
  };

  return (
    <div css={style.wrapper}>
      <ModificationsFilters
        hiddenFilters={props.hiddenFilters}
        filters={filters}
        onChangeFilter={(updatedFilters) => setFilters(updatedFilters)}
        showPlayerFilter={!props.athleteId}
        athleteId={props.athleteId}
        injuryId={issueType === 'Injury' ? issueId : null}
        illnessId={issueType === 'Illness' ? issueId : null}
      />
      <InfiniteScrollLayout
        itemsLength={modificationNotes.length}
        hasMore={!isFullyLoaded}
        onReachingEnd={getNextModifications}
      >
        {modificationNotes.map((modification) => (
          <ModificationNoteCard
            key={modification.id}
            withAvatar={!props.athleteId}
            modification={modification}
            isLoading={
              requestStatus === 'PENDING' &&
              lastModificationNoteUpdatedByStatusId === modification.id
            }
            hasActions={canRenderActions(modification)}
            deactivateModification={deactivateModification}
          />
        ))}
      </InfiniteScrollLayout>
      {window.featureFlags['medical-global-add-button-fix'] &&
      props.scopeToLevel === 'issue' ? (
        <MedicalSidePanels
          athleteId={props.athleteId}
          athleteData={props.athleteData}
          issueId={props.issueId}
          reloadAthleteData={props.reloadAthleteData}
          isMedicalDocumentPanelOpen={props.isMedicalDocumentPanelOpen}
          setIsMedicalDocumentPanelOpen={props.setIsMedicalDocumentPanelOpen}
          isMedicalFilePanelOpen={props.isMedicalFilePanelOpen}
          setIsMedicalFilePanelOpen={props.setIsMedicalFilePanelOpen}
          onSidePanelAction={() => getNextModifications({ resetList: true })}
        />
      ) : (
        <AddModificationSidePanel
          athleteId={props.athleteId}
          onSaveModification={() => getNextModifications({ resetList: true })}
        />
      )}

      {requestStatus === 'SUCCESS' && modificationNotes.length === 0 && (
        <div css={style.noModificationText}>
          {props.t('No modifications for this period')}
        </div>
      )}
      {requestStatus === 'FAILURE' && <AppStatus status="error" />}
    </div>
  );
};

export const ModificationsTabTranslated: ComponentType<Props> =
  withNamespaces()(ModificationsTab);
export default ModificationsTab;
