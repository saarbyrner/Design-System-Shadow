// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { GenericDocumentStatuses } from '@kitman/services/src/services/documents/generic/redux/services/types';

export const getHeaderLabels = () => ({
  status: i18n.t('Status'),
  category: i18n.t('Category'),
  search: i18n.t('Search'),
});

export const documentStatuses = [
  { value: GenericDocumentStatuses.ACTIVE, label: i18n.t('Active') },
  { value: GenericDocumentStatuses.EXPIRED, label: i18n.t('Expired') },
  { value: GenericDocumentStatuses.FUTURE, label: i18n.t('Future') },
];
