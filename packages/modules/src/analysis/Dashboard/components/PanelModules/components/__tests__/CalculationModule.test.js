import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VirtuosoMockContext } from 'react-virtuoso';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';

import CalculationModule from '../CalculationModule';

describe('<CalculationModule />', () => {
  const defaultProps = {
    t: i18nextTranslateStub(),
  };

  it('renders correctly', () => {
    renderWithStore(<CalculationModule {...defaultProps} />);

    expect(screen.getByText('Calculation')).toBeInTheDocument();
  });

  it('renders the correct options', async () => {
    const user = userEvent.setup();
    renderWithStore(<CalculationModule {...defaultProps} />);

    const selectInput = screen.getByTestId('selectInput');
    await user.click(selectInput);

    await waitFor(() => {
      expect(screen.getByText('Count (Absolute)')).toBeInTheDocument();
    });
  });

  it('calls the onSetCalculation prop when changed', async () => {
    const mockOnSetCalculation = jest.fn();
    const user = userEvent.setup();

    renderWithStore(
      <CalculationModule
        {...defaultProps}
        onSetCalculation={mockOnSetCalculation}
      />
    );
    const selectInput = screen.getByTestId('selectInput');
    await user.click(selectInput);

    // Select second option
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(mockOnSetCalculation).toHaveBeenCalledTimes(1);
  });

  describe('when evaluating hideComplexCalcs', () => {
    beforeEach(() => {
      window.setFlag('table-widget-complex-calculations', true);
    });

    afterEach(() => {
      window.setFlag('table-widget-complex-calculations', false);
    });

    it('hides complex calculations when hideComplexCalcs is true', async () => {
      const user = userEvent.setup();

      renderWithStore(
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 2000, itemHeight: 40 }}
        >
          <CalculationModule {...defaultProps} hideComplexCalcs />
        </VirtuosoMockContext.Provider>
      );

      const selectInput = screen.getByTestId('selectInput');
      await user.click(selectInput);

      expect(screen.queryByText('Complex Z-Score')).not.toBeInTheDocument();
    });

    it('shows complex calculations when hideComplexCalcs is false', async () => {
      const user = userEvent.setup();

      renderWithStore(
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 10000, itemHeight: 40 }}
        >
          <CalculationModule {...defaultProps} hideComplexCalcs={false} />
        </VirtuosoMockContext.Provider>
      );

      const selectInput = screen.getByTestId('selectInput');
      await user.click(selectInput);

      await waitFor(() => {
        expect(screen.getByText('Complex Z-Score')).toBeInTheDocument();
      });
    });

    it('shows complex calculations when hideComplexCalcs is undefined', async () => {
      const user = userEvent.setup();

      renderWithStore(
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 10000, itemHeight: 40 }}
        >
          <CalculationModule {...defaultProps} />
        </VirtuosoMockContext.Provider>
      );

      const selectInput = screen.getByTestId('selectInput');
      await user.click(selectInput);

      await waitFor(() => {
        expect(screen.getByText('Complex Z-Score')).toBeInTheDocument();
      });
    });
  });

  describe('when table-widget-complex-calculations feature flag is true', () => {
    beforeEach(() => {
      window.setFlag('table-widget-complex-calculations', true);
    });

    afterEach(() => {
      window.setFlag('table-widget-complex-calculations', false);
    });

    it('renders evaluated_period & comparative_period for z_score calculation', async () => {
      const mockOnSetCalculationParam = jest.fn();

      renderWithStore(
        <CalculationModule
          {...defaultProps}
          calculation="z_score"
          onSetCalculationParam={mockOnSetCalculationParam}
        />
      );

      expect(screen.getByText('Z-Score')).toBeInTheDocument();
      expect(screen.getByText('Evaluate Period')).toBeInTheDocument();
      expect(screen.getByText('Comparative Period')).toBeInTheDocument();

      const evaluatedPeriodContainer = screen
        .getByText('Evaluate Period')
        .closest('.InputNumeric');
      const evaluatedPeriodInput = evaluatedPeriodContainer.querySelector(
        '[data-validatetype="inputNumeric"]'
      );

      await fireEvent.change(evaluatedPeriodInput, { target: { value: '1' } });

      await waitFor(() => {
        expect(mockOnSetCalculationParam).toHaveBeenCalledWith(
          'evaluated_period',
          1
        );
      });
    });

    it('renders evaluated_period, comparative_period_type & operator for complex_z_score calculation', () => {
      const mockOnSetCalculationParam = jest.fn();

      renderWithStore(
        <CalculationModule
          {...defaultProps}
          calculation="complex_z_score"
          onSetCalculationParam={mockOnSetCalculationParam}
        />
      );

      const expectedCalculations = [
        'Complex Z-Score',
        'Evaluate Period',
        'Comparative Days',
        'Operator',
        'Min',
        'Mean',
        'Max',
      ];

      expectedCalculations.forEach((text) => {
        expect(screen.getByText(text)).toBeInTheDocument();
      });
    });

    it('renders acute, chronic & type for acute_chronic calculation', () => {
      const mockOnSetCalculationParam = jest.fn();

      renderWithStore(
        <CalculationModule
          {...defaultProps}
          calculation="acute_chronic"
          onSetCalculationParam={mockOnSetCalculationParam}
        />
      );

      expect(screen.getByText('Acute:Chronic')).toBeInTheDocument();

      const acuteElements = screen.getAllByText('Acute');
      const chronicElements = screen.getAllByText('Chronic');

      expect(acuteElements.length).toBeGreaterThanOrEqual(2);
      expect(chronicElements.length).toBeGreaterThanOrEqual(2);

      expect(screen.getByText('Ratio')).toBeInTheDocument();
    });

    it('renders acute & chronic for training_stress_balance calculation', () => {
      const mockOnSetCalculationParam = jest.fn();

      renderWithStore(
        <CalculationModule
          {...defaultProps}
          calculation="training_stress_balance"
          onSetCalculationParam={mockOnSetCalculationParam}
        />
      );

      expect(screen.getByText('Training Stress Balance')).toBeInTheDocument();
      expect(screen.getByText('Acute')).toBeInTheDocument();
      expect(screen.getByText('Chronic')).toBeInTheDocument();
    });

    it('renders evaluated_period & comparative_period for average_percentage_change calculation', () => {
      const mockOnSetCalculationParam = jest.fn();

      renderWithStore(
        <CalculationModule
          {...defaultProps}
          calculation="average_percentage_change"
          onSetCalculationParam={mockOnSetCalculationParam}
        />
      );

      expect(screen.getByText('Average Percentage Change')).toBeInTheDocument();
      expect(screen.getByText('Evaluate Period')).toBeInTheDocument();
      expect(screen.getByText('Comparative Period')).toBeInTheDocument();
    });

    it('renders time_period for strain calculation', async () => {
      const user = userEvent.setup();
      const mockOnSetCalculationParam = jest.fn();

      renderWithStore(
        <CalculationModule
          {...defaultProps}
          calculationParams={{
            time_period_length: 4,
            time_period_length_unit: 'days',
          }}
          calculation="strain"
          onSetCalculationParam={mockOnSetCalculationParam}
        />
      );

      expect(screen.getByText('Strain')).toBeInTheDocument();
      expect(screen.getByText('Time Period')).toBeInTheDocument();

      const input = screen.getByDisplayValue('4');
      expect(input).toBeInTheDocument();

      expect(screen.getByText('Days')).toBeInTheDocument();
      expect(screen.getByText('Weeks')).toBeInTheDocument();

      const weeksButton = screen.getByRole('button', { name: 'Weeks' });
      await user.click(weeksButton);

      expect(mockOnSetCalculationParam).toHaveBeenCalledWith(
        'time_period_length_unit',
        'weeks'
      );
    });

    it('renders time_period for monotony calculation', async () => {
      const user = userEvent.setup();
      const mockOnSetCalculationParam = jest.fn();

      renderWithStore(
        <CalculationModule
          {...defaultProps}
          calculationParams={{
            time_period_length: 7,
            time_period_length_unit: 'weeks',
          }}
          calculation="monotony"
          onSetCalculationParam={mockOnSetCalculationParam}
        />
      );

      expect(screen.getByText('Monotony')).toBeInTheDocument();
      expect(screen.getByText('Time Period')).toBeInTheDocument();

      const input = screen.getByDisplayValue('7');
      expect(input).toBeInTheDocument();

      const daysButton = screen.getByRole('button', { name: 'Days' });
      await user.click(daysButton);

      expect(mockOnSetCalculationParam).toHaveBeenCalledWith(
        'time_period_length_unit',
        'days'
      );
    });

    it('renders DateRangeModule for standard_deviation calculation', () => {
      renderWithStore(
        <CalculationModule {...defaultProps} calculation="standard_deviation" />
      );

      expect(screen.getByText('Standard Deviation')).toBeInTheDocument();
      expect(screen.getByText('Time Period')).toBeInTheDocument();
    });
  });
});
