import { useGetDocumentNoteCategoriesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { DocumentsFiltersTranslated as DocumentsFilters } from '../components/MedicalDocumentsTab/DocumentsFilters';
import { useGetSquadAthletesQuery } from '../redux/services/medical';

const DocumentsFiltersContainer = (props) => {
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

  const getInitialDataRequestStatus = () => {
    if (squadAthletesError || documentNoteCategoriesError) {
      return 'FAILURE';
    }
    if (isSquadAthletesLoading || isDocumentNoteCategoriesLoading) {
      return 'PENDING';
    }
    return null;
  };

  return (
    <DocumentsFilters
      {...props}
      playerOptions={squadAthletes.squads.map((squad) => ({
        label: squad.name,
        options: squad.athletes.map((athlete) => ({
          label: athlete.fullname,
          value: athlete.id,
        })),
      }))}
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

export default DocumentsFiltersContainer;
