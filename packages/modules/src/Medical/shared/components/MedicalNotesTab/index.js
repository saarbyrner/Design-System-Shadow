// @flow
import type { ComponentType } from 'react';
import { colors } from '@kitman/common/src/variables';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { AppStatus } from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import type { MedicalNote } from '@kitman/modules/src/Medical/shared/types/medical';
import _xor from 'lodash/xor';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useCurrentUser from '../../hooks/useGetCurrentUser';
import { useIssue } from '../../contexts/IssueContext';
import useMedicalNotes from '../../hooks/useMedicalNotes';
import NotesFilters from '../../containers/NotesFilters';
import { getDefaultNotesFilters } from '../../utils';
import type {
  RequestStatus,
  NotesFilters as NotesFiltersType,
} from '../../types';
import AddMedicalNoteSidePanel from '../../containers/AddMedicalNoteSidePanel';

import { InfiniteScrollLayoutTranslated as InfiniteScrollLayout } from '../InfiniteScrollLayout';
import { MedicalNoteCardTranslated as MedicalNoteCard } from './components/MedicalNoteCard';
import useSessionMedicalFilters from '../../hooks/useSessionMedicalFilters';
import { useDiagnostic } from '../../contexts/DiagnosticContext';
import { useProcedure } from '../../contexts/ProcedureContext';
import { useGetAthleteDataQuery } from '../../redux/services/medicalShared';

type Props = {
  athleteId?: number,
  reloadData: boolean,
  hiddenFilters?: Array<string>,
  scopeToLevel?: string,
};

const style = {
  wrapper: css`
    min-height: 540px;
  `,
  noNoteText: css`
    color: ${colors.grey_200};
    font-size: 14px;
    font-weight: normal;
    line-height: 20px;
    margin-top: 24px;
    text-align: center;
  `,
};

const MedicalNotesTab = (props: I18nProps<Props>) => {
  const { issue, issueType, isReadOnly, isChronicIssue } = useIssue();
  const { diagnostic } = useDiagnostic();
  const { procedure } = useProcedure();
  const { organisation } = useOrganisation();
  const { currentUser, fetchCurrentUser } = useCurrentUser();

  const { id: diagnosticId } = diagnostic;
  const { id: procedureId } = procedure;
  const { id: issueId } = issue;

  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const persistedFilters = _xor(
    ['squads', 'organisation_annotation_type_ids', 'date_range'],
    props.hiddenFilters
  );
  const [filters, setFilters] = useSessionMedicalFilters<NotesFiltersType>(
    () => {
      const updatedIssueType = isChronicIssue
        ? 'Emr::Private::Models::ChronicIssue'
        : issueType.toLowerCase();
      const notesFilter: Object = {
        athleteId: props.athleteId || null,
        issueType: updatedIssueType,
        issueId,
        diagnosticId,
        procedureId,
      };
      return getDefaultNotesFilters(notesFilter);
    },
    persistedFilters,
    props.scopeToLevel
  );

  const {
    data: athleteData,
    error: getAthleteDataError,
    isLoading: isAthleteDataLoading,
  } = useGetAthleteDataQuery(props.athleteId, { skip: !props.athleteId });

  const {
    medicalNotes,
    fetchMedicalNotes,
    resetMedicalNotes,
    resetNextPage,
    lastMedicalNoteUpdatedByStatusId,
    nextPage,
  } = useMedicalNotes({
    withPagination: true,
  });

  const isFullyLoaded = requestStatus === 'SUCCESS' && !nextPage;

  const getNextNotes = useDebouncedCallback(({ resetList = false } = {}) => {
    setRequestStatus('PENDING');
    if (resetList) {
      resetMedicalNotes();
    }

    fetchMedicalNotes(filters, resetList)
      .then(() => setRequestStatus('SUCCESS'))
      .catch(() => {
        setRequestStatus('FAILURE');
      });
  }, 1000);

  useEffect(() => {
    return () => {
      // Do any clean up including debounces
      getNextNotes?.cancel?.();
    };
  }, [getNextNotes]);

  const buildNotes = () => {
    resetMedicalNotes();
    resetNextPage();
    getNextNotes({ resetList: true });
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    buildNotes();
  }, [filters]);

  useEffect(() => {
    if (!props.reloadData) {
      return;
    }

    buildNotes();
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

  const isWithinCurrentOrganisation = (note: MedicalNote) => {
    if (!note?.organisation_id) return true;
    return organisation.id === note.organisation_id;
  };

  return (
    <div css={style.wrapper}>
      <NotesFilters
        hiddenFilters={props.hiddenFilters}
        notesFilters={filters}
        onNotesFiltersChange={(updatedNotesFilters) =>
          setFilters(updatedNotesFilters)
        }
        athleteId={props.athleteId}
        isAthleteOnTrial={
          athleteData?.constraints?.organisation_status === 'TRIAL_ATHLETE'
        }
        injuryId={issueType === 'Injury' ? issueId : null}
        illnessId={issueType === 'Illness' ? issueId : null}
      />
      <InfiniteScrollLayout
        itemsLength={medicalNotes.length}
        hasMore={!isFullyLoaded}
        nextPage={nextPage}
        onReachingEnd={() => {
          // don't check for 'PENDING' requestStatus here
          // 'SUCCESS' requestStatus only comes back
          // when the last fetch happens
          getNextNotes();
        }}
      >
        {medicalNotes.map((note) => (
          <MedicalNoteCard
            currentUser={currentUser}
            athleteId={
              note.annotationable?.athlete?.id ??
              note.annotationable?.id ??
              null
            }
            key={note.id}
            withAvatar={!props.athleteId}
            note={note}
            isLoading={
              isAthleteDataLoading &&
              requestStatus === 'PENDING' &&
              lastMedicalNoteUpdatedByStatusId === note.id
            }
            hasActions={!isReadOnly && isWithinCurrentOrganisation(note)}
            onReloadData={buildNotes}
            isPastAthlete={!!athleteData?.org_last_transfer_record?.left_at}
            athleteData={athleteData}
          />
        ))}
      </InfiniteScrollLayout>
      {requestStatus === 'SUCCESS' && medicalNotes.length === 0 && (
        <div css={style.noNoteText} data-testid="MedicalNotesTab|NoNoteText">
          {props.t('No notes for this period')}
        </div>
      )}

      {(requestStatus === 'FAILURE' || getAthleteDataError) && (
        <AppStatus status="error" />
      )}
      <AddMedicalNoteSidePanel
        currentUser={currentUser}
        athleteId={props.athleteId}
        onSaveNote={() => getNextNotes({ resetList: true })}
      />
    </div>
  );
};

export const MedicalNotesTabTranslated: ComponentType<Props> =
  withNamespaces()(MedicalNotesTab);
export default MedicalNotesTab;
