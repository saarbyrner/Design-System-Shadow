// @flow
import { withNamespaces } from 'react-i18next';
import { Modal, TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  openModal: boolean,
  setOpenModal: Function,
  numExcludedFiles: number,
  selectedExports: any,
  supportedFileTypesNames: Array<string>,
  onExport: Function,
};

const ExportWarningModal = (props: I18nProps<Props>) => {
  return (
    <Modal
      isOpen={props.openModal}
      close={() => props.setOpenModal(false)}
      onPressEscape={() => props.setOpenModal(false)}
      overlapSidePanel
    >
      <Modal.Header>
        <Modal.Title>{props.t('Unsupported file type')}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <p>
          {`${props.t(
            'Only the following file formats will be included in your export'
          )}; ${props.supportedFileTypesNames.join(', ')}`}
        </p>
      </Modal.Content>

      <Modal.Footer>
        <TextButton
          onClick={() => props.setOpenModal(false)}
          text={props.t('Cancel')}
          type={
            props.numExcludedFiles !== props.selectedExports?.length
              ? 'subtle'
              : 'primary'
          }
          data-testid="Modal|Cancel"
          kitmanDesignSystem
        />
        {props.numExcludedFiles !== props.selectedExports?.length && (
          <TextButton
            onClick={() => {
              props.onExport();
              props.setOpenModal(false);
            }}
            text={props.t('Export')}
            type="warning"
            data-testid="Modal|Export"
            kitmanDesignSystem
          />
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ExportWarningModal;
export const ExportWarningModalTranslated =
  withNamespaces()(ExportWarningModal);
