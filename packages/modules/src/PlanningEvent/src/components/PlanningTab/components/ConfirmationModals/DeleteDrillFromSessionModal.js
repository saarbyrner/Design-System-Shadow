// @flow
import { useEffect } from 'react';
import { Modal, TextButton } from '@kitman/components';
import { deleteEventActivity } from '@kitman/services/src/services/planning';
import type { EventActivityV2 } from '@kitman/common/src/types/Event';
import type { PlanningDispatch } from '@kitman/modules/src/PlanningEvent/src/hooks/usePlanningReducer';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '../../style';

type Props = {
  dispatch: PlanningDispatch,
  drillActivityToDelete: EventActivityV2,
  setActivities: ((Array<EventActivityV2>) => Array<EventActivityV2>) => void,
  setDrillActivityToDelete: (?EventActivityV2) => void,
  onActivitiesUpdate: (Array<EventActivityV2>) => void,
  eventId: number,
};

const DeleteDrillFromSessionModal = (props: I18nProps<Props>) => {
  const deleteActivity = async () => {
    deleteEventActivity({
      eventId: props.eventId,
      activityId: props.drillActivityToDelete.id,
    });
    props.dispatch({
      type: 'REMOVE_DRILL',
      drillId: props.drillActivityToDelete.id,
    });
    props.setActivities((prevActivities) => {
      const newActivities = prevActivities.filter(
        ({ id }) => id !== props.drillActivityToDelete.id
      );
      props.onActivitiesUpdate(newActivities);
      return newActivities;
    });
    props.setDrillActivityToDelete(null);
  };
  useEffect(() => {
    const onKeyDown: KeyboardEventListener = (event) => {
      if (event.key === 'Enter') {
        deleteActivity();
      }
    };
    const eventType = 'keydown';

    document.addEventListener(eventType, onKeyDown);
    return () => {
      document.removeEventListener(eventType, onKeyDown);
    };
  }, []);

  return (
    <Modal
      isOpen={!!props.drillActivityToDelete}
      outsideClickCloses
      overlapSidePanel
      width="small"
      onPressEscape={() => props.setDrillActivityToDelete(null)}
      close={() => props.setDrillActivityToDelete(null)}
    >
      <Modal.Header>
        <Modal.Title>{props.t('Remove drill from this session')}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <div css={style.deleteActivityConfirmationText}>
          <p>
            {props.t(
              `Are you sure you want to remove this drill from your session?
              Notes, duration and area size will be lost.`
            )}
          </p>
          {props.drillActivityToDelete?.event_activity_drill?.library && (
            <p>
              {props.t(
                'The drill will still be available to reuse in your library.'
              )}
            </p>
          )}
        </div>
      </Modal.Content>
      <div css={style.deleteActivityConfirmationButtons}>
        <Modal.Footer>
          <TextButton
            text={props.t('Cancel')}
            onClick={() => props.setDrillActivityToDelete(null)}
            type="textOnly"
            kitmanDesignSystem
          />
          <TextButton
            text={props.t('Remove')}
            onClick={deleteActivity}
            type="primary"
            kitmanDesignSystem
          />
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default DeleteDrillFromSessionModal;
