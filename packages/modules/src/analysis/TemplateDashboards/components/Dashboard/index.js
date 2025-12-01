// @flow
import { useSelector, useDispatch } from 'react-redux';
import {
  useEffect,
  type ComponentType,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import { withNamespaces } from 'react-i18next';
import GridLayout, { WidthProvider } from 'react-grid-layout';
import _orderBy from 'lodash/orderBy';

import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { TabBar, ErrorBoundary } from '@kitman/components';
import { EmptyStateTranslated as EmptyState } from '@kitman/modules/src/analysis/shared/components/EmptyState';
import { useBrowserTabTitle } from '@kitman/common/src/hooks';

import { useGetTemplateDashboardWidgetsQuery } from '../../redux/services/templateDashboards';
import { WidgetTranslated as Widget } from '../Widget';
import {
  NUM_WIDGET_COLUMNS,
  HEIGHT_WIDGET_ROW,
  getDashboardLayoutConfig,
  MARGIN_BETWEEN_WIDGETS_HORIZONTALLY,
  MARGIN_BETWEEN_WIDGETS_VERTICALLY,
  getAdditionalWidgets,
  getTabDashboardLayoutConfig,
} from '../../constants';
import {
  getIfFiltersAreEmpty,
  getIfPopulationIsEmpty,
  getIsPanelOpen,
} from '../../redux/selectors/filters';
import FilterControls from '../FilterControls';
import { TableTranslated as Table } from '../Table';
import { FilterPanelTranslated as FilterPanel } from '../FilterPanel';
import DashboardLayout from '../DashboardLayout';
import WidgetSectionHeader from '../WidgetSectionHeader';
import styles from '../style';
import {
  applyFilters,
  clearFilters,
  closeFilterPanel,
  openFilterPanel,
  resetState,
} from '../../redux/slices/filters';
import { ProfileTranslated as Profile } from '../Profile';
import {
  isGrowthAndMaturationReport,
  getWidgetCategoryColors,
  getInitialTab,
} from '../../utils';

const TemplateDashboardGrid = WidthProvider(GridLayout);

type Props = {
  isTabFormat?: boolean,
};

function Dashboard(props: I18nProps<Props>) {
  const dispatch = useDispatch();
  const onCloseFilterPanel = () => dispatch(closeFilterPanel());
  const onApplyFilters = () => dispatch(applyFilters());
  const onClearFilters = () => dispatch(clearFilters());
  const onOpenFilterPanel = () => dispatch(openFilterPanel());

  const isPanelOpen = useSelector(getIsPanelOpen);
  const areFiltersEmpty = useSelector(getIfFiltersAreEmpty);
  const isPopulationFilterEmpty = useSelector(getIfPopulationIsEmpty);
  const pathname = useLocationPathname();
  const [, , , dashboardKey] = pathname.split('/');

  // skipping for growth_and_maturation as it uses another endpoint.
  const { data = { template_dashboard_name: '', widgets: [] }, isLoading } =
    useGetTemplateDashboardWidgetsQuery(dashboardKey, {
      skip: isGrowthAndMaturationReport(),
    });

  // G&M only depends on population filter
  const isContentAvailable = isGrowthAndMaturationReport()
    ? !isPopulationFilterEmpty && !isLoading
    : !areFiltersEmpty && !isLoading;

  const widgetLayout = [...getDashboardLayoutConfig()[dashboardKey]];
  const metaData = data?.meta || {};
  const widgetCategoryColors = getWidgetCategoryColors(metaData);

  const allWidgets = [
    ...data.widgets.map((widget) => ({ ...widget })),
    ...getAdditionalWidgets(dashboardKey),
  ];

  useEffect(() => {
    // Reset state is required so that static dashboards can reuse the same store
    // and retrieving the values from the localStorage.
    dispatch(resetState());
  }, [dashboardKey, dispatch]);

  const renderGrid = useCallback(
    (layout, widgets) => {
      return (
        <TemplateDashboardGrid
          css={{
            position: 'relative',
          }}
          layout={layout}
          margin={[
            MARGIN_BETWEEN_WIDGETS_HORIZONTALLY,
            MARGIN_BETWEEN_WIDGETS_VERTICALLY,
          ]}
          containerPadding={[0, 0]}
          rowHeight={HEIGHT_WIDGET_ROW}
          cols={NUM_WIDGET_COLUMNS}
          isDroppable={false}
          isDraggable={false}
          isResizable={false}
          autoSize
        >
          {_orderBy(layout, ['x', 'y'], ['asc', 'asc'])
            .map((layoutWidget) => {
              const widget = widgets?.find(
                ({ id }) => layoutWidget.i === `${id}`
              );

              if (!widget) {
                return null;
              }

              switch (widget.type) {
                case 'athlete':
                  return (
                    <div key={widget.id}>
                      <Profile />
                    </div>
                  );
                case 'header':
                  return (
                    <div key={widget.id}>
                      <WidgetSectionHeader
                        widgetId={widget.id}
                        widgetTitle={widget.title}
                      />
                    </div>
                  );
                case 'table':
                  return (
                    <div key={widget.id}>
                      <Table />
                    </div>
                  );
                default:
                  return (
                    <div id={widget.id} key={widget.id}>
                      <Widget
                        key={widget.id}
                        /* $FlowIgnore - flow doesnt like the use of widget here, but the above cases in the switch mean it is safe */
                        widget={widget}
                        widgetColors={widgetCategoryColors}
                      />
                    </div>
                  );
              }
            })
            .filter((node) => node !== null)}
        </TemplateDashboardGrid>
      );
    },
    [widgetCategoryColors]
  );
  const tabPanes = useMemo(
    () =>
      getTabDashboardLayoutConfig()
        [dashboardKey]?.map((dashboardTab) => {
          return {
            title: dashboardTab.title,
            tabHash: dashboardTab.tabHash,
            content: <>{renderGrid([...dashboardTab.layout], allWidgets)}</>,
          };
        })
        .map((tab, index) => ({ ...tab, tabKey: index.toString() })),
    [allWidgets, dashboardKey, renderGrid]
  );
  const initialTab = useRef(getInitialTab(tabPanes));
  const [currentTab, setCurrentTab] = useState(initialTab.current);
  useBrowserTabTitle([
    props.t('Dashboard'),
    tabPanes?.[currentTab]?.title ?? '',
  ]);

  const onClickTab = (tabKey) => {
    const tabHash = tabPanes.find(
      (tabPane) => tabPane.tabKey === tabKey
    )?.tabHash;

    if (tabHash) {
      // We use location.replace so it does not push the page in the history.
      // This prevents the browser back button from redirecting the user to the
      // previous hash instead of the previous page
      window.location.replace(tabHash);
    }

    setCurrentTab(tabKey);
  };

  // Render dashboard content splitted with tabs.
  // Layout can be updated in `getTabDashboardLayoutConfig`.
  const renderDashboardContentWithTabs = () => {
    return (
      <TabBar
        customStyles=".rc-tabs-bar { padding: 0 24px; }, .rc-tabs::before { background-color: unset }, .rc-tabs-tabpane { position: relative }"
        tabPanes={tabPanes.map((tabPane) => ({
          title: tabPane.title,
          content: tabPane.content,
        }))}
        onClickTab={onClickTab}
        initialTab={currentTab}
        destroyInactiveTabPane
        kitmanDesignSystem
      />
    );
  };

  const showTabGrid = props.isTabFormat && isContentAvailable;
  const showSinglePageGrid = !props.isTabFormat && isContentAvailable;

  return (
    <>
      <DashboardLayout title={data?.template_dashboard_name}>
        <DashboardLayout.Header>
          <FilterControls onFilterIcon={onOpenFilterPanel} />
        </DashboardLayout.Header>
        {!isGrowthAndMaturationReport() && areFiltersEmpty && (
          <DashboardLayout.Content styles={styles.dashboardNoContent}>
            <EmptyState
              icon="icon-bar-chart-reporting"
              title={props.t('No data available')}
              infoMessage={props.t('Apply some filters to render your report')}
            />
          </DashboardLayout.Content>
        )}
        {isGrowthAndMaturationReport() && isPopulationFilterEmpty && (
          <DashboardLayout.Content styles={styles.dashboardNoContent}>
            <EmptyState
              icon="icon-bar-chart-reporting"
              title={props.t('No data available')}
              infoMessage={props.t('Apply some filters to render your report')}
            />
          </DashboardLayout.Content>
        )}
        {showTabGrid && (
          <ErrorBoundary>
            <DashboardLayout.Content>
              {renderDashboardContentWithTabs()}
            </DashboardLayout.Content>
          </ErrorBoundary>
        )}
        {showSinglePageGrid && (
          <ErrorBoundary>
            <DashboardLayout.Content>
              {renderGrid(widgetLayout, allWidgets)}
            </DashboardLayout.Content>
          </ErrorBoundary>
        )}
        <FilterPanel
          isOpen={isPanelOpen}
          onClose={onCloseFilterPanel}
          onApply={onApplyFilters}
          onClear={onClearFilters}
          dashboardKey={dashboardKey}
        />
      </DashboardLayout>
    </>
  );
}

export const DashboardTranslated: ComponentType<Props> =
  withNamespaces()(Dashboard);
export default Dashboard;
