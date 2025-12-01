// @flow
import type { FormStatus } from '@kitman/modules/src/HumanInput/types/forms';
import { Chip } from '@kitman/playbook/components';
import i18n from '@kitman/common/src/utils/i18n';

export const renderStatusChip = (formStatus: FormStatus) => {
  switch (formStatus) {
    case 'complete':
      return <Chip label={i18n.t('Complete')} color="success" size="small" />;
    case 'draft':
      return <Chip label={i18n.t('Draft')} color="secondary" size="small" />;
    case 'deleted':
      return null;
    case 'not_started':
      return null;
    default:
      return <>{i18n.t('Status not supported')}</>;
  }
};
