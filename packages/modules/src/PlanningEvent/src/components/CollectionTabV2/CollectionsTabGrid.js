// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import { InputNumeric, InfoTooltip, UserAvatar } from '@kitman/components';
import EditableScore from '@kitman/modules/src/Assessments/components/EditableScore';
import useScoreDropdown from '@kitman/common/src/hooks/useScoreDropdown';
import type { OrganisationTrainingVariables } from '@kitman/common/src/types/Workload';
import { validateRpe } from '@kitman/common/src/utils/planningEvent';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { BulkEditTooltipTranslated as BulkEditTooltip } from '../GridComponents/BulkEditTooltip';
import { PlanningGridTranslated as PlanningGrid } from '../GridComponents/PlanningGrid';
import type { CollectionsGridData } from '../../../types';

type Props = {
  collectionsGrid: CollectionsGridData,
  fetchMoreData: Function,
  editMode: boolean,
  canViewProtectedMetrics: boolean,
  onAttributesUpdate: Function,
  onAttributesBulkUpdate: Function,
  onValidateCell: Function,
  isLoading: boolean,
  isCommentsSidePanelOpen: boolean,
  rowErrors: Array<{ id: number, rowKey: string, message: string }>,
  selectedCollection: { name: string, type: string },
  selectedRowId: number,
  organisationTrainingVariables: Array<OrganisationTrainingVariables>,
  canViewAvailabilities?: boolean,
};

type EditableStateProps = {
  name: string,
  assessmentItemId: string,
  trainingVariableId: number,
  // variables defined out of the scope of the original function
  organisationTrainingVariables: Array<OrganisationTrainingVariables>,
  isBulkTooltipValid: boolean,
  bulkTooltipErrorMsg: ?string,
  onAttributesBulkUpdate: Function,
};

const EditableStateAssessmentHeaderCell = (
  // existing paramaters given to function
  props: EditableStateProps
) => {
  const scoreItems = useScoreDropdown(
    props.organisationTrainingVariables,
    props.trainingVariableId
  );

  const scoreItemsForSelect = scoreItems.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  return (
    <BulkEditTooltip
      type="SELECT"
      columnName={props.name}
      onApply={(value) => {
        const val = value ? parseFloat(value) : value;
        props.onAttributesBulkUpdate({
          [(props.assessmentItemId: string)]: val,
        });
      }}
      isValid={props.isBulkTooltipValid}
      error={props.bulkTooltipErrorMsg}
      options={scoreItemsForSelect}
    />
  );
};

const ATHLETE_NAME_LIMIT = 23;

