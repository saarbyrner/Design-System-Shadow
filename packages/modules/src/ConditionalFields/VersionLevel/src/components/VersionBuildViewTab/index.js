// @flow
import { useDispatch, useSelector } from 'react-redux';
import _cloneDeep from 'lodash/cloneDeep';

import { AppStatus, LoadingSpinner } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';

import {
  onSetAllConditions,
  onSetActiveCondition,
} from '@kitman/modules/src/ConditionalFields/shared/redux/slices/conditionBuildViewSlice';
import {
  selectRequestStatus,
  selectAllConditions,
} from '@kitman/modules/src/ConditionalFields/shared/redux/selectors/conditionBuildView';
import {
  blankConditionGenerator,
  transformConditionResponseToClientState,
} from '@kitman/modules/src/ConditionalFields/shared/utils';
import type {
  ActiveCondition as ActiveConditionType,
  Version,
  RequiredFieldsAndValues,
} from '@kitman/modules/src/ConditionalFields/shared/types';

import { ActiveConditionComponentTranslated as ActiveCondition } from '../ActiveCondition';
import ConditionsList from '../ConditionsList';
import styles from './styles';

type Props = {
  version: Version,
  requiredFieldsAndValues: RequiredFieldsAndValues,
  setRequiredFieldsAndValues: (
    value:
      | RequiredFieldsAndValues
      | ((prev: RequiredFieldsAndValues) => RequiredFieldsAndValues)
  ) => void,
};

const VersionBuildViewTab = ({
  version,
  requiredFieldsAndValues,
  setRequiredFieldsAndValues,
}: Props) => {
  const dispatch = useDispatch();

  const requestStatus = useSelector(selectRequestStatus);
  const allConditions: Array<ActiveConditionType> =
    useSelector(selectAllConditions);

  const figureAllConditionsLogic = () => {
    // only want to set the conditions off the version on first load
    // otherwise we lose any unsaved changes——break early!
    if (allConditions.length > version?.conditions?.length) {
      return;
    }

    // set the conditions in state if they exist on the version
    // if there are more conditions on version than local state
    // then we know a new condition was just created
    if (version?.conditions?.length > allConditions.length) {
      // Since Response and Request DS are not the same shape,
      // must run a transform function for now
      const copyOfResponseConditions = _cloneDeep(version.conditions);
      const transformedConditions = transformConditionResponseToClientState(
        copyOfResponseConditions
      );

      dispatch(
        onSetAllConditions({
          conditions: transformedConditions,
        })
      );
      dispatch(
        onSetActiveCondition({
          // ensure activeCondition has an index and we know this one is zero
          activeCondition: { ...transformedConditions[0], index: 0 },
        })
      );
    }

    // if both the version conditions and local conditions are empty
    // that means this is a brand new ruleset version
    if (version?.conditions.length === 0 && allConditions.length === 0) {
      // preload state with a single blank condition if none exist on version
      const preloadedNewConditionsArray = [blankConditionGenerator()];
      dispatch(onSetAllConditions({ conditions: preloadedNewConditionsArray }));
      dispatch(
        onSetActiveCondition({
          activeCondition: preloadedNewConditionsArray[0],
        })
      );
    }
  };
  const renderContent = () => {
    figureAllConditionsLogic();
    if (requestStatus === 'ERROR') {
      return <AppStatus status="error" isEmbed />;
    }
    if (requestStatus === 'LOADING') {
      return (
        <div css={styles.loaderWrapper}>
          <LoadingSpinner size={88} color={colors.grey_400} />
        </div>
      );
    }

    return (
      <div css={styles.contentContainer}>
        <div css={styles.left}>
          <ConditionsList
            allConditions={allConditions}
            isPublished={!!version?.published_at}
          />
        </div>
        <div css={styles.right}>
          <ActiveCondition
            isPublished={!!version?.published_at}
            requiredFieldsAndValues={requiredFieldsAndValues}
            setRequiredFieldsAndValues={setRequiredFieldsAndValues}
          />
        </div>
      </div>
    );
  };

  return renderContent();
};

export default VersionBuildViewTab;
