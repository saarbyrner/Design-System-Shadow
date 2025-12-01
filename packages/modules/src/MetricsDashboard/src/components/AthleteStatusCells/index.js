// @flow
import type { Athlete } from '@kitman/common/src/types/Athlete';
import type { GroupBy } from '@kitman/common/src/types';
import { getEmptyCells } from '@kitman/common/src/utils/dashboard';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import AthleteStatusCellContent from '../AthleteStatusCellContent';

type Props = {
  canViewGraph: boolean,
  groupedAthletes: { [GroupBy]: Array<Athlete> },
  orderedGroup: Array<GroupBy>,
  statuses: Object,
  dummyCellsNumber: number,
};

const AthleteStatusCells = (props: I18nProps<Props>) => {
  const getCellRows = (athlete: Athlete) =>
    props.statuses.ids.map((id, index) => {
      const statusValue = athlete.status_data[id]
        ? athlete.status_data[id].value
        : null;

      const datapointsUsed = athlete.status_data[id]
        ? athlete.status_data[id].data_points_used
        : 0;

      const alarms = athlete.status_data[id]
        ? athlete.status_data[id].alarms
        : [];

      // work around to ensure unique key because we don't return
      // a new status object on saving with a unique id - we just refresh the page
      const uniqueKey = `${index}_${id}`;

      return (
        <div key={uniqueKey} className="athleteStatusCells__cell">
          <AthleteStatusCellContent
            statusValue={statusValue}
            status={props.statuses.byId[id]}
            datapointsUsed={datapointsUsed}
            alarms={alarms}
            t={props.t}
            athleteId={athlete.id}
            canViewGraph={props.canViewGraph}
          />
        </div>
      );
    });

  const getAthleteStatuses = (group: GroupBy) =>
    props.groupedAthletes[group].map((athlete) => {
      let cellRow = getCellRows(athlete);

      // if we have less than the minimum cells, we need to populate the cells with blank ones
      const emptyCells = getEmptyCells(
        props.dummyCellsNumber,
        'athleteStatusCells__cell'
      );
      cellRow = cellRow.concat(emptyCells);

      return (
        <div key={athlete.id} className="athleteStatusCells__row">
          {cellRow}
        </div>
      );
    });

  const renderDataCells = () =>
    props.orderedGroup.map((group) => {
      if (
        props.groupedAthletes[group] === undefined ||
        props.groupedAthletes[group].length === 0
      ) {
        return null;
      }

      const athleteStatuses = getAthleteStatuses(group);

      const rowBreak =
        athleteStatuses.length > 0 ? (
          <div className="athleteStatusCells__break" />
        ) : null;

      return (
        <div key={group}>
          {rowBreak}
          {athleteStatuses}
        </div>
      );
    });

  return <div className="athleteStatusCells">{renderDataCells()}</div>;
};

export default AthleteStatusCells;
