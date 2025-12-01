// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import classNames from 'classnames';
import {
  DataGrid,
  EllipsisTooltipText,
  IconButton,
  InputText,
  TextButton,
} from '@kitman/components';
import type { DevelopmentGoalCompletionType } from '@kitman/modules/src/PlanningHub/src/services/getDevelopmentGoalCompletionTypes';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { SettingsView } from '../types';
import styles from '../styles/table';

type Props = {
  isLoading: boolean,
  view: SettingsView,
  developmentGoalCompletionTypes: Array<DevelopmentGoalCompletionType>,
  isValidationCheckAllowed: boolean,
  onArchive: Function,
  onChangeName: Function,
  onAddNew: Function,
  onDeleteNew: (newItemId: number | string) => void,
};

const DevelopmentGoalCompletionTypeTable = (props: I18nProps<Props>) => {
  const isPresentationView = props.view === 'PRESENTATION';

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
  ];

  const rows = props.developmentGoalCompletionTypes.map(
    (developmentGoalCompletionType) => {
      const { id: goalCompletionTypeId, name: goalCompletionTypeName } =
        developmentGoalCompletionType;

      const isNewDevelopmentGoalCompletionType =
        !isPresentationView && `${goalCompletionTypeId}`.includes('NEW_ITEM_');

      return {
        id: goalCompletionTypeId,
        classnames: classNames('planningSettingsTable__row', {
          planningSettingsTable__newRow: isNewDevelopmentGoalCompletionType,
        }),
        cells: [
          {
            id: `developmentGoalCompletionType_${goalCompletionTypeId}`,
            content: (
              <div
                css={styles.rowCell}
                className="planningSettingsTable__rowCell planningSettingsTable__rowCell--name"
              >
                {isPresentationView ? (
                  <EllipsisTooltipText
                    content={goalCompletionTypeName || ''}
                    displayEllipsisWidth={380}
                  />
                ) : (
                  <>
                    <InputText
                      value={goalCompletionTypeName}
                      onValidation={({ value = '' }) => {
                        if (value === goalCompletionTypeName) {
                          return;
                        }
                        props.onChangeName(goalCompletionTypeId, value);
                      }}
                      invalid={
                        props.isValidationCheckAllowed &&
                        !goalCompletionTypeName
                      }
                      kitmanDesignSystem
                    />
                    {isNewDevelopmentGoalCompletionType && (
                      <IconButton
                        icon="icon-close"
                        isBorderless
                        isTransparent
                        onClick={() => props.onDeleteNew(goalCompletionTypeId)}
                      />
                    )}
                  </>
                )}
              </div>
            ),
          },
        ],
      };
    }
  );

  const rowActions = [
    {
      id: 'archive',
      text: props.t('Archive'),
      onCallAction: props.onArchive,
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
        isTableEmpty={props.developmentGoalCompletionTypes.length === 0}
        emptyTableText={props.t('No development goal completion types')}
        scrollOnBody
      />
      {!isPresentationView && (
        <div css={styles.action} className="planningSettingsTable__action">
          <TextButton
            type="link"
            text={props.t('Add development goal completion type')}
            onClick={props.onAddNew}
            kitmanDesignSystem
          />
        </div>
      )}
    </main>
  );
};

export const DevelopmentGoalCompletionTypeTableTranslated: ComponentType<Props> =
  withNamespaces()(DevelopmentGoalCompletionTypeTable);
export default DevelopmentGoalCompletionTypeTable;
