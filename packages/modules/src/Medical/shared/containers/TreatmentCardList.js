// @flow
import { useDispatch } from 'react-redux';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { TreatmentSession } from '../types';
import { TreatmentsCardListTranslated as TreatmentsCardList } from '../components/TreatmentsTab/components/TreatmentCardList';
import { initialiseEditTreatmentState } from '../redux/actions';

type Props = {
  isLoading: boolean,
  isReviewMode: boolean,
  onReachingEnd: Function,
  removeSelectedAthlete: Function,
  selectedAthletes: Array<number>,
  showAthleteInformation: boolean,
  staffUsers: Array<Option>,
  treatmentSessions: Array<TreatmentSession>,
};

const TreatmentsCardListContainer = (props: Props) => {
  const dispatch = useDispatch();
  return (
    <TreatmentsCardList
      {...props}
      initialiseState={(athleteIds, selectedTreatment) => {
        dispatch(initialiseEditTreatmentState(athleteIds, selectedTreatment));
      }}
    />
  );
};

export default TreatmentsCardListContainer;
