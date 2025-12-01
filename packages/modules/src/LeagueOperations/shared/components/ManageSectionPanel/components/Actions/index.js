// @flow
import type { Node } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import { Stack, Button } from '@kitman/playbook/components';
import { useSelector } from 'react-redux';

import useUpdateSection from '@kitman/modules/src/LeagueOperations/shared/hooks/useUpdateSection';
import { getModeFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import useManageSection from '../../hooks/useManageSection';

const Actions = (props: I18nProps<{}>) => {
  const mode = useSelector(getModeFactory());

  const {
    isSectionValid,
    isSectionEditable,
    isSectionApprovable,
    onToggleMode,
    isSubmitStatusDisabled,
  } = useManageSection();

  const { isLoading, isError, onUpdate, onUpdateStatus } = useUpdateSection();

  const isSaveDisabled = () => {
    if (isLoading) return true;
    if (isError) return false;
    return !isSectionValid;
  };

  const renderEditFlow = (): Node => {
    if (mode === MODES.VIEW) {
      return (
        <Stack direction="row" gap={2}>
          <Button onClick={() => onToggleMode({ mode: MODES.EDIT })}>
            {props.t('Edit')}
          </Button>
        </Stack>
      );
    }
    if (mode === MODES.EDIT) {
      return (
        <Stack direction="row" gap={2}>
          <Button onClick={() => onUpdate()} disabled={isSaveDisabled()}>
            {props.t('Save')}
          </Button>
          <Button
            color="secondary"
            onClick={() => onToggleMode({ mode: MODES.VIEW })}
          >
            {props.t('Cancel')}
          </Button>
        </Stack>
      );
    }
    return null;
  };

  const renderApprovalActions = (): Node => {
    return (
      <Stack direction="row" gap={2}>
        <Button onClick={onUpdateStatus} disabled={isSubmitStatusDisabled}>
          {props.t('Submit')}
        </Button>
      </Stack>
    );
  };

  const renderActionButton = () => {
    if (isSectionEditable) {
      return renderEditFlow();
    }

    if (isSectionApprovable) {
      return renderApprovalActions();
    }

    return null;
  };

  return renderActionButton();
};

export default Actions;
export const ActionsTranslated = withNamespaces()(Actions);
