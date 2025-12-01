// @flow
import { InputTextField } from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import { capitalize } from 'lodash';
import { useState } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import GameEventsModal from '../GameEventsModal';

type Props = {
  show: boolean,
  setShow: (show: boolean) => void,
  onConfirm: Function,
};

const SaveLineUpTemplateModal = (props: I18nProps<Props>) => {
  const [name, setName] = useState('');

  return (
    <GameEventsModal
      isOpen={props.show}
      onPressEscape={() => props.setShow(false)}
      onClose={() => props.setShow(false)}
      title={capitalize(props.t('Save line-up'))}
      content={
        <InputTextField
          value={name}
          label={props.t('Line-up template name')}
          onChange={(e) => setName(e.target.value)}
          kitmanDesignSystem
          updatedValidationDesign
        />
      }
      cancelButtonText={props.t('Cancel')}
      confirmButtonText={props.t('Save')}
      onCancel={() => {
        props.setShow(false);
        setName('');
      }}
      onConfirm={() => {
        props.onConfirm(name);
        setName('');
      }}
      confirmButtonDisabled={!name}
    />
  );
};

export const SaveLineUpTemplateModalTranslated = withNamespaces()(
  SaveLineUpTemplateModal
);
export default SaveLineUpTemplateModal;
