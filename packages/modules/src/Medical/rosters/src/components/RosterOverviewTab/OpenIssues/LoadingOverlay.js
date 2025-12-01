// @flow
import { CircularProgress } from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { style } from './style';

type Props = {};

const LoadingOverlay = ({ t }: I18nProps<Props>) => (
  <div css={style.loadingOverlay}>
    <CircularProgress size={40} />
    <div css={style.loadingText}>{t('Loading injury details...')}</div>
  </div>
);

export default LoadingOverlay;
