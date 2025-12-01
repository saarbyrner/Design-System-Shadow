import { useDispatch } from 'react-redux';
import { NotesFiltersTranslated as NotesFilters } from '../components/MedicalNotesTab/NotesFilters';
import {
  useGetAnnotationMedicalTypesQuery,
  useGetSquadsQuery,
  useGetAnnotationAuthorsQuery,
} from '../redux/services/medical';
import { openAddMedicalNotePanel } from '../redux/actions';

const NotesFiltersContainer = (props) => {
  const dispatch = useDispatch();
  const isNotesTab = window.location.hash === '#medical_notes';

  const {
    data: annotationTypes = [],
    error: getAnnotationTypesError,
    isLoading: areAnnotationTypesLoading,
  } = useGetAnnotationMedicalTypesQuery({
    skip: !isNotesTab,
  });
  const {
    data: squads = [],
    error: getSquadsError,
    isLoading: areSquadsLoading,
  } = useGetSquadsQuery({
    skip: !isNotesTab,
  });
  const {
    data: authors = [],
    error: getAuthorsError,
    isLoading: areAuthorsLoading,
  } = useGetAnnotationAuthorsQuery(
    {
      athleteId: props.athleteId,
      injuryId: props.injuryId,
      illnessId: props.illnessId,
    },
    {
      skip: !isNotesTab,
    }
  );

  const getInitialDataRequestStatus = () => {
    if (getAnnotationTypesError || getSquadsError || getAuthorsError) {
      return 'FAILURE';
    }
    if (areAnnotationTypesLoading || areSquadsLoading || areAuthorsLoading) {
      return 'PENDING';
    }
    return null;
  };

  return (
    <NotesFilters
      {...props}
      annotationTypes={annotationTypes
        .filter(
          (annotationType) =>
            annotationType.type !== 'OrganisationAnnotationTypes::Document'
        )
        .map(({ id, name }) => ({
          value: id,
          label: name,
        }))}
      squads={squads.map(({ id, name }) => ({
        value: id,
        label: name,
      }))}
      authors={authors.map(({ id, fullname }) => ({
        value: id,
        label: fullname,
      }))}
      initialDataRequestStatus={getInitialDataRequestStatus()}
      onClickAddMedicalNote={() =>
        dispatch(openAddMedicalNotePanel({ isAthleteSelectable: false }))
      }
    />
  );
};

export default NotesFiltersContainer;
