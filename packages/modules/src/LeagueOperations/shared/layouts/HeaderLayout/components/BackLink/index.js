// @flow
import { type Node, useCallback } from 'react';
import i18n from '@kitman/common/src/utils/i18n';
import useHistoryGo from '@kitman/common/src/hooks/useHistoryGo';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { useTheme } from '@kitman/playbook/hooks';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Button, IconButton } from '@kitman/playbook/components';

import { useDispatch, useSelector } from 'react-redux';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import {
  onSetMode,
  onUpdateShowUnsavedChangesModal,
} from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import useUnsavedChanges from '@kitman/modules/src/HumanInput/hooks/useUnsavedChanges';
import { getModeFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import useFormToasts from '@kitman/modules/src/LeagueOperations/shared/hooks/useFormToasts';

const BackLink = (): Node => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));
  const historyGo = useHistoryGo();
  const { hasUnsavedChanges } = useUnsavedChanges();
  const { onClearToasts } = useFormToasts();
  const mode = useSelector(getModeFactory());

  const onBack = useCallback(() => {
    if (hasUnsavedChanges) {
      onClearToasts();
      dispatch(
        onUpdateShowUnsavedChangesModal({ showUnsavedChangesModal: true })
      );
    } else {
      if (mode === MODES.CREATE) {
        // Set mode to view if in create mode
        dispatch(onSetMode({ mode: MODES.VIEW }));
      }

      historyGo(-1);
    }
  }, [hasUnsavedChanges, mode, dispatch, onClearToasts, historyGo]);

  return isMobileView ? (
    <IconButton aria-label="back" color="primary">
      <KitmanIcon
        name={KITMAN_ICON_NAMES.ArrowBackIos}
        fontSize="small"
        onClick={onBack}
      />
    </IconButton>
  ) : (
    <Button
      size="small"
      variant="text"
      component="label"
      startIcon={<KitmanIcon name={KITMAN_ICON_NAMES.ArrowBack} />}
      onClick={onBack}
    >
      {i18n.t('Back')}
    </Button>
  );
};

export default BackLink;
