import { useSelector, useDispatch } from 'react-redux';
import { AthletesListTranslated as AthletesList } from '../components/listView/AthletesList';
import { fetchAssessments, selectAthlete } from '../redux/actions';

export default () => {
  const dispatch = useDispatch();
  const athletes = useSelector((state) => state.athletes);

  return (
    <AthletesList
      athletes={athletes}
      onSelectAthleteId={(athleteId) => {
        dispatch(selectAthlete(athleteId));
        dispatch(
          fetchAssessments({
            listView: true,
            athleteIds: [athleteId],
            reset: true,
          })
        );
      }}
    />
  );
};
