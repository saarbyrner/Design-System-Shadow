// @flow
import i18n from '@kitman/common/src/utils/i18n';
import DefaultHeaderCell from '@kitman/modules/src/shared/MassUpload/New/components/DefaultHeaderCell';

import {
  UploadFirstNameHeader,
  UploadLastNameHeader,
  UploadEmailHeader,
  UploadDOBHeader,
  UploadSquadNameHeader,
} from './sharedHeaders';

const UploadCountryHeader = {
  id: 'Country',
  row_key: 'Country',
  content: <DefaultHeaderCell title={i18n.t('Country')} />,
};

const UploadPositionHeader = {
  id: 'Position',
  row_key: 'Position',
  content: <DefaultHeaderCell title={i18n.t('Position')} />,
};

export default [
  UploadFirstNameHeader,
  UploadLastNameHeader,
  UploadEmailHeader,
  UploadDOBHeader,
  UploadSquadNameHeader,
  UploadCountryHeader,
  UploadPositionHeader,
];
