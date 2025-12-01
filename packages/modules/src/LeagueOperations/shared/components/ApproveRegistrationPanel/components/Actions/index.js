// @flow
import type { Node } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Stack, Button } from '@kitman/playbook/components';

import useApproveRegistration from '@kitman/modules/src/LeagueOperations/shared/components/ApproveRegistrationPanel/hooks/useApproveRegistration';

const Actions = (props: I18nProps<{}>) => {
  const { onApproveRegistration, isSubmitStatusDisabled } =
    useApproveRegistration();

  const renderApprovalActions = (): Node => {
    return (
      <Stack direction="row" gap={2}>
        <Button
          onClick={onApproveRegistration}
          disabled={isSubmitStatusDisabled}
        >
          {props.t('Submit')}
        </Button>
      </Stack>
    );
  };

  return renderApprovalActions();
};

export default Actions;
export const ActionsTranslated = withNamespaces()(Actions);
