import i18n from '@kitman/common/src/utils/i18n';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeNotesModal } from '@kitman/modules/src/Annotations/components/AnnotationModal/actions';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import getAreCoachingPrinciplesEnabled from '../redux/actions/coachingPrinciples';
import { AppTranslated as App } from '../components/App';
import {
  deleteWidget,
  fetchWidgets,
  fetchWidgetContent,
} from '../redux/actions/widgets';
import {
  updateDashboard,
  updateDashboardLayout,
  sortGraphWidget,
  setCodingSystemKey,
  refreshDashboardCache,
} from '../redux/actions/dashboard';
import {
  closeGraphLinksModal,
  openGraphLinksModal,
} from '../redux/actions/graphLinksModal';
import { openDuplicateDashboardModal } from '../redux/actions/duplicateDashboardModal';
import { openDuplicateWidgetModal } from '../redux/actions/duplicateWidgetModal';
import {
  closeHeaderWidgetModal,
  openHeaderWidgetModal,
} from '../redux/actions/headerWidgetModal';
import {
  closeProfileWidgetModal,
  openProfileWidgetModal,
  updatePreview,
} from '../redux/actions/profileWidgetModal';
import {
  closeNotesWidgetSettingsModal,
  openNotesWidgetSettingsModal,
} from '../redux/actions/notesWidgetSettingsModal';
import { openTableWidgetModal } from '../redux/actions/tableWidgetModal';
import { openActionsWidgetModal } from '../redux/actions/actionsWidgetModal';
import { developmentGoalWidget } from '../redux/actions/developmentGoalWidget';
import {
  toggleSlidingPanel,
  updateAggregationPeriod,
} from '../redux/actions/pivotPanel';
import {
  closeReorderModal,
  openReorderModal,
} from '../redux/actions/reorderModal';
import { openPrintBuilder } from '../redux/actions/printBuilder';

