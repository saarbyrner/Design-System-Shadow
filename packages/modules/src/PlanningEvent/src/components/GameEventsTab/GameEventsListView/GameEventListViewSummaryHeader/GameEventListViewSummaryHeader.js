// @flow
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import type {
  GameActivity,
  GamePeriod,
} from '@kitman/common/src/types/GameEvent';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import PlanningTab from '@kitman/modules/src/PlanningEvent/src/components/PlanningTabLayout';

const style = {
  metaData: css`
    color: ${colors.grey_300};
  `,
  iconButton: css`
    cursor: pointer;
    background-color: white;
    border: none;
  `,
};

type Props = {
  gameActivities: Array<GameActivity>,
  periods: Array<GamePeriod>,
  onOpenPeriodPanel: () => void,
};

const GameEventListViewSummaryHeader = (props: I18nProps<Props>) => {
  const durationTotal = () => {
    let total = 0;
    props.periods.forEach((period) => {
      total += period.duration;
    });
    return total;
  };

  const formationList = () => {
    const formations = props.gameActivities
      .filter(({ kind }) => kind === eventTypes.formation_change)
      .map(({ relation }) => relation?.name)
      .join(' | ');
    return formations ? ` | ${formations}` : '';
  };

  return (
    <>
      <PlanningTab.TabHeader>
        <PlanningTab.TabTitle>
          <button
            type="button"
            onClick={props.onOpenPeriodPanel}
            className="icon-burger"
            css={style.iconButton}
          />
          {props.t('Game summary')}
          <PlanningTab.TabSubTitle>
            <div
              css={style.metaData}
              data-testid="GameEventListViewSummaryHeader|MetaData"
            >
              <div>
                {props.t('Total duration')}: {durationTotal() || '-'}{' '}
                {props.t('mins')} | {props.t('Number of periods')}:{' '}
                {props.periods.length?.toString() || '-'}
                {formationList()}
              </div>
            </div>
          </PlanningTab.TabSubTitle>
        </PlanningTab.TabTitle>
      </PlanningTab.TabHeader>
    </>
  );
};

export const GameEventListViewSummaryHeaderTranslated = withNamespaces()(
  GameEventListViewSummaryHeader
);
export default GameEventListViewSummaryHeader;
