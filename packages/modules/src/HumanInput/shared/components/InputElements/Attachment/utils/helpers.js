// @flow
import { renderToString } from 'react-dom/server';

import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import i18n from '@kitman/common/src/utils/i18n';

const fileTypesEnumLike = {
  'application/pdf': 'PDF',
  'image/jpeg': 'JPEG',
  'image/jpg': 'JPG',
  'image/png': 'PNG',
  'image/gif': 'GIF',
  'text/csv': 'CSV',
};

export const getIdleLabel = (
  fileTypes: Array<string> = [],
  maxSize: string = ''
) => {
  let label = renderToString(
    <>
      <KitmanIcon name={KITMAN_ICON_NAMES.UploadFile} />
      <p>
        <span className="filepond--label-action">
          {i18n.t('Click to upload')}
        </span>
        &nbsp;
        {i18n.t('or drag and drop')}
      </p>
      <p>
        {fileTypes
          .map((fileType) => fileTypesEnumLike[fileType] || fileType)
          .join(', ')}
      </p>
    </>
  );

  if (maxSize) {
    label += renderToString(
      <p>
        {i18n.t('Max file size: ')} {maxSize}
      </p>
    );
  }

  return label;
};
