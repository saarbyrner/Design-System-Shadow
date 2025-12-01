// @flow
import { colors } from '@kitman/common/src/variables';
import { type EventDevelopmentGoalItem } from '@kitman/modules/src/PlanningHub/src/services/getEventDevelopmentGoals';
import { type DevelopmentGoalCompletionType } from '@kitman/modules/src/PlanningHub/src/services/getDevelopmentGoalCompletionTypes';
import { type Event } from '@kitman/common/src/types/Event';

import { DevelopmentGoalCompletionActionsTranslated as DevelopmentGoalCompletionActions } from './DevelopmentGoalCompletionActions';
import DevelopmentGoalRow from './DevelopmentGoalRow';

type AthleteSettings = {
  avatarUrl: string,
  name: string,
  position: string,
};

type Props = {
  event: Event,
  isLoading: boolean,
  athleteSettings: AthleteSettings,
  athleteEventId: number,
  withCompletionTypes: boolean,
  withUnarchiveCompletionType: boolean,
  eventDevelopmentGoalItems: Array<EventDevelopmentGoalItem>,
  developmentGoalCompletionTypes: Array<DevelopmentGoalCompletionType>,

  onSelectAthleteGoals: (
    athleteEventId: number,
    completionTypeId: ?number | string
  ) => void,
  onUnselectAthleteGoals: (athleteEventId: number) => void,
  onSelectGoal: Function,
  onUnselectGoal: Function,
  areCoachingPrinciplesEnabled: boolean,
};

const AthleteDevelopmentGoals = (props: Props) => {
  const style = {
    wrapper: {
      paddingTop: '6px',
      header: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
        padding: '0 10px 0 16px',
      },
    },
    athlete: {
      display: 'inline-grid',
      gridTemplateColumns: 'auto auto',
      img: {
        borderRadius: '50%',
        height: '40px',
        width: '40px',
        '& + div': {
          marginLeft: '8px',
          h4: {
            fontSize: '14px',
            fontWeight: 'normal',
            margin: '2px 0 4px',
          },
          h5: {
            color: colors.grey_100,
            fontSize: '12px',
            fontWeight: 'normal',
            margin: 0,
          },
        },
      },
    },
  };

  return (
    <div className="athleteDevelopmentGoals" css={style.wrapper}>
      <header>
        <div css={style.athlete}>
          <img
            className="athleteDevelopmentGoals__athleteAvatar"
            src={props.athleteSettings.avatarUrl}
            alt="Athlete avatar"
          />
          <div>
            <h4 className="athleteDevelopmentGoals__athleteName kitmanHeading--L4">
              {props.athleteSettings.name}
            </h4>
            <h5 className="athleteDevelopmentGoals__athletePosition">
              {props.athleteSettings.position}
            </h5>
          </div>
        </div>
        <div className="athleteDevelopmentGoals__bulkAction">
          <DevelopmentGoalCompletionActions
            // $FlowIgnore[incompatible-type] the type is correct here.
            event={props.event}
            withCompletionTypes={props.withCompletionTypes}
            developmentGoalCompletionTypes={
              props.developmentGoalCompletionTypes
            }
            onSelect={(completionId: ?number | string) =>
              props.onSelectAthleteGoals(props.athleteEventId, completionId)
            }
            onClear={() => props.onUnselectAthleteGoals(props.athleteEventId)}
          />
        </div>
      </header>
      {props.eventDevelopmentGoalItems.map((eventDevelopmentGoalItem) => (
        <DevelopmentGoalRow
          // $FlowIgnore[incompatible-type] the type is correct here.
          event={props.event}
          key={eventDevelopmentGoalItem.development_goal.id}
          withUnarchiveCompletionType={props.withUnarchiveCompletionType}
          eventDevelopmentGoalItem={eventDevelopmentGoalItem}
          developmentGoalCompletionTypes={props.developmentGoalCompletionTypes}
          onSelectGoal={props.onSelectGoal}
          onUnselectGoal={props.onUnselectGoal}
          isLoading={props.isLoading}
          areCoachingPrinciplesEnabled={props.areCoachingPrinciplesEnabled}
        />
      ))}
    </div>
  );
};

export default AthleteDevelopmentGoals;
