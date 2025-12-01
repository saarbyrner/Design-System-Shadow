// @flow
import { withNamespaces } from 'react-i18next';
import { Modal, TextButton } from '@kitman/components';
import { useState } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { FormMeta } from '../../../../shared/types/medical/QuestionTypes';

type Props = {
  isOpen: boolean,
  formMeta: ?FormMeta,
  isLoading: boolean,
  onDelete: Function,
  onClose: Function,
};

const FormAnswerSetsDelete = (props: I18nProps<Props>) => {
  // eslint-disable-next-line no-unused-vars
  const [formName, setFormName] = useState(
    props.formMeta ? props.formMeta.fullname : 'form'
  );
  return (
    <Modal
      onPressEscape={props.onClose}
      isOpen={props.isOpen}
      close={props.onClose}
    >
      <Modal.Header>
        <Modal.Title>
          {props.t('Delete {{formName}}', { formName })}
        </Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <p>
          {props.t(
            `Deleting this ${formName} will delete it for all users and remove it from any linked injuries. This can't be undone.`
          )}
        </p>
      </Modal.Content>
      <Modal.Footer>
        <TextButton
          text="Cancel"
          type="subtle"
          isDisabled={props.isLoading}
          onClick={props.onClose}
          kitmanDesignSystem
        />
        <TextButton
          text="Delete"
          type="primaryDestruct"
          isDisabled={props.isLoading}
          onClick={props.onDelete}
          kitmanDesignSystem
        />
      </Modal.Footer>
    </Modal>
  );
};

export default FormAnswerSetsDelete;
export const FormAnswerSetsDeleteTranslated =
  withNamespaces()(FormAnswerSetsDelete);
