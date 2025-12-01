// @flow
import i18n from '@kitman/common/src/utils/i18n';
import DefaultHeaderCell from '@kitman/modules/src/shared/MassUpload/New/components/DefaultHeaderCell';

import { UploadEmailHeader } from './sharedHeaders';

const GameIdHeader = {
  id: 'Game ID',
  row_key: 'Game ID',
  content: <DefaultHeaderCell title={i18n.t('Game ID')} />,
};

const RoleHeader = {
  id: 'Role',
  row_key: 'Role',
  content: <DefaultHeaderCell title={i18n.t('Role')} />,
};

export const matchMonitorAssignmentHeaders = [GameIdHeader, UploadEmailHeader];

export const officialAssignmentHeaders = [
  GameIdHeader,
  UploadEmailHeader,
  RoleHeader,
];
