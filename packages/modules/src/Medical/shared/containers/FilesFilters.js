// @flow
import { withNamespaces } from 'react-i18next';
import type { EntityAttachmentFilters } from '@kitman/modules/src/Medical/shared/types/medical';
import {
  useGetDocumentNoteCategoriesQuery,
  useGetMedicalAttachmentsFileTypesQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { FilesFiltersTranslated as FilesFilters } from '../components/MedicalFilesTab/FilesFilters';
import {
  useGetSquadAthletesQuery,
  useGetMedicalAttachmentsEntityTypesQuery,
} from '../redux/services/medical';
import type { ExportAttachment } from '../types/medical/MedicalFile';
import type { FilesFilters as DocumentsFiltersType } from '../types';

type Props = {
  setIsPanelOpen: Function,
  showPlayerFilter: boolean,
  filters: ?DocumentsFiltersType,
  enhancedFilters: ?EntityAttachmentFilters,
  setFilters: Function,
  showArchivedDocuments: boolean,
  setShowArchivedDocuments: Function,
  onExportClick: Function,
  exportAttachments: Array<ExportAttachment>,
  atIssueLevel: boolean,
};

const FilesFiltersContainer = (props: I18nProps<Props>) => {
  const {
    data: squadAthletes = { squads: [] },
    error: squadAthletesError,
    isLoading: isSquadAthletesLoading,
  } = useGetSquadAthletesQuery();

  const {
    data: documentNoteCategories = [],
    error: documentNoteCategoriesError,
    isLoading: isDocumentNoteCategoriesLoading,
  } = useGetDocumentNoteCategoriesQuery();

  const {
    data: fileTypes = [],
    error: fileTypesError,
    isLoading: isFileTypesLoading,
  } = useGetMedicalAttachmentsFileTypesQuery();

  const {
    data: entityTypes = [],
    error: entityTypesError,
    isLoading: isEntityTypesLoading,
  } = useGetMedicalAttachmentsEntityTypesQuery();

  const getInitialDataRequestStatus = () => {
    if (
      squadAthletesError ||
      documentNoteCategoriesError ||
      fileTypesError ||
      entityTypesError
    ) {
      return 'FAILURE';
    }
    if (
      isSquadAthletesLoading ||
      isDocumentNoteCategoriesLoading ||
      isFileTypesLoading ||
      isEntityTypesLoading
    ) {
      return 'PENDING';
    }
    return null;
  };

  return (
    <FilesFilters
      {...props}
      playerOptions={squadAthletes.squads.map((squad) => ({
        label: squad.name,
        options: squad.athletes.map((athlete) => ({
          label: athlete.fullname,
          value: athlete.id,
        })),
      }))}
      fileTypeOptions={fileTypes}
      filesSourceOptions={entityTypes}
      categoryOptions={documentNoteCategories
        .map((category) => ({
          label: category.name,
          value: category.id,
        }))
        .sort((a, b) =>
          a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1
        )}
      initialDataRequestStatus={getInitialDataRequestStatus()}
    />
  );
};

export const FilesFiltersContainerTranslated = withNamespaces()(
  FilesFiltersContainer
);
export default FilesFiltersContainer;
