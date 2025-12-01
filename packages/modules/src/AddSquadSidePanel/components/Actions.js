// @flow
import { withNamespaces } from 'react-i18next';

import { TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  onSave: Function,
  isDisabled: boolean,
};

const Actions = (props: I18nProps<Props>) => (
  <div className="addIssueSidePanel">
    <TextButton
      onClick={props.onSave}
      text={props.t('Save')}
      type="primary"
      isDisabled={props.isDisabled}
      kitmanDesignSystem
    />
  </div>
);
export const ActionsTranslated = withNamespaces()(Actions);
export default Actions;
