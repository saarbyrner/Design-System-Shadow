// @flow
import { useMemo } from 'react';
import type { OrganisationTrainingVariables } from '../types/Workload';

/* custom hook to get the scoreDropdownItems by receiving as params
 the organisationTrainingVariables and the trainingVariableId */

const buildScoreDropdownItems = (organisationTrainingVariable) => {
  if (!organisationTrainingVariable) {
    return [];
  }

  const scoreDropdownItems = [];
  // toFixed(2) is used to avoid floating point issues (e.g. 0.1 + 0.2 !== 0.3)
  for (
    let i = organisationTrainingVariable.training_variable.min;
    i <= organisationTrainingVariable.training_variable.max;
    i = parseFloat(
      (i + parseFloat(organisationTrainingVariable.scale_increment)).toFixed(2)
    )
  ) {
    scoreDropdownItems.push({ id: i, name: i.toString() });
  }
  return scoreDropdownItems;
};

const useScoreDropdown = (
  organisationTrainingVariables: Array<OrganisationTrainingVariables>,
  trainingVariableId: ?number
) => {
  const scoreDropdownItems = useMemo(() => {
    const selectedOrganisationTrainingVariable =
      organisationTrainingVariables.find(
        (organisationTrainingVariable) =>
          organisationTrainingVariable.training_variable.id ===
          trainingVariableId
      );
    return buildScoreDropdownItems(selectedOrganisationTrainingVariable);
  }, [trainingVariableId]);

  return scoreDropdownItems;
};

export default useScoreDropdown;
