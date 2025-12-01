// @flow
import { withNamespaces } from 'react-i18next';

import { Dropdown, IconButton } from '@kitman/components';
import { getCalculationsByType } from '@kitman/common/src/utils/status_utils';
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { DropdownItem } from '@kitman/components/src/types';
import TimePeriod from '../../TimePeriod';

type Props = {
  metricIndex: number,
  overlay: any,
  deleteOverlay: Function,
  updateOverlaySummary: Function,
  updateOverlayPopulation: Function,
  updateOverlayTimePeriod: Function,
  updateOverlayDateRange: Function,
  turnaroundList: Array<Turnaround>,
  athleteGroupsDropdown: Array<DropdownItem>,
};

const OverlayForm = (props: I18nProps<Props>) => (
  <div className="row">
    <div className="col-xl-2">
      <Dropdown
        items={getCalculationsByType('graph_overlay')}
        onChange={(summary) => props.updateOverlaySummary(summary)}
        value={props.overlay.summary}
        label={props.t('Overlay Type')}
      />
    </div>
    <div className="col-xl-3">
      <Dropdown
        items={props.athleteGroupsDropdown}
        onChange={(population) => props.updateOverlayPopulation(population)}
        value={props.overlay.population}
        label={props.t('Comparison Group')}
      />
    </div>
    <TimePeriod
      metricIndex={props.metricIndex}
      turnaroundList={props.turnaroundList}
      updateTimePeriod={(timePeriod) =>
        props.updateOverlayTimePeriod(timePeriod)
      }
      updateDateRange={(dateRange) => props.updateOverlayDateRange(dateRange)}
      timePeriod={props.overlay.timePeriod}
      dateRange={props.overlay.dateRange}
      excludeRollingPeriod
      t={props.t}
    />
    <div className="col-xl-1 overlaySection__removeOverlayBtn">
      <IconButton
        icon="icon-close"
        onClick={props.deleteOverlay}
        isSmall
        isTransparent
      />
    </div>
  </div>
);

export const OverlayFormTranslated = withNamespaces()(OverlayForm);
export default OverlayForm;
