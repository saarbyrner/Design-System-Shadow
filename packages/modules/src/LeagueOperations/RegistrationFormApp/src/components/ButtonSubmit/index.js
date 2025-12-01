// @flow
import type { Node } from 'react';
import { withNamespaces } from 'react-i18next';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { Button } from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';

import useRegistrationOperations from '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationOperations';

import useCreateRegistration from '@kitman/modules/src/LeagueOperations/shared/hooks/useCreateRegistration';

const ButtonSubmit = (props: I18nProps<{ isMobileView?: boolean }>): ?Node => {
  const { registration } = useRegistrationOperations();
  const { handleOnCreateRegistration, isDisabled } = useCreateRegistration();

  return registration.athlete.canCreate || registration.staff.canCreate ? (
    <Button
      key="submit"
      disabled={isDisabled}
      size="small"
      variant="contained"
      onClick={handleOnCreateRegistration}
      color="primary"
      sx={{ ml: 0.5 }}
    >
      {props.isMobileView ? (
        <KitmanIcon name={KITMAN_ICON_NAMES.SendOutlined} />
      ) : (
        props.t('Submit')
      )}
    </Button>
  ) : null;
};

export default ButtonSubmit;
export const ButtonSubmitTranslated = withNamespaces()(ButtonSubmit);
