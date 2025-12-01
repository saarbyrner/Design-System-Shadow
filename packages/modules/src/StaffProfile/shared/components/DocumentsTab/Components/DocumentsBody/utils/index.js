// @flow
import moment from 'moment';
import type { Node } from 'react';
import i18n from '@kitman/common/src/utils/i18n';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import {
  GenericDocumentStatuses,
  type GenericDocumentStatus,
} from '@kitman/services/src/services/documents/generic/redux/services/types';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { Link, Chip } from '@kitman/playbook/components';

export const FALLBACK_DASH = '-';

export const formatCellDate = (dateValue: string) => {
  const documentDate = moment(dateValue);

  return documentDate.isValid()
    ? DateFormatter.formatStandard({ date: documentDate })
    : FALLBACK_DASH;
};

export const renderFileCell = ({ value }: Object) => {
  const filename = value?.filename;
  const downloadUrl = value?.downloadUrl;

  return (
    <>
      <KitmanIcon
        name={KITMAN_ICON_NAMES.InsertDriveFileOutlined}
        fontSize="small"
      />
      <Link underline="none" href={downloadUrl} sx={{ ml: 1 }}>
        {filename}
      </Link>
    </>
  );
};

export const renderStatusCell = ({ value }: Object): Node | string => {
  if (!value) {
    return FALLBACK_DASH;
  }

  const isActive = value === GenericDocumentStatuses.ACTIVE;
  const iconName = isActive ? KITMAN_ICON_NAMES.Done : KITMAN_ICON_NAMES.Error;

  const getLabel = (status: GenericDocumentStatus) => {
    switch (status) {
      case GenericDocumentStatuses.ACTIVE:
        return i18n.t('Active');
      case GenericDocumentStatuses.FUTURE:
        return i18n.t('Future');
      case GenericDocumentStatuses.EXPIRED:
        return i18n.t('Expired');
      default:
        return FALLBACK_DASH;
    }
  };

  const getColor = (status: GenericDocumentStatus) => {
    switch (status) {
      case GenericDocumentStatuses.ACTIVE:
        return 'success';
      case GenericDocumentStatuses.FUTURE:
        return 'info';
      case GenericDocumentStatuses.EXPIRED:
        return 'error';
      default:
        return 'default';
    }
  };
  return (
    <Chip
      icon={<KitmanIcon name={iconName} />}
      label={getLabel(value)}
      color={getColor(value)}
    />
  );
};
