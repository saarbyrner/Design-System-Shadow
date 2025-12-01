import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DuplicateDashboardModalTranslated as DuplicateDashboardModal } from '../components/DuplicateDashboardModal';
import {
  changeDuplicateDashboardName,
  changeDuplicateDashboardSelectedSquad,
  closeDuplicateDashboardAppStatus,
  closeDuplicateDashboardModal,
  saveDuplicateDashboard,
} from '../redux/actions/duplicateDashboardModal';
import {
  useGetActiveSquadQuery,
  useGetPermittedSquadsQuery,
} from '../redux/services/dashboard';

export default (props) => {
  const dispatch = useDispatch();
  const { isOpen, status, dashboardName, selectedSquad } = useSelector(
    (state) => state.duplicateDashboardModal
  );
  const { data: activeSquad = { id: null, name: '' } } =
    useGetActiveSquadQuery();
  const squadData = useGetPermittedSquadsQuery();

  useEffect(() => {
    if (selectedSquad.id === null && activeSquad.id !== null) {
      dispatch(changeDuplicateDashboardSelectedSquad({ ...activeSquad }));
    }
  }, [selectedSquad.id, activeSquad.id]);

  return (
    <DuplicateDashboardModal
      dashboardName={dashboardName}
      isOpen={isOpen}
      status={status}
      onChangeDashboardName={(name) => {
        dispatch(changeDuplicateDashboardName(name));
      }}
      onClickCloseAppStatus={() => {
        dispatch(closeDuplicateDashboardAppStatus());
      }}
      onClickCloseModal={() => {
        dispatch(closeDuplicateDashboardModal());
      }}
      onClickSaveDuplicateDashboard={() => {
        dispatch(saveDuplicateDashboard());
      }}
      squadData={squadData}
      activeSquad={activeSquad}
      selectedSquad={selectedSquad}
      onChangeSelectedSquad={(squad) => {
        dispatch(changeDuplicateDashboardSelectedSquad(squad));
      }}
      {...props}
    />
  );
};
