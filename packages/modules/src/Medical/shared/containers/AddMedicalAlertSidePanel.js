import { useSelector, useDispatch } from 'react-redux';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import {
  addToast,
  updateToast,
  removeToast,
  closeAddMedicalAlertSidePanel,
} from '../redux/actions';
import { AddMedicalAlertSidePanelTranslated as AddMedicalAlertSidePanel } from '../components/AddMedicalAlertSidePanel';
import {
  useGetMedicalAlertsQuery,
  useGetSquadAthletesQuery,
} from '../redux/services/medical';
import useSquadAthletesSelectOptions from '../hooks/useSquadAthletesSelectOptions';

const AddMedicalAlertSidePanelContainer = (props) => {
  const dispatch = useDispatch();
  const { permissions } = usePermissions();
  const isOpen = useSelector((state) => state.addMedicalAlertSidePanel.isOpen);
  const isAthleteSelectable = useSelector(
    (state) => state.addMedicalAlertSidePanel.initialInfo.isAthleteSelectable
  );
  const selectedMedicalAlert = useSelector(
    (state) => state.addMedicalAlertSidePanel.selectedMedicalAlert
  );

  const {
    data: squadAthletes = { squads: [] },
    error: squadAthletesError,
    isLoading: isSquadAthletesLoading,
  } = useGetSquadAthletesQuery(
    { athleteList: true }, // Can use minimal athlete data
    { skip: !isOpen }
  );

  const {
    data: medicalAlerts = [],
    error: medicalAlertsError,
    isLoading: isMedicalAlertsLoading,
  } = useGetMedicalAlertsQuery(true, {
    skip: !isOpen || !permissions.medical.alerts.canView,
  });

  const athletesSelectOptions = useSquadAthletesSelectOptions({
    isAthleteSelectable,
    squadAthletes,
  });

  const getInitialDataRequestStatus = () => {
    if (squadAthletesError || medicalAlertsError) {
      return 'FAILURE';
    }
    if (isSquadAthletesLoading || isMedicalAlertsLoading) {
      return 'PENDING';
    }
    return 'SUCCESS';
  };

  return (
    <AddMedicalAlertSidePanel
      {...props}
      isOpen={isOpen}
      isAthleteSelectable={isAthleteSelectable}
      squadAthletes={athletesSelectOptions}
      selectedMedicalAlert={selectedMedicalAlert || null}
      medicalAlerts={medicalAlerts?.map((medicalAlert) => ({
        value: medicalAlert.id,
        label: medicalAlert.name,
      }))}
      initialDataRequestStatus={getInitialDataRequestStatus()}
      onSaveMedicalAlertStart={(alertId) => {
        dispatch(
          addToast({
            title: `${
              selectedMedicalAlert ? 'Updating' : 'Adding'
            } medical alert..`,
            status: 'LOADING',
            id: alertId,
          })
        );
        setTimeout(() => dispatch(removeToast(alertId)), 2000);
      }}
      onSaveMedicalAlertSuccess={(alertId) => {
        dispatch(
          updateToast(alertId, {
            title: `Medical alert ${
              selectedMedicalAlert ? 'updated' : 'added'
            } successfully`,
            status: 'SUCCESS',
          })
        );
        setTimeout(() => dispatch(removeToast(alertId)), 3000);
      }}
      onClose={() => dispatch(closeAddMedicalAlertSidePanel())}
    />
  );
};

export default AddMedicalAlertSidePanelContainer;
