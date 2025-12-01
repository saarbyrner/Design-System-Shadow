import { useDispatch } from 'react-redux';
import {
  addToast,
  updateToast,
  removeToast,
} from '@kitman/modules/src/Medical/shared/redux/actions';
import MedicationsTab from '../components/MedicationsTab';
import { openAddMedicationSidePanel } from '../redux/actions/index';

const MedicationsTabContainer = (props) => {
  const dispatch = useDispatch();

  return (
    <MedicationsTab
      {...props}
      onOpenDispenseMedicationsSidePanel={() => {
        dispatch(openAddMedicationSidePanel({ isAthleteSelectable: false }));
      }}
      onFavoriteMedicationStart={(medication) => {
        dispatch(
          addToast({
            title: `${props.t('Favoriting medication configuration...')}`,
            status: 'LOADING',
            id: medication.drug.id,
          })
        );
        setTimeout(() => dispatch(removeToast(medication.drug.id)), 2000);
      }}
      onFavoriteMedicationSuccess={(medication) => {
        dispatch(
          updateToast(medication.drug.id, {
            title: `${props.t(
              'Medication configuration favorited successfully'
            )}`,
            status: 'SUCCESS',
          })
        );
        setTimeout(() => dispatch(removeToast(medication.drug.id)), 3000);
      }}
      onFavoriteMedicationFailure={(medication) => {
        dispatch(
          updateToast(medication.drug.id, {
            title: `${props.t(
              'Medication configuration favorite failed to save'
            )}`,
            status: 'ERROR',
          })
        );
        setTimeout(() => dispatch(removeToast(medication.drug.id)), 3000);
      }}
    />
  );
};

export default MedicationsTabContainer;
