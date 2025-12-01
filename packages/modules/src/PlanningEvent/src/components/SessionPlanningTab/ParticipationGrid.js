// @flow
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import type {
  EventActivity,
  EventActivityAthlete,
} from '@kitman/common/src/types/Event';
import { Checkbox, EllipsisTooltipText, UserAvatar } from '@kitman/components';
import { TrackEvent } from '@kitman/common/src/utils';
import { colors } from '@kitman/common/src/variables';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { areAllAthletesParticipating } from './utils';

type Props = {
  isLoading: boolean,
  canViewAvailabilities: boolean,
  type: 'STAFF' | 'ATHLETE',
  participants: Array<EventActivityAthlete>,
  activities: Array<EventActivity>,
  onSelectParticipant: Function,
  onSelectAllParticipants: Function,
};

const ParticipationGrid = (props: I18nProps<Props>) => {
  const style = {
    wrapper: css`
      overflow: auto;
    `,
    header: css`
      align-items: center;
      display: flex;
      flex-direction: row;
      justify-content: stretch;
    `,
    headerCell: css`
      border-bottom: 2px solid ${colors.colour_light_shadow};
      color: $colour-grey-100;
      display: flex;
      flex: 1;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      font-weight: 600;
      padding: 20px 10px 10px 0;
      min-width: 260px;
      overflow: hidden;

      &:first-of-type {
        padding-left: 24px;
      }
    `,
    row: css`
      align-items: center;
      display: flex;
      flex-direction: row;
      justify-content: stretch;
      padding: 4px 0px;
      &:not(:last-child) {
        border: 1px solid ${colors.neutral_300};
      }
    `,
    rowCell: css`
      display: flex;
      flex: 1;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      padding-right: 10px;
      min-width: 260px;

      img {
        margin-right: 8px;
      }

      &:first-of-type {
        padding-left: 24px;
      }
    `,
  };

  const getActivityColumnHeaders = () => {
    const headerItems = [
      {
        id: 111,
        name: props.type === 'STAFF' ? props.t('Staff') : props.t('Athlete'),
        isSelectable: false,
      },
      {
        id: 222,
        name: props.type === 'STAFF' ? props.t('Role') : props.t('Position'),
        isSelectable: false,
      },
    ];

    if (props.type === 'ATHLETE') {
      headerItems.push({
        id: 333,
        name: props.t('Participation level'),
        isSelectable: false,
      });
    }

    if (props.activities.length > 0) {
      props.activities.forEach((activity, index) => {
        const headerName = activity.event_activity_type
          ? `${index + 1}. ${activity.event_activity_type.name}`
          : `${index + 1}`;

        headerItems.push({
          id: activity.id,
          name: headerName,
          athletes: activity.athletes,
          isSelectable: true,
        });
      });
    }

    return headerItems.map((item) => (
      <div
        className="participationGrid__headerCell"
        key={`${item.id}__headerCell`}
        css={style.headerCell}
      >
        {item.isSelectable ? (
          <>
            <Checkbox
              id={`selectAll_${item.name}`}
              isChecked={areAllAthletesParticipating({
                activity: item,
                participants: props.participants,
              })}
              toggle={(checkbox) => {
                TrackEvent('Session Planning', 'Set', 'Athlete Participation');
                props.onSelectAllParticipants(
                  checkbox.checked,
                  item.id,
                  props.participants,
                  item
                );
              }}
              isDisabled={props.isLoading}
              kitmanDesignSystem
            />
            <EllipsisTooltipText
              content={item.name}
              displayEllipsisWidth={220}
            />
          </>
        ) : (
          <span>{item.name}</span>
        )}
      </div>
    ));
  };

  const isParticipantSelected = (
    activity: EventActivity,
    participantId: number
  ) => activity.athletes.some((athlete) => athlete.id === participantId);

  const getParticipantRows = () => {
    return props.participants.length > 0 ? (
      props.participants.map((participant) => (
        <div
          className="participationGrid__row"
          css={style.row}
          key={`${participant.id}__row`}
        >
          <div className="participationGrid__rowCell" css={style.rowCell}>
            <UserAvatar
              url={participant.avatar_url}
              firstname={participant.name}
              displayInitialsAsFallback
              availability={
                props.canViewAvailabilities
                  ? participant.availability
                  : undefined
              }
              size="EXTRA_SMALL"
            />
            <span>{participant.name}</span>
          </div>
          <div className="participationGrid__rowCell" css={style.rowCell}>
            {participant.position.name}
          </div>
          {props.type === 'ATHLETE' && (
            <div className="participationGrid__rowCell" css={style.rowCell}>
              {participant.participation_level}
            </div>
          )}
          {props.activities.length > 0 &&
            props.activities.map((activity) => (
              <div
                className="participationGrid__rowCell"
                key={`${activity.id}__rowCell`}
                css={style.rowCell}
              >
                <Checkbox
                  id={`selectActivity_${activity.id}`}
                  isChecked={isParticipantSelected(activity, participant.id)}
                  toggle={(checkbox) => {
                    TrackEvent(
                      'Session Planning',
                      'Set',
                      'Athlete Participation'
                    );
                    props.onSelectParticipant(
                      checkbox.checked,
                      activity.id,
                      participant.id
                    );
                  }}
                  isDisabled={props.isLoading}
                  kitmanDesignSystem
                />
              </div>
            ))}
        </div>
      ))
    ) : (
      <span>{props.t('No athletes found')}</span>
    );
  };

  return (
    <div className="participationGrid" css={style.wrapper}>
      <div className="participationGrid__header" css={style.header}>
        {getActivityColumnHeaders()}
      </div>
      <div className="participationGrid__body">{getParticipantRows()}</div>
    </div>
  );
};

export const ParticipationGridTranslated = withNamespaces()(ParticipationGrid);
export default ParticipationGrid;
