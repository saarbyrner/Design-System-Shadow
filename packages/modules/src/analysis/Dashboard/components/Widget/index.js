// @flow
import { type ComponentType, type Node, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { EditInPlace, TooltipMenu } from '@kitman/components';
import { KitmanIcon } from '@kitman/playbook/icons';
import { IconButton } from '@kitman/playbook/components';
import type { TooltipItem } from '@kitman/components/src/TooltipMenu';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { CoreChartType } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';
import { Moment } from 'moment';
import { humanizeTimestamp } from '@kitman/common/src/utils/dateFormatter';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import { LOADING_LEVEL } from '@kitman/modules/src/analysis/Dashboard/types';
import { searchParams } from '@kitman/common/src/utils';
import { refreshWidgetCache } from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
import type { ChartElement } from '@kitman/modules/src/analysis/shared/types/charts';
import {
  sortCacheTimestamps,
  isDashboardPivoted,
} from '@kitman/modules/src/analysis/Dashboard/utils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { getWidgetCacheRefreshData } from '@kitman/common/src/utils/TrackingData/src/data/analysis/getWidgetEventData';
import reportingEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/reporting';
import WidgetCard from '../WidgetCard';
import { ConfirmDialogTranslated as ConfirmDialog } from '../ConfirmDialog';
import { useDeleteDialog } from './hooks';
import { openDuplicateWidgetModal } from '../../redux/actions/duplicateWidgetModal';
import {
  getLoaderLevelByWidgetId,
  getCachedAtByWidgetId,
} from '../../redux/selectors/chartBuilder';
import styles from './styles';

type Props = {
  widgetId: number,
  widgetName: string,
  widgetType: string,
  onEdit: Function,
  canEdit: boolean,
  onChangeWidgetName?: (newName: string) => void,
  children: Node,
  menuItems?: Array<TooltipItem>,
  hideWidgetMenu?: boolean,
  renderHeaderRight?: () => Node,
  chartType: CoreChartType,
  cachedAt: Array<Moment>,
  chartElements?: Array<ChartElement>,
};

function Widget(props: I18nProps<Props>) {
  const dispatch = useDispatch();
  const isNameEditable = typeof props.onChangeWidgetName === 'function';
  const { openDeleteDialog, dialogProps } = useDeleteDialog(
    props.widgetId,
    props.widgetName
  );
  const loaderLevel: number = useSelector(
    getLoaderLevelByWidgetId(props.widgetId)
  );

  const cachedAtTimestamps = useSelector(getCachedAtByWidgetId(props.widgetId));

  const sortedCachedAtTimestamps = cachedAtTimestamps?.length
    ? sortCacheTimestamps(cachedAtTimestamps)
    : [];

  const dashboardId = useSelector(
    (state) => state.dashboard.activeDashboard?.id
  );

  const isPivoted =
    window.getFlag('table-updated-pivot') && !!searchParams('pivot');

  const { organisation } = useOrganisation();
  const { trackEvent } = useEventTracking();

  const onRefreshCache = () => {
    trackEvent(
      reportingEventNames.refreshWidgetData,
      getWidgetCacheRefreshData({
        dashboardId,
        widgetId: props.widgetId,
      })
    );
    dispatch(
      refreshWidgetCache({
        widgetId: props.widgetId,
        refreshCache: true,
      })
    );
  };

  const refreshDataItem = window.getFlag('rep-charts-v2-caching')
    ? [
        {
          description: props.t('Refresh data'),
          icon: 'icon-refresh',
          isDisabled: isPivoted || !props.chartElements?.length,
          onClick: onRefreshCache,
        },
      ]
    : [];

  const appendedCopyText = props.t('copy');
  const menuItems = [
    ...(props.menuItems || []),
    {
      description: props.t('Edit'),
      icon: 'icon-edit',
      isDisabled: !props.canEdit,
      onClick: props.onEdit,
    },
    ...refreshDataItem,
    {
      description: props.t('Duplicate'),
      icon: 'icon-duplicate',
      onClick: () => {
        dispatch(
          openDuplicateWidgetModal(
            props.widgetId,
            props.widgetType,
            isNameEditable,
            `${props.widgetName} ${appendedCopyText}`
          )
        );
      },
    },
    {
      description: props.t('Delete'),
      icon: 'icon-bin',
      onClick: openDeleteDialog,
    },
  ];

  const rollOverContent = useMemo(() => {
    if (loaderLevel === LOADING_LEVEL.LONG_LOAD) {
      return props.t('Calculating...');
    }
    if (loaderLevel === LOADING_LEVEL.IDLE && sortedCachedAtTimestamps.length) {
      return `${props.t('Last Calculated:')} ${humanizeTimestamp(
        organisation.locale || navigator.language,
        sortedCachedAtTimestamps[0]
      )}`;
    }
    return '';
  }, [loaderLevel, sortedCachedAtTimestamps, organisation.locale]);

  return (
    <>
      <WidgetCard>
        <WidgetCard.Header styles={[styles.headerWrapper]}>
          <div data-tooltip-target={`${props.chartType}-chart-widget-name`}>
            <WidgetCard.Title>
              {isNameEditable ? (
                <EditInPlace
                  value={props.widgetName}
                  onChange={props.onChangeWidgetName}
                  editOnTextOnly
                />
              ) : (
                <h6>{props.widgetName}</h6>
              )}
            </WidgetCard.Title>
          </div>

          <div css={styles.headerRight}>
            {window.getFlag('rep-charts-v2-caching') &&
              !isDashboardPivoted() && (
                <div css={styles.rollOver} data-container-rollover>
                  {rollOverContent && loaderLevel === LOADING_LEVEL.IDLE && (
                    <IconButton
                      data-testid="refresh-widget-cache-button"
                      css={{ width: '20px', height: '20px' }}
                      isSmall
                      onClick={onRefreshCache}
                    >
                      <KitmanIcon
                        css={{ height: '18px' }}
                        name="RefreshOutlined"
                      />
                    </IconButton>
                  )}
                  {rollOverContent}
                </div>
              )}
            {typeof props.renderHeaderRight === 'function' &&
              props.renderHeaderRight()}

            {!props.hideWidgetMenu && (
              <TooltipMenu
                placement="bottom-end"
                offset={[10, 10]}
                menuItems={menuItems}
                tooltipTriggerElement={
                  <div>
                    <WidgetCard.MenuIcon
                      label={props.t('{{widgetName}} Menu Icon', {
                        widgetName: props.widgetName,
                      })}
                    />
                  </div>
                }
                kitmanDesignSystem
              />
            )}
          </div>
        </WidgetCard.Header>

        <WidgetCard.Content>{props.children}</WidgetCard.Content>
      </WidgetCard>
      <ConfirmDialog {...dialogProps} />
    </>
  );
}

export const WidgetTranslated: ComponentType<Props> = withNamespaces()(Widget);
export default Widget;
