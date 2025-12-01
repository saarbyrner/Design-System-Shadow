// @flow
import { getSelectedItems } from '@kitman/components/src/AthleteSelector/utils';
import PivotDashboardButton from '../components/PivotDashboardButton';
import {
  useGetPermittedSquadsQuery,
  useGetSquadAthletesQuery,
} from '../redux/services/dashboard';

type Props = {
  onClick?: Function,
  datesText: string,
  defaultText: string,
  id?: ?string,
  isDisabled?: boolean,
  pivotedAthletes: Object,
};

export default (props: Props) => {
  const { data: squadAthletes = { position_groups: [] } } =
    useGetSquadAthletesQuery();
  const { data: squads } = useGetPermittedSquadsQuery();

  return (
    <PivotDashboardButton
      athletesText={getSelectedItems(
        props.pivotedAthletes,
        squadAthletes,
        squads
      )}
      onClick={props.onClick}
      datesText={props.datesText}
      defaultText={props.defaultText}
      id={props.id}
      isDisabled={props.isDisabled}
    />
  );
};
