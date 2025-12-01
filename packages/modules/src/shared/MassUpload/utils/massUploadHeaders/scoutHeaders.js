// @flow
import i18n from '@kitman/common/src/utils/i18n';
import DefaultHeaderCell from '@kitman/modules/src/shared/MassUpload/New/components/DefaultHeaderCell';

import {
  UploadFirstNameHeader,
  UploadLastNameHeader,
  UploadEmailHeader,
  UploadDOBHeader,
  UploadLanguageHeader,
} from './sharedHeaders';

const UploadTypeHeader = {
  id: 'Type',
  row_key: 'Type',
  content: <DefaultHeaderCell title={i18n.t('Type')} />,
};

const UploadOrganisationHeader = {
  id: 'Organisation',
  row_key: 'Organisation',
  content: <DefaultHeaderCell title={i18n.t('Organisation')} />,
};

export default [
  UploadFirstNameHeader,
  UploadLastNameHeader,
  UploadEmailHeader,
  UploadDOBHeader,
  UploadLanguageHeader,
  UploadTypeHeader,
  UploadOrganisationHeader,
];
