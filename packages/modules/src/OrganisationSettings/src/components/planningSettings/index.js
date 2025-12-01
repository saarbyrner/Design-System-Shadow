// @flow
import { AppStatus } from '@kitman/components';
import getActivityTypeCategories from '@kitman/services/src/services/getActivityTypeCategories';
import getIsActivityTypeCategoriesEnabled from '@kitman/services/src/services/getIsActivityTypeCategoriesEnabled';
import type { ActivityTypeCategories } from '@kitman/services/src/services/getActivityTypeCategories';
import { useState, useEffect } from 'react';
import { PlanningSettingsHeaderTranslated as PlanningSettingsHeader } from './PlanningSettingsHeader';
import Principles from './principles';
import DevelopmentGoalType from './developmentGoalType';
import DevelopmentGoalCompletionType from './developmentGoalCompletionType';
import ActivityType from './activityType';
import DrillLabels from './drillLabels';
import useSquads from './hooks/useSquads';
import styles from './styles/sections';

type Props = {
  hasDevelopmentGoalsModule: boolean,
  areCoachingPrinciplesEnabled: boolean,
};

const PlanningSettings = (props: Props) => {
  const { requestStatus: squadsRequestStatus, squads } = useSquads();

  const [activityCategoryEnabled, setActivityCategoryEnabled] = useState(false);
  const [activityTypeCategories, setActivityTypeCategories] =
    useState<ActivityTypeCategories>([]);

  useEffect(() => {
    getIsActivityTypeCategoriesEnabled().then(({ value }) => {
      setActivityCategoryEnabled(value);
    });
  }, []);

  useEffect(() => {
    if (activityCategoryEnabled) {
      getActivityTypeCategories().then((activities) => {
        setActivityTypeCategories(activities);
      });
    }
  }, [activityCategoryEnabled]);

  const isDevelopmentGoalEnabled = props.hasDevelopmentGoalsModule;

  if (squadsRequestStatus === 'FAILURE') {
    return <AppStatus status="error" />;
  }

  return (
    <div className="organisationPlanningSettings">
      <PlanningSettingsHeader />
      <div css={styles.sections}>
        {props.areCoachingPrinciplesEnabled && <Principles squads={squads} />}
        {isDevelopmentGoalEnabled && (
          <>
            <DevelopmentGoalType squads={squads} />
            <DevelopmentGoalCompletionType />
          </>
        )}
        <ActivityType
          activityTypeCategoriesEnabled={activityCategoryEnabled}
          activityTypeCategories={activityTypeCategories}
          squads={squads}
        />
        <DrillLabels squads={squads} />
      </div>
    </div>
  );
};

export default PlanningSettings;
