// @flow
import { withNamespaces } from 'react-i18next';
import { TrackEvent } from '@kitman/common/src/utils';
import { Dropdown, IconButton, MultiSelectDropdown } from '@kitman/components';
import type {
  DropdownItem,
  MultiSelectDropdownItem,
  MultiSelectDropdownItems,
} from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  index: number,
  metricList: Array<MultiSelectDropdownItems>,
  disabledMetrics: Array<$PropertyType<MultiSelectDropdownItem, 'id'>>,
  dashboardList: Array<DropdownItem>,
  graphLink: Object,
  onClickRemoveGraphLinkRow: Function,
  onSelectGraphLinkOrigin: Function,
  onUnselectGraphLinkOrigin: Function,
  onSelectGraphLinkTarget: Function,
  revealIncompleteEntries: boolean,
};

const GraphLinkRow = (props: I18nProps<Props>) => {
  const isMetricDropdownInvalid =
    props.revealIncompleteEntries &&
    props.graphLink.metrics.length === 0 &&
    !!props.graphLink.dashboardId;

  const isDashboardDropdownInvalid =
    props.revealIncompleteEntries &&
    props.graphLink.metrics.length > 0 &&
    !props.graphLink.dashboardId;

  return (
    <div className="row graphLinkRow">
      <div className="col-xl-1 graphLinkRow__indexWrapper">
        <div className="graphLinkRow__index">{props.index}</div>
      </div>
      <div className="col-xl-5">
        <MultiSelectDropdown
          listItems={props.metricList}
          onItemSelect={(checkbox) => {
            TrackEvent('Graph Dashboard', 'Focus', 'Select metric(s)');

            if (checkbox.checked) {
              props.onSelectGraphLinkOrigin(checkbox.id);
            } else {
              props.onUnselectGraphLinkOrigin(checkbox.id);
            }
          }}
          selectedItems={props.graphLink.metrics}
          disabledItems={props.disabledMetrics}
          invalid={isMetricDropdownInvalid}
        />
        {isMetricDropdownInvalid && (
          <div className="graphLinkRow__errorMessage">
            {props.t('Please select a metric to proceed')}
          </div>
        )}
      </div>
      <div className="col-xl-5">
        <Dropdown
          items={props.dashboardList}
          onChange={(dashboardId) => {
            TrackEvent('Graph Dashboard', 'Focus', 'Select Dashboard');

            props.onSelectGraphLinkTarget(dashboardId);
          }}
          value={props.graphLink.dashboardId}
          invalid={isDashboardDropdownInvalid}
        />
        {isDashboardDropdownInvalid && (
          <div className="graphLinkRow__errorMessage">
            {props.t('Please select a dashboard to proceed')}
          </div>
        )}
      </div>
      <div className="col-xl-1 graphLinkRow__removeRowBtn">
        <IconButton
          icon="icon-close"
          onClick={() => {
            props.onClickRemoveGraphLinkRow();
          }}
          isSmall
          isTransparent
        />
      </div>
    </div>
  );
};

GraphLinkRow.defaultProps = {
  revealIncompleteEntries: false,
};

export default GraphLinkRow;
export const GraphLinkRowTranslated = withNamespaces()(GraphLinkRow);
