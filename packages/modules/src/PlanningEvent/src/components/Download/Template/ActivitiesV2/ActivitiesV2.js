// @flow
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { PlanningTabActivity } from '@kitman/modules/src/PlanningEvent/src/components/PlanningTabActivity/PlanningTabActivity';
import type {
  EventActivityV2,
  SportType,
} from '@kitman/common/src/types/Event';

import style from './style';

type ActivitiesV2Props = {
  activities: Array<EventActivityV2>,
  templateType: 'default' | 'stacked',
  areParticipantsDisplayed: boolean,
  areNotesDisplayed: boolean,
  areCoachingPrinciplesEnabled: boolean,
  organisationSport: SportType,
};

const ActivitiesV2 = (props: I18nProps<ActivitiesV2Props>): any => {
  const isStacked = props.templateType === 'stacked';
  return (
    <div css={isStacked && style.stackedActivities}>
      {props.activities.map((activity, i) => (
        <div key={activity.id} css={isStacked && style.stackedActivity}>
          <PlanningTabActivity
            activityIndex={i}
            activity={activity}
            isInPrintView
            isInStackView={isStacked}
            areParticipantsDisplayed={props.areParticipantsDisplayed}
            areNotesDisplayed={props.areNotesDisplayed}
            areCoachingPrinciplesEnabled={props.areCoachingPrinciplesEnabled}
            organisationSport={props.organisationSport}
            t={props.t}
          />
        </div>
      ))}
    </div>
  );
};

export const ActivitiesV2Translated = withNamespaces()(ActivitiesV2);
export default ActivitiesV2;
