// @flow
import { useDispatch } from 'react-redux';

import useUnsavedChanges from '@kitman/modules/src/HumanInput/hooks/useUnsavedChanges';
import {
  onSetMode,
  onUpdateShowUnsavedChangesModal,
} from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import type { Mode } from '@kitman/modules/src/HumanInput/types/forms';

export const useCancelFormEdit = (mode: Mode) => {
  const dispatch = useDispatch();

  const { hasUnsavedChanges } = useUnsavedChanges();
  const onCancelFormEdit = () => {
    if (hasUnsavedChanges) {
      dispatch(
        onUpdateShowUnsavedChangesModal({ showUnsavedChangesModal: true })
      );
    } else {
      dispatch(
        onSetMode({ mode: mode === MODES.CREATE ? MODES.CREATE : MODES.VIEW })
      );
    }
  };
  return { onCancelFormEdit };
};
