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
import type { Squads } from '@kitman/services/src/services/getSquads';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { SettingsView } from '../types';
import styles from '../styles/table';

type Props = {
  isLoading: boolean,
  view: SettingsView,
  drillLabels: Array<Object>,
  squads: Squads,
  isValidationCheckAllowed: boolean,
  onDelete: Function,
  onChangeName: Function,
  onChangeSquads: Function,
  onAddNew: Function,
  onDeleteNew: (newItemId: number | string) => void,
};

const DrillLabelsTable = (props: I18nProps<Props>) => {
  const isPresentationView = props.view === 'PRESENTATION';

  const selectableSquads = props.squads.map((squad) => ({
    value: squad.id,
    label: squad.name,
  }));

  const columns = [
    {
      id: 'drillLabel',
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

  const rows = props.drillLabels.map((drillLabel) => {
    const {
      id: drillLabelId,
      name: drillLabelName,
      squads: drillLabelSquads,
    } = drillLabel;

    const withSquads = drillLabelSquads && drillLabelSquads.length > 0;
    const squadNames = withSquads
      ? // $FlowFixMe there are squads at this point
        drillLabelSquads.map((squad) => squad.name).join(', ')
      : '';

    const isNewDrillLabel =
      !isPresentationView && `${drillLabelId}`.includes('NEW_ITEM_');

    return {
      id: drillLabelId,
      classnames: classNames('planningSettingsTable__row', {
        planningSettingsTable__newRow: isNewDrillLabel,
      }),
      cells: [
        {
          id: `drillLabel_${drillLabelId}`,
          content: (
            <div
              css={styles.rowCell}
              className="planningSettingsTable__rowCell planningSettingsTable__rowCell--name"
            >
              {isPresentationView ? (
                <EllipsisTooltipText
                  content={drillLabelName || ''}
                  displayEllipsisWidth={380}
                />
              ) : (
                <InputText
                  value={drillLabelName}
                  onValidation={({ value = '' }) => {
                    if (value === drillLabelName) {
                      return;
                    }
                    props.onChangeName(drillLabelId, value);
                  }}
                  invalid={props.isValidationCheckAllowed && !drillLabelName}
                  kitmanDesignSystem
                />
              )}
            </div>
          ),
        },
        {
          id: `squad_${drillLabelId}`,
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
                          drillLabelSquads.map((squad) => squad.id)
                        : []
                    }
                    onChange={(selectedIds) => {
                      props.onChangeSquads(
                        drillLabelId,
                        selectedIds,
                        props.squads
                      );
                    }}
                    isMulti
                    inlineShownSelection
                    inlineShownSelectionMaxWidth={isNewDrillLabel ? 110 : 160}
                    allowSelectAll
                    allowClearAll
                    appendToBody
                  />
                  {isNewDrillLabel && (
                    <IconButton
                      icon="icon-close"
                      isBorderless
                      isTransparent
                      onClick={() => props.onDeleteNew(drillLabelId)}
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
        isTableEmpty={props.drillLabels.length === 0}
        emptyTableText={props.t('No drill labels added')}
        scrollOnBody
      />
      {!isPresentationView && (
        <div css={styles.action} className="planningSettingsTable__action">
          <TextButton
            type="link"
            text={props.t('Add drill label')}
            onClick={props.onAddNew}
            kitmanDesignSystem
          />
        </div>
      )}
    </main>
  );
};

export const DrillLabelsTableTranslated: ComponentType<Props> =
  withNamespaces()(DrillLabelsTable);
export default DrillLabelsTable;
