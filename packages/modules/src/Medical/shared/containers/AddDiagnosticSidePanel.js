import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AthleteConstraints from '@kitman/modules/src/Medical/shared/components/AthleteConstraints';
import {
  closeAddDiagnosticSidePanel,
  addToast,
  updateToast,
  removeToast,
} from '../redux/actions';
import { AddDiagnosticSidePanelTranslated as AddDiagnosticSidePanel } from '../components/AddDiagnosticSidePanel';
import {
  useGetCovidResultTypesQuery,
  useGetCovidAntibodyResultTypesQuery,
  useGetDiagnosticTypesQuery,
  useGetDiagnosticReasonsQuery,
  useGetStaffUsersQuery,
  useGetMedicalLocationsQuery,
  useGetSquadAthletesQuery,
} from '../redux/services/medical';
import useSquadAthletesSelectOptions from '../hooks/useSquadAthletesSelectOptions';

const AddDiagnosticSidePanelContainer = (props) => {
  const dispatch = useDispatch();
  const [athleteId, setAthleteId] = useState(props.athleteId || null);
  const isOpen = useSelector((state) => state.addDiagnosticSidePanel.isOpen);
  const isAthleteSelectable = useSelector(
    (state) => state.addDiagnosticSidePanel?.initialInfo?.isAthleteSelectable
  );
  const diagnosticId = useSelector(
    (state) => state.addDiagnosticSidePanel?.initialInfo?.diagnosticId
  );
  const redoxOrg =
    // eslint-disable-next-line dot-notation
    window.featureFlags['redox'] && window.featureFlags['redox-iteration-1'];

  const {
    data: covidResultTypes = [],
    error: getCovidResultTypesError,
    isLoading: areCovidResultTypesLoading,
  } = useGetCovidResultTypesQuery(null, { skip: !isOpen });
  const {
    data: covidAntibodyResultTypes = [],
    error: getCovidAntibodyResultTypesError,
    isLoading: areCovidAntibodyResultTypesLoading,
  } = useGetCovidAntibodyResultTypesQuery(null, { skip: !isOpen });
  const {
    data: diagnosticTypes = [],
    error: getDiagnosticTypesError,
    isLoading: areDiagnosticTypesLoading,
  } = useGetDiagnosticTypesQuery(null, { skip: !isOpen });

  const {
    data: diagnosticReasons = [],
    error: diagnosticReasonsError,
    isLoading: diagnosticReasonsLoading,
  } = useGetDiagnosticReasonsQuery('diagnostic', { skip: !isOpen });

  const sortedReasons = diagnosticReasons?.diagnostic_reasons
    // eslint-disable-next-line camelcase
    ?.map(({ id, name, injury_illness_required }) => ({
      value: id,
      label: name,
      isInjuryIllness: injury_illness_required,
    }))
    .sort((a, b) => {
      const lowercaseA = a.label.toLowerCase();
      const lowercaseB = b.label.toLowerCase();
      return lowercaseA.localeCompare(lowercaseB);
    });
  const {
    data: squadAthletes = { squads: [] },
    error: squadAthletesError,
    isLoading: isSquadAthletesLoading,
  } = useGetSquadAthletesQuery(
    { athleteList: true }, // Can use minimal athlete data
    { skip: !isOpen }
  );

  const {
    data: staffUsers = [],
    error: staffUsersError,
    isLoading: isStaffUsersLoading,
  } = useGetStaffUsersQuery(null, { skip: !isOpen });

  const {
    data: medicalLocations = [],
    error: medicalLocationsError,
    isLoading: isMedicalLocationsLoading,
  } = useGetMedicalLocationsQuery(redoxOrg ? 'order' : 'diagnostic', {
    skip: !isOpen,
  });

  const sortedLocations = medicalLocations?.organisation_locations
    ?.map(({ id, name, redox_orderable: redoxOrderable }) => ({
      value: id,
      label: name,
      redoxOrderable,
    }))
    .sort((a, b) => {
      const lowercaseA = a.label.toLowerCase();
      const lowercaseB = b.label.toLowerCase();
      return lowercaseA.localeCompare(lowercaseB);
    });

  const sortedStaffUsers = staffUsers
    .map(({ id, fullname }) => ({
      value: id,
      label: fullname,
    }))
    .sort((a, b) => {
      const lowercaseA = a.label.toLowerCase();
      const lowercaseB = b.label.toLowerCase();
      return lowercaseA.localeCompare(lowercaseB);
    });

  const athletesSelectOptions = useSquadAthletesSelectOptions({
    isAthleteSelectable,
    squadAthletes,
  });

  const getInitialDataRequestStatus = () => {
    if (
      squadAthletesError ||
      getCovidResultTypesError ||
      getCovidAntibodyResultTypesError ||
      getDiagnosticTypesError ||
      staffUsersError ||
      medicalLocationsError ||
      diagnosticReasonsError
    ) {
      return 'FAILURE';
    }
    if (
      isSquadAthletesLoading ||
      areCovidResultTypesLoading ||
      areCovidAntibodyResultTypesLoading ||
      areDiagnosticTypesLoading ||
      isStaffUsersLoading ||
      isMedicalLocationsLoading ||
      diagnosticReasonsLoading
    ) {
      return 'PENDING';
    }
    return null;
  };

  return (
    <AthleteConstraints athleteId={athleteId}>
      {({ organisationStatus }) => (
        <AddDiagnosticSidePanel
          {...props}
          athleteConstraints={{
            organisationStatus,
          }}
          athleteId={props.athleteId}
          diagnosticId={diagnosticId}
          staffUsers={sortedStaffUsers}
          medicalLocations={sortedLocations}
          diagnosticReasons={sortedReasons}
          covidResultTypes={covidResultTypes.map((covidResult) => ({
            value: covidResult,
            label: covidResult,
          }))}
          covidAntibodyResultTypes={covidAntibodyResultTypes.map(
            (covidAntibodyResult) => ({
              value: covidAntibodyResult,
              label: covidAntibodyResult,
            })
          )}
          diagnosticTypes={diagnosticTypes.map(
            ({
              id,
              name,
              issue_optional: optional,
              cardiac_screening: cardiacScreening,
              // eslint-disable-next-line camelcase
              diagnostic_type_questions,
            }) => ({
              value: id,
              label: name,
              optional,
              cardiacScreening,
              diagnostic_type_questions,
            })
          )}
          isOpen={isOpen}
          isAthleteSelectable={isAthleteSelectable}
          squadAthletes={athletesSelectOptions}
          initialDataRequestStatus={getInitialDataRequestStatus()}
          onClose={() => dispatch(closeAddDiagnosticSidePanel())}
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
          onSaveSuccessful={() => props.onSaveDiagnostic?.()}
          setAthleteId={setAthleteId}
        />
      )}
    </AthleteConstraints>
  );
};

export default AddDiagnosticSidePanelContainer;
