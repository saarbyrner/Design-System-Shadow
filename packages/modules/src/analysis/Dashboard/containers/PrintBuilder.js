import { useSelector, useDispatch } from 'react-redux';
import PrintBuilder from '../components/PrintBuilder';
import {
  closePrintBuilder,
  updatePrintOrientation,
  updatePrintPaperSize,
} from '../redux/actions/printBuilder';
import {
  saveDashboard,
  saveDashboardLayout,
  updateDashboardPrintLayout,
} from '../redux/actions/dashboard';
import {
  useGetPermittedSquadsQuery,
  useGetSquadAthletesQuery,
} from '../redux/services/dashboard';

export default (props) => {
  const dispatch = useDispatch();
  const widgets = useSelector((state) => state.dashboard.widgets);
  const activeDashboard = useSelector(
    (state) => state.dashboard.activeDashboard
  );
  const containerType = useSelector((state) => state.staticData.containerType);
  const dashboardPrintLayout = useSelector(
    (state) => state.dashboard.dashboardPrintLayout
  );
  const printPaperSize = useSelector(
    (state) => state.dashboard.activeDashboard.print_paper_size || 'a_4'
  );
  const printOrientation = useSelector(
    (state) => state.dashboard.activeDashboard.print_orientation || 'portrait'
  );
  const { data: squadAthletes } = useGetSquadAthletesQuery();
  const { data: squads } = useGetPermittedSquadsQuery();
  const dashboardName = useSelector(
    (state) => state.dashboard.activeDashboard.name
  );

  const layoutChanged = (currentLayout, newLayout) => {
    if (currentLayout.length !== newLayout.length) {
      return true;
    }

    return newLayout.some((layoutItem) => {
      const containerWidgetId = parseInt(layoutItem.i, 10);
      const containerWidget = widgets.find(
        (widget) => widget.id === containerWidgetId
      );
      if (containerWidget == null) {
        return true;
      }
      return (
        layoutItem.h !== containerWidget.print_rows ||
        layoutItem.w !== containerWidget.print_cols ||
        layoutItem.x !== containerWidget.print_horizontal_position ||
        layoutItem.y !== containerWidget.print_vertical_position
      );
    });
  };

  const handleUpdate = (
    updatedDashboardPrintLayout,
    updateWithCurrentLayout = true,
    saveChanges = true
  ) => {
    // don't try and save when the layout is the same
    // this happens when the print layout is first shown
    if (layoutChanged(dashboardPrintLayout, updatedDashboardPrintLayout)) {
      // if updateWithCurrentLayout is false then we would expect to receive
      // a layout other than the current layout since dashboardPrintLayout is
      // the existing layout in the redux state
      if (updateWithCurrentLayout) {
        dispatch(updateDashboardPrintLayout(updatedDashboardPrintLayout));
      } else {
        dispatch(updateDashboardPrintLayout(dashboardPrintLayout));
      }
      if (saveChanges) {
        dispatch(saveDashboardLayout(containerType, activeDashboard.id, true));
      }
    }
  };

  return (
    <PrintBuilder
      close={() => {
        dispatch(closePrintBuilder());
      }}
      onUpdateDashboardPrintLayout={handleUpdate}
      onUpdatePrintOrientation={(newPrintOrientation) => {
        dispatch(updatePrintOrientation(newPrintOrientation));
        dispatch(saveDashboard(true));
      }}
      onUpdatePrintPaperSize={(newPrintPaperSize) => {
        dispatch(updatePrintPaperSize(newPrintPaperSize));
        dispatch(saveDashboard(true));
      }}
      widgets={widgets}
      dashboardPrintLayout={dashboardPrintLayout}
      printPaperSize={printPaperSize}
      printOrientation={printOrientation}
      {...props}
      squadAthletes={squadAthletes || { position_groups: [] }}
      squads={squads || []}
      dashboardName={dashboardName}
    />
  );
};
