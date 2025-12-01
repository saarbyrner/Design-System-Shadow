// @flow

import intersection from 'lodash/intersection';
import { withNamespaces } from 'react-i18next';
import type { Athlete } from '@kitman/common/src/types/Athlete';
import type { QuestionnaireVariable } from '@kitman/common/src/types';
import { MultipleCheckboxChecker } from '@kitman/components';
import {
  convertQuestionnaireVariablesToIdArray,
  variablesHashToArray,
} from '../../utils';

type Props = {
  groupedAthletes: { [string]: Array<Athlete> },
  toggleAllVariables: Function,
  variables: Array<QuestionnaireVariable>,
  checkedVariables: { [number]: { [string]: boolean } },
  groupingLabels: { [string]: string },
};

const Sidebar = ({
  groupedAthletes,
  variables,
  toggleAllVariables,
  checkedVariables,
  groupingLabels,
}: Props) => {
  const groupHeadings = groupedAthletes ? Object.keys(groupedAthletes) : [];

  const getCheckboxType = (athleteId) => {
    /*
     * Convert variables to an array of IDs to facilitate
     * the intersection with the checked Variables
     */
    const questionnaireVariablesArr =
      convertQuestionnaireVariablesToIdArray(variables);

    // Intersection between the checked Variables and the visible variables
    // Intersection between the checked Variables and the visible variables
    const checkedVisibleVariables = intersection(
      questionnaireVariablesArr,
      variablesHashToArray(checkedVariables[athleteId])
    );

    /*
     * If the all the vars are checked, CheckboxType = "ALL_CHECKED" (tick icon)
     * If some of the vars are checked, CheckboxType = "PARTIALLY_CHECKED" (minus icon)
     * Else CheckboxType = "EMPTY" (no icon)
     */
    if (checkedVisibleVariables.length === questionnaireVariablesArr.length) {
      return 'ALL_CHECKED';
    }

    if (checkedVisibleVariables.length > 0) {
      return 'PARTIALLY_CHECKED';
    }
    return 'EMPTY';
  };

  const statusClass = (availability) =>
    `km-availability-triangle km-availability-${availability}`;

  const sidebarContent = groupHeadings.map((heading) => {
    if (groupedAthletes[heading].length === 0) {
      return null;
    }

    const athletes = groupedAthletes[heading].map((athlete) => {
      const checkboxType = getCheckboxType(athlete.id);
      return (
        <div key={athlete.id} className="questionnaireManagerSidebar__athlete">
          <span className={statusClass(athlete.availability)} />
          <div className="questionnaireManagerSidebar__checkboxContainer">
            <MultipleCheckboxChecker
              type={checkboxType}
              onClick={() => {
                toggleAllVariables(athlete.id, variables);
              }}
            />
          </div>
          <span className="questionnaireManagerSidebar__athleteName">
            {athlete.fullname}
          </span>
        </div>
      );
    });

    const headingLabel = groupingLabels[heading]
      ? groupingLabels[heading]
      : heading;
    return (
      <div key={heading} className="questionnaireManagerSidebar__section">
        <div className="questionnaireManagerSidebar__heading">
          {headingLabel}
        </div>
        {athletes}
      </div>
    );
  });

  return <div className="questionnaireManagerSidebar">{sidebarContent}</div>;
};

export const SidebarTranslated = withNamespaces()(Sidebar);
export default Sidebar;
