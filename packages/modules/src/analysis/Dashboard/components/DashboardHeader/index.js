// @flow
import { useState, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { TrackEvent } from '@kitman/common/src/utils';
import { TextButton, TooltipMenu } from '@kitman/components';
import { KitmanIcon } from '@kitman/playbook/icons';
import { IconButton } from '@kitman/playbook/components';
import { getTimePeriodName } from '@kitman/common/src/utils/status_utils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import type { Dashboard } from '@kitman/modules/src/analysis/shared/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useBrowserTabTitle } from '@kitman/common/src/hooks';
import reportingEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/reporting';
import { getDashboardCacheRefreshData } from '@kitman/common/src/utils/TrackingData/src/data/analysis/getDashboardEventData';
import { DATA_STATUS } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/consts';
import {
  getDashboardCachedAtContent,
  isDashboardPivoted,
} from '@kitman/modules/src/analysis/Dashboard/utils';
import { selectDashboardCache } from '../../redux/selectors/dashboardCache';
import type { ContainerType } from '../../types';
import AddWidgetDropdown from '../../containers/AddWidgetDropdown';
import PivotDashboardButton from '../../containers/PivotDashboardButton';
import { DeleteDashboardModalTranslated as DeleteDashboardModal } from '../DeleteDashboardModal';
import { RenameDashboardModalTranslated as RenameDashboardModal } from '../RenameDashboardModal';
import { AddDashboardModalTranslated as AddDashboardModal } from '../AddDashboardModal';
import DashboardSelector from '../DashboardSelector';

type Props = {
  locale: string,
  containerType: ContainerType,
  dashboard: Dashboard,
  dashboardList: Array<Dashboard>,
  isDashboardEmpty: boolean,
  isDashboardManager: boolean,
  canViewNotes: boolean,
  hasDevelopmentGoalsModule: boolean,
  isGraphBuilder: boolean,
  canSeeHiddenVariables: boolean,
  orgLogoPath: string,
  orgName: string,
  squadName: string,
  onClickAddActionsWidget: Function,
  onClickOpenHeaderWidgetModal: Function,
  onClickOpenNotesWidgetSettingsModal: Function,
  onClickOpenProfileWidgetModal: Function,
  onClickOpenTableWidgetModal: Function,
  onClickAddDevelopmentGoalWidget: Function,
  openDuplicateModal: Function,
  openReorderModal: Function,
  pivotedAthletes: Object,
  pivotedDateRange: Object,
  pivotedTimePeriod: string,
  pivotedTimePeriodLength: ?number,
  toggleSlidingPanel: Function,
  updateDashboard: Function,
  openPrintBuilder: Function,
  annotationTypes: Array<Object>,
  refreshDashboard: Function,
};

const styles = {
  rollover: {
    fontSize: '10px',
    padding: '0.2rem',
  },
  refreshButton: { width: '20px', height: '20px' },
  refreshIcon: { height: '18px' },
};

