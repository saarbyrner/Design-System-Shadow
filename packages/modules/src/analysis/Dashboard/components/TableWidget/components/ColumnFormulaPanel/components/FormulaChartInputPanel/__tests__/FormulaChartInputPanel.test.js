import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import * as Utils from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';
import { INHERIT_GROUPING } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/consts';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import { REDUCER_KEY } from '@kitman/modules/src/analysis/Dashboard/redux/slices/columnFormulaPanelSlice';
// eslint-disable-next-line jest/no-mocks-import
import { COLUMN_FORMULA_PANEL_STATE } from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/tableWidget';

import mockFormulaInputProps from '../../FormulaInputPanel/__tests__/mockData';
import FormulaChartInputPanel from '..';

const defaultProps = {
  ...mockFormulaInputProps,
  isOpen: true,
  isEditMode: false,
  isStepValid: true,
  canGoPrevious: false,
  columnName: 'Chart Value',
  canShowInheritPopulation: false,

  onSetColumnName: jest.fn(),
  onNext: jest.fn(),
  onPrevious: jest.fn(),
  onSubmit: jest.fn(),
  updateFormulaInput: jest.fn(),
};

const renderComponent = (props = defaultProps, store) =>
  renderWithStore(<FormulaChartInputPanel {...props} />, {}, store);

describe('Analytical Dashboard ColumnFormulaPanel <FormulaChartInputPanel />', () => {
  it('renders the FormulaChartInputPanel', () => {
    renderComponent();

    expect(screen.getByText('Data type')).toBeInTheDocument();
    expect(screen.getByText('mockDataTypeSelection')).toBeInTheDocument();
    expect(screen.getByText('mockActiveSourceModule')).toBeInTheDocument();
    expect(
      screen.queryByText('Inherit population from table')
    ).not.toBeInTheDocument();

    expect(defaultProps.onNext).not.toHaveBeenCalled();
    expect(defaultProps.onPrevious).not.toHaveBeenCalled();
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it('renders the FormulaInputPanel with active next button', async () => {
    const user = userEvent.setup();
    renderComponent();

    const nextButton = screen.getByRole('button', { name: 'Next' });
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).toBeEnabled();

    const previousButton = screen.queryByRole('button', { name: 'Back' });
    expect(previousButton).not.toBeInTheDocument();

    const applyButton = screen.queryByRole('button', { name: 'Apply' });
    expect(applyButton).not.toBeInTheDocument();

    await user.click(nextButton);
    expect(defaultProps.onNext).toHaveBeenCalled();
  });

  it('renders the FormulaInputPanel with active previous button', async () => {
    const user = userEvent.setup();
    renderComponent({
      ...defaultProps,
      canGoPrevious: true,
      isFinalStep: true,
    });

    const nextButton = screen.queryByRole('button', { name: 'Next' });
    expect(nextButton).not.toBeInTheDocument();

    const previousButton = screen.getByRole('button', { name: 'Back' });
    expect(previousButton).toBeInTheDocument();
    expect(previousButton).toBeEnabled();

    await user.click(previousButton);
    expect(defaultProps.onPrevious).toHaveBeenCalled();
  });

  it('renders the column name input when is final step', async () => {
    const user = userEvent.setup();
    renderComponent({
      ...defaultProps,
      isFinalStep: true,
    });

    const textField = screen.getByLabelText('Label name');
    await user.type(textField, 'X');

    expect(defaultProps.onSetColumnName).toHaveBeenCalledWith('Chart ValueX');
  });

  describe('when chart is type "XY"', () => {
    it('renders visualisationModule on final step', async () => {
      renderComponent({
        ...defaultProps,
        isFinalStep: true,
        widgetType: 'xy',
      });

      expect(screen.getByText('Visualisation')).toBeVisible();
    });

    it('renders groupingModule on first step', async () => {
      renderComponent({
        ...defaultProps,
        isFinalStep: false,
        widgetType: 'xy',
      });

      expect(screen.getByText('Groupings')).toBeVisible();
    });
  });

  describe('copy primary grouping', () => {
    beforeEach(() => {
      jest.spyOn(Utils, 'copyPrimaryGrouping');
    });

    it('calls copyPrimaryGrouping when props.isFinalstep is present', async () => {
      renderComponent(
        {
          ...defaultProps,
          widgetType: 'xy',
          isFinalStep: true,
          codingSystemKeys: codingSystemKeys.OSICS_10,
        },
        {
          [REDUCER_KEY]: {
            ...COLUMN_FORMULA_PANEL_STATE,
            inheritGroupings: INHERIT_GROUPING.yes,
          },
        }
      );
      expect(Utils.copyPrimaryGrouping).toHaveBeenCalledWith(
        COLUMN_FORMULA_PANEL_STATE.inputs,
        true
      );
    });

    it('does not calls copyPrimaryGrouping when is not finalStep', async () => {
      renderComponent(
        {
          ...defaultProps,
          widgetType: 'xy',
          isFinalStep: false,
          codingSystemKeys: codingSystemKeys.OSICS_10,
        },
        {
          [REDUCER_KEY]: COLUMN_FORMULA_PANEL_STATE,
        }
      );

      expect(Utils.copyPrimaryGrouping).not.toHaveBeenCalled();
    });
  });
});
