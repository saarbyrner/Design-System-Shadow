// @flow
import { AthleteSelector } from '@kitman/components';
import type { SquadAthletesSelection } from '@kitman/components/src/types';
import {
  useGetPermittedSquadsQuery,
  useGetSquadAthletesQuery,
} from '../redux/services/dashboard';

type Props = {
  label?: string,
  disabledSquadAthletes?: SquadAthletesSelection,
  selectedSquadAthletes: SquadAthletesSelection,
  onSelectSquadAthletes: Function,
  showDropdownButton: boolean,
  singleSelection?: boolean,
  onlyAthletes?: boolean,
};

export default (props: Props) => {
  const { data: squadAthletes, isFetching: isFetchingSquadAthletes } =
    useGetSquadAthletesQuery();
  const { data: squads, isFetching: isFetchingSquads } =
    useGetPermittedSquadsQuery();

  return (
    <AthleteSelector
      label={props.label}
      isFetchingSquadAthletes={isFetchingSquadAthletes}
      isFetchingSquads={isFetchingSquads}
      squadAthletes={squadAthletes || { position_groups: [] }}
      squads={squads || []}
      selectedSquadAthletes={props.selectedSquadAthletes}
      disabledSquadAthletes={props.disabledSquadAthletes}
      onSelectSquadAthletes={props.onSelectSquadAthletes}
      showDropdownButton={props.showDropdownButton}
      singleSelection={props.singleSelection}
      onlyAthletes={props.onlyAthletes}
    />
  );
};
