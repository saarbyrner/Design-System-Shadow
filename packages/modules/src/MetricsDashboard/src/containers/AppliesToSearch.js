import { connect } from 'react-redux';
import { SquadSearch as SquadSearchComponent } from '@kitman/components';
import {
  flattenSquadSearchItems,
  flattenSelectedItems,
  formatSelectedItems,
} from '@kitman/components/src/SquadSearch/utils';
import { applyTo } from '../actions';

const getMissingAthletes = (athletes) =>
  athletes.filter((athlete) => !athlete.on_dashboard);

const getMissingAthleteIds = (athletes) =>
  athletes.map((athlete) => athlete.id);

const mapStateToProps = (state, ownProps) => {
  const alarm = state.alarmDefinitionsForStatus.alarms[ownProps.position] || {
    positions: [],
    position_groups: [],
    athletes: [],
    applies_to_squad: false,
  };
  const missingAthletes = getMissingAthletes(alarm.athletes);

  return {
    exclusive: true,
    items: flattenSquadSearchItems(
      state.alarmSquadSearch.athletes,
      state.alarmSquadSearch.athleteOrder,
      state.alarmSquadSearch.positions,
      state.alarmSquadSearch.positionOrder,
      state.alarmSquadSearch.positionGroups,
      state.alarmSquadSearch.positionGroupOrder,
      missingAthletes
    ),
    selectedItems:
      flattenSelectedItems(
        alarm.athletes,
        alarm.positions,
        alarm.position_groups,
        alarm.applies_to_squad
      ) || [],
    missingAthletes: getMissingAthleteIds(missingAthletes) || [],
    unique_key:
      state.alarmDefinitionsForStatus.alarms[ownProps.position].alarm_id,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onChange: (selectedItems) => {
    const formattedSelectedItems = formatSelectedItems(selectedItems);
    dispatch(applyTo(ownProps.position, formattedSelectedItems));
  },
});

const AppliesToSearch = connect(
  mapStateToProps,
  mapDispatchToProps
)(SquadSearchComponent);

export default AppliesToSearch;
