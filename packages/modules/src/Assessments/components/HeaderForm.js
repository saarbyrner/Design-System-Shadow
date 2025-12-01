// @flow
import { withNamespaces } from 'react-i18next';

import { ChooseNameModal } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  onClickSave: Function,
  onClickCloseModal: Function,
  initialValue?: string,
};

const HeaderForm = (props: I18nProps<Props>) => {
  return (
    <ChooseNameModal
      title={props.t('Section name')}
      label={props.t('Name')}
      actionButtonText={props.t('Save')}
      value={props.initialValue || ''}
      closeModal={() => props.onClickCloseModal()}
      onConfirm={(value) => props.onClickSave(value)}
      isOpen
    />
  );
};

export default HeaderForm;
export const HeaderFormTranslated = withNamespaces()(HeaderForm);
