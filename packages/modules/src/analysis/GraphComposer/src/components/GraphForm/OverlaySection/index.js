// @flow
/* eslint-disable react/no-array-index-key */
import { withNamespaces } from 'react-i18next';

import { IconButton } from '@kitman/components';
import { TrackEvent } from '@kitman/common/src/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { DropdownItem } from '@kitman/components/src/types';
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import { OverlayFormTranslated as OverlayForm } from './OverlayForm';

type Props = {
  metricIndex: number,
  overlays: Array<any>,
  addOverlay: Function,
  deleteOverlay: Function,
  updateOverlaySummary: Function,
  updateOverlayPopulation: Function,
  updateOverlayTimePeriod: Function,
  updateOverlayDateRange: Function,
  turnaroundList: Array<Turnaround>,
  athleteGroupsDropdown: Array<DropdownItem>,
};

const OverlaySection = (props: I18nProps<Props>) => {
  const { trackEvent } = useEventTracking();

  const onSave = () => {
    TrackEvent('Graph Builder', 'Click', 'Add Overlay');
    // Mixpanel
    trackEvent('Graph Builder: Add Overlay');
    props.addOverlay();
  };

  const overlayList = props.overlays.map((overlay, index) => (
    <div className="statusForm__row" key={index}>
      <OverlayForm
        metricIndex={props.metricIndex}
        overlay={overlay}
        turnaroundList={props.turnaroundList}
        athleteGroupsDropdown={props.athleteGroupsDropdown}
        updateOverlaySummary={(summary) =>
          props.updateOverlaySummary(index, summary)
        }
        updateOverlayPopulation={(population) =>
          props.updateOverlayPopulation(index, population)
        }
        updateOverlayTimePeriod={(timePeriod) =>
          props.updateOverlayTimePeriod(index, timePeriod)
        }
        updateOverlayDateRange={(dateRange) =>
          props.updateOverlayDateRange(index, dateRange)
        }
        deleteOverlay={() => props.deleteOverlay(index)}
      />
    </div>
  ));
  return (
    <div className="overlaySection">
      {overlayList}
      <div className="overlaySection__addOverlayBtn">
        <IconButton
          text={props.t('Overlay')}
          icon="icon-add"
          onClick={onSave}
          isSmall
        />
      </div>
    </div>
  );
};

export const OverlaySectionTranslated = withNamespaces()(OverlaySection);
export default OverlaySection;
