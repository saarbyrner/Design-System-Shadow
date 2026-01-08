import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import PeriodScopeSelector from '..';

describe('<PeriodScopeSelector />', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    summary: 'strain',
    periodLength: 7,
    secondPeriodLength: 28,
    operator: 'mean',
    secondPeriodAllTime: false,
    setPeriodLength: () => {},
    setBothPeriodLengths: () => {},
    t: i18nT,
  };

  it('renders a single LastXDaysSelector control when summary is strain', () => {
    render(<PeriodScopeSelector {...props} />);
    const container = screen.getByTestId('PeriodScopeSelector');
    expect(container).toBeInTheDocument();
    expect(container.querySelectorAll('.lastXDaysSelector')).toHaveLength(1);
  });

  it('renders a single LastXDaysSelector control when summary is monotony', () => {
    render(<PeriodScopeSelector {...props} summary="monotony" />);
    const container = screen.getByTestId('PeriodScopeSelector');
    expect(container).toBeInTheDocument();
    expect(container.querySelectorAll('.lastXDaysSelector')).toHaveLength(1);
  });

  it('renders an AcuteToChronic control when summary is acute_to_chronic_ratio', () => {
    render(<PeriodScopeSelector {...props} summary="acute_to_chronic_ratio" />);
    const container = screen.getByTestId('PeriodScopeSelector');
    expect(container.querySelector('.acuteChronic')).toBeInTheDocument();
  });

  it('renders an AcuteToChronic control when summary is ewma_acute_to_chronic_ratio', () => {
    render(
      <PeriodScopeSelector {...props} summary="ewma_acute_to_chronic_ratio" />
    );
    const container = screen.getByTestId('PeriodScopeSelector');
    expect(container.querySelector('.acuteChronic')).toBeInTheDocument();
  });

  it('renders an AcuteToChronic control when summary is training_stress_balance', () => {
    render(
      <PeriodScopeSelector {...props} summary="training_stress_balance" />
    );
    const container = screen.getByTestId('PeriodScopeSelector');
    expect(container.querySelector('.acuteChronic')).toBeInTheDocument();
  });

  it('renders an ZScoreRolling control when summary is z_score_rolling', () => {
    render(<PeriodScopeSelector {...props} summary="z_score_rolling" />);
    const container = screen.getByTestId('PeriodScopeSelector');
    expect(container.querySelector('.zScoreRolling')).toBeInTheDocument();
  });

  it('renders an Dropdown and LastXDaysSelector controls when summary is something else and custom time period selected', () => {
    render(
      <PeriodScopeSelector
        {...props}
        summary="sum"
        periodScope="last_x_days"
        availableTimePeriods={[
          { name: 'Custom Time Period', key_name: 'last_x_days' },
        ]}
      />
    );

    const container = screen.getByTestId('PeriodScopeSelector');
    expect(container.querySelector('.dropdown')).toBeInTheDocument();
    expect(container.querySelector('.lastXDaysSelector')).toBeInTheDocument();
  });

  it('renders nothing but a Dropdown control when summary is something else (non defined value) and custom time period not selected', () => {
    render(
      <PeriodScopeSelector
        {...props}
        summary="anything_at_all"
        periodScope="yesterday"
        availableTimePeriods={[{ name: 'Yesterday', key_name: 'yesterday' }]}
      />
    );

    const container = screen.getByTestId('PeriodScopeSelector');
    expect(container.querySelector('.dropdown')).toBeInTheDocument();
    expect(container.parentNode.childNodes).toHaveLength(1);
    expect(container.parentNode.parentNode.childNodes).toHaveLength(1);
  });
});
