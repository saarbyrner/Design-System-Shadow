// @flow
import type { Athlete } from '@kitman/common/src/types/Athlete';
import type { QuestionnaireVariable } from '@kitman/common/src/types';
import Checkbox from '../../containers/Checkbox';

type Props = {
  groupedAthletes: { [string]: Array<Athlete> },
  variables: Array<QuestionnaireVariable>,
  cellWidth: number,
};

const CheckboxCells = (props: Props) => {
  const groupHeadings = props.groupedAthletes
    ? Object.keys(props.groupedAthletes)
    : [];

  // Loops on the variables to build each cell
  const buildCells = (athleteId) => {
    const cells = [];

    props.variables.forEach((variable) => {
      cells.push(
        <div
          key={variable.id}
          className="questionnaireManagerCheckboxCells__cell"
          style={{ width: props.cellWidth }}
        >
          <Checkbox athleteId={athleteId} currentVariableId={variable.id} />
        </div>
      );
    });

    return cells;
  };

  // Loops on the grouped athletes to build each row
  const buildRows = (heading) =>
    props.groupedAthletes[heading].map((athlete) => {
      const cells = buildCells(athlete.id);

      return (
        <div
          key={athlete.id}
          className="questionnaireManagerCheckboxCells__row"
        >
          {cells}
        </div>
      );
    });

  // Loops on the groups of athletes to build each section
  const buildAthleteGroups = () =>
    groupHeadings.map((heading) => {
      if (props.groupedAthletes[heading].length === 0) {
        return null;
      }
      const rows = buildRows(heading);
      return (
        <div key={heading}>
          <div className="questionnaireManagerCheckboxCells__break" />
          {rows}
        </div>
      );
    });

  const statusCells = buildAthleteGroups();

  return <div className="questionnaireManagerCheckboxCells">{statusCells}</div>;
};

export default CheckboxCells;
