// @flow
import { withNamespaces } from 'react-i18next';
import { capitalize } from 'lodash';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import GameEventsModal from '../GameEventsModal';

type Props = {
  show: boolean,
  setShow: (show: boolean) => void,
  name: string,
  changeName: string,
  onConfirm: Function,
};

const FormationChangeConfirmationModal = (props: I18nProps<Props>) => {
  const { show, setShow, name, changeName, onConfirm, t } = props;

  return (
    <GameEventsModal
      isOpen={show}
      onPressEscape={() => setShow(false)}
      onClose={() => setShow(false)}
      title={capitalize(t('{{name}} change', { name }))}
      content={t(
        'Changing the {{name}} will clear the current period and reset the format for subsequent unedited periods. Are you sure you want to continue?',
        { name }
      )}
      cancelButtonText={t('Cancel')}
      confirmButtonText={t('Change {{name}} to {{changeName}}', {
        name,
        changeName,
      })}
      onCancel={() => setShow(false)}
      onConfirm={onConfirm}
    />
  );
};

export const FormationChangeConfirmationModalTranslated = withNamespaces()(
  FormationChangeConfirmationModal
);
export default FormationChangeConfirmationModal;
