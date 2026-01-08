// @flow
import { withNamespaces } from 'react-i18next';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { type I18nProps } from '@kitman/common/src/types/i18n';

import style from './style';

type Props = {
  customValidationText?: string,
};
const ValidationText = ({ t, customValidationText }: I18nProps<Props>) => (
  <div css={style.validationText}>
    <KitmanIcon name={KITMAN_ICON_NAMES.ErrorOutline} sx={style.icon} />
    <span css={style.text}>
      {customValidationText || t('This field is required')}
    </span>
  </div>
);

export const ValidationTextTranslated = withNamespaces()(ValidationText);
export default ValidationText;
