import { useSelector, useDispatch } from 'react-redux';
import {
  closeAddTreatmentsSidePanel,
  addToast,
  updateToast,
  removeToast,
} from '../redux/actions';
import { AddTreatmentSidePanelTranslated as AddTreatmentSidePanel } from '../components/AddTreatmentSidePanel';
import {
  useGetMedicalLocationsQuery,
  useGetSquadAthletesQuery,
  useGetStaffUsersQuery,
} from '../redux/services/medical';
import useSquadAthletesSelectOptions from '../hooks/useSquadAthletesSelectOptions';

const AddTreatmentsSidePanelContainer = (props) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.addTreatmentsSidePanel.isOpen);
  const isAthleteSelectable = useSelector(
    (state) => state.addTreatmentsSidePanel.initialInfo.isAthleteSelectable
  );
  const isDuplicatingTreatment = useSelector(
    (state) => state.addTreatmentsSidePanel.initialInfo.isDuplicatingTreatment
  );
  const duplicateTreatment = useSelector(
    (state) =>
      state.addTreatmentsSidePanel.initialInfo?.duplicateTreatment || null
  );

  const {
    data: medicalLocations = [],
    error: medicalLocationsError,
    isLoading: isMedicalLocationsLoading,
  } = useGetMedicalLocationsQuery('treatment', { skip: !isOpen });

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

  const athletesSelectOptions = useSquadAthletesSelectOptions({
    isAthleteSelectable,
    squadAthletes,
  });

  const sortedStaffUsers = staffUsers
    .map(({ id, fullname }) => ({
      value: id,
      label: fullname,
    }))
    .sort((a, b) => {
      const lowercaseA = a.label.toLowerCase();
      const lowercaseB = b.label.toLowerCase();
      if (lowercaseA > lowercaseB) {
        return 1;
      }
      if (lowercaseA < lowercaseB) {
        return -1;
      }
      return 0;
    });

  const getInitialDataRequestStatus = () => {
    if (squadAthletesError || staffUsersError || medicalLocationsError) {
      return 'FAILURE';
    }
    if (
      isSquadAthletesLoading ||
      isStaffUsersLoading ||
      isMedicalLocationsLoading
    ) {
      return 'PENDING';
    }
    return null;
  };

  return (
    <AddTreatmentSidePanel
      {...props}
      initialDataRequestStatus={getInitialDataRequestStatus()}
      isOpen={isOpen}
      isAthleteSelectable={isAthleteSelectable}
      isDuplicatingTreatment={isDuplicatingTreatment}
      duplicateTreatment={duplicateTreatment}
      staffUsers={sortedStaffUsers}
      squadAthletes={athletesSelectOptions}
      medicalLocations={medicalLocations?.organisation_locations?.map(
        (location) => ({
          label: location.name,
          value: location.id,
        })
      )}
      onClose={() => dispatch(closeAddTreatmentsSidePanel())}
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
      onSaveTreatment={() => {
        dispatch(closeAddTreatmentsSidePanel());
        props.onSaveTreatment?.();
      }}
    />
  );
};

export default AddTreatmentsSidePanelContainer;
