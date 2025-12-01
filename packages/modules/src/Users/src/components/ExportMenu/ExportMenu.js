// @flow
import { withNamespaces } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import uuid from 'uuid';
import { TooltipMenu, TextButton } from '@kitman/components';
import type { TooltipItem } from '@kitman/components/src/TooltipMenu/index';
import ToastDialog from '@kitman/components/src/Toast/KitmanDesignSystem/ToastDialog';
import type { ToastId, Toast } from '@kitman/components/src/Toast/types';

type ExportMenuProps = {
  menuItems: Array<TooltipItem>,
  toastHandlers: Array<{|
    closeToast: (id: ToastId) => void,
    toasts: Array<Toast>,
  |}>,
};

const ExportMenu = (props: ExportMenuProps) => {
  const renderExportMenu = () => {
    return (
      <>
        <TooltipMenu
          appendToParent
          placement="bottom-end"
          offset={[0, 5]}
          menuItems={props.menuItems}
          tooltipTriggerElement={
            <TextButton
              text={i18n.t('Download')}
              type="secondary"
              iconAfter="icon-chevron-down"
              kitmanDesignSystem
            />
          }
          kitmanDesignSystem
        />

        {props.toastHandlers.map((toastHandler) => {
          return (
            <div key={uuid()} data-testid="tooltip-menu-toast">
              <ToastDialog
                toasts={toastHandler.toasts}
                onCloseToast={toastHandler.closeToast}
              />
            </div>
          );
        })}
      </>
    );
  };

  return props.menuItems.length > 0 && renderExportMenu();
};

export const ExportMenuTranslated = withNamespaces()(ExportMenu);
export default ExportMenu;
