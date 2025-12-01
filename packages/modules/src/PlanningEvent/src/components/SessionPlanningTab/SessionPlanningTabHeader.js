// @flow
import { withNamespaces } from 'react-i18next';
import { breakPoints } from '@kitman/common/src/variables';
import { TextButton, TooltipMenu } from '@kitman/components';
import { TrackEvent } from '@kitman/common/src/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  isLoading: boolean,
  eventId: number,
  canEditEvent: boolean,
  onAddActivity: Function,
  onClickAthleteParticipation: Function,
  onPrintSummaryOpen: Function,
  eventType: any,
};

const SessionPlanningTabHeader = (props: I18nProps<Props>) => {
  const style = {
    header: {
      [`@media only screen and (max-width: ${breakPoints.tablet})`]: {
        marginBottom: '20px',
      },
    },

    desktopActions: {
      [`@media only screen and (max-width: ${breakPoints.desktop})`]: {
        display: 'none',
      },
    },

    mobileActions: {
      [`@media only screen and (min-width: ${breakPoints.desktop})`]: {
        display: 'none',
      },
    },
  };

  const onAddActivity = () => {
    TrackEvent('Session Planning', 'Add', 'Activity');
    props.onAddActivity(props.eventId);
  };

  const getToolTipMenuItems = () => {
    const tooltipMenuItems = [
      {
        description: props.t('Add activity'),
        onClick: onAddActivity,
      },
      {
        description: props.t('Athlete participation'),
        onClick: props.onClickAthleteParticipation,
      },
    ];

    if (
      props.eventType === 'session_event' &&
      window.getFlag('session-planning-download-sharing')
    ) {
      tooltipMenuItems.push({
        description: props.t('Download plan'),
        onClick: () => props.onPrintSummaryOpen(),
      });
    }
    return tooltipMenuItems;
  };

  return (
    <header className="planningEventGridTab__header" css={style.header}>
      {props.canEditEvent && (
        <>
          <div
            className="planningEventGridTab__actions planningEventGridTab__actions--desktop"
            css={style.desktopActions}
          >
            <TextButton
              text={props.t('Add activity')}
              onClick={onAddActivity}
              type="secondary"
              isDisabled={props.isLoading}
              kitmanDesignSystem
              testId="add-activity-button"
            />
            <TextButton
              text={props.t('Athlete participation')}
              onClick={props.onClickAthleteParticipation}
              type="secondary"
              kitmanDesignSystem
              testId="athlete-participation-button"
            />
            {props.eventType === 'session_event' &&
              window.getFlag('session-planning-download-sharing') && (
                <TooltipMenu
                  placement="bottom-end"
                  menuItems={[
                    {
                      description: props.t('Download plan'),
                      onClick: () => props.onPrintSummaryOpen(),
                    },
                  ]}
                  tooltipTriggerElement={
                    <TextButton
                      iconAfter="icon-more"
                      type="secondary"
                      kitmanDesignSystem
                    />
                  }
                  kitmanDesignSystem
                />
              )}
          </div>
          <div
            className="planningEventGridTab__actions planningEventGridTab__actions--mobile"
            css={style.mobileActions}
          >
            <TooltipMenu
              placement="bottom-end"
              offset={[0, 5]}
              menuItems={getToolTipMenuItems()}
              tooltipTriggerElement={
                <TextButton
                  iconAfter="icon-more"
                  type="secondary"
                  kitmanDesignSystem
                />
              }
              kitmanDesignSystem
            />
          </div>
        </>
      )}
    </header>
  );
};

export const SessionPlanningTabHeaderTranslated = withNamespaces()(
  SessionPlanningTabHeader
);
export default SessionPlanningTabHeader;
