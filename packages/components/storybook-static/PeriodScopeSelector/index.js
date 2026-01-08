// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { Dropdown, LastXDaysSelector } from '@kitman/components';
import type { DropdownItem } from '@kitman/components/src/types';
import AcuteChronic from './AcuteChronic';
import ZScoreRolling from './ZScoreRolling';
import EvaluativeComparativeSelector from './EvaluativeComparativeSelector';

/**
 * periodLengthHtml() returns the HTML to select period length or null if
 * periodScope is not last_x_days
 */
const lastXDaysInput = (
  periodScope,
  periodLength,
  setPeriodLength,
  lastXPeriodRadioName
) => {
  if (periodScope !== 'last_x_days') {
    return null;
  }

  return (
    <LastXDaysSelector
      onChange={setPeriodLength}
      customClass="lastXDaysSelector--pushdown"
      periodLength={periodLength}
      radioName={lastXPeriodRadioName}
    />
  );
};

const acuteChronicInputs = (
  periodLength,
  secondPeriodLength,
  setBothPeriodLengths
) => (
  <div className="row">
    <div className="col-lg-12">
      <AcuteChronic
        onChange={setBothPeriodLengths}
        firstPeriodLength={periodLength}
        secondPeriodLength={secondPeriodLength}
      />
    </div>
  </div>
);

const evaluativeComparativeInputs = (
  periodLength,
  secondPeriodLength,
  setBothPeriodLengths
) => (
  <div className="row">
    <div className="col-lg-12">
      <EvaluativeComparativeSelector
        onChange={setBothPeriodLengths}
        firstPeriodLength={periodLength}
        secondPeriodLength={secondPeriodLength}
      />
    </div>
  </div>
);

const zscoreRollingInputs = (
  operator,
  periodLength,
  secondPeriodAllTime,
  secondPeriodLength,
  setZScoreRolling
) => (
  <div className="row">
    <div className="col-lg-12">
      <ZScoreRolling
        operator={operator}
        periodLength={periodLength}
        secondPeriodAllTime={secondPeriodAllTime}
        secondPeriodLength={secondPeriodLength}
        setZScoreRolling={setZScoreRolling}
      />
    </div>
  </div>
);

const strainMonotonyInputs = (periodLength, setPeriodLength) => (
  <div className="row">
    <div className="col-lg-6">
      <label className="modalContent__label" htmlFor="dropdown">
        {i18n.t('Time Period')}
      </label>
      <LastXDaysSelector
        onChange={setPeriodLength}
        periodLength={periodLength}
      />
    </div>
  </div>
);

const defaultInputs = (
  periodScope,
  periodLength,
  availableTimePeriods,
  setPeriodScope,
  setPeriodLength,
  lastXPeriodRadioName
) => (
  <div className="row">
    <div className="col-lg-6">
      <Dropdown
        onChange={setPeriodScope}
        items={availableTimePeriods}
        label={i18n.t('Time Period')}
        value={periodScope}
      />
    </div>
    <div className="col-lg-6">
      {lastXDaysInput(
        periodScope,
        periodLength,
        setPeriodLength,
        lastXPeriodRadioName
      )}
    </div>
  </div>
);

type Props = {
  summary: ?string,
  operator?: string,
  periodScope: ?string,
  periodLength?: ?number,
  secondPeriodLength: ?number,
  secondPeriodAllTime: ?boolean,
  availableTimePeriods: Array<DropdownItem>,
  setPeriodScope: Function,
  setPeriodLength: Function,
  setBothPeriodLengths: Function,
  setZScoreRolling: Function,
  lastXPeriodRadioName?: ?string,
};

const PeriodScopeSelector = ({
  summary,
  operator,
  periodScope,
  periodLength,
  secondPeriodLength,
  secondPeriodAllTime,
  availableTimePeriods,
  setPeriodScope,
  setPeriodLength,
  setBothPeriodLengths,
  setZScoreRolling,
  lastXPeriodRadioName,
}: Props) => {
  if (!summary) {
    return null;
  }

  let elementToRender;

  switch (summary) {
    case 'acute_to_chronic_ratio':
    case 'ewma_acute_to_chronic_ratio':
    case 'training_stress_balance':
      elementToRender = acuteChronicInputs(
        periodLength,
        secondPeriodLength,
        setBothPeriodLengths
      );
      break;
    case 'strain':
    case 'monotony':
      elementToRender = strainMonotonyInputs(periodLength, setPeriodLength);
      break;
    case 'z_score':
    case 'average_percentage_change':
      elementToRender = evaluativeComparativeInputs(
        periodLength,
        secondPeriodLength,
        setBothPeriodLengths
      );
      break;
    case 'z_score_rolling':
      elementToRender = zscoreRollingInputs(
        operator,
        periodLength,
        secondPeriodAllTime,
        secondPeriodLength,
        setZScoreRolling
      );
      break;
    default:
      elementToRender = defaultInputs(
        periodScope,
        periodLength,
        availableTimePeriods,
        setPeriodScope,
        setPeriodLength,
        lastXPeriodRadioName
      );
      break;
  }
  return <div data-testid="PeriodScopeSelector">{elementToRender}</div>;
};

export default PeriodScopeSelector;
