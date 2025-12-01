// @flow
import { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { TextButton, TooltipMenu, Modal, AppStatus } from '@kitman/components';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import type { Game, Athlete } from '@kitman/common/src/types/Event';
import type {
  GameActivity,
  GamePeriod,
} from '@kitman/common/src/types/GameEvent';
import { gameActivitiesPeriodBulkSave } from '@kitman/modules/src/PlanningEvent/src/services/gameActivities';
import useGameEventsModal from '@kitman/modules/src/PlanningEvent/src/hooks/useGameEventsModal';
import {
  eventTypes,
  listViewViewableEventTypes,
} from '@kitman/common/src/consts/gameEventConsts';
import { clearPeriodActivities } from '@kitman/common/src/utils/planningEvent/gamePeriodUtils';
import {
  removeFormationComplete,
  checkIfActivityExistsWithinPeriod,
} from '@kitman/common/src/utils/planningEvent/gameActivityUtils';
import PlanningTab from '@kitman/modules/src/PlanningEvent/src/components/PlanningTabLayout';
import { setUnsavedGameActivities } from '@kitman/modules/src/PlanningEvent/src/redux/slices/gameActivitiesSlice';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import { getEventTypeText } from '../../utils';

const style = {
  metaData: css`
    color: ${colors.grey_300};
  `,
  pitchMetaDataTitle: css`
    color: ${colors.grey_300};
    font-weight: 600;
  `,
  pitchMetaDataText: css`
    font-style: italic;
  `,
  deletionPanel: css`
    padding: 20px;
  `,
  iconButton: css`
    cursor: pointer;
    background-color: white;
    border: none;
  `,
};

type Props = {
  pitchViewEnabled: boolean,
  event: Game,
  isDmrLocked?: boolean,
  period: GamePeriod,
  athletes: Array<Athlete>,
  activitiesForPeriod: Array<GameActivity>,
  canDelete: boolean,
  hasPeriodStarted: boolean,
  isFirstPeriodSelected: boolean,
  isLastPeriodSelected: boolean,
  onGameActivitiesUpdate: Function,
  onDelete: (GamePeriod) => void,
  onEdit: (GamePeriod) => void,
  onOpenPeriodPanel: () => void,
};

type RequestStatusType = 'FAILURE' | null;

const GameEventListViewHeader = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const { preferences } = usePreferences();

  const isMatchDayGame =
    props.event?.league_setup && preferences?.league_game_team;

  const modal = useGameEventsModal();
  const [requestStatus, setRequestStatus] = useState<RequestStatusType>(null);
  const [showDeletionPanel, setShowDeletionPanel] = useState<boolean>(false);

  const formationChangeActivities = props.activitiesForPeriod.filter(
    (gameActivity) => gameActivity.kind === eventTypes.formation_change
  );

  const formationList = () => {
    const formations = formationChangeActivities
      .filter(({ kind }) => kind === eventTypes.formation_change)
      .map(({ relation }) => relation?.name)
      .join(' | ');
    return formations ? ` | ${formations}` : '';
  };

  const hasInPeriodActivities = [...props.activitiesForPeriod].filter(
    (activity) =>
      listViewViewableEventTypes.includes(activity.kind) &&
      checkIfActivityExistsWithinPeriod({
        activity,
        currentPeriod: props.period,
        isLastPeriodSelected: props.isLastPeriodSelected,
      })
  ).length;

  const recentPitchMovementActivity = [...props.activitiesForPeriod]
    .sort((a, b) => +b.id - +a.id)
    .find((activity) =>
      [eventTypes.switch, eventTypes.sub, eventTypes.formation_change].includes(
        activity.kind
      )
    );

  const getAthleteName = (athleteId: number) =>
    props.athletes.find((athlete) => athlete.id === athleteId)?.fullname;

  const getRecentPitchMovementActivityText = () =>
    recentPitchMovementActivity?.kind === eventTypes.formation_change
      ? recentPitchMovementActivity?.relation?.name
      : getAthleteName(+recentPitchMovementActivity?.athlete_id);

  const onConfirmClearPeriod = () => {
    const updatedActivitiesToDelete = clearPeriodActivities({
      gameActivities: props.activitiesForPeriod,
      currentPeriod: props.period,
      isEventListShown: props.hasPeriodStarted,
      isLastPeriodSelected: props.isLastPeriodSelected,
    });

    const filteredDeletedActivities = updatedActivitiesToDelete
      .filter((activity) => activity.delete)
      .map((activity) => ({
        id: activity.id,
        delete: activity.delete,
      }));

    gameActivitiesPeriodBulkSave(
      props.event.id,
      props.period.id,
      filteredDeletedActivities
    ).then(
      (updatedGameActivities) => {
        setRequestStatus(null);

        props.onGameActivitiesUpdate({
          updates: updatedGameActivities,
          deletions: filteredDeletedActivities,
        });
        modal.hide();
      },
      () => setRequestStatus('FAILURE')
    );
  };

  const handleEditLineup = () => {
    const updatedActivities = removeFormationComplete(
      props.activitiesForPeriod,
      props.period
    );
    dispatch(setUnsavedGameActivities(updatedActivities));
  };

  const renderPitchViewDeleteModal = () => {
    modal.show({
      title: props.t(`Delete period`),
      content: props.t(
        'This action cannot be undone and all data will be deleted.'
      ),
      onConfirm: () => props.onDelete(props.period),
    });
  };

  const renderPitchViewClearPeriodModal = () => {
    const title = props.hasPeriodStarted
      ? props.t(`Clear events`)
      : props.t(`Clear`);
    const content = props.hasPeriodStarted
      ? props.t('Are you sure you want to clear the events from this period?')
      : props.t(
          'Are you sure you want to clear the starting lineup from this period?'
        );

    modal.show({
      title,
      content,
      onConfirm: () => onConfirmClearPeriod(),
    });
  };

  const renderDeleteModal = () => (
    <Modal
      isOpen={showDeletionPanel}
      onPressEscape={() => setShowDeletionPanel(false)}
      kitmanDesignSystem
      close={() => setShowDeletionPanel(false)}
    >
      <Modal.Header>
        <Modal.Title>
          {props.canDelete
            ? props.t('Delete period')
            : props.t('Unable to delete period')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Content>
        {props.canDelete
          ? props.t(
              'This action cannot be undone and all data will be deleted.'
            )
          : props.t(
              'This period cannot be deleted as game event data have been added to subsequent periods. To delete the period, you will need to delete any data added to any subsequent periods. This includes positions, minutes, goals, assists and cards.'
            )}
      </Modal.Content>
      <Modal.Footer>
        {!props.canDelete && !props.pitchViewEnabled && (
          <TextButton
            text={props.t('Close')}
            onClick={() => setShowDeletionPanel(false)}
            kitmanDesignSystem
            type="primary"
          />
        )}
        {(props.canDelete || props.pitchViewEnabled) && (
          <Fragment>
            <TextButton
              text={props.t('Cancel')}
              onClick={() => setShowDeletionPanel(false)}
              kitmanDesignSystem
            />
            <TextButton
              text={props.t('Delete')}
              type="primaryDestruct"
              onClick={() => {
                setShowDeletionPanel(false);
                props.onDelete(props.period);
              }}
              kitmanDesignSystem
            />
          </Fragment>
        )}
      </Modal.Footer>
    </Modal>
  );

  if (requestStatus === 'FAILURE') {
    return <AppStatus status="error" />;
  }

  return (
    <>
      <PlanningTab.TabHeader>
        <PlanningTab.TabTitle>
          <button
            type="button"
            onClick={() => props.onOpenPeriodPanel()}
            className="icon-burger"
            css={style.iconButton}
          />
          {props.period?.name}
          <PlanningTab.TabSubTitle>
            <div
              css={style.metaData}
              data-testid="GameEventListViewHeader|MetaData"
            >
              <div>
                {props.t('Duration: {{duration}}', {
                  duration: props.period?.duration || '-',
                })}
                {props.period?.additional_duration
                  ? ` (+ ${props.period?.additional_duration}) `
                  : ' '}
                {props.t('mins')}
                {formationList()}
              </div>
            </div>
          </PlanningTab.TabSubTitle>
          {props.pitchViewEnabled &&
            props.hasPeriodStarted &&
            recentPitchMovementActivity && (
              <PlanningTab.TabSubTitle>
                <span css={style.pitchMetaDataTitle}>
                  {props.t('Recent Pitch Movement Activity: ')}
                </span>
                <span css={style.pitchMetaDataText}>
                  {`${getEventTypeText(
                    recentPitchMovementActivity.kind,
                    props.t
                  )} - `}
                  {getRecentPitchMovementActivityText()}
                  {` ${recentPitchMovementActivity.absolute_minute}'`}
                </span>
              </PlanningTab.TabSubTitle>
            )}
        </PlanningTab.TabTitle>
        <PlanningTab.TabActions>
          <div className="gameActivitiesTab__actions gameActivitiesTab__actions--desktop">
            {props.pitchViewEnabled && props.hasPeriodStarted && (
              <TextButton
                onClick={handleEditLineup}
                text={props.t('Edit lineup')}
                isDisabled={hasInPeriodActivities > 0 || props.isDmrLocked}
                type="secondary"
                kitmanDesignSystem
              />
            )}
            {props.pitchViewEnabled && (
              <TextButton
                onClick={() => renderPitchViewClearPeriodModal()}
                text={
                  props.hasPeriodStarted
                    ? props.t('Clear events')
                    : props.t('Clear')
                }
                type="secondary"
                kitmanDesignSystem
              />
            )}
            <TooltipMenu
              placement="bottom-end"
              menuItems={[
                {
                  description: props.t('Edit'),
                  onClick: () => props.onEdit(props.period),
                },
                ...(!(isMatchDayGame && props.isFirstPeriodSelected)
                  ? [
                      {
                        description: props.t('Delete'),
                        onClick: () =>
                          props.pitchViewEnabled
                            ? renderPitchViewDeleteModal()
                            : setShowDeletionPanel(true),
                      },
                    ]
                  : []),
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
          </div>
        </PlanningTab.TabActions>
      </PlanningTab.TabHeader>

      {showDeletionPanel && renderDeleteModal()}
      {modal.renderModal()}
    </>
  );
};

export const GameEventListViewHeaderTranslated = withNamespaces()(
  GameEventListViewHeader
);
export default GameEventListViewHeader;
