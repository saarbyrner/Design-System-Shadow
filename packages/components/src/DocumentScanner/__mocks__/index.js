// @flow
import { css } from '@emotion/react';
import { Modal, TextButton } from '@kitman/components';

type Props = {
  isOpen: boolean,
  onSave: (file: File, pageCount: number) => void,
  onCancel: () => void,
};

const DocumentScanner = (props: Props) => {
  const onClickAdd = () => {
    // $FlowIgnore[incompatible-call]
    props.onSave({ fileStandIn: 'notReallyAFile' }, 5);
  };

  return (
    <Modal
      isOpen={props.isOpen}
      onPressEscape={props.onCancel}
      close={props.onCancel}
      width="x-large"
      overlapSidePanel
      additionalStyle={css`
        max-height: 90vh !important;
      `}
    >
      <Modal.Header>
        <Modal.Title>Scan</Modal.Title>
      </Modal.Header>
      <Modal.Content
        additionalStyle={css`
          padding: 0;
        `}
      >
        Mocked scan component
      </Modal.Content>
      <Modal.Footer>
        <TextButton text="Cancel" onClick={props.onCancel} kitmanDesignSystem />
        <TextButton
          text="Add"
          onClick={onClickAdd}
          type="primary"
          kitmanDesignSystem
        />
      </Modal.Footer>
    </Modal>
  );
};

export const DocumentScannerTranslated = DocumentScanner;
export default DocumentScanner;
