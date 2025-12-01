// @flow
import { withNamespaces } from 'react-i18next';

import { TextButton, TooltipMenu } from '@kitman/components';
import type { DevelopmentGoalCompletionType } from '@kitman/modules/src/PlanningHub/src/services/getDevelopmentGoalCompletionTypes';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { getHumanReadableEventType } from '@kitman/common/src/utils/events';
import { type Event } from '@kitman/common/src/types/Event';

type Props = {
  event: Event,
  withCompletionTypes: boolean,
  developmentGoalCompletionTypes: Array<DevelopmentGoalCompletionType>,
  onSelect: (completionId: ?number | string) => void,
  onClear: Function,
};

const DevelopmentGoalCompletionActions = (props: I18nProps<Props>) => {
  const { trackEvent } = useEventTracking();

  return (
    <div className="developmentGoalCompletionActions">
      <TooltipMenu
        placement="bottom-end"
        offset={[0, 5]}
        menuItems={
          props.withCompletionTypes
            ? [
                ...props.developmentGoalCompletionTypes
                  .filter((completionType) => !completionType.archived)
                  .map((filteredCompletionType) => ({
                    description: filteredCompletionType.name,
                    onClick: () => {
                      trackEvent(
                        `Calendar — ${getHumanReadableEventType(
                          props.event
                        )} details — Development goals — Check all`
                      );
                      props.onSelect(filteredCompletionType.id);
                    },
                  })),
                {
                  description: props.t('Clear all'),
                  onClick: () => {
                    trackEvent(
                      `Calendar — ${getHumanReadableEventType(
                        props.event
                      )} details — Development goals — Uncheck all`
                    );
                    props.onClear();
                  },
                },
              ]
            : [
                {
                  description: props.t('Checked'),
                  onClick: () => {
                    trackEvent(
                      `Calendar — ${getHumanReadableEventType(
                        props.event
                      )} details — Development goals — Check all`
                    );
                    props.onSelect(null);
                  },
                },
                {
                  description: props.t('Unchecked'),
                  onClick: () => {
                    trackEvent(
                      `Calendar — ${getHumanReadableEventType(
                        props.event
                      )} details — Development goals — Uncheck all`
                    );
                    props.onClear();
                  },
                },
              ]
        }
        tooltipTriggerElement={
          <TextButton
            text={props.t('Mark all')}
            type="link"
            iconAfter="icon-chevron-down"
            kitmanDesignSystem
          />
        }
        kitmanDesignSystem
      />
    </div>
  );
};

export const DevelopmentGoalCompletionActionsTranslated = withNamespaces()(
  DevelopmentGoalCompletionActions
);
export default DevelopmentGoalCompletionActions;
