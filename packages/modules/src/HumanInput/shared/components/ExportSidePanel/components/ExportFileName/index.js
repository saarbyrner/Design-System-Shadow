// @flow
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { InputText } from '@kitman/components';

type Props = {
  value: string,
  onUpdate: Function,
};

const ExportFileName = (props: I18nProps<Props>) => {
  return (
    <InputText
      value={props.value}
      onValidation={(input) => {
        props.onUpdate(input?.value);
      }}
      label={props.t('File name')}
      kitmanDesignSystem
    />
  );
};

export const ExportFileNameTranslated = withNamespaces()(ExportFileName);
export default ExportFileName;
