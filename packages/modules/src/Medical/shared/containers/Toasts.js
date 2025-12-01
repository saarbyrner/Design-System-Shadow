import { useSelector, useDispatch } from 'react-redux';
import { ToastDialog } from '@kitman/components/src/Toast/KitmanDesignSystem';
import { remove } from '@kitman/modules/src/Toasts/toastsSlice';
import { removeToast } from '../redux/actions';
import { openAddIssuePanelPreviousState } from '../../rosters/src/redux/actions';

const ToastsContainer = () => {
  const dispatch = useDispatch();
  // TODO: Move all medical toasts to use medicalToasts and not useToasts hook
  // Longer term consider not having a medical area store and use global store

  // NOTE: Medical area has it's own store, which is in the way of accessing the global one
  // The global one is where toasts get added via slice actions
  // This means dispatches of add from the slice actions never reach the global reducer from medical area.
  // To allow use of the new slice actions, we have to insert a medicalToasts store entry
  // It is named as such to avoid conflict with the existing toasts entry driven by from legacy
  // useToasts hook approach
  const legacyToasts = useSelector((state) => state.toasts);
  const medicalToasts = useSelector((state) => state.medicalToasts?.value); // These toasts come from the duplicate Toasts slice

  const toasts = [...legacyToasts, ...(medicalToasts || [])]; // Combine
  // This custom handler was required to handle click events on links else
  // redux will throw serialization related errors if we handle this specifically in
  // create chronic issue toast options.
  // packages/modules/src/Medical/rosters/src/redux/actions/index.js
  const onClickToastLink = (toastLink) => {
    if (
      toastLink?.metadata?.action ===
      'REMOVE_TOAST_AND_OPEN_CHRONIC_CONDITION_ISSUE_PANEL'
    ) {
      const panelState = toastLink?.metadata?.panelState;
      dispatch(openAddIssuePanelPreviousState(panelState));
      dispatch(removeToast(toastLink.id));
    }
  };

  return (
    <ToastDialog
      toasts={toasts}
      onClickToastLink={onClickToastLink}
      onCloseToast={(toastId) => {
        dispatch(remove(toastId));
        dispatch(removeToast(toastId));
      }}
    />
  );
};

export default ToastsContainer;
