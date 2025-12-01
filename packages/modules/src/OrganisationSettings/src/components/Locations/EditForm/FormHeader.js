// @flow
import { withNamespaces } from 'react-i18next';

import type { Translation } from '@kitman/common/src/types/i18n';
import styles from './utils/styles';

const Text = ({ text }: { text: string }) => (
  <p css={styles.headerText}>{text}</p>
);

const FormHeader = ({ t }: { t: Translation }) => {
  return (
    <div css={styles.singleRowContainer}>
      <Text text={t('Name')} />
      <Text text={t('Location Type')} />
      <Text text={t('Related Event')} />
    </div>
  );
};

export const FormHeaderTranslated = withNamespaces()(FormHeader);
export default FormHeader;
