import { useSelector, useDispatch } from 'react-redux';
import { RPECollectionFormTranslated as RPECollectionForm } from '../components/RPECollectionForm';
import {
  updateRpeCollectionAthlete,
  updateRpeCollectionKiosk,
  updateMassInput,
} from '../redux/actions/participantForm';

export default () => {
  const dispatch = useDispatch();
  const event = useSelector((state) => state.participantForm.event);

  return (
    <RPECollectionForm
      event={event}
      onRpeCollectionAthleteChange={(rpeCollectionAthlete) => {
        dispatch(updateRpeCollectionAthlete(rpeCollectionAthlete));
      }}
      onRpeCollectionKioskChange={(rpeCollectionKiosk) => {
        dispatch(updateRpeCollectionKiosk(rpeCollectionKiosk));
      }}
      onMassInputChange={(massInput) => {
        dispatch(updateMassInput(massInput));
      }}
    />
  );
};
