// @flow
import { withNamespaces } from 'react-i18next';

import { Dropdown, LegacyModal as Modal, TextButton } from '@kitman/components';
import type { DropdownItem } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  isOpen: boolean,
  dashboardList: Array<DropdownItem>,
  selectedDashboard: string,
  closeModal: Function,
  onConfirm: Function,
  onChange: Function,
};

const DashboardSelectorModal = (props: I18nProps<Props>) => (
  <Modal
    isOpen={props.isOpen}
    close={props.closeModal}
    title={props.t('Save Graph')}
    width={490}
  >
    <div className="dashboardSelectorModal__dropdown">
      <Dropdown
        items={props.dashboardList}
        onChange={(selectedDashboard) => props.onChange(selectedDashboard)}
        label={props.t('Choose Dashboard')}
        value={props.selectedDashboard}
      />
    </div>
    <div className="km-datagrid-modalFooter">
      <TextButton
        text={props.t('Cancel')}
        type="secondary"
        onClick={props.closeModal}
      />
      <TextButton
        text={props.t('Save')}
        type="primary"
        onClick={props.onConfirm}
      />
    </div>
  </Modal>
);

export default DashboardSelectorModal;
export const DashboardSelectorModalTranslated = withNamespaces()(
  DashboardSelectorModal
);
