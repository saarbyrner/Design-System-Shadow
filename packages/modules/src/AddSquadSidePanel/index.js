// @flow
import { withNamespaces } from 'react-i18next';

import { SlidingPanelResponsive } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { FormTranslated as Form } from './components/Form';

type Props = {
  isOpen: boolean,
  onClose: Function,
  onSaveSuccess: Function,
};

const AddSquadSidePanel = (props: I18nProps<Props>) => {
  return (
    <SlidingPanelResponsive
      isOpen={props.isOpen}
      onClose={props.onClose}
      kitmanDesignSystem
      title={props.t('New Team')}
      width={649}
    >
      <Form reset={!props.isOpen} onSaveSuccess={props.onSaveSuccess} />
    </SlidingPanelResponsive>
  );
};

export const AddSquadSidePanelTranslated = withNamespaces()(AddSquadSidePanel);
export default AddSquadSidePanel;
