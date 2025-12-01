// @flow
import type { ComponentType } from 'react';
import { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import type { DateRange } from '@kitman/common/src/types';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  DocumentsFilters as DocumentsFiltersType,
  RequestStatus,
} from '../../types';
import useMedicalNotes from '../../hooks/useMedicalNotes';
import { DocumentsTableTranslated as DocumentsTable } from './components/DocumentsTable';
import AddMedicalDocumentSidePanel from '../../containers/AddMedicalDocumentSidePanel';
import DocumentsFilters from '../../containers/DocumentsFilters';
import style from './styles';

type Props = {
  athleteId: number | null,
  defaultAthleteSquadId: number,
  issueId: string | null,
  hiddenFilters?: ?Array<string>,
};

const MedicalDocumentsTab = (props: I18nProps<Props>) => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const [searchContent, setSearchContent] = useState<string>('');
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | null>(
    null
  );
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(
    props.athleteId
  );
  const [selectedCategories, setSelectedCategories] =
    useState<Array<number> | null>(null);
  const [isAddMedicalDocumentPanelOpen, setIsAddMedicalDocumentPanelOpen] =
    useState<boolean>(false);

  const showPlayerFilter = props.athleteId === null;
  const organisationAnnotationType = 'OrganisationAnnotationTypes::Document';

  const createIssueOccurance = (issue: string | null) => {
    if (issue === null) return null;

    return {
      id: +issue.replace(/\D/g, ''),
      type: issue.replace(/[^A-Za-z]+/g, '').toLowerCase(),
    };
  };

  const [filters, setFilters] = useState<DocumentsFiltersType>({
    content: searchContent,
    date_range: selectedDateRange,
    athlete_id: selectedPlayer,
    document_note_category_ids: selectedCategories,
    organisation_annotation_type: [organisationAnnotationType],
    unexpired: true,
    squads: [],
    organisation_annotation_type_ids: [],
    author: [],
    archived: false,
    issue_occurrence: createIssueOccurance(props.issueId),
    ...(window.featureFlags['fix-lazy-load-debounce'] && { per_page: 15 }),
  });

  const { medicalNotes, fetchMedicalNotes, resetMedicalNotes, resetNextPage } =
    useMedicalNotes({
      withPagination: true,
    });

  const getNextDocuments = useDebouncedCallback(
    ({ resetList = false } = {}) => {
      setRequestStatus('PENDING');
      if (resetList) {
        resetMedicalNotes();
      }

      fetchMedicalNotes(filters, resetList)
        .then(() => setRequestStatus('SUCCESS'))
        .catch(() => {
          setRequestStatus('FAILURE');
        });
    },
    1000
  );

  useEffect(() => {
    return () => {
      // Do any clean up including debounces
      getNextDocuments?.cancel?.();
    };
  }, [getNextDocuments]);

  const buildDocuments = () => {
    resetMedicalNotes();
    resetNextPage();
    getNextDocuments({ resetList: true });
  };

  useEffect(() => {
    buildDocuments();
  }, [filters]);

  return (
    <div css={style.wrapper}>
      <DocumentsFilters
        requestStatus={requestStatus}
        setIsPanelOpen={setIsAddMedicalDocumentPanelOpen}
        selectedPlayer={selectedPlayer}
        setSelectedPlayer={setSelectedPlayer}
        selectedDateRange={selectedDateRange}
        setSelectedDateRange={setSelectedDateRange}
        searchContent={searchContent}
        setSearchContent={setSearchContent}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        showPlayerFilter={showPlayerFilter}
        filters={filters}
        setFilters={setFilters}
        hiddenFilters={props.hiddenFilters}
      />
      <DocumentsTable
        documents={medicalNotes.filter(
          (document) => document.attachments.length > 0
        )}
        onReachingEnd={getNextDocuments}
        isLoading={requestStatus === 'PENDING'}
        issueId={props.issueId}
        showPlayerColumn={showPlayerFilter}
      />
      {requestStatus === 'SUCCESS' && medicalNotes.length === 0 && (
        <div
          css={style.noNoteText}
          data-testid="MedicalDocumentsTab|NoDocumentsText"
        >
          {props.t('No documents found')}
        </div>
      )}
      <AddMedicalDocumentSidePanel
        isPanelOpen={isAddMedicalDocumentPanelOpen}
        setIsPanelOpen={setIsAddMedicalDocumentPanelOpen}
        disablePlayerSelection={!!showPlayerFilter}
        athleteId={props.athleteId}
        issueId={props.issueId}
        getDocuments={buildDocuments}
        defaultAthleteSquadId={props.defaultAthleteSquadId}
      />
    </div>
  );
};

export const MedicalDocumentsTabTranslated: ComponentType<Props> =
  withNamespaces()(MedicalDocumentsTab);
export default MedicalDocumentsTab;
