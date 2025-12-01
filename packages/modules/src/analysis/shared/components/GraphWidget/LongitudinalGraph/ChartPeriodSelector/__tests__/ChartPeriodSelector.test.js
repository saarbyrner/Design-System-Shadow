import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ChartPeriodSelector from '..';

describe('Graph Composer <ChartPeriodSelector /> component', () => {
  const i18nT = i18nextTranslateStub();
  const onChangeFn = jest.fn();
  const props = {
    period: 'day',
    onChange: onChangeFn,
    t: i18nT,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    render(<ChartPeriodSelector {...props} />);

    expect(screen.getByRole('button', { name: 'Day' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Week' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Month' })).toBeInTheDocument();
  });

  describe('when the selected period is day', () => {
    const customProps = {
      period: 'day',
      onChange: onChangeFn,
      t: i18nT,
    };

    it('highlights the day button', () => {
      render(<ChartPeriodSelector {...customProps} />);

      const dayButton = screen.getByRole('button', { name: 'Day' });
      const weekButton = screen.getByRole('button', { name: 'Week' });
      const monthButton = screen.getByRole('button', { name: 'Month' });

      expect(dayButton).toHaveClass('active');
      expect(weekButton).not.toHaveClass('active');
      expect(monthButton).not.toHaveClass('active');
    });
  });

  describe('when the selected period is week', () => {
    const customProps = {
      period: 'week',
      onChange: onChangeFn,
      t: i18nT,
    };

    it('highlights the week button', () => {
      render(<ChartPeriodSelector {...customProps} />);

      const dayButton = screen.getByRole('button', { name: 'Day' });
      const weekButton = screen.getByRole('button', { name: 'Week' });
      const monthButton = screen.getByRole('button', { name: 'Month' });

      expect(dayButton).not.toHaveClass('active');
      expect(weekButton).toHaveClass('active');
      expect(monthButton).not.toHaveClass('active');
    });
  });

  describe('when the selected period is month', () => {
    const customProps = {
      period: 'month',
      onChange: onChangeFn,
      t: i18nT,
    };

    it('highlights the month button', () => {
      render(<ChartPeriodSelector {...customProps} />);

      const dayButton = screen.getByRole('button', { name: 'Day' });
      const weekButton = screen.getByRole('button', { name: 'Week' });
      const monthButton = screen.getByRole('button', { name: 'Month' });

      expect(dayButton).not.toHaveClass('active');
      expect(weekButton).not.toHaveClass('active');
      expect(monthButton).toHaveClass('active');
    });
  });

  describe('when the user clicks the day button', () => {
    it('calls the onChange callback', async () => {
      const user = userEvent.setup();
      render(<ChartPeriodSelector {...props} />);

      const dayButton = screen.getByRole('button', { name: 'Day' });
      await user.click(dayButton);

      expect(onChangeFn).toHaveBeenCalledWith('day');
    });
  });

  describe('when the user clicks the week button', () => {
    it('calls the onChange callback', async () => {
      const user = userEvent.setup();
      render(<ChartPeriodSelector {...props} />);

      const weekButton = screen.getByRole('button', { name: 'Week' });
      await user.click(weekButton);

      expect(onChangeFn).toHaveBeenCalledWith('week');
    });
  });

  describe('when the user clicks the month button', () => {
    it('calls the onChange callback', async () => {
      const user = userEvent.setup();
      render(<ChartPeriodSelector {...props} />);

      const monthButton = screen.getByRole('button', { name: 'Month' });
      await user.click(monthButton);

      expect(onChangeFn).toHaveBeenCalledWith('month');
    });
  });

  describe('when condensed is true', () => {
    it('renders a small button with the selected period text', () => {
      const { container } = render(
        <ChartPeriodSelector {...props} condensed />
      );

      const textButton = container.querySelector('button');
      expect(textButton).toBeInTheDocument();
      expect(textButton).toHaveTextContent('Day');
    });

    it('selects the correct time period when clicking the time period button', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<ChartPeriodSelector {...props} condensed />);

      let button = screen.getByRole('button', { name: 'Day' });
      expect(button).toHaveTextContent('Day');

      await user.click(button);
      expect(onChangeFn).toHaveBeenCalledWith('week');

      rerender(<ChartPeriodSelector {...props} period="week" condensed />);
      button = screen.getByRole('button', { name: 'Week' });
      expect(button).toHaveTextContent('Week');

      await user.click(button);
      expect(onChangeFn).toHaveBeenCalledWith('month');

      rerender(<ChartPeriodSelector {...props} period="month" condensed />);
      button = screen.getByRole('button', { name: 'Month' });
      expect(button).toHaveTextContent('Month');

      await user.click(button);
      expect(onChangeFn).toHaveBeenCalledWith('day');
    });
  });
});
