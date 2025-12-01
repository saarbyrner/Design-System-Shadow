// @flow
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  ACTIVE_FORMULA_MOCK,
  COLUMN_FORMULA_PANEL_STATE,
} from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/tableWidget';

const mockFormulaInputProps = {
  isLoading: false,
  canShowPopulationSelection: true,
  canShowInheritPopulation: true,
  isFinalStep: false,
  formulaInputId: 'A',
  input: COLUMN_FORMULA_PANEL_STATE.inputs.A,
  inputConfig: ACTIVE_FORMULA_MOCK.inputs[0],

  dateRangeModule: <div>mockDateRangeModule</div>,
  activeSourceModule: <div>mockActiveSourceModule</div>,
  dataTypeSelection: <div>mockDataTypeSelection</div>,
  populationUI: <div>mockPopulationUI</div>,
  panelFiltersUI: <div>mockPanelFiltersUI</div>,
  panelFilterMedical: <div>mockPanelFilterMedical</div>,
  actionsModule: <div>mockActionsModule</div>,
  finalStepSection: <div>finalStepSection</div>,
  t: i18nextTranslateStub(),
};

export default mockFormulaInputProps;
