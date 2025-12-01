// @flow
import type { Node } from 'react';
import { withNamespaces } from 'react-i18next';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { Button } from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';

import { SAVE_PROGRESS_FEATURE_FLAG } from '@kitman/modules/src/LeagueOperations/shared/consts/index';
import useRegistrationOperations from '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationOperations';
import useUnsavedChanges from '@kitman/modules/src/HumanInput/hooks/useUnsavedChanges';
import useSaveRegistration from '@kitman/modules/src/LeagueOperations/shared/hooks/useSaveRegistration';

const ButtonSaveProgress = (
  props: I18nProps<{ isMobileView?: boolean }>
): ?Node => {
  const { registration } = useRegistrationOperations();
  const { hasUnsavedChanges } = useUnsavedChanges();
  const { handleOnSaveRegistration, isSaveInProgress, isRefetchingProfile } =
    useSaveRegistration();

  return window.featureFlags[SAVE_PROGRESS_FEATURE_FLAG] &&
    (registration.athlete.canCreate || registration.staff.canCreate) ? (
    <Button
      key="save_progress"
      color="secondary"
      size="small"
      onClick={handleOnSaveRegistration}
      disabled={!hasUnsavedChanges || isSaveInProgress || isRefetchingProfile}
    >
      {props.isMobileView ? (
        <KitmanIcon name={KITMAN_ICON_NAMES.SaveAs} />
      ) : (
        props.t('Save Progress')
      )}
    </Button>
  ) : null;
};

export default ButtonSaveProgress;
export const ButtonSaveProgressTranslated =
  withNamespaces()(ButtonSaveProgress);
