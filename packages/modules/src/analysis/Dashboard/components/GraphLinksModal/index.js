// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { TrackEvent } from '@kitman/common/src/utils';
import type { ModalStatus } from '@kitman/common/src/types';
import type {
  DropdownItem,
  MultiSelectDropdownItems,
} from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  AppStatus,
  LegacyModal as Modal,
  TextButton,
  IconButton,
  InfoTooltip,
} from '@kitman/components';

import { GraphLinkRowTranslated as GraphLinkRow } from './GraphLinkRow';

type Props = {
  status: ?ModalStatus,
  open: boolean,
  metricList: Array<MultiSelectDropdownItems>,
  dashboardList: Array<DropdownItem>,
  graphLinks: Array<Object>,
  onClickCloseModal: Function,
  onClickAddGraphLinkRow: Function,
  onClickRemoveGraphLinkRow: Function,
  onSelectGraphLinkOrigin: Function,
  onUnselectGraphLinkOrigin: Function,
  onSelectGraphLinkTarget: Function,
  onClickSaveGraphLinks: Function,
  onClickCloseAppStatus: Function,
};

const GraphLinksModal = (props: I18nProps<Props>) => {
  const [dirtyRows, setDirtyRows] = useState([]);

  const areAllMetricsSelected = () => {
    const nbOfMetrics = props.metricList.length;
    const nbOfSelectedMetrics = props.graphLinks.reduce((sum, graphLink) => {
      return sum + graphLink.metrics.length;
    }, 0);

    return nbOfMetrics === nbOfSelectedMetrics;
  };

  // Get an array of ids of all the selected metrics of the other rows
  const getRowDisabledMetrics = (rowIndex) =>
    props.graphLinks.reduce(
      (disabledMetrics, graphLink, index) =>
        rowIndex === index
          ? disabledMetrics
          : disabledMetrics.concat(graphLink.metrics),
      []
    );

  const onClickSaveGraphLinks = () => {
    TrackEvent('Graph Dashboard', 'Click', 'Save Button');

    let formContainsIncompleteEntries = false;
    const touchedRows = [];

    props.graphLinks.forEach((graphLink, index) => {
      const hasRowIncompleteEntries =
        (graphLink.metrics.length === 0 && graphLink.dashboardId) ||
        (graphLink.metrics.length > 0 && !graphLink.dashboardId);

      if (hasRowIncompleteEntries) {
        formContainsIncompleteEntries = true;
      }

      if (graphLink.metrics.length > 0 || graphLink.dashboardId) {
        touchedRows.push(index);
      }
    });

    setDirtyRows(touchedRows);

    if (!formContainsIncompleteEntries) {
      setDirtyRows([]);
      props.onClickSaveGraphLinks();
    }
  };

  const onClickRemoveGraphLinkRow = (rowToDeleteIndex) => {
    let updatedDirtyRows = dirtyRows.slice();

    // Remove deleted row from the dirty rows,
    // then, adapt the indexes of the dirty rows
    updatedDirtyRows = updatedDirtyRows
      .filter((rowIndex) => rowIndex !== rowToDeleteIndex)
      .map((rowIndex) =>
        rowIndex > rowToDeleteIndex ? rowIndex - 1 : rowIndex
      );

    setDirtyRows(updatedDirtyRows);

    props.onClickRemoveGraphLinkRow(rowToDeleteIndex);
  };

  return (
    <Modal
      title={props.t('Link to dashboard')}
      isOpen={props.open}
      style={{ overflow: 'visible' }}
      close={() => {
        TrackEvent('Graph Dashboard', 'Click', 'Close Button');
        setDirtyRows([]);
        props.onClickCloseModal();
      }}
    >
      <div className="graphLinksModal">
        <div className="row">
          <p className="col-xl-12 graphLinksModal__subtitle">
            {props.t('Create contextual links between graphs and dashboards')}
          </p>
        </div>
        <div className="row">
          <div className="col-xl-5 offset-xl-1 graphLinksModal__label">
            {props.t('Select metric(s)')}

            <InfoTooltip
              content={props.t(
                'This is the metric on the graph that when clicked will bring you to the linked dashboard'
              )}
              onVisibleChange={(isVisible) => {
                if (isVisible) {
                  TrackEvent(
                    'Graph Dashboard',
                    'Hover',
                    'Select metric(s) tooltip'
                  );
                }
              }}
            >
              <span className="graphLinksModal__labelTooltipIcon icon-info" />
            </InfoTooltip>
          </div>
          <div className="col-xl-5 graphLinksModal__label">
            {props.t('Select linked dashboard')}

            <InfoTooltip
              content={props.t(
                'This is the dashboard that will be opened when you press the selected metric on a graph'
              )}
              onVisibleChange={(isVisible) => {
                if (isVisible) {
                  TrackEvent(
                    'Graph Dashboard',
                    'Hover',
                    'Select Dashboard tooltip'
                  );
                }
              }}
            >
              <span className="graphLinksModal__labelTooltipIcon icon-info" />
            </InfoTooltip>
          </div>
        </div>
        {props.graphLinks.map((graphLink, index) => (
          <GraphLinkRow
            key={index} // eslint-disable-line react/no-array-index-key
            index={index}
            metricList={props.metricList}
            disabledMetrics={getRowDisabledMetrics(index)}
            dashboardList={props.dashboardList}
            graphLink={graphLink}
            onClickRemoveGraphLinkRow={() => onClickRemoveGraphLinkRow(index)}
            onSelectGraphLinkOrigin={(metricIndex) => {
              props.onSelectGraphLinkOrigin(index, metricIndex);
            }}
            onUnselectGraphLinkOrigin={(metricIndex) => {
              props.onUnselectGraphLinkOrigin(index, metricIndex);
            }}
            onSelectGraphLinkTarget={(dashboardId) => {
              props.onSelectGraphLinkTarget(index, dashboardId);
            }}
            revealIncompleteEntries={dirtyRows.includes(index)}
          />
        ))}
        <div className="row">
          <div className="col-xl-1 graphLinksModal__addRowBtn">
            <IconButton
              icon="icon-add"
              onClick={() => {
                TrackEvent(
                  'Graph Dashboard',
                  'Click',
                  'Link to dashboard - Plus Button'
                );
                props.onClickAddGraphLinkRow();
              }}
              isDisabled={areAllMetricsSelected()}
              isSmall
            />
          </div>
        </div>

        <div className="km-datagrid-modalFooter">
          <TextButton
            text={props.t('Save')}
            type="primary"
            onClick={onClickSaveGraphLinks}
          />
        </div>
      </div>
      <AppStatus status={props.status} close={props.onClickCloseAppStatus} />
    </Modal>
  );
};

export default GraphLinksModal;
export const GraphLinksModalTranslated = withNamespaces()(GraphLinksModal);
