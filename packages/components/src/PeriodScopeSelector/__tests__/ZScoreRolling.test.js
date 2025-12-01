import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { ZScoreRollingComponent } from '../ZScoreRolling';

describe('ZScoreRollingComponent', () => {
  const baseProps = {
    operator: 'mean',
    periodLength: 7,
    secondPeriodAllTime: true,
    secondPeriodLength: 365,
    t: i18nextTranslateStub(),
  };

  const renderComponent = (overrideProps = {}) => {
    const setZScoreRolling = jest.fn();
    const props = { ...baseProps, ...overrideProps, setZScoreRolling };
    render(<ZScoreRollingComponent {...props} />);
    return { setZScoreRolling, props };
  };

  it('renders provided operator and period values', () => {
    renderComponent();

    expect(screen.getByText('Operator')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mean' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'All Time' })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('spinbutton')[0]).toHaveValue(7);
  });

  it('renders comparative period length input when second period is custom', () => {
    renderComponent({ secondPeriodAllTime: false });

    expect(screen.getByRole('button', { name: 'Custom' })).toBeInTheDocument();
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs[0]).toHaveValue(7);
    expect(inputs[1]).toHaveValue(365);
  });

  it('calls setZScoreRolling when operator changes', async () => {
    const user = userEvent.setup();
    const { setZScoreRolling, props } = renderComponent();

    await user.click(screen.getByRole('button', { name: 'Mean' }));
    await user.click(screen.getByText('Min'));

    expect(setZScoreRolling).toHaveBeenCalledWith(
      'min',
      props.periodLength,
      props.secondPeriodAllTime,
      props.secondPeriodLength
    );
  });

  it('calls setZScoreRolling when evaluated period changes', () => {
    const { setZScoreRolling, props } = renderComponent();

    fireEvent.change(screen.getAllByRole('spinbutton')[0], {
      target: { value: '3' },
    });

    expect(setZScoreRolling).toHaveBeenCalledWith(
      props.operator,
      3,
      props.secondPeriodAllTime,
      props.secondPeriodLength
    );
  });

  it('calls setZScoreRolling when comparative period selection changes', async () => {
    const user = userEvent.setup();
    const { setZScoreRolling, props } = renderComponent();

    await user.click(screen.getByRole('button', { name: 'All Time' }));
    await user.click(screen.getByText('Custom'));

    expect(setZScoreRolling).toHaveBeenCalledWith(
      props.operator,
      props.periodLength,
      false,
      props.secondPeriodLength
    );
  });

  it('calls setZScoreRolling when comparative period length changes', () => {
    const { setZScoreRolling, props } = renderComponent({
      secondPeriodAllTime: false,
    });

    fireEvent.change(screen.getAllByRole('spinbutton')[1], {
      target: { value: '21' },
    });

    expect(setZScoreRolling).toHaveBeenCalledWith(
      props.operator,
      props.periodLength,
      props.secondPeriodAllTime,
      21
    );
  });
});
