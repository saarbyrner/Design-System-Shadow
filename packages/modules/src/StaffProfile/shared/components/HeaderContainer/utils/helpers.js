// @flow
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import type { HumanInputUser } from '@kitman/modules/src/HumanInput/types/forms';
import type { Translation } from '@kitman/common/src/types/i18n';

type GetTitle = {
  mode: $Values<typeof MODES>,
  user: HumanInputUser | null,
  t: Translation,
};

export const getTitle = ({ mode, user, t }: GetTitle) => {
  switch (mode) {
    case MODES.CREATE:
      return t('Create staff');
    case MODES.EDIT:
      return user?.fullname || t('Edit staff');
    case MODES.VIEW:
      return user?.fullname || t('View staff');
    default:
      return '';
  }
};

export const getButtonTranslations = (t: Translation) => ({
  deactivateUser: t('Deactivate User'),
  activateUser: t('Activate User'),
});

export const getToastTranslations = (t: Translation) => ({
  activated: t('activated'),
  deactivated: t('deactivated'),
  activate: t('activate'),
  deactivate: t('deactivate'),
});

export const getModalTranslations = (t: Translation) => ({
  activate: t('activate'),
  deactivate: t('deactivate'),
  cancel: t('Cancel'),
});
