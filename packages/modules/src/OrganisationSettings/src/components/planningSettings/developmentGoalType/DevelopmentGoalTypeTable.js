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
import type { DevelopmentGoalType } from '@kitman/modules/src/PlanningHub/src/services/getDevelopmentGoalTypes';
import type { Squads } from '@kitman/services/src/services/getSquads';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { SettingsView } from '../types';
import styles from '../styles/table';

type Props = {
  isLoading: boolean,
  view: SettingsView,
  developmentGoalTypes: Array<DevelopmentGoalType>,
  squads: Squads,
  isValidationCheckAllowed: boolean,
  onDelete: Function,
  onChangeName: Function,
  onChangeSquads: Function,
  onAddNew: Function,
  onDeleteNew: (newItemId: number | string) => void,
};

const DevelopmentGoalTypeTable = (props: I18nProps<Props>) => {
  const isPresentationView = props.view === 'PRESENTATION';

  const selectableSquads = props.squads.map((squad) => ({
    value: squad.id,
    label: squad.name,
  }));

  const columns = [
    {
      id: 'name',
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

  const rows = props.developmentGoalTypes.map((developmentGoalType) => {
    const {
      id: goalTypeId,
      name: goalTypeName,
      squads: goalTypeSquads,
    } = developmentGoalType;

    const withSquads = goalTypeSquads && goalTypeSquads.length > 0;
    const squadNames = withSquads
      ? // $FlowFixMe there are squads at this point
        goalTypeSquads.map((squad) => squad.name).join(', ')
      : '';

    const isNewDevelopmentGoalType =
      !isPresentationView && `${goalTypeId}`.includes('NEW_ITEM_');

    return {
      id: goalTypeId,
      classnames: classNames('planningSettingsTable__row', {
        planningSettingsTable__newRow: isNewDevelopmentGoalType,
      }),
      cells: [
        {
          id: `developmentGoalType_${goalTypeId}`,
          content: (
            <div
              css={styles.rowCell}
              className="planningSettingsTable__rowCell planningSettingsTable__rowCell--name"
            >
              {isPresentationView ? (
                <EllipsisTooltipText
                  content={goalTypeName || ''}
                  displayEllipsisWidth={380}
                />
              ) : (
                <InputText
                  value={goalTypeName}
                  onValidation={({ value = '' }) => {
                    if (value === goalTypeName) {
                      return;
                    }
                    props.onChangeName(goalTypeId, value);
                  }}
                  invalid={props.isValidationCheckAllowed && !goalTypeName}
                  kitmanDesignSystem
                />
              )}
            </div>
          ),
        },
        {
          id: `squad_${goalTypeId}`,
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
                          goalTypeSquads.map((squad) => squad.id)
                        : []
                    }
                    onChange={(selectedIds) => {
                      props.onChangeSquads(
                        goalTypeId,
                        selectedIds,
                        props.squads
                      );
                    }}
                    isMulti
                    inlineShownSelection
                    inlineShownSelectionMaxWidth={
                      isNewDevelopmentGoalType ? 110 : 160
                    }
                    allowSelectAll
                    allowClearAll
                    appendToBody
                  />
                  {isNewDevelopmentGoalType && (
                    <IconButton
                      icon="icon-close"
                      isBorderless
                      isTransparent
                      onClick={() => props.onDeleteNew(goalTypeId)}
                    />
                  )}
                </>
              )}
            </div>
          ),
        },
      ],
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
    >
      <DataGrid
        columns={columns}
        rows={rows}
        rowActions={isPresentationView && rowActions}
        isFullyLoaded={!props.isLoading}
        isTableEmpty={props.developmentGoalTypes.length === 0}
        emptyTableText={props.t('No development goal types added')}
        scrollOnBody
      />
      {!isPresentationView && (
        <div css={styles.action} className="planningSettingsTable__action">
          <TextButton
            type="link"
            text={props.t('Add development goal type')}
            onClick={props.onAddNew}
            kitmanDesignSystem
          />
        </div>
      )}
    </main>
  );
};

export const DevelopmentGoalTypeTableTranslated: ComponentType<Props> =
  withNamespaces()(DevelopmentGoalTypeTable);
export default DevelopmentGoalTypeTable;
