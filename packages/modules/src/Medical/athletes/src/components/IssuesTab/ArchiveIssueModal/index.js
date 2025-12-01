// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import { Modal, Select, TextButton } from '@kitman/components';
import type {
  SelectOption as Option,
  ToastDispatch,
} from '@kitman/components/src/types';
import type { ToastAction } from '@kitman/components/src/Toast/KitmanDesignSystem/hooks/useToasts';
import { archiveMedicalInjuryOrIllness } from '@kitman/services/src/services/medical';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Issue } from '@kitman/modules/src/Medical/shared/types';
import { getIssueTitle } from '@kitman/modules/src/Medical/shared/utils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import {
  determineMedicalLevelAndTab,
  getIssueType,
} from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';

type Props = {
  isOpen: boolean,
  setShowArchiveModal: Function,
  archiveModalOptions: Array<Option>,
  selectedRow: Issue,
  athleteId: number,
  getIssues: Function,
  toastAction: ToastDispatch<ToastAction>,
};

const ArchiveIssue = (props: I18nProps<Props>) => {
  const [archiveReason, setArchiveReason] = useState<number>(0);
  const { trackEvent } = useEventTracking();

  const unknownError = props.t('An unknown error occurred.');

  const closeModal = () => {
    setArchiveReason(0);
    props.setShowArchiveModal(false);
    props.toastAction({
      type: 'REMOVE_TOAST_BY_ID',
      id: props.selectedRow.id,
    });
  };

  const getTitle = () => {
    return getIssueTitle(
      props.selectedRow,
      !props.selectedRow.full_pathology &&
        !props.selectedRow.issue_occurrence_title
    );
  };

  const archiveRequestSuccessful = () => {
    closeModal();
    props.getIssues();
    props.toastAction({
      type: 'UPDATE_TOAST',
      toast: {
        id: props.selectedRow.id,
        title: `${getTitle()} - successfully archived`,
        status: 'SUCCESS',
      },
    });
  };

  const archiveRequestError = (errorMessage: string) => {
    props.toastAction({
      type: 'UPDATE_TOAST',
      toast: {
        id: props.selectedRow.id,
        title: `${getTitle()} - ${errorMessage}`,
        status: 'ERROR',
      },
    });
  };

  const makeArchiveIssueRequest = async () => {
    if (props.selectedRow) {
      props.toastAction({
        type: 'CREATE_TOAST',
        toast: {
          id: props.selectedRow.id,
          title: getTitle(),
          status: 'LOADING',
        },
      });

      try {
        await archiveMedicalInjuryOrIllness(
          props.athleteId,
          props.selectedRow.id,
          props.selectedRow.issue_type,
          archiveReason
        );

        archiveRequestSuccessful();
        trackEvent(performanceMedicineEventNames.injuryIllnessArchived, {
          ...determineMedicalLevelAndTab(),
          ...getIssueType(props.selectedRow.issue_type),
        });
      } catch (err) {
        const errorMessage = err?.response?.data?.data?.[0]?.message;

        if (err.response.status === 422 && errorMessage) {
          archiveRequestError(errorMessage);
        } else {
          archiveRequestError(unknownError);
        }
      }
    }
  };

  return (
    <Modal
      isOpen={props.isOpen}
      onPressEscape={closeModal}
      onClose={closeModal}
    >
      <Modal.Header>
        <Modal.Title>{props.t('Archive injury/issue')}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <p>
          {props.t(
            'Please provide the reason why this issue or injury is being archived'
          )}
        </p>

        <Select
          label={props.t('Reason for archiving:')}
          options={props.archiveModalOptions}
          onChange={setArchiveReason}
          value={archiveReason}
          menuPosition="fixed"
          appendToBody
        />
      </Modal.Content>
      <Modal.Footer>
        <TextButton
          text={props.t('Cancel')}
          onClick={closeModal}
          type="subtle"
          isDisabled={false}
          kitmanDesignSystem
        />
        <TextButton
          text={props.t('Archive')}
          type="primaryDestruct"
          onClick={makeArchiveIssueRequest}
          isDisabled={!archiveReason}
          kitmanDesignSystem
        />
      </Modal.Footer>
    </Modal>
  );
};

export const ArchiveIssueModalTranslated: ComponentType<Props> =
  withNamespaces()(ArchiveIssue);
export default ArchiveIssue;
