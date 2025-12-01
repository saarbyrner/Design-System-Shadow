// @flow
import moment from 'moment';
import i18n from '@kitman/common/src/utils/i18n';
import useFilterValues from '@kitman/modules/src/analysis/TemplateDashboards/hooks/useFilterValues';
import { getDateRanges } from '@kitman/modules/src/analysis/TemplateDashboards/components/TimeScopeFilter/utils';
import { TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';

type populationProps = {
  labelOnly?: boolean,
};

function useSelectedTimeScope(props?: populationProps): Object {
  const { timescope } = useFilterValues(['timescope']);
  const options = getDateRanges();
  const getValue = () => {
    const option = options.find((opt) => opt.value === timescope.time_period);

    if (option?.value === TIME_PERIODS.customDateRange) {
      return `${moment(timescope.start_time).format('DD MMM YYYY')} - ${moment(
        timescope.end_time
      ).format('DD MMM YYYY')}`;
    }
    if (option?.value === TIME_PERIODS.lastXDays) {
      const timePeriodType =
        timescope.time_period_length === 1 ? i18n.t('Day') : i18n.t('Days');
      return i18n.t('Last {{timescope}} {{timePeriodType}}', {
        timescope: timescope.time_period_length || '',
        timePeriodType,
      });
    }

    if (props?.labelOnly) {
      return option?.label || '';
    }

    return option || {};
  };

  return { date: getValue() };
}

export default useSelectedTimeScope;
