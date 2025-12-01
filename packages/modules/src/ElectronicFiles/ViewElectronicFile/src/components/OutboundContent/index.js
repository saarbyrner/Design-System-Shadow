// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { OutboundElectronicFile } from '@kitman/modules/src/ElectronicFiles/shared/types';
import { SelectedFilesTranslated as SelectedFiles } from '@kitman/modules/src/ElectronicFiles/shared/components/SelectedFiles';

type Props = {
  electronicFile: OutboundElectronicFile,
};

const OutboundContent = ({ electronicFile }: I18nProps<Props>) => {
  return (
    <SelectedFiles
      attachedFiles={electronicFile.attachments}
      fitContent
      hideTitle
      hideRemoveAction
    />
  );
};

export const OutboundContentTranslated: ComponentType<Props> =
  withNamespaces()(OutboundContent);
export default OutboundContent;
