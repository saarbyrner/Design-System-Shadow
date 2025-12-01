// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import { Modal, Select, TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  athleteId: number | null,
  medicationId: number | null,
  isOpen: boolean,
  onClose: Function,
  onArchiveMedication: Function,
  archiveModalOptions: Array<mixed>,
};

const ArchiveMedication = (props: I18nProps<Props>) => {
  const [archiveReason, setArchiveReason] = useState<number>(0);

  return (
    <Modal
      isOpen={props.isOpen}
      onPressEscape={props.onClose}
      onClose={props.onClose}
    >
      <Modal.Header>
        <Modal.Title>{props.t('Archive medication')}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <p>
          {props.t(
            'Please provide the reason why this medication is being archived'
          )}
        </p>

        <Select
          label={props.t('Reason for archiving:')}
          options={props.archiveModalOptions}
          onChange={(reason) => setArchiveReason(reason)}
          value={archiveReason}
          menuPosition="fixed"
          appendToBody
        />
      </Modal.Content>
      <Modal.Footer>
        <TextButton
          text={props.t('Cancel')}
          onClick={() => props.onClose()}
          type="subtle"
          isDisabled={false}
          kitmanDesignSystem
        />
        <TextButton
          text={props.t('Archive')}
          type="primaryDestruct"
          onClick={() =>
            props.athleteId && props.medicationId
              ? props.onArchiveMedication(props.medicationId, archiveReason)
              : null
          }
          isDisabled={!archiveReason}
          kitmanDesignSystem
        />
      </Modal.Footer>
    </Modal>
  );
};

export const ArchiveMedicationModalTranslated: ComponentType<Props> =
  withNamespaces()(ArchiveMedication);
export default ArchiveMedication;
