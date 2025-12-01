// @flow
import { ToastDialog } from '@kitman/components/src/Toast/KitmanDesignSystem';
import { useExportSettings } from './Context';

function Toasts() {
  const { toasts, updateStatus } = useExportSettings();
  return (
    <ToastDialog
      toasts={toasts}
      onCloseToast={() => updateStatus('DONE', '', '')}
    />
  );
}

export default Toasts;
