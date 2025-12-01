// @flow
import { Select } from '@kitman/components';
import useScoreDropdown from '@kitman/common/src/hooks/useScoreDropdown';
import type { OrganisationTrainingVariables } from '@kitman/common/src/types/Workload';

type Props = {
  organisationTrainingVariables: Array<OrganisationTrainingVariables>,
  trainingVariableId: number,
  score: ?number,
  className: string,
  onChangeScore: Function,
  appendToBody?: boolean,
  menuPlacement?: 'auto' | 'bottom' | 'top',
};

const EditableScore = (props: Props) => {
  const scoreItems = useScoreDropdown(
    props.organisationTrainingVariables,
    props.trainingVariableId
  );
  const scoreItemsForSelect = scoreItems.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  return (
    <div className={props.className}>
      <Select
        options={scoreItemsForSelect}
        value={props.score}
        onChange={(value) => {
          props.onChangeScore(value);
        }}
        appendToBody={props.appendToBody || false}
        menuPlacement={props.menuPlacement}
        allowClearAll
        isClearable
        onClear={() => {
          props.onChangeScore(null);
        }}
      />
    </div>
  );
};

export default EditableScore;
