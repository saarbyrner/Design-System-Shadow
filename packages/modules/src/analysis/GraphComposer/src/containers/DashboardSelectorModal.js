import { connect } from 'react-redux';
import { DashboardSelectorModalTranslated as DashboardSelectorModal } from '../components/DashboardSelectorModal';
import {
  selectDashboard,
  closeDashboardSelectorModal,
  saveGraph,
} from '../actions';

const mapStateToProps = (state) => ({
  isOpen: state.DashboardSelectorModal.isOpen,
  dashboardList: state.DashboardSelectorModal.dashboardList,
  selectedDashboard: state.DashboardSelectorModal.selectedDashboard,
});

const mapDispatchToProps = (dispatch) => ({
  onChange: (selectedDashboard) => {
    dispatch(selectDashboard(selectedDashboard));
  },
  closeModal: () => {
    dispatch(closeDashboardSelectorModal());
  },
  onConfirm: () => {
    dispatch(saveGraph());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardSelectorModal);
