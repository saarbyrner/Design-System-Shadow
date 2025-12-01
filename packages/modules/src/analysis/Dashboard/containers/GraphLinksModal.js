import { useSelector, useDispatch } from 'react-redux';
import { getMetricName } from '@kitman/modules/src/analysis/shared/utils';
import { GraphLinksModalTranslated as GraphLinksModal } from '../components/GraphLinksModal';
import {
  closeGraphLinksModal,
  addGraphLinkRow,
  removeGraphLinkRow,
  resetGraphLinks,
  selectGraphLinkOrigin,
  unselectGraphLinkOrigin,
  selectGraphLinkTarget,
  saveGraphLinks,
  closeGraphLinksAppStatus,
} from '../redux/actions/graphLinksModal';

export default () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.graphLinksModal.status);
  const open = useSelector((state) => state.graphLinksModal.open);
  const graphLinks = useSelector((state) => state.graphLinksModal.graphLinks);
  const dashboardList = useSelector((state) =>
    state.dashboardList
      .map((dashboard) => ({
        id: dashboard.id,
        title: dashboard.name,
      }))
      .filter(
        (dashboard) => state.dashboard.activeDashboard.id !== dashboard.id
      )
  );
  const metricList = useSelector((state) => {
    if (!state.graphLinksModal.graphId) {
      return [];
    }

    const currentGraph = state.dashboard.widgets.filter(
      (widget) =>
        widget.widget_type === 'graph' &&
        widget.widget_render.id === state.graphLinksModal.graphId
    )[0].widget_render;

    return currentGraph.metrics.map((metric, index) => ({
      id: index,
      name: getMetricName(metric),
    }));
  });

  return (
    <GraphLinksModal
      status={status}
      open={open}
      metricList={metricList}
      dashboardList={dashboardList}
      graphLinks={graphLinks}
      onClickCloseModal={() => {
        dispatch(closeGraphLinksModal());
      }}
      onClickAddGraphLinkRow={() => {
        dispatch(addGraphLinkRow());
      }}
      onClickRemoveGraphLinkRow={(index) => {
        if (graphLinks.length > 1) {
          dispatch(removeGraphLinkRow(index));
        } else {
          dispatch(resetGraphLinks());
        }
      }}
      onSelectGraphLinkTarget={(index, dashboardId) => {
        dispatch(selectGraphLinkTarget(index, dashboardId));
      }}
      onSelectGraphLinkOrigin={(index, metricIndex) => {
        dispatch(selectGraphLinkOrigin(index, metricIndex));
      }}
      onUnselectGraphLinkOrigin={(index, metricIndex) => {
        dispatch(unselectGraphLinkOrigin(index, metricIndex));
      }}
      onClickSaveGraphLinks={() => {
        dispatch(saveGraphLinks());
      }}
      onClickCloseAppStatus={() => {
        dispatch(closeGraphLinksAppStatus());
      }}
    />
  );
};
