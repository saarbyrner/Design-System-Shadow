// @flow
import type { Athlete } from '@kitman/common/src/types/Athlete';
import type { QuestionnaireVariable } from '@kitman/common/src/types';
import { MultipleCheckboxChecker } from '@kitman/components';

type Props = {
  variables: Array<QuestionnaireVariable>,
  variableWidth: number,
  groupedAthletes: { [string]: Array<Athlete> },
  checkedVariables: { [number]: { [string]: boolean } },
  toggleAllAthletes: Function,
};

const Header = (props: Props) => {
  const minimumNumberOfCells = 6;
  const dummyVariablesCount = minimumNumberOfCells - props.variables.length;
  const groupHeadings = props.groupedAthletes
    ? Object.keys(props.groupedAthletes)
    : [];

  const getCheckboxType = (variableId: string) => {
    // We want to change the variable only for the athletes currently visible.
    const visibleAthleteIds = [];
    groupHeadings.forEach((group) => {
      props.groupedAthletes[group].forEach((athlete) => {
        visibleAthleteIds.push(athlete.id);
      });
    });

    // Collect athlete ids that has this variable checked.
    const athleteIdsWithThisVar = [];
    visibleAthleteIds.forEach((athleteId) => {
      const variableIndex = props.checkedVariables[athleteId][variableId];
      if (variableIndex === true) {
        athleteIdsWithThisVar.push(athleteId);
      }
    });

    /*
     * If the all the vars are checked, CheckboxType = "ALL_CHECKED" (tick icon)
     * If some of the vars are checked, CheckboxType = "PARTIALLY_CHECKED" (minus icon)
     * Else CheckboxType = "EMPTY" (no icon)
     */
    if (visibleAthleteIds.length === athleteIdsWithThisVar.length) {
      return 'ALL_CHECKED';
    }

    if (athleteIdsWithThisVar.length > 0) {
      return 'PARTIALLY_CHECKED';
    }
    return 'EMPTY';
  };

  const getEmptyCells = (amount: number, cellClassName: string) => {
    const emptyCells = [];
    if (amount === 0) {
      return [];
    }

    for (let i = 0; i < amount; i++) {
      emptyCells.push(<div key={i} className={cellClassName} />);
    }
    return emptyCells;
  };

  const renderVariables = () => {
    if (props.variables.length === 0) {
      return (
        <div className="tableHeadMessage">
          <span className="tableHeadMessage__text">
            There are no variables defined for this Organisation.
          </span>
        </div>
      );
    }

    let variablesHtml = props.variables.map((variable) => {
      const checkboxType = getCheckboxType(variable.id.toString());
      return (
        <div
          key={`${variable.id}_${variable.key}`}
          className="variableHeader__variable"
          style={{ width: props.variableWidth }}
        >
          <div className="variableHeader__variableInner">
            <span>{variable.name}</span>
            <MultipleCheckboxChecker
              type={checkboxType}
              onClick={() => {
                props.toggleAllAthletes(variable.id);
              }}
            />
          </div>
        </div>
      );
    });

    // if we have less than the minimum cells, we need to populate the variables header
    // with blank ones
    const emptyVariables = getEmptyCells(
      dummyVariablesCount,
      'variableHeader__variable'
    );
    variablesHtml = variablesHtml.concat(emptyVariables);

    return variablesHtml;
  };

  return (
    <div className="variableHeader">
      <div className="variableHeader__athleteTitle" />
      <div className="variableHeader__variablesContainer js-scrollableTable__header">
        {renderVariables()}
      </div>
    </div>
  );
};

export default Header;
