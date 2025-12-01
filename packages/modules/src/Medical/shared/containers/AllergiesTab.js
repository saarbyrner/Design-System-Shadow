import { useDispatch } from 'react-redux';
import { AllergiesTabTranslated as AllergiesTab } from '../components/AllergiesTab';
import {
  openAddAllergySidePanel,
  openAddMedicalAlertSidePanel,
} from '../redux/actions/index';

const AllergiesTabContainer = (props) => {
  const dispatch = useDispatch();
  return (
    <AllergiesTab
      {...props}
      initialDataRequestStatus={null}
      openAddAllergySidePanel={({
        isAthleteSelectable,
        medicalFlag: selectedAllergy,
      }) => {
        dispatch(
          openAddAllergySidePanel({
            isAthleteSelectable,
            selectedAllergy,
          })
        );
      }}
      openAddMedicalAlertSidePanel={({
        isAthleteSelectable,
        medicalFlag: selectedMedicalAlert,
      }) => {
        dispatch(
          openAddMedicalAlertSidePanel({
            isAthleteSelectable,
            selectedMedicalAlert,
          })
        );
      }}
    />
  );
};

export default AllergiesTabContainer;
