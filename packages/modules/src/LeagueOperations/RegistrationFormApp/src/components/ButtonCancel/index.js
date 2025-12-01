// @flow
import type { Node } from 'react';
import { useCallback } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { Button } from '@kitman/playbook/components';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import {
  onSetMode,
  onUpdateShowUnsavedChangesModal,
} from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import useUnsavedChanges from '@kitman/modules/src/HumanInput/hooks/useUnsavedChanges';
import useHistoryGo from '@kitman/common/src/hooks/useHistoryGo';
import { getModeFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import useFormToasts from '@kitman/modules/src/LeagueOperations/shared/hooks/useFormToasts';

const ButtonCancel = (props: I18nProps<{ isMobileView?: boolean }>): ?Node => {
  const dispatch = useDispatch();
  const historyGo = useHistoryGo();
  const { hasUnsavedChanges } = useUnsavedChanges();
  const { onClearToasts } = useFormToasts();
  const mode = useSelector(getModeFactory());

  const onCancel = useCallback(() => {
    onClearToasts();
    if (hasUnsavedChanges) {
      dispatch(
        onUpdateShowUnsavedChangesModal({ showUnsavedChangesModal: true })
      );
    } else {
      // Set mode and redirect back to profile view
      dispatch(onSetMode({ mode: MODES.VIEW }));
      historyGo(-1);
    }
  }, [hasUnsavedChanges, mode, dispatch]);

  return mode === MODES.CREATE ? (
    <Button
      key="cancel"
      variant="contained"
      size="small"
      onClick={onCancel}
      color="secondary"
      sx={{ ml: 0.5 }}
    >
      {props.isMobileView ? (
        <KitmanIcon name={KITMAN_ICON_NAMES.Close} />
      ) : (
        props.t('Cancel')
      )}
    </Button>
  ) : null;
};

export default ButtonCancel;
export const ButtonCancelTranslated = withNamespaces()(ButtonCancel);
