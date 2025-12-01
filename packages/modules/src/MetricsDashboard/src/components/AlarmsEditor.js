// @flow
import { withNamespaces } from 'react-i18next';
import type { Alarm } from '@kitman/common/src/types/Alarm';
import type { Status } from '@kitman/common/src/types/Status';
import { AppStatus, LegacyModal as Modal } from '@kitman/components';
import type { ModalStatus } from '@kitman/common/src/types';
import { ModalContentTranslated as ModalContent } from './ModalContent';

type ConfirmActionId = 'hideModal' | 'deleteAllAlarms';

type AlarmsModalProps = {
  statusId: string,
  alarms: Array<Alarm>,
  status: Status,
  createNewAlarm: () => void,
  saveAlarmDefinitions: () => void,
  modalIsOpen: boolean,
  modalStatus: ModalStatus,
  modalMessage: string,
  closeModal: () => void,
  confirmCloseModal: () => void,
  toggleSelectAllForMobile: () => void,
  cancelCloseModal: () => void,
  confirmActionId: ConfirmActionId,
  deleteAllAlarms: () => void,
  confirmDeleteAllAlarms: () => void,
};

export const AlarmsEditor = (props: AlarmsModalProps) => {
  const getConfirmAction = () =>
    props.confirmActionId === 'deleteAllAlarms'
      ? props.deleteAllAlarms
      : props.closeModal;

  return (
    <Modal isOpen={props.modalIsOpen} close={props.confirmCloseModal}>
      <ModalContent
        statusId={props.statusId}
        alarms={props.alarms}
        status={props.status}
        createNewAlarm={props.createNewAlarm}
        saveAlarmDefinitions={props.saveAlarmDefinitions}
        closeModal={props.closeModal}
        toggleSelectAllForMobile={props.toggleSelectAllForMobile}
        confirmDeleteAllAlarms={props.confirmDeleteAllAlarms}
      />
      <AppStatus
        status={props.modalStatus}
        message={props.modalMessage}
        hideConfirmation={props.cancelCloseModal}
        confirmAction={getConfirmAction()}
        close={props.closeModal}
      />
    </Modal>
  );
};

export const AlarmsEditorTranslated = withNamespaces()(AlarmsEditor);
export default AlarmsEditor;
