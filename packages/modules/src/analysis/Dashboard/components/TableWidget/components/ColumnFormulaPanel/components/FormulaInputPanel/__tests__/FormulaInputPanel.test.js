import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// eslint-disable-next-line jest/no-mocks-import
import { COLUMN_FORMULA_PANEL_STATE } from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/tableWidget';
import FormulaInputPanel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/ColumnFormulaPanel/components/FormulaInputPanel';
import mockFormulaInputProps from './mockData';

const defaultProps = {
  ...mockFormulaInputProps,
  updateFormulaInput: jest.fn(),
};

const renderComponent = (props = defaultProps) =>
  render(<FormulaInputPanel {...props} />);

describe('Analytical Dashboard ColumnFormulaPanel <FormulaInputPanel />', () => {
  it('renders the FormulaInputPanel', () => {
    renderComponent();

    expect(screen.getByText('Data type')).toBeInTheDocument();
    expect(screen.getByText('mockDataTypeSelection')).toBeInTheDocument();
    expect(screen.getByText('mockActiveSourceModule')).toBeInTheDocument();
    expect(screen.getByText('Context')).toBeInTheDocument();
    expect(screen.getByText('mockDateRangeModule')).toBeInTheDocument();
    expect(screen.getByText('mockActionsModule')).toBeInTheDocument();
    expect(screen.queryByText('finalStepSection')).not.toBeInTheDocument();

    expect(
      screen.getByText('Inherit population from table')
    ).toBeInTheDocument();
    expect(screen.getByText('Select specific population')).toBeInTheDocument();

    const populationRadios = screen.getAllByRole('radio');
    expect(populationRadios).toHaveLength(2);
    expect(populationRadios[0]).toBeChecked(); // Inherit
    expect(populationRadios[1]).not.toBeChecked(); // Select

    expect(screen.queryByText('mockPopulationUI')).not.toBeInTheDocument();
    expect(screen.getByText('mockPanelFiltersUI')).toBeInTheDocument();
    expect(screen.getByText('mockPanelFilterMedical')).toBeInTheDocument();
    expect(
      screen.queryByLabelText('Column header title')
    ).not.toBeInTheDocument();
  });

  it('hides the population selection as needed', () => {
    renderComponent({
      ...defaultProps,
      canShowPopulationSelection: false,
    });

    expect(
      screen.queryByText('Inherit population from table')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Select specific population')
    ).not.toBeInTheDocument();

    expect(screen.queryByText('mockPopulationUI')).not.toBeInTheDocument();
  });

  it('renders the population UI', () => {
    renderComponent({
      ...defaultProps,
      canShowPopulationSelection: true,
      canShowInheritPopulation: false,
    });

    expect(
      screen.queryByText('Inherit population from table')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Select specific population')
    ).not.toBeInTheDocument();

    expect(screen.getByText('mockPopulationUI')).toBeInTheDocument();
  });

  it('renders the population UI when inherit not selected', () => {
    renderComponent({
      ...defaultProps,
      canShowPopulationSelection: true,
      canShowInheritPopulation: true,
      input: {
        ...COLUMN_FORMULA_PANEL_STATE.inputs.A,
        population_selection: 'select',
      },
    });

    expect(
      screen.getByText('Inherit population from table')
    ).toBeInTheDocument();
    expect(screen.getByText('Select specific population')).toBeInTheDocument();

    const populationRadios = screen.getAllByRole('radio');
    expect(populationRadios).toHaveLength(2);
    expect(populationRadios[0]).not.toBeChecked(); // Inherit
    expect(populationRadios[1]).toBeChecked(); // Select

    expect(screen.getByText('mockPopulationUI')).toBeInTheDocument();
  });

  it('calls updateFormulaInput when population radio changed', async () => {
    const user = userEvent.setup();
    renderComponent();

    expect(
      screen.getByText('Inherit population from table')
    ).toBeInTheDocument();
    expect(screen.getByText('Select specific population')).toBeInTheDocument();

    const populationRadios = screen.getAllByRole('radio');
    expect(populationRadios).toHaveLength(2);
    expect(populationRadios[0]).toBeChecked(); // Inherit

    await user.click(populationRadios[1]);
    expect(defaultProps.updateFormulaInput).toHaveBeenCalledWith({
      formulaInputId: 'A',
      properties: {
        population_selection: 'select',
      },
    });
  });

  it('renders finalStepSection the column name input when is final step', async () => {
    renderComponent({
      ...defaultProps,
      isFinalStep: true,
    });

    expect(screen.getByText('finalStepSection')).toBeInTheDocument();
  });
});
