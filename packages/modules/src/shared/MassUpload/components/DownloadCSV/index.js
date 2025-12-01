// @flow
import { withNamespaces } from 'react-i18next';
import { TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { UserTypes } from '../../types';

type Props = {
  userType: UserTypes,
};

const DownloadCSV = (props: I18nProps<Props>) => {
  return (
    <a
      href={`https://kitman.imgix.net/kitman/${props.userType}_mass_importer.csv`}
      download={`${props.userType}_mass_importer.csv`}
    >
      <TextButton
        text={props.t('Download csv')}
        type="secondary"
        kitmanDesignSystem
      />
    </a>
  );
};

export const DownloadCSVTranslated = withNamespaces()(DownloadCSV);
export default DownloadCSV;
