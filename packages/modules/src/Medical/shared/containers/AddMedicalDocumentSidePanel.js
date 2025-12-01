import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useGetDocumentNoteCategoriesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { AddMedicalDocumentSidePanelTranslated as AddMedicalDocumentSidePanel } from '../components/AddMedicalDocumentSidePanel';
import { useGetSquadAthletesQuery } from '../redux/services/medical';
import { addToast, updateToast, removeToast } from '../redux/actions';
import useAthletesIssues from '../hooks/useAthletesIssues';
import getAnnotationMedicalTypes from '../../../../../services/src/services/medical/getAnnotationMedicalTypes';
import useSquadAthletesSelectOptions from '../hooks/useSquadAthletesSelectOptions';

const organisationAnnotationType = 'OrganisationAnnotationTypes::Document';

const AddMedicalDocumentSidePanelContainer = (props) => {
  const dispatch = useDispatch();

  const [orgAnnotationTypeId, setOrgAnnotationTypeId] = useState(0);

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

  const athletesSelectOptions = useSquadAthletesSelectOptions({
    squadAthletes,
  });

  const getInitialDataRequestStatus = () => {
    if (squadAthletesError || documentNoteCategoriesError) {
      return 'FAILURE';
    }
    if (isSquadAthletesLoading || isDocumentNoteCategoriesLoading) {
      return 'PENDING';
    }
    return null;
  };

  const { athleteIssues, fetchAthleteIssues } = useAthletesIssues(
    props.athleteId
  );

  const getMedicalTypes = () => {
    getAnnotationMedicalTypes().then((response) => {
      const documentOrganisationAnnotationType = response.find(
        (annoType) => annoType.type === organisationAnnotationType
      );

      let annotationId = 0;

      if (documentOrganisationAnnotationType) {
        annotationId = documentOrganisationAnnotationType.id;
      }
      setOrgAnnotationTypeId(annotationId);
    });
  };

  useEffect(() => {
    getMedicalTypes();
  }, []);

  return (
    <AddMedicalDocumentSidePanel
      {...props}
      playerOptions={athletesSelectOptions}
      categoryOptions={documentNoteCategories
        .map((category) => ({
          label: category.name,
          value: category.id,
        }))
        .sort((a, b) =>
          a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1
        )}
      onFileUploadStart={(fileName, fileSize, fileId) =>
        dispatch(
          addToast({
            title: fileName,
            description: fileSize,
            status: 'LOADING',
            id: fileId,
          })
        )
      }
      onFileUploadSuccess={(fileId) => {
        dispatch(updateToast(fileId, { status: 'SUCCESS' }));
        setTimeout(() => dispatch(removeToast(fileId)), 5000);
      }}
      onFileUploadFailure={(fileId) =>
        dispatch(updateToast(fileId, { status: 'ERROR' }))
      }
      initialDataRequestStatus={getInitialDataRequestStatus()}
      athleteIssues={athleteIssues}
      fetchAthleteIssues={fetchAthleteIssues}
      organisationAnnotationTypeId={orgAnnotationTypeId}
      squads={squadAthletes.squads}
    />
  );
};

export default AddMedicalDocumentSidePanelContainer;
