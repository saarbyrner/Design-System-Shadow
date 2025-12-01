// @flow
import { useMemo } from 'react';

import { colors, breakPoints } from '@kitman/common/src/variables';
import { ActionCheckbox, TextTag } from '@kitman/components';
import type { EventDevelopmentGoalItem } from '@kitman/modules/src/PlanningHub/src/services/getEventDevelopmentGoals';
import type { DevelopmentGoalCompletionType } from '@kitman/modules/src/PlanningHub/src/services/getDevelopmentGoalCompletionTypes';
import { getPrincipleNameWithItems } from '@kitman/common/src/utils/planningEvent';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { getHumanReadableEventType } from '@kitman/common/src/utils/events';
import { type Event } from '@kitman/common/src/types/Event';

import type { CompletionStatus } from '.';

type Props = {
  event: Event,
  isLoading: boolean,
  withUnarchiveCompletionType: boolean,
  eventDevelopmentGoalItem: EventDevelopmentGoalItem,
  developmentGoalCompletionTypes: Array<DevelopmentGoalCompletionType>,
  onSelectGoal: (
    developmentGoalId: number,
    completionTypeId: ?number | string
  ) => void,
  onUnselectGoal: (developmentGoalId: number) => void,
  areCoachingPrinciplesEnabled: boolean,
};

const style = {
  wrapper: {
    background: colors.p06,
    display: 'grid',
    gridGap: '30px',
    gridTemplateColumns: '2fr 1fr 1fr',
    marginBottom: '1px',
    padding: '16px 12px 16px 16px',
    overflowX: 'auto',
    [`@media only screen and (max-width: ${breakPoints.desktop})`]: {
      gridTemplateColumns: 'minmax(320px, 1fr) auto',
    },
    [`@media only screen and (max-width: ${breakPoints.tablet})`]: {
      gridTemplateColumns: 'minmax(230px, 1fr) auto',
    },
  },
  tags: {
    '> div': {
      marginBottom: '4px',
    },
  },
  completion: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    i: {
      fontSize: '26px',
    },
    [`@media only screen and (max-width: ${breakPoints.desktop})`]: {
      gridColumn: '2/2',
      gridRow: '1/2',
    },
  },
  checkWrapper: {
    alignItems: 'center',
    display: 'flex',
    marginBottom: '4px',
    span: {
      marginRight: '4px',
    },
  },
};

const DevelopmentGoalRow = (props: Props) => {
  const { trackEvent } = useEventTracking();

  const onToggle = (
    completionStatus: CompletionStatus,
    completionTypeId: ?number | string
  ) => {
    const currentEvent = completionStatus.checked ? 'Check' : 'Uncheck';
    const developmentGoalId = Number(completionStatus.id);

    trackEvent(
      `Calendar — ${getHumanReadableEventType(
        props.event
      )} details — Development goals — ${currentEvent}`
    );

    if (currentEvent === 'Check') {
      props.onSelectGoal(developmentGoalId, completionTypeId);
    }

    if (currentEvent === 'Uncheck') {
      props.onUnselectGoal(developmentGoalId);
    }
  };

  const displayActionCheckbox = ({
    id,
    isChecked,
    isDefaultCompletionType,
  }: {
    id: number | string,
    isChecked: boolean,
    isDefaultCompletionType: boolean,
  }) => {
    const completionTypeId = isDefaultCompletionType ? null : id;

    return (
      <ActionCheckbox
        id={`${props.eventDevelopmentGoalItem.development_goal.id}`}
        isChecked={isChecked}
        isDisabled={props.isLoading}
        onToggle={(completionStatus) =>
          onToggle(completionStatus, completionTypeId)
        }
        kitmanDesignSystem
      />
    );
  };

  const withCompletionTypes = props.developmentGoalCompletionTypes.length > 0;
  const showDefaultCompletionCheckbox =
    !withCompletionTypes ||
    (withCompletionTypes &&
      !props.eventDevelopmentGoalItem.development_goal_completion_type_id &&
      props.eventDevelopmentGoalItem.checked) ||
    !props.withUnarchiveCompletionType;

  const filteredCompletionTypes = useMemo(
    () =>
      props.developmentGoalCompletionTypes.filter((filteredCompletionType) => {
        if (
          filteredCompletionType.id ===
            props.eventDevelopmentGoalItem
              .development_goal_completion_type_id &&
          props.eventDevelopmentGoalItem.checked
        ) {
          return true;
        }
        return !filteredCompletionType.archived;
      }),
    [props.developmentGoalCompletionTypes, props.eventDevelopmentGoalItem]
  );

  return (
    <div className="developmentGoalRow" css={style.wrapper}>
      <div className="developmentGoalRow__description">
        {props.eventDevelopmentGoalItem.development_goal.description}
      </div>
      <div className="developmentGoalRow__tags" css={style.tags}>
        {props.eventDevelopmentGoalItem.development_goal.development_goal_types.map(
          (goalType) => (
            <div key={goalType.id}>
              <TextTag content={goalType.name} />
            </div>
          )
        )}
        {props.areCoachingPrinciplesEnabled &&
          props.eventDevelopmentGoalItem.development_goal.principles.map(
            (principle) => (
              <div key={principle.id}>
                <TextTag content={getPrincipleNameWithItems(principle)} />
              </div>
            )
          )}
      </div>
      <div className="developmentGoalRow__completion" css={style.completion}>
        {showDefaultCompletionCheckbox &&
          displayActionCheckbox({
            id: props.eventDevelopmentGoalItem.development_goal.id,
            isChecked:
              (!withCompletionTypes ||
                (withCompletionTypes &&
                  !props.eventDevelopmentGoalItem
                    .development_goal_completion_type_id)) &&
              props.eventDevelopmentGoalItem.checked,
            isDefaultCompletionType: true,
          })}
        {withCompletionTypes &&
          filteredCompletionTypes.map((developmentGoalCompletionType) => (
            <div
              key={developmentGoalCompletionType.id}
              css={style.checkWrapper}
            >
              <span className="developmentGoalRow__completionName">
                {developmentGoalCompletionType.name}
              </span>
              {displayActionCheckbox({
                id: developmentGoalCompletionType.id,
                isChecked:
                  props.eventDevelopmentGoalItem
                    .development_goal_completion_type_id ===
                    developmentGoalCompletionType.id &&
                  props.eventDevelopmentGoalItem.checked,
                isDefaultCompletionType: false,
              })}
            </div>
          ))}
      </div>
    </div>
  );
};

export default DevelopmentGoalRow;
