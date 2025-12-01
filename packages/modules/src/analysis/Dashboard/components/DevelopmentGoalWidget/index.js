// @flow
import { useState, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';

import { TrackEvent } from '@kitman/common/src/utils';
import { AppStatus, TextButton, TooltipMenu } from '@kitman/components';
import type { DevelopmentGoals } from '@kitman/modules/src/PlanningHub/src/services/getDevelopmentGoals';
import type { TooltipItem } from '@kitman/components/src/TooltipMenu/index';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from './style';
import { DevelopmentGoalItemTranslated as DevelopmentGoalItem } from './components/DevelopmentGoalItem';
import { getPlaceholderImgPath } from '../utils';
import WidgetCard from '../WidgetCard';

type Props = {
  nextId: ?number,
  developmentGoals: DevelopmentGoals,
  totalCount: number,
  fetchNextDevelopmentGoals: Function,
  areCoachingPrinciplesEnabled: boolean,
  onClickAddDevelopmentGoal: Function,
  onClickDeleteDevelopmentGoalWidget: Function,
  onDeleteDevelopmentGoalSuccess: Function,
  onCloseDevelopmentGoalSuccess: Function,
  onClickEditDevelopmentGoal: Function,
  canViewDevelopmentGoals: boolean,
  canCreateDevelopmentGoals: boolean,
  canEditDevelopmentGoals: boolean,
  canDeleteDevelopmentGoals: boolean,
  canManageDashboard: boolean,
  hasError: boolean,
  isLoadingWidgetContent: boolean,
  developmentGoalTerminology: string,
};

function DevelopmentGoalWidget(props: I18nProps<Props>) {
  const isDashboardUIUpgradeFF = window.getFlag('rep-dashboard-ui-upgrade');
  const [showConfirmWidgetRemoval, setShowConfirmWidgetRemoval] =
    useState(false);
  const isFullyLoaded = !props.isLoadingWidgetContent && !props.nextId;

  const menuItems = useMemo(() => {
    const items: Array<TooltipItem> = [];
    if (props.canCreateDevelopmentGoals) {
      items.push({
        description: props.developmentGoalTerminology
          ? props.t('Add {{item}}', { item: props.developmentGoalTerminology })
          : props.t('Add Development goal'),
        onClick: () => {
          props.onClickAddDevelopmentGoal();
          TrackEvent('Analysis Dahsboard', 'Add', 'Development Goal');
        },
      });
    }

    if (props.canManageDashboard) {
      items.push({
        description: props.t('Remove widget'),
        onClick: () => {
          setShowConfirmWidgetRemoval(true);
          TrackEvent('Analysis Dahsboard', 'Remove', 'Development Goal Widget');
        },
      });
    }

    return items;
  }, [
    props.canCreateDevelopmentGoals,
    props.canManageDashboard,
    props.developmentGoalTerminology,
  ]);

  const getEmptyMessage = () => {
    return props.developmentGoalTerminology
      ? props.t('There are no {{item}}', {
          item: props.developmentGoalTerminology,
        })
      : props.t('There are no development goals');
  };

  const getHeaderToolTipStyle = () => {
    if (isDashboardUIUpgradeFF) {
      // TODO Work around solution to make the alignment work with FF.
      return [style.headerTooltip, style.customHeaderToolTipPadding];
    }
    return style.headerTooltip;
  };

  return (
    <WidgetCard styles={[style.widget]}>
      <WidgetCard.Header styles={[style.header]}>
        {isDashboardUIUpgradeFF ? (
          <WidgetCard.Title>
            <h6>
              <span>
                {props.developmentGoalTerminology ||
                  props.t('Development Goals')}{' '}
                <span css={style.totalDevelopmentGoals}>
                  {props.totalCount > 0 && `[ ${props.totalCount} ]`}
                </span>
              </span>
            </h6>
          </WidgetCard.Title>
        ) : (
          <h3>
            <span>
              {props.developmentGoalTerminology || props.t('Development Goals')}{' '}
              {props.totalCount > 0 && `(${props.totalCount})`}
            </span>
          </h3>
        )}
        <div css={getHeaderToolTipStyle()}>
          <TooltipMenu
            placement="bottom-end"
            offset={[10, 10]}
            menuItems={menuItems}
            tooltipTriggerElement={
              <button
                type="button"
                css={[
                  style.tooltipBtn,
                  ...[isDashboardUIUpgradeFF ? style.customTooltipBtn : []],
                ]}
              >
                <WidgetCard.MenuIcon />
              </button>
            }
            kitmanDesignSystem
          />
        </div>
      </WidgetCard.Header>

      {props.canViewDevelopmentGoals && (
        <div css={style.content} id="developmentGoalsScrollableContent">
          <InfiniteScroll
            dataLength={props.developmentGoals.length}
            next={() => props.fetchNextDevelopmentGoals()}
            hasMore={!isFullyLoaded}
            loader={<div css={style.loader}>{props.t('Loading')} ...</div>}
            scrollableTarget="developmentGoalsScrollableContent"
          >
            <ul css={style.developmentGoalsList}>
              {props.developmentGoals.map((developmentGoal, index) => {
                const prevDevelopmentGoalAthleteId =
                  index > 0
                    ? props.developmentGoals[index - 1].athlete?.id
                    : null;
                return (
                  <li key={developmentGoal.id}>
                    {prevDevelopmentGoalAthleteId !==
                      developmentGoal.athlete?.id && (
                      <p css={style.athleteName}>
                        {developmentGoal.athlete?.fullname}
                      </p>
                    )}
                    <DevelopmentGoalItem
                      developmentGoal={developmentGoal}
                      onDeleteDevelopmentGoalSuccess={
                        props.onDeleteDevelopmentGoalSuccess
                      }
                      onCloseDevelopmentGoalSuccess={
                        props.onCloseDevelopmentGoalSuccess
                      }
                      onClickEditDevelopmentGoal={
                        props.onClickEditDevelopmentGoal
                      }
                      canEditDevelopmentGoals={props.canEditDevelopmentGoals}
                      canDeleteDevelopmentGoals={
                        props.canDeleteDevelopmentGoals
                      }
                      areCoachingPrinciplesEnabled={
                        props.areCoachingPrinciplesEnabled
                      }
                    />
                  </li>
                );
              })}
            </ul>
          </InfiniteScroll>

          {isFullyLoaded && props.developmentGoals.length === 0 && (
            <div css={style.emptyState}>
              {props.canCreateDevelopmentGoals ? (
                <TextButton
                  text={
                    props.developmentGoalTerminology
                      ? props.t('add {{item}}', {
                          item: props.developmentGoalTerminology,
                        })
                      : props.t('Add Development Goal')
                  }
                  type="link"
                  onClick={() => {
                    TrackEvent('Analysis Dahsboard', 'Add', 'Development Goal');
                    props.onClickAddDevelopmentGoal();
                  }}
                  isDisabled={!props.canCreateDevelopmentGoals}
                  kitmanDesignSystem
                />
              ) : (
                getEmptyMessage()
              )}
            </div>
          )}
        </div>
      )}

      {!props.canViewDevelopmentGoals && (
        <div css={style.noPermissionOverlay}>
          <img
            src={getPlaceholderImgPath('development_goal')}
            alt="widget placeholder"
          />
          <p css={style.content}>
            {props.t(
              'Please contact your administrator for permission to view this data'
            )}
          </p>
        </div>
      )}

      {props.hasError && <AppStatus status="error" isEmbed />}

      {showConfirmWidgetRemoval && (
        <AppStatus
          status="confirm"
          message={props.t('Delete widget?')}
          confirmButtonText={props.t('Delete')}
          hideConfirmation={() => setShowConfirmWidgetRemoval(false)}
          close={() => setShowConfirmWidgetRemoval(false)}
          confirmAction={() => props.onClickDeleteDevelopmentGoalWidget()}
        />
      )}
    </WidgetCard>
  );
}

export default DevelopmentGoalWidget;
export const DevelopmentGoalWidgetTranslated = withNamespaces()(
  DevelopmentGoalWidget
);
