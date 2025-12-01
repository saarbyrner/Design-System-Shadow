// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import type { MedicalNote } from '@kitman/modules/src/Medical/shared/types/medical';

import { Modal, Select, TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  note: MedicalNote,
  isOpen: boolean,
  onClose: Function,
  onArchiveNote: Function,
  archiveModalOptions: Array<mixed>,
};

const ArchiveNote = (props: I18nProps<Props>) => {
  const [archiveReason, setArchiveReason] = useState<number>(0);
  return (
    <Modal
      isOpen={props.isOpen}
      onPressEscape={props.onClose}
      onClose={props.onClose}
    >
      <Modal.Header>
        <Modal.Title>{props.t('Archive medical note')}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <p>
          {props.t('Please provide the reason why this note is being archived')}
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
          onClick={async () => props.onArchiveNote(props.note, archiveReason)}
          isDisabled={!archiveReason}
          kitmanDesignSystem
        />
      </Modal.Footer>
    </Modal>
  );
};

export const ArchiveNoteModalTranslated: ComponentType<Props> =
  withNamespaces()(ArchiveNote);
export default ArchiveNote;