const DashboardHeader = (props: I18nProps<Props>) => {
  useBrowserTabTitle([props.t('Dashboard'), props.dashboard.name]);

  const [deleteDashboardModalType, setDeleteDashboardModalType] =
    useState(null);
  const [isAddDashboardModalOpen, setIsAddDashboardModalOpen] = useState(false);
  const [isRenameDashboardModalOpen, setIsRenameDashboardModalOpen] =
    useState(false);
  const [newDashboardName, setNewDashboardName] = useState('');
  const [hideDashboard, setHideDashboard] = useState(false);
  const { trackEvent } = useEventTracking();

  const { effectiveLoadingStatus, cachedAtTimestamp } =
    useSelector(selectDashboardCache);

  const openAddDashboardModal = () => {
    TrackEvent('Graph Dashboard', 'Click', 'New Dashboard');
    setIsAddDashboardModalOpen(true);
    setNewDashboardName('');
    setHideDashboard(false);
  };

  const openDashboardRenameModal = () => {
    TrackEvent('Graph Dashboard', 'Click', 'Rename Dashboard');
    setIsRenameDashboardModalOpen(true);
  };

  const openConfirmDeleteDashboardModal = () => {
    TrackEvent('Graph Dashboard', 'Click', 'Delete Dashboard');
    setDeleteDashboardModalType('confirm');
  };

  const onPrint = () => {
    // GA tracking
    TrackEvent('Graph Dashboard', 'Click', 'Print Dashboard');
    // Mixpanel
    trackEvent('Print Dashboard');
    props.openPrintBuilder();
  };

  const getPivotButton = () => {
    return (
      <PivotDashboardButton
        data-testid="DashboardHeader|PivotDashboardButtons"
        pivotedAthletes={props.pivotedAthletes}
        onClick={() => {
          TrackEvent('Graph Dashboard', 'Click', 'Pivot Action Button');
          props.toggleSlidingPanel();
        }}
        isDisabled={props.isDashboardEmpty}
        datesText={getTimePeriodName(
          props.pivotedTimePeriod,
          {
            startDate: props.pivotedDateRange.start_date,
            endDate: props.pivotedDateRange.end_date,
          },
          props.pivotedTimePeriodLength
        )}
        defaultText={props.t('Pivot')}
      />
    );
  };

  const addDashboard = {
    description: props.t('Add New Dashboard'),
    onClick: () => {
      TrackEvent('Graph Dashboard', 'Click', 'Add New Dashboard');
      openAddDashboardModal();
    },
  };

  const renameDashboard = {
    description: props.t('Rename Dashboard'),
    onClick: () => {
      TrackEvent('Graph Dashboard', 'Click', 'Rename Dashboard');
      openDashboardRenameModal();
    },
  };

  const customiseLayout = {
    description: props.t('Customise Layout'),
    onClick: () => {
      TrackEvent('Graph Dashboard', 'Click', 'Customise Layout');
      props.openReorderModal();
    },
    isDisabled: props.isDashboardEmpty,
  };

  const duplicateDashboard = {
    description: props.t('Duplicate Dashboard'),
    onClick: () => {
      TrackEvent('Graph Dashboard', 'Click', 'Duplicate Dashboard');
      props.openDuplicateModal();
    },
  };
  const deleteDashboard = {
    description: props.t('Delete Dashboard'),
    onClick: () => {
      TrackEvent('Graph Dashboard', 'Click', 'Delete Dashboard');
      openConfirmDeleteDashboardModal();
    },
  };

  const getMenuItems = () => {
    switch (props.containerType) {
      case 'AnalyticalDashboard':
        return [
          addDashboard,
          renameDashboard,
          customiseLayout,
          duplicateDashboard,
          deleteDashboard,
        ];
      case 'HomeDashboard':
        return [customiseLayout];
      default:
        return [];
    }
  };

  const cachedAt = useMemo(() => {
    return getDashboardCachedAtContent(
      cachedAtTimestamp,
      effectiveLoadingStatus.includes(DATA_STATUS.caching)
        ? DATA_STATUS.caching
        : DATA_STATUS.success,

      props.locale
    );
  }, [cachedAtTimestamp, props.locale, effectiveLoadingStatus]);

  return (
    <>
      <header className="analyticalDashboard__pageHeader">
        <div className="analyticalDashboard__dashboardTitleContainer">
          {props.containerType === 'AnalyticalDashboard' && (
            <DashboardSelector
              locale={props.locale}
              dashboardList={props.dashboardList}
              selectedDashboard={props.dashboard}
            />
          )}
          {props.containerType === 'HomeDashboard' && (
            <>
              <img
                className="analyticalDashboard__dashboardTitleLogo"
                src={props.orgLogoPath}
                alt="Organisation logo"
              />
              <div className="analyticalDashboard__dashboardTitleText">
                {props.orgName} - {props.squadName}
              </div>
            </>
          )}
        </div>
        <div className="analyticalDashboard__dashboardActionsContainer">
          {!props.isDashboardEmpty &&
            !isDashboardPivoted() &&
            cachedAt &&
            !effectiveLoadingStatus.includes(DATA_STATUS.pending) && (
              <div
                data-testid="refresh-dashboard-container"
                css={styles.rollover}
              >
                {!effectiveLoadingStatus.includes(DATA_STATUS.caching) && (
                  <IconButton
                    css={styles.refreshButton}
                    onClick={() => {
                      trackEvent(
                        reportingEventNames.refreshDashboardData,
                        getDashboardCacheRefreshData({
                          dashboardId: +props.dashboard.id,
                        })
                      );
                      props.refreshDashboard(props.dashboard.id);
                    }}
                  >
                    <KitmanIcon
                      css={styles.refreshIcon}
                      name="RefreshOutlined"
                    />
                  </IconButton>
                )}

                {cachedAt}
              </div>
            )}
          {props.isDashboardManager && (
            <AddWidgetDropdown
              containerType={props.containerType}
              dashboard={props.dashboard}
              isGraphBuilder={props.isGraphBuilder}
              onClickAddActionsWidget={props.onClickAddActionsWidget}
              onClickOpenHeaderWidgetModal={(
                widgetId,
                name,
                population,
                backgroundColor,
                showOrgLogo,
                showOrgName,
                hideOrgDetails
              ) => {
                props.onClickOpenHeaderWidgetModal(
                  widgetId,
                  name,
                  population,
                  backgroundColor,
                  showOrgLogo,
                  showOrgName,
                  hideOrgDetails
                );
              }}
              onClickOpenProfileWidgetModal={
                props.onClickOpenProfileWidgetModal
              }
              onClickOpenNotesWidgetSettingsModal={
                props.onClickOpenNotesWidgetSettingsModal
              }
              onClickOpenTableWidgetModal={props.onClickOpenTableWidgetModal}
              onClickAddDevelopmentGoalWidget={
                props.onClickAddDevelopmentGoalWidget
              }
              pivotedAthletes={props.pivotedAthletes}
              pivotedDateRange={props.pivotedDateRange}
              pivotedTimePeriod={props.pivotedTimePeriod}
              pivotedTimePeriodLength={props.pivotedTimePeriodLength}
              canViewNotes={props.canViewNotes}
              hasDevelopmentGoalsModule={props.hasDevelopmentGoalsModule}
              annotationTypes={props.annotationTypes}
            />
          )}
          {!window.getFlag('hide-pivot-graphing-dashboard') &&
            props.containerType === 'AnalyticalDashboard' &&
            getPivotButton()}
          <TextButton
            text={props.t('Print')}
            type="secondary"
            onClick={onPrint}
            kitmanDesignSystem
          />
          {props.isDashboardManager && (
            <TooltipMenu
              placement="bottom-end"
              offset={[10, 10]}
              menuItems={getMenuItems()}
              tooltipTriggerElement={
                <div
                  onClick={() => {
                    TrackEvent('Graph Dashboard', 'Click', 'Settings Dropdown');
                  }}
                >
                  <TextButton
                    iconAfter="icon-more"
                    type="secondary"
                    kitmanDesignSystem
                  />
                </div>
              }
              kitmanDesignSystem
            />
          )}
        </div>
      </header>
      <AddDashboardModal
        isModalOpen={isAddDashboardModalOpen}
        onRequestSuccess={() => {
          setIsAddDashboardModalOpen(false);
        }}
        onClickCloseButton={() => {
          setIsAddDashboardModalOpen(false);
        }}
        onDashboardNameChange={(name) => {
          setNewDashboardName(name);
        }}
        isDashboardHidden={hideDashboard}
        onToggleHideDashboard={(isChecked) => {
          setHideDashboard(isChecked);
        }}
        newDashboardName={newDashboardName}
        canSeeHiddenVariables={props.canSeeHiddenVariables}
      />
      <RenameDashboardModal
        dashboard={props.dashboard}
        isModalOpen={isRenameDashboardModalOpen}
        onClickCloseButton={() => {
          setIsRenameDashboardModalOpen(false);
        }}
        onDashboardUpdate={(updatedDashboard) => {
          props.updateDashboard(updatedDashboard);
        }}
        onRequestSuccess={() => {
          setIsRenameDashboardModalOpen(false);
        }}
      />
      <DeleteDashboardModal
        dashboard={props.dashboard}
        modalType={deleteDashboardModalType}
        onClickCloseButton={() => {
          setDeleteDashboardModalType(null);
        }}
        onRequestStart={() => {
          setDeleteDashboardModalType('loading');
        }}
        onRequestFail={() => {
          setDeleteDashboardModalType('error');
        }}
      />
    </>
  );
};

export default DashboardHeader;
export const DashboardHeaderTranslated = withNamespaces()(DashboardHeader);