export default (props) => {
  const dispatch = useDispatch();
  const widgets = useSelector((state) => state.dashboard.widgets);
  const status = useSelector((state) => state.dashboard.status);
  const appStatusText = useSelector((state) => state.dashboard.appStatusText);
  const canManageDashboard = useSelector(
    (state) => state.staticData.canManageDashboard
  );
  const canViewNotes = useSelector((state) => state.staticData.canViewNotes);
  const hasDevelopmentGoalsModule = useSelector(
    (state) => state.staticData.hasDevelopmentGoalsModule
  );
  const dashboardLayout = useSelector(
    (state) => state.dashboard.dashboardLayout
  );
  const isReorderModalOpen = useSelector(
    (state) => state.dashboard.isReorderModalOpen
  );
  const isSlidingPanelOpen = useSelector(
    (state) => state.dashboard.isSlidingPanelOpen
  );
  const dashboardList = useSelector((state) => state.dashboardList);
  const activeDashboard = useSelector(
    (state) => state.dashboard.activeDashboard
  );
  const appliedSquadAthletes = useSelector(
    (state) => state.dashboard.appliedSquadAthletes
  );
  const appliedDateRange = useSelector(
    (state) => state.dashboard.appliedDateRange
  );
  const appliedTimePeriod = useSelector(
    (state) => state.dashboard.appliedTimePeriod
  );
  const appliedTimePeriodLength = useSelector(
    (state) => state.dashboard.appliedTimePeriodLength
  );
  const isPrinting = useSelector((state) => state.printBuilder.isOpen);
  const containerType = useSelector((state) => state.staticData.containerType);
  const activeWidgets = useSelector(
    (state) => state.chartBuilder.activeWidgets
  );

  const canSeeHiddenVariables = useSelector(
    (state) => state.staticData.canSeeHiddenVariables
  );

  const canViewMetrics = useSelector(
    (state) => state.staticData.canViewMetrics
  );

  const isHeaderModalOpen = useSelector(
    (state) => state.headerWidgetModal.open
  );

  const isProfileModalOpen = useSelector(
    (state) => state.profileWidgetModal.open
  );

  /**
   * Syncs the organisation coding system key with the state
   * this is unlikely to change too much
   */
  const { organisation } = useOrganisation();
  const codingSystemKey = organisation.coding_system_key;
  useEffect(() => {
    dispatch(setCodingSystemKey(codingSystemKey));
  }, [codingSystemKey]);

  const closeAllModalsExceptReorder = () => {
    dispatch(closeGraphLinksModal());
    dispatch(closeHeaderWidgetModal());
    dispatch(closeNotesModal());
    dispatch(closeNotesWidgetSettingsModal());
    dispatch(closeProfileWidgetModal());
  };

  return (
    <App
      locale={props.locale}
      activeWidgets={activeWidgets}
      containerType={containerType}
      canSeeHiddenVariables={canSeeHiddenVariables}
      appliedDateRange={appliedDateRange}
      appliedSquadAthletes={appliedSquadAthletes}
      appliedTimePeriod={appliedTimePeriod}
      appliedTimePeriodLength={appliedTimePeriodLength}
      appStatusText={appStatusText}
      canManageDashboard={canManageDashboard}
      canViewNotes={canViewNotes}
      canViewMetrics={canViewMetrics}
      hasDevelopmentGoalsModule={hasDevelopmentGoalsModule}
      dashboard={activeDashboard}
      dashboardList={dashboardList}
      dashboardLayout={dashboardLayout}
      fetchAllWidgets={() => {
        dispatch(fetchWidgets());
      }}
      fetchSingleWidget={(widgetId, widgetType) => {
        dispatch(fetchWidgetContent(widgetId, widgetType));
      }}
      getAreCoachingPrinciplesEnabled={() => {
        dispatch(getAreCoachingPrinciplesEnabled());
      }}
      isPrinting={isPrinting}
      isReorderModalOpen={isReorderModalOpen}
      isSlidingPanelOpen={isSlidingPanelOpen}
      isHeaderModalOpen={isHeaderModalOpen}
      isProfileModalOpen={isProfileModalOpen}
      onUpdateDashboard={(updatedDashboard) =>
        dispatch(updateDashboard(updatedDashboard))
      }
      onClickOpenDuplicateDashboardModal={(dashboardName) => {
        const appendedText = i18n.t('copy');
        // Subtract translated appended text length + 1 (for whitespace) from 40 (max dashboard name length)
        const maxDashboardLength = 40 - (appendedText.length + 1);
        const newDashboardName =
          dashboardName.length > maxDashboardLength
            ? dashboardName
            : `${dashboardName} ${appendedText}`;
        dispatch(openDuplicateDashboardModal(newDashboardName));
      }}
      onClickOpenDuplicateWidgetModal={(
        widgetId,
        widgetType,
        isNameEditable,
        originalWidgetName
      ) => {
        const appendedText = i18n.t('copy');
        // Subtract translated appended text length + 1 (for whitespace) from 255 (max widget name length)
        const maxWidgetLength = 255 - (appendedText.length + 1);
        const newWidgetName =
          originalWidgetName && originalWidgetName.length > maxWidgetLength
            ? originalWidgetName
            : `${originalWidgetName} ${appendedText}`;
        dispatch(
          openDuplicateWidgetModal(
            widgetId,
            widgetType,
            isNameEditable,
            newWidgetName
          )
        );
      }}
      onClickOpenGraphLinksModal={(graphData) =>
        dispatch(openGraphLinksModal(graphData))
      }
      onClickOpenHeaderWidgetModal={(
        widgetId,
        name,
        population,
        backgroundColor,
        showOrgLogo,
        showOrgName,
        hideOrgDetails
      ) => {
        dispatch(
          openHeaderWidgetModal(
            widgetId,
            name,
            population,
            backgroundColor,
            showOrgLogo,
            showOrgName,
            hideOrgDetails
          )
        );
      }}
      onClickOpenNotesWidgetSettingsModal={(
        widgetId,
        widgetName,
        selectedAnnotationTypes,
        selectedPopulation,
        selectedTimeScope
      ) => {
        dispatch(
          openNotesWidgetSettingsModal(
            widgetId,
            widgetName,
            selectedAnnotationTypes,
            selectedPopulation,
            selectedTimeScope
          )
        );
      }}
      onClickOpenPrintBuilder={() => dispatch(openPrintBuilder())}
      onClickOpenProfileWidgetModal={(
        widgetId,
        athleteId,
        showAvailabilityIndicator,
        showSquadNumber,
        selectedInfoFields,
        backgroundColour
      ) => {
        dispatch(
          openProfileWidgetModal(
            widgetId,
            athleteId,
            showAvailabilityIndicator,
            showSquadNumber,
            selectedInfoFields,
            backgroundColour
          )
        );
        dispatch(updatePreview());
      }}
      onClickOpenReorderModal={() => {
        closeAllModalsExceptReorder();
        dispatch(openReorderModal());
      }}
      onClickOpenTableWidgetModal={() => {
        dispatch(openTableWidgetModal());
      }}
      onClickAddActionsWidget={(
        widgetId,
        selectedAnnotationTypes,
        selectedPopulation,
        selectedHiddenColumns
      ) => {
        dispatch(
          openActionsWidgetModal(
            widgetId,
            selectedAnnotationTypes,
            selectedPopulation,
            selectedHiddenColumns
          )
        );
      }}
      onClickAddDevelopmentGoalWidget={() => {
        dispatch(developmentGoalWidget());
      }}
      onCloseReorderModal={() => {
        dispatch(closeReorderModal());
      }}
      onDeleteWidget={(widgetId) => dispatch(deleteWidget(widgetId))}
      onSortGraphWidget={(widgetId, sortOptions) =>
        dispatch(sortGraphWidget(widgetId, sortOptions))
      }
      onUpdateAggregationPeriod={(graphId, aggregationPeriod) =>
        dispatch(updateAggregationPeriod(graphId, aggregationPeriod))
      }
      status={status}
      toggleSlidingPanel={() => dispatch(toggleSlidingPanel())}
      updateDashboardLayout={(newDashboardLayout) =>
        dispatch(updateDashboardLayout(newDashboardLayout))
      }
      onDashboardRefresh={(dashboardId) => {
        dispatch(refreshDashboardCache(dashboardId));
      }}
      widgets={widgets}
      {...props}
    />
  );
};
