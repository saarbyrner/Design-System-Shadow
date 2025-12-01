import { useEffect, useState } from 'react';
import getAnnotationMedicalTypes from '@kitman/services/src/services/medical/getAnnotationMedicalTypes';
import AthleteConstraints from '@kitman/modules/src/Medical/shared/components/AthleteConstraints';
import { useGetDocumentNoteCategoriesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { AddMedicalFileSidePanelTranslated as AddMedicalFileSidePanel } from '../components/AddMedicalFileSidePanel';
import { useGetSquadAthletesQuery } from '../redux/services/medical';
import useAthletesIssues from '../hooks/useAthletesIssues';
import useSquadAthletesSelectOptions from '../hooks/useSquadAthletesSelectOptions';

const organisationAnnotationType = 'OrganisationAnnotationTypes::Document';

const AddMedicalFileSidePanelContainer = (props) => {
  const [orgAnnotationTypeId, setOrgAnnotationTypeId] = useState(0);
  const [athleteId, setAthleteId] = useState(props.athleteId || null);

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
    <AthleteConstraints athleteId={athleteId}>
      {({ organisationStatus }) => (
        <AddMedicalFileSidePanel
          {...props}
          athleteConstraints={{
            organisationStatus,
          }}
          playerOptions={athletesSelectOptions}
          categoryOptions={documentNoteCategories
            .map((category) => ({
              label: category.name,
              value: category.id,
            }))
            .sort((a, b) =>
              a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1
            )}
          initialDataRequestStatus={getInitialDataRequestStatus()}
          athleteIssues={athleteIssues}
          fetchAthleteIssues={fetchAthleteIssues}
          organisationAnnotationTypeId={orgAnnotationTypeId}
          setAthleteId={setAthleteId}
        />
      )}
    </AthleteConstraints>
  );
};

export default AddMedicalFileSidePanelContainer;
