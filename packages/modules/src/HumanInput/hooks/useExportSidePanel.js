// @flow
import { useDispatch, useSelector } from 'react-redux';
import { getIsOpenExportSidePanelFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/humanInputSelectors';
import {
  onCloseExportSidePanel,
  onOpenExportSidePanel,
} from '@kitman/modules/src/HumanInput/shared/redux/slices/humanInputSlice';

export type ReturnType = {
  isExportSidePanelOpen: boolean,
  handleCloseExportSidePanel: Function,
  handleOpenExportSidePanel: Function,
};

const useExportSidePanel = (): ReturnType => {
  const dispatch = useDispatch();
  const isExportSidePanelOpen = useSelector(getIsOpenExportSidePanelFactory());
  const handleCloseExportSidePanel = () => {
    dispatch(onCloseExportSidePanel());
  };
  const handleOpenExportSidePanel = () => {
    dispatch(onOpenExportSidePanel());
  };

  return {
    isExportSidePanelOpen,
    handleCloseExportSidePanel,
    handleOpenExportSidePanel,
  };
};

export default useExportSidePanel;
