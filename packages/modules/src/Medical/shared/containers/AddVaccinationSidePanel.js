import { useSelector, useDispatch } from 'react-redux';

import {
  closeAddVaccinationSidePanel,
  addToast,
  updateToast,
  removeToast,
} from '../redux/actions';
import { AddVaccinationSidePanelTranslated as AddVaccinationSidePanel } from '../components/AddVaccinationSidePanel';
import { useGetSquadAthletesQuery } from '../redux/services/medical';
import useSquadAthletesSelectOptions from '../hooks/useSquadAthletesSelectOptions';

const AddVaccinationSidePanelContainer = (props) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.addVaccinationSidePanel.isOpen);
  const isAthleteSelectable = useSelector(
    (state) => state.addVaccinationSidePanel.initialInfo.isAthleteSelectable
  );

  const {
    data: squadAthletes = { squads: [] },
    error: squadAthletesError,
    isLoading: isSquadAthletesLoading,
  } = useGetSquadAthletesQuery(
    { athleteList: true }, // Can use minimal athlete data
    { skip: !isOpen }
  );

  const athletesSelectOptions = useSquadAthletesSelectOptions({
    isAthleteSelectable,
    squadAthletes,
  });

  const getInitialDataRequestStatus = () => {
    if (squadAthletesError) {
      return 'FAILURE';
    }
    if (isSquadAthletesLoading) {
      return 'PENDING';
    }
    return 'SUCCESS';
  };

  return (
    <AddVaccinationSidePanel
      {...props}
      athleteId={props.athleteId}
      isOpen={isOpen}
      isAthleteSelectable={isAthleteSelectable}
      squadAthletes={athletesSelectOptions}
      initialDataRequestStatus={getInitialDataRequestStatus()}
      onClose={() => dispatch(closeAddVaccinationSidePanel())}
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
    />
  );
};

export default AddVaccinationSidePanelContainer;