const CollectionsTabGrid = (props: I18nProps<Props>) => {
  const [isBulkTooltipValid, setIsBulkTooltipValid] = useState(true);
  const [bulkTooltipErrorMsg, setBulkTooltipErrorMsg] = useState(null);

  const getReadOnlyStateHeaderCell = (id, rowKey, name, isDefault) => {
    if (!isDefault) {
      return (
        <InfoTooltip content={name}>
          <div
            className={classNames(
              'planningEventGridTab__headerCell',
              `planningEventGridTab__headerCell--${rowKey}`
            )}
          >
            {name}
          </div>
        </InfoTooltip>
      );
    }
    return name;
  };

  const getEditableStateHeaderCell = (
    rowKey,
    name,
    assessmentItemId,
    trainingVariableId,
    isWorkloadUnit: boolean
  ) => {
    const isRpe = rowKey === 'rpe';
    const isAssessmentField = !!assessmentItemId;

    if (isAssessmentField) {
      return (
        <EditableStateAssessmentHeaderCell
          name={name}
          assessmentItemId={assessmentItemId}
          trainingVariableId={trainingVariableId}
          organisationTrainingVariables={props.organisationTrainingVariables}
          isBulkTooltipValid={isBulkTooltipValid}
          bulkTooltipErrorMsg={bulkTooltipErrorMsg}
          onAttributesBulkUpdate={props.onAttributesBulkUpdate}
        />
      );
    }
    return (
      <BulkEditTooltip
        type="INPUT"
        columnName={name}
        onApply={(value) => {
          const attributeKey = rowKey === 'minutes' ? 'duration' : rowKey;
          const val = value ? parseFloat(value) : value;
          if (isWorkloadUnit) {
            const workloadUnits = {};
            workloadUnits[attributeKey] = val;

            props.onAttributesBulkUpdate({
              workload_units: workloadUnits,
            });
          } else {
            props.onAttributesBulkUpdate({
              [(attributeKey: string)]: val,
            });
          }
        }}
        onValidate={(value) => {
          if (isRpe) {
            const { error, isValid } = validateRpe(value);
            setIsBulkTooltipValid(isValid);
            setBulkTooltipErrorMsg(error);
          }
        }}
        isValid={isBulkTooltipValid}
        error={bulkTooltipErrorMsg}
      />
    );
  };

  const getHeaderCell = ({
    id,
    row_key: rowKey,
    name,
    readonly,
    assessment_item_id: assessmentItemId,
    default: isDefault,
    training_variable_id: trainingVariableId,
    workload_unit: isWorkloadUnit,
  }) => {
    return {
      id: rowKey,
      content: (
        <div className={`planningEventGridTab__headerCell--${rowKey}`}>
          {props.editMode && !readonly
            ? getEditableStateHeaderCell(
                rowKey,
                name,
                assessmentItemId,
                trainingVariableId,
                isWorkloadUnit
              )
            : getReadOnlyStateHeaderCell(id, rowKey, name, isDefault)}
        </div>
      ),
      isHeader: true,
    };
  };

  const defaultEditableCellContent = (
    assessmentItemId,
    trainingVariableId,
    cellValue,
    rowData,
    rowKey,
    invalidCell,
    isOnInvalidRow,
    columnId
  ) => {
    return assessmentItemId == null && trainingVariableId == null ? (
      <>
        <InputNumeric
          value={cellValue ?? undefined}
          onBlur={() => {
            props.onValidateCell(rowData.id, rowKey, cellValue);
          }}
          onChange={(value) => {
            const val = value ? parseFloat(value) : value;
            return props.onAttributesUpdate(
              { [rowKey]: val === '' ? null : val },
              rowData.athlete.id
            );
          }}
          isInvalid={invalidCell}
          size="small"
          kitmanDesignSystem
        />
        {isOnInvalidRow ? (
          <div className="planningEventGridTab__invalidCell--blank" />
        ) : null}
        {invalidCell ? (
          <span className="planningEventGridTab__invalidCell--error">
            {invalidCell.message}
          </span>
        ) : null}
      </>
    ) : (
      <EditableScore
        className="planningEventGridTab__dropdownScore"
        organisationTrainingVariables={props.organisationTrainingVariables}
        trainingVariableId={trainingVariableId}
        onChangeScore={(value) => {
          props.onValidateCell(rowData.id, rowKey, cellValue);
          return props.onAttributesUpdate(
            {
              [rowKey]: { value, comment: rowData[rowKey]?.comment },
              value,
              assessment_item_id: assessmentItemId,
              columnId,
            },
            rowData.athlete.id
          );
        }}
        score={cellValue}
        appendToBody
      />
    );
  };

  const getCellContent = (
    {
      row_key: rowKey,
      id: columnId,
      protected: isProtected,
      readonly,
      assessment_item_id: assessmentItemId,
      training_variable_id: trainingVariableId,
    },
    rowData
  ) => {
    const cellValue =
      typeof rowData[rowKey] === 'object'
        ? rowData[rowKey]?.value
        : rowData[rowKey];

    // Is on a row where there is an invalid cell but is not invalid itself
    const isOnInvalidRow = !!props.rowErrors.find(
      (error) => error.id === rowData.id && error.rowKey !== rowKey
    );
    // Is an invalid cell
    const invalidCell = props.rowErrors.find(
      (error) => error.id === rowData.id && error.rowKey === rowKey
    );

    const isEditable =
      (!readonly && !isProtected) ||
      (!readonly && isProtected && props.canViewProtectedMetrics);

    const athleteName =
      rowData.athlete.fullname.length > ATHLETE_NAME_LIMIT
        ? `${rowData.athlete.fullname.substring(0, 22)} ...`
        : rowData.athlete.fullname;

    switch (rowKey) {
      case 'athlete':
        return (
          <InfoTooltip content={rowData.athlete.fullname}>
            <div className="planningEventGridTab__athleteCell">
              <UserAvatar
                url={rowData.athlete.avatar_url}
                firstname={rowData.athlete.fullname}
                availability={
                  props.canViewAvailabilities
                    ? rowData.athlete.availability
                    : undefined
                }
                displayInitialsAsFallback
                size="EXTRA_SMALL"
              />
              {athleteName}
            </div>
          </InfoTooltip>
        );
      case 'participation_level':
        return (
          <div className="planningEventGridTab__participationLevelCell">
            {rowData.participation_level.name}
          </div>
        );
      default:
        if (props.editMode && isEditable) {
          return defaultEditableCellContent(
            assessmentItemId,
            trainingVariableId,
            cellValue,
            rowData,
            rowKey,
            invalidCell,
            isOnInvalidRow,
            columnId
          );
        }

        return rowData[rowKey];
    }
  };

  return (
    <PlanningGrid
      grid={props.collectionsGrid}
      getHeaderCell={getHeaderCell}
      emptyText={props.t('There are no athletes')}
      fetchMoreData={props.fetchMoreData}
      isFullyLoaded={!props.isLoading && !props.collectionsGrid.nextId}
      isLoading={props.isLoading}
      isCommentsSidePanelOpen={props.isCommentsSidePanelOpen}
      getCellContent={getCellContent}
      selectedRowId={props.selectedRowId}
    />
  );
};

export const CollectionsTabGridTranslated =
  withNamespaces()(CollectionsTabGrid);
export default CollectionsTabGrid;
