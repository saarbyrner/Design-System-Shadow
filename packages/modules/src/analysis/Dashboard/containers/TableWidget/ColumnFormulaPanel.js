// @flow
import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ErrorBoundary } from '@kitman/components';
import {
  OrganisationProvider,
  useOrganisation,
} from '@kitman/common/src/contexts/OrganisationContext';
import {
  toggleTableColumnFormulaPanel,
  applyComparisonTableColumnFormula,
} from '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidget/panel';
import {
  reset,
  updateFormulaInput,
  updateFormulaInputDataSource,
  updateFormulaInputElementConfig,
  incrementProgressStep,
  setColumnName,
  updateFormulaInputDataSourceSubtype,
} from '@kitman/modules/src/analysis/Dashboard/redux/slices/columnFormulaPanelSlice';
import { ColumnFormulaPanelTranslated as ColumnFormulaPanelComponent } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/ColumnFormulaPanel';
import { getSupportedFormulas } from '@kitman/modules/src/analysis/shared/utils';
import {
  useGetPermittedSquadsQuery,
  useGetSquadAthletesQuery,
} from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';
import {
  type UpdateFormulaInput,
  type UpdateFormulaInputDataSource,
  type UpdateFormulaInputElementConfig,
  type UpdateFormulaInputDataSourceSubtype,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import { type FormulaDetails } from '@kitman/modules/src/analysis/shared/types';

export default () => {
  const [activeFormula, setActiveFormula] = useState<?FormulaDetails>(null);

  const isPanelOpen = useSelector(
    (state) => state.dashboard.isTableColumnFormulaPanelOpen
  );

  const { data: squadAthletes, isFetching: isFetchingSquadAthletes } =
    useGetSquadAthletesQuery(); // TODO: has no params for skipping ?
  const { data: squads, isFetching: isFetchingSquads } =
    useGetPermittedSquadsQuery(undefined, { skip: !isPanelOpen });
  const dispatch = useDispatch();

  const { organisation } = useOrganisation();
  const codingSystemKey = organisation.coding_system_key;

  const requestUnderway = useSelector(
    (state) => state.columnFormulaPanel.isLoading
  );

  const isLoading =
    requestUnderway ||
    isFetchingSquadAthletes ||
    isFetchingSquads ||
    !activeFormula;

  const widgetType = useSelector(
    (state) => state.columnFormulaPanel.widgetType
  );
  const columnName = useSelector(
    (state) => state.columnFormulaPanel.columnName
  );
  const isEditMode = useSelector(
    (state) => state.columnFormulaPanel.isEditMode
  );
  const progressStep = useSelector(
    (state) => state.columnFormulaPanel.progressStep
  );
  const inputs = useSelector((state) => state.columnFormulaPanel.inputs);
  const formulaId = useSelector((state) => state.columnFormulaPanel.formulaId);
  const formulaInputId =
    activeFormula && activeFormula.inputs.length > progressStep
      ? activeFormula.inputs[progressStep].id
      : '';

  const updateColumnName = useCallback(
    (name: string) => dispatch(setColumnName(name)),
    [dispatch]
  );

  useEffect(() => {
    if (isPanelOpen) {
      const supportedFormulas = getSupportedFormulas();

      const matchingFormula = supportedFormulas.find(
        (formula) => formula.id === formulaId
      );
      if (matchingFormula) {
        setActiveFormula(matchingFormula);
        if (!isEditMode) {
          updateColumnName(matchingFormula.label);
        }
      }
    }
  }, [isPanelOpen, isEditMode, formulaId, updateColumnName]);

  return (
    <OrganisationProvider>
      <ErrorBoundary>
        <ColumnFormulaPanelComponent
          isOpen={isPanelOpen}
          isEditMode={isEditMode}
          isLoading={isLoading}
          widgetType={widgetType}
          progressStep={progressStep}
          activeFormula={activeFormula}
          formulaInputId={formulaInputId}
          squadAthletes={squadAthletes}
          squads={squads}
          inputs={inputs}
          columnName={columnName}
          codingSystemKey={codingSystemKey}
          updateFormulaInput={(param: UpdateFormulaInput): void => {
            dispatch(updateFormulaInput(param));
          }}
          updateFormulaInputDataSource={(
            param: UpdateFormulaInputDataSource
          ): void => {
            dispatch(updateFormulaInputDataSource(param));
          }}
          updateFormulaInputElementConfig={(
            param: UpdateFormulaInputElementConfig
          ): void => {
            dispatch(updateFormulaInputElementConfig(param));
          }}
          updateFormulaInputDataSourceSubtype={(
            param: UpdateFormulaInputDataSourceSubtype
          ): void => {
            dispatch(updateFormulaInputDataSourceSubtype(param));
          }}
          onNext={() => dispatch(incrementProgressStep(1))}
          onPrevious={() => dispatch(incrementProgressStep(-1))}
          onClose={() => {
            dispatch(toggleTableColumnFormulaPanel());
            dispatch(reset());
          }}
          onSubmit={() => {
            dispatch(applyComparisonTableColumnFormula(activeFormula));
          }}
          onSetColumnName={(name: string) => dispatch(setColumnName(name))}
        />
      </ErrorBoundary>
    </OrganisationProvider>
  );
};
