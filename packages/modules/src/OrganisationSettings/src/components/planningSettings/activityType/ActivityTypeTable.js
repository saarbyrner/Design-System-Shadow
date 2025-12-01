// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import classNames from 'classnames';
import {
  DataGrid,
  EllipsisTooltipText,
  IconButton,
  InputText,
  Select,
  TextButton,
} from '@kitman/components';
import type { ActivityType } from '@kitman/modules/src/PlanningHub/src/services/getActivityTypes';
import type { Squads } from '@kitman/services/src/services/getSquads';
import type { ActivityTypeCategory } from '@kitman/services/src/services/getActivityTypeCategories';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { SettingsView } from '../types';
import styles from '../styles/table';

type Props = {
  isLoading: boolean,
  view: SettingsView,
  activityTypeCategoriesEnabled: boolean,
  activityTypeCategories: ?Array<ActivityTypeCategory>,
  activityTypes: Array<ActivityType>,
  squads: Squads,
  isValidationCheckAllowed: boolean,
  onDelete: Function,
  onChangeName: Function,
  onChangeActivityCategory: Function,
  onChangeSquads: Function,
  onAddNew: Function,
  onDeleteNew: (newItemId: number | string) => void,
};

const ActivityTypeTable = (props: I18nProps<Props>) => {
  const isPresentationView = props.view === 'PRESENTATION';

  const selectableSquads = props.squads.map((squad) => ({
    value: squad.id,
    label: squad.name,
  }));

  const selectableActivityCategoriesTypes = props.activityTypeCategories?.map(
    ({ id, name }) => ({ value: id, label: name })
  );

  const columns = [
    {
      id: 'activityType',
      content: (
        <div className="planningSettingsTable__columnCell">
          {props.t('Name')}
        </div>
      ),
      isHeader: true,
    },
    {
      id: 'squad',
      content: (
        <div className="planningSettingsTable__columnCell">
          {props.t('Squad')}
        </div>
      ),
      isHeader: true,
    },
  ];
  // should only be added as an option if the preference 'enable_activity_type_category' has been enabled
  if (props.activityTypeCategoriesEnabled) {
    columns.splice(1, 0, {
      id: 'category',
      content: (
        <div className="planningSettingsTable__columnCell">
          {props.t('Category')}
        </div>
      ),
      isHeader: true,
    });
  }

  const rows = props.activityTypes.map((activityType) => {
    const {
      id: activityTypeId,
      name: activityTypeName,
      squads: activityTypeSquads,
      event_activity_type_category: activityTypeCategory,
    } = activityType;

    const withSquads = activityTypeSquads && activityTypeSquads.length > 0;
    const squadNames = withSquads
      ? // $FlowFixMe there are squads at this point
        activityTypeSquads.map((squad) => squad.name).join(', ')
      : '';

    const isNewActivityType =
      !isPresentationView && `${activityTypeId}`.includes('NEW_ITEM_');

    const cells = [
      {
        id: `activityType_${activityTypeId}`,
        content: (
          <div
            css={styles.rowCell}
            className="planningSettingsTable__rowCell planningSettingsTable__rowCell--name"
          >
            {isPresentationView ? (
              <EllipsisTooltipText
                content={activityTypeName || ''}
                displayEllipsisWidth={380}
              />
            ) : (
              <InputText
                value={activityTypeName}
                onValidation={({ value = '' }) => {
                  if (value === activityTypeName) {
                    return;
                  }
                  props.onChangeName(activityTypeId, value);
                }}
                invalid={props.isValidationCheckAllowed && !activityTypeName}
                kitmanDesignSystem
              />
            )}
          </div>
        ),
      },
      {
        id: `squad_${activityTypeId}`,
        content: (
          <div
            css={styles.rowCell}
            className="planningSettingsTable__rowCell planningSettingsTable__rowCell--squad"
          >
            {isPresentationView ? (
              withSquads && (
                <EllipsisTooltipText
                  content={squadNames}
                  displayEllipsisWidth={220}
                />
              )
            ) : (
              <>
                <Select
                  options={selectableSquads}
                  value={
                    withSquads
                      ? // $FlowFixMe there are squads at this point
                        activityTypeSquads.map((squad) => squad.id)
                      : []
                  }
                  onChange={(selectedIds) => {
                    props.onChangeSquads(
                      activityTypeId,
                      selectedIds,
                      props.squads
                    );
                  }}
                  isMulti
                  inlineShownSelection
                  inlineShownSelectionMaxWidth={isNewActivityType ? 110 : 160}
                  allowSelectAll
                  allowClearAll
                  appendToBody
                />
                {isNewActivityType && (
                  <IconButton
                    icon="icon-close"
                    isBorderless
                    isTransparent
                    onClick={() => props.onDeleteNew(activityTypeId)}
                  />
                )}
              </>
            )}
          </div>
        ),
      },
    ];
    // should only be added as an option if the preference 'enable_activity_type_category' has been enabled
    if (props.activityTypeCategoriesEnabled) {
      cells.splice(1, 0, {
        id: `activity_type_${activityTypeId}`,
        content: (
          <div
            css={styles.rowCell}
            className="planningSettingsTable__rowCell planningSettingsTable__rowCell--squad"
          >
            {isPresentationView ? (
              <EllipsisTooltipText
                content={activityTypeCategory?.name || ''}
                displayEllipsisWidth={220}
              />
            ) : (
              <>
                <Select
                  options={selectableActivityCategoriesTypes}
                  value={
                    activityTypeCategory?.id || activityTypeCategory?.value
                  }
                  onChange={(actCatType) => {
                    props.onChangeActivityCategory(activityTypeId, actCatType);
                  }}
                  invalid={
                    props.isValidationCheckAllowed &&
                    (!activityTypeCategory?.id || activityTypeCategory?.value)
                  }
                  appendToBody
                  returnObject
                />
              </>
            )}
          </div>
        ),
      });
    }

    return {
      id: activityTypeId,
      classnames: classNames('planningSettingsTable__row', {
        planningSettingsTable__newRow: isNewActivityType,
      }),
      cells,
    };
  });

  const rowActions = [
    {
      id: 'delete',
      text: props.t('Delete'),
      onCallAction: props.onDelete,
    },
  ];

  return (
    <main
      css={styles.table}
      className={classNames('planningSettingsTable', {
        'planningSettingsTable--edit': !isPresentationView,
      })}
      data-testid="activityTypeTable"
    >
      <DataGrid
        columns={columns}
        rows={rows}
        rowActions={isPresentationView && rowActions}
        isFullyLoaded={!props.isLoading}
        isTableEmpty={props.activityTypes.length === 0}
        emptyTableText={props.t('No activity types added')}
        scrollOnBody
      />
      {!isPresentationView && (
        <div css={styles.action} className="planningSettingsTable__action">
          <TextButton
            type="link"
            text={props.t('Add activity type')}
            onClick={props.onAddNew}
            kitmanDesignSystem
          />
        </div>
      )}
    </main>
  );
};

export default ActivityTypeTable;
export const ActivityTypeTableTranslated: ComponentType<Props> =
  withNamespaces()(ActivityTypeTable);
