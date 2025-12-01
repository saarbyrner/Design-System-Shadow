// @flow

import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import { LineLoader } from '@kitman/components';
import type { EventDevelopmentGoal } from '@kitman/modules/src/PlanningHub/src/services/getEventDevelopmentGoals';
import type { DevelopmentGoalCompletionType } from '@kitman/modules/src/PlanningHub/src/services/getDevelopmentGoalCompletionTypes';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { DevelopmentGoalsFiltersTranslated as DevelopmentGoalsFilters } from './DevelopmentGoalsFilters';
import { DevelopmentGoalCompletionActionsTranslated as DevelopmentGoalCompletionActions } from './DevelopmentGoalCompletionActions';

type Props = {
  isLoading: boolean,
  shouldDisplayFilters: boolean,
  shouldDisplayActions: boolean,
  withCompletionTypes: boolean,
  eventDevelopmentGoals: Array<EventDevelopmentGoal>,
  developmentGoalCompletionTypes: Array<DevelopmentGoalCompletionType>,
  developmentGoalTerminology: ?string,
  areCoachingPrinciplesEnabled: boolean,
  onFilterByItem: Function,
  onFilterBySearch: Function,
  onSelectAllGoals: (id: ?number | string) => void,
  onClearAllGoals: Function,
};

const style = {
  wrapper: {
    background: colors.white,
    border: `1px solid ${colors.s13}`,
    padding: '24px 9px 16px 24px',
    position: 'relative',
  },
  title: {
    color: colors.grey_300,
    fontSize: '20px',
    fontWeight: 600,
    marginBottom: '24px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '30px',
  },
  emptyMsg: {
    color: colors.grey_200,
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '20px',
    marginBottom: '30px',
    marginTop: '30px',
    textAlign: 'center',
  },
  headerLoader: {
    bottom: 0,
    height: '4px',
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
};

const DevelopmentGoalsHeader = (props: I18nProps<Props>) => (
  <header className="developmentGoalsHeader" css={style.wrapper}>
    <h3 css={style.title}>
      {props.developmentGoalTerminology || props.t('Development Goals')}
    </h3>
    {props.shouldDisplayFilters && (
      <DevelopmentGoalsFilters
        eventDevelopmentGoals={props.eventDevelopmentGoals}
        areCoachingPrinciplesEnabled={props.areCoachingPrinciplesEnabled}
        onFilterByItem={props.onFilterByItem}
        onFilterBySearch={props.onFilterBySearch}
      />
    )}
    {props.shouldDisplayActions ? (
      <div className="developmentGoalsHeader__actions" css={style.actions}>
        <DevelopmentGoalCompletionActions
          withCompletionTypes={props.withCompletionTypes}
          developmentGoalCompletionTypes={props.developmentGoalCompletionTypes}
          onSelect={(completionId: ?number | string) =>
            props.onSelectAllGoals(completionId)
          }
          onClear={props.onClearAllGoals}
        />
      </div>
    ) : (
      <div css={style.emptyMsg} className="developmentGoalsTab__emptyMsg">
        <p>
          {props.developmentGoalTerminology
            ? props.t('No {{item}} added', {
                item: props.developmentGoalTerminology,
              })
            : props.t('No development goals added')}
        </p>
      </div>
    )}
    {props.isLoading && (
      <div
        css={style.headerLoader}
        data-testid="DevelopmentGoalsTab|lineLoader"
      >
        <LineLoader />
      </div>
    )}
  </header>
);

export const DevelopmentGoalsHeaderTranslated = withNamespaces()(
  DevelopmentGoalsHeader
);
export default DevelopmentGoalsHeader;
