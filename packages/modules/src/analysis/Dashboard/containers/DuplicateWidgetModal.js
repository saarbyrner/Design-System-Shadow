import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DuplicateWidgetModalTranslated as DuplicateWidgetModal } from '../components/DuplicateWidgetModal';
import {
  changeSelectedDashboard,
  changeSelectedSquad,
  changeDuplicateWidgetName,
  closeDuplicateWidgetAppStatus,
  closeDuplicateWidgetModal,
  saveDuplicateWidget,
} from '../redux/actions/duplicateWidgetModal';
import {
  useGetSquadDashboardsQuery,
  useGetActiveSquadQuery,
  useGetPermittedSquadsQuery,
} from '../redux/services/dashboard';

export default (props) => {
  const dispatch = useDispatch();
  const {
    isNameEditable,
    isOpen,
    selectedDashboard,
    selectedSquad,
    activeDashboard,
    status,
    widgetName,
    widgetType,
  } = useSelector((state) => state.duplicateWidgetModal);
  const { data: activeSquad = { id: null, name: '' } } =
    useGetActiveSquadQuery();
  const squadData = useGetPermittedSquadsQuery();
  const dashboardData = useGetSquadDashboardsQuery(selectedSquad.id, {
    skip: selectedSquad.id === null,
  });

  useEffect(() => {
    if (selectedSquad.id === null && activeSquad.id !== null) {
      dispatch(changeSelectedSquad({ ...activeSquad }));
    }
  }, [selectedSquad.id, activeSquad.id]);

  return (
    <DuplicateWidgetModal
      isNameEditable={isNameEditable}
      isOpen={isOpen}
      selectedDashboard={selectedDashboard}
      selectedSquad={selectedSquad}
      activeDashboard={activeDashboard}
      activeSquad={activeSquad}
      status={status}
      widgetName={widgetName}
      widgetType={widgetType}
      squadData={squadData}
      dashboardData={dashboardData}
      onChangeSelectedDashboard={(dashboard) => {
        dispatch(changeSelectedDashboard(dashboard));
      }}
      onChangeSelectedSquad={(squad) => {
        dispatch(changeSelectedSquad(squad));
      }}
      onChangeDuplicateWidgetName={(name) => {
        dispatch(changeDuplicateWidgetName(name));
      }}
      onClickCloseAppStatus={() => {
        dispatch(closeDuplicateWidgetAppStatus());
      }}
      onClickCloseModal={(newSelectedDashboard) => {
        dispatch(closeDuplicateWidgetModal(newSelectedDashboard));
      }}
      onClickSaveDuplicateWidget={() => {
        dispatch(saveDuplicateWidget());
      }}
      {...props}
    />
  );
};
