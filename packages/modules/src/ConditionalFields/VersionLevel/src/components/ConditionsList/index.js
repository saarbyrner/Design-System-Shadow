// @flow
import { Fragment } from 'react';

import { ConditionCardComponentTranslated as ConditionCardComponent } from '../ConditionCard';
import { ConditionsListHeaderComponentTranslated as ConditionsListHeader } from '../ConditionsListHeader';

import type { ActiveCondition } from '../../../../shared/types';

type Props = {
  allConditions: Array<ActiveCondition>,
  isPublished: boolean,
};
const ConditionsListComponent = (props: Props) => {
  return (
    <div>
      <ConditionsListHeader {...props} />

      {props.allConditions?.length &&
        props.allConditions.map((condition, index) => {
          return (
            <Fragment key={condition.id}>
              <ConditionCardComponent
                condition={condition}
                index={index}
                isPublished={props.isPublished}
              />
            </Fragment>
          );
        })}
    </div>
  );
};

export default ConditionsListComponent;
