// @flow
import { Box } from '@kitman/playbook/components';
import { useSelector, useDispatch } from 'react-redux';
import { tabContainerSx } from '@kitman/modules/src/StaffProfile/shared/utils/styles';
import {
  onCloseGuardianSidePanel,
  onCloseDeleteGuardianModal,
  onResetSidePanelForm,
  onResetDeleteGuardianModalForm,
} from '@kitman/modules/src/AthleteProfile/redux/slices/guardiansTabSlice';
import {
  getIsOpenGuardianSidePanelFactory,
  getIsOpenDeleteGuardianModalFactory,
} from '@kitman/modules/src/AthleteProfile/redux/selectors';
import { GuardiansTableTranslated as GuardiansTable } from './GuardiansTable';
import { GuardiansHeaderTranslated as GuardiansHeader } from './GuardiansHeader';
import { GuardianSidePanelTranslated as GuardianSidePanel } from './GuardianSidePanel';
import { DeleteGuardianModalTranslated as DeleteGuardianModal } from './GuardiansTable/Components/DeleteGuardianModal';

const GuardiansTab = () => {
  const dispatch = useDispatch();
  const isGuardianSidePanelOpen = useSelector(
    getIsOpenGuardianSidePanelFactory()
  );
  const isDeleteGuardianModalOpen = useSelector(
    getIsOpenDeleteGuardianModalFactory()
  );
  return (
    <Box sx={tabContainerSx}>
      <GuardiansHeader />
      <GuardiansTable />
      <GuardianSidePanel
        isOpen={isGuardianSidePanelOpen}
        onClose={() => {
          dispatch(onCloseGuardianSidePanel());
          dispatch(onResetSidePanelForm());
        }}
      />
      <DeleteGuardianModal
        isOpen={isDeleteGuardianModalOpen}
        onClose={() => {
          dispatch(onCloseDeleteGuardianModal());
          dispatch(onResetDeleteGuardianModalForm());
        }}
      />
    </Box>
  );
};

export default GuardiansTab;
