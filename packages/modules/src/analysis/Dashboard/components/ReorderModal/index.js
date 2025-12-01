// @flow
import { useState, useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import $ from 'jquery';
import { TrackEvent } from '@kitman/common/src/utils';
import GridLayout, { WidthProvider } from 'react-grid-layout';
import classNames from 'classnames';
import {
  AppStatus,
  LegacyModal as Modal,
  TextButton,
} from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import {
  getGraphTitles,
  formatGraphTitlesToString,
} from '@kitman/modules/src/analysis/shared/utils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import reportingEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/reporting';

import type { Dashboard } from '@kitman/modules/src/analysis/shared/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getModalPlaceholderImgPath } from '../utils';
import type { ContainerType, WidgetData } from '../../types';

const GridLayoutModifier = WidthProvider(GridLayout);

type Props = {
  containerType: ContainerType,
  dashboard: Dashboard,
  layout: Array<{
    i: string,
    x: number,
    y: number,
    w: number,
    h: number,
    minH: number,
    maxH: number,
    minW: number,
    maxW: number,
    isResizable: boolean,
  }>,
  onApply: Function,
  isOpen: boolean,
  onCloseModal: Function,
  widgets: Array<WidgetData>,
};

const ReorderModal = (props: I18nProps<Props>) => {
  const [newLayout, setNewLayout] = useState(props.layout);
  const [feedbackModalStatus, setFeedbackModalStatus] = useState(null);
  const { trackEvent } = useEventTracking();

  useEffect(() => {
    if (!isEqual(props.layout, newLayout)) {
      setNewLayout(props.layout);
    }
  }, [props.layout]);

  const widgets = newLayout.map((widgetLayout) => {
    const dashboardWidgetLayout = widgetLayout;
    const widgetGraphData = props.widgets.filter(
      (widgetData) => `${widgetData.id}` === `${dashboardWidgetLayout.i}`
    )[0];

    if (!widgetGraphData) {
      return null;
    }

    if (
      widgetGraphData.widget_type === 'header' ||
      widgetGraphData.widget_type === 'athlete_profile'
    ) {
      dashboardWidgetLayout.isResizable = false;
    }

    const graphName =
      widgetGraphData.widget_type === 'header'
        ? widgetGraphData.widget_render.widget_name
        : widgetGraphData.widget_render.name ||
          widgetGraphData.widget.name ||
          formatGraphTitlesToString(
            getGraphTitles(widgetGraphData.widget_render)
          );
    const placeholderImg = getModalPlaceholderImgPath(
      widgetGraphData.widget_type,
      widgetGraphData.widget.configuration &&
        widgetGraphData.widget.configuration.graph_type
        ? widgetGraphData.widget.configuration.graph_type
        : '',
      widgetGraphData.widget.configuration &&
        widgetGraphData.widget.configuration.graph_group
        ? widgetGraphData.widget.configuration.graph_group
        : ''
    );

    return (
      <div className="gridLayoutModifier__widget" key={dashboardWidgetLayout.i}>
        {widgetGraphData.widget_type === 'header' ||
        widgetGraphData.widget_type === 'athlete_profile' ? (
          <>
            <span
              className={classNames(
                'gridLayoutModifier__reorderIcon icon-reorder-vertical',
                {
                  'gridLayoutModifier__reorderIcon--athleteProfile':
                    widgetGraphData.widget_type === 'athlete_profile',
                  'gridLayoutModifier__reorderIcon--header':
                    widgetGraphData.widget_type === 'header',
                }
              )}
            />
            {widgetGraphData.widget_type === 'header' ? (
              <span
                className="gridLayoutModifier__graphName gridLayoutModifier__graphName--header"
                title={graphName}
              >
                {graphName}
              </span>
            ) : null}
          </>
        ) : (
          <header className="gridLayoutModifier__widgetHeader">
            <span className="gridLayoutModifier__reorderIcon icon-reorder-vertical" />
            <span className="gridLayoutModifier__graphName" title={graphName}>
              {graphName}
            </span>
          </header>
        )}
        <div
          className={classNames('gridLayoutModifier__widgetContent', {
            'gridLayoutModifier__widgetContent--header':
              widgetGraphData.widget_type === 'header',
          })}
        >
          <img
            className={classNames('gridLayoutModifier__placeholderImg', {
              'gridLayoutModifier__placeholderImg--svg':
                placeholderImg.includes('.svg'),
              'gridLayoutModifier__placeholderImg--athleteProfile':
                widgetGraphData.widget_type === 'athlete_profile',
              'gridLayoutModifier__placeholderImg--header':
                widgetGraphData.widget_type === 'header',
            })}
            src={placeholderImg}
            draggable="false"
            alt="graph placeholder"
          />
        </div>
      </div>
    );
  });

  const closeModal = () => {
    setNewLayout(props.layout);
    props.onCloseModal();
  };

  const saveNewLayout = () => {
    // GA tracking
    TrackEvent('Graph Dashboard', 'Click', 'Save New Layout');
    // Mixpanel
    trackEvent(reportingEventNames.customiseDashboard);

    setFeedbackModalStatus('loading');

    const updatedDashboard = {
      ...props.dashboard,
    };

    const containerWidgetParams = newLayout.map((layout) => {
      const containerWidgetId = parseInt(layout.i, 10);
      const containerWidget = props.widgets.find(
        (widget) => widget.id === containerWidgetId
      );
      if (containerWidget == null) {
        return null;
      }
      return {
        container_widget: containerWidgetId,
        rows: layout.h,
        cols: layout.w,
        horizontal_position: layout.x,
        vertical_position: layout.y,
        print_rows: containerWidget.print_rows,
        print_cols: containerWidget.print_cols,
        print_vertical_position: containerWidget.print_vertical_position,
        print_horizontal_position: containerWidget.print_horizontal_position,
      };
    });

    const data = JSON.stringify({
      container_type: props.containerType,
      container_id: parseInt(props.dashboard.id, 10),
      container_widgets_params: containerWidgetParams,
    });

    $.ajax({
      method: 'POST',
      url: '/widgets/update_layout',
      contentType: 'application/json',
      data,
    })
      .done(() => {
        setFeedbackModalStatus(null);
        props.onApply(updatedDashboard, newLayout);
      })
      .fail(() => {
        setFeedbackModalStatus('error');
      });
  };

  return (
    <>
      <Modal
        title={props.t('Customise layout')}
        isOpen={props.isOpen}
        width={600}
        close={() => closeModal()}
      >
        <GridLayoutModifier
          className="gridLayoutModifier"
          layout={newLayout}
          cols={6}
          rowHeight={40}
          containerPadding={[0, 0]}
          onLayoutChange={setNewLayout}
          onDragStart={() => {
            TrackEvent('Graph Dashboard', 'Click', 'Move Graph');
          }}
          onResizeStart={() => {
            TrackEvent('Graph Dashboard', 'Click', 'Resize Graph');
          }}
        >
          {widgets}
        </GridLayoutModifier>
        <footer className="gridLayoutModifier__footer">
          <TextButton
            text={props.t('Cancel')}
            size="small"
            type="secondary"
            onClick={() => closeModal()}
          />
          <TextButton
            text={props.t('Apply')}
            size="small"
            type="primary"
            onClick={() => saveNewLayout()}
          />
        </footer>
      </Modal>

      <AppStatus
        status={feedbackModalStatus}
        close={() => setFeedbackModalStatus(null)}
      />
    </>
  );
};

export default ReorderModal;
export const ReorderModalTranslated = withNamespaces()(ReorderModal);
