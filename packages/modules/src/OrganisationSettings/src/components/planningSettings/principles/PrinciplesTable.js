// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
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
import type {
  PrincipleId,
  PrincipleItemId,
  PrincipleItemType,
  PrincipleItems,
  PrincipleCategories,
  PrincipleTypes,
  PrinciplePhases,
  Principles,
  PrinciplesView,
} from '@kitman/common/src/types/Principles';
import { TrackEvent } from '@kitman/common/src/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { InteractiveColumnHeaderTranslated as InteractiveColumnHeader } from './InteractiveColumnHeader';
import { getPrincipleSelectItems } from '../utils';
import styles from '../styles/table';

type Props = {
  isLoading: boolean,
  view: PrinciplesView,
  categories: PrincipleCategories,
  types: PrincipleTypes,
  phases: PrinciplePhases,
  squads: Squads,
  principles: Principles,
  isValidationCheckAllowed: boolean,
  onAdd: Function,
  onDeleteNew: (principleId: PrincipleId) => void,
  onDeletePrinciple: (principleId: PrincipleId) => void,
  updatePrincipleItems: ({
    principleItemIds: PrincipleItemId[],
    principleItemType: PrincipleItemType,
    principleItems: PrincipleItems,
  }) => void,
  updatePrincipleItemById: ({
    principleId: PrincipleId,
    principleItemId: (PrincipleItemId | null) | PrincipleItemId[],
    principleItemType: PrincipleItemType,
    principleItems: PrincipleItems,
  }) => void,
  changePrincipleName: (principleId: PrincipleId, value: string) => void,
};

const PrinciplesTable = (props: I18nProps<Props>) => {
  const isPresentationView = props.view === 'PRESENTATION';

  const selectableCategories = getPrincipleSelectItems(props.categories);
  const selectablePhases = getPrincipleSelectItems(props.phases);
  const selectableTypes = getPrincipleSelectItems(props.types);
  const selectableSquads = getPrincipleSelectItems(props.squads);

  const columns = [
    {
      id: 'principle',
      content: (
        <div className="planningSettingsTable__columnCell">
          {props.t('Principle name')}
        </div>
      ),
      isHeader: true,
    },
    {
      id: 'category',
      content: (
        <InteractiveColumnHeader
          view={props.view}
          title={props.t('Category')}
          principleSelectItems={selectableCategories}
          withSingleSelection
          updatePrincipleItems={(categoryIds) =>
            props.updatePrincipleItems({
              principleItemIds: categoryIds,
              principleItemType: 'principle_categories',
              principleItems: props.categories,
            })
          }
        />
      ),
      isHeader: true,
    },
    {
      id: 'phase',
      content: (
        <InteractiveColumnHeader
          view={props.view}
          title={props.t('Phases of play')}
          principleSelectItems={selectablePhases}
          withSingleSelection
          updatePrincipleItems={(phaseIds) =>
            props.updatePrincipleItems({
              principleItemIds: phaseIds,
              principleItemType: 'phases',
              principleItems: props.phases,
            })
          }
        />
      ),
      isHeader: true,
    },
    {
      id: 'type',
      content: (
        <InteractiveColumnHeader
          view={props.view}
          title={props.t('Type')}
          principleSelectItems={selectableTypes}
          withSingleSelection
          updatePrincipleItems={(typeIds) =>
            props.updatePrincipleItems({
              principleItemIds: typeIds,
              principleItemType: 'principle_types',
              principleItems: props.types,
            })
          }
        />
      ),
      isHeader: true,
    },
    {
      id: 'squad',
      content: (
        <InteractiveColumnHeader
          view={props.view}
          title={props.t('Squad')}
          principleSelectItems={selectableSquads}
          updatePrincipleItems={(squadIds) =>
            props.updatePrincipleItems({
              principleItemIds: squadIds,
              principleItemType: 'squads',
              principleItems: props.squads,
            })
          }
        />
      ),
      isHeader: true,
    },
  ];

  const rows = props.principles.map((principle) => {
    const {
      id: principleId,
      name: principleName,
      squads: principleSquads,
    } = principle;

    const isNewPrinciple =
      !isPresentationView && `${principleId}`.includes('NEW_PRINCIPLE_');

    const withSquads = principleSquads && principleSquads.length > 0;
    const squadNames = withSquads
      ? principleSquads.map((squad) => squad.name).join(', ')
      : '';

    return {
      id: principleId,
      classnames: classNames(
        'planningSettingsTable__row planningSettingsTable__row--principle',
        {
          planningSettingsTable__newRow: isNewPrinciple,
        }
      ),
      cells: [
        {
          id: `principle_${principleId}`,
          content: (
            <div
              css={styles.rowCell}
              className="planningSettingsTable__rowCell planningSettingsTable__rowCell--name"
            >
              {isPresentationView ? (
                <EllipsisTooltipText
                  content={principleName}
                  displayEllipsisWidth={380}
                />
              ) : (
                <InputText
                  value={principleName}
                  onValidation={({ value = '' }) => {
                    if (value === principleName) {
                      return;
                    }
                    props.changePrincipleName(principleId, value);
                  }}
                  invalid={props.isValidationCheckAllowed && !principleName}
                  kitmanDesignSystem
                />
              )}
            </div>
          ),
        },
        {
          id: `category_${principleId}`,
          content: (
            <div
              css={styles.rowCell}
              className="planningSettingsTable__rowCell planningSettingsTable__rowCell--category"
            >
              {isPresentationView ? (
                principle.principle_categories.length > 0 && (
                  <EllipsisTooltipText
                    content={
                      principle.principle_categories.length > 0
                        ? principle.principle_categories[0].name
                        : ''
                    }
                    displayEllipsisWidth={220}
                  />
                )
              ) : (
                <Select
                  options={selectableCategories}
                  isClearable
                  onClear={() =>
                    props.updatePrincipleItemById({
                      principleId,
                      principleItemId: null,
                      principleItemType: 'principle_categories',
                      principleItems: props.categories,
                    })
                  }
                  onChange={(categoryId) =>
                    props.updatePrincipleItemById({
                      principleId,
                      principleItemId: categoryId,
                      principleItemType: 'principle_categories',
                      principleItems: props.categories,
                    })
                  }
                  value={
                    principle.principle_categories.length > 0 &&
                    principle.principle_categories[0].id
                  }
                  appendToBody
                />
              )}
            </div>
          ),
        },
        {
          id: `phase_${principleId}`,
          content: (
            <div
              css={styles.rowCell}
              className="planningSettingsTable__rowCell planningSettingsTable__rowCell--phase"
            >
              {isPresentationView ? (
                principle.phases.length > 0 && (
                  <EllipsisTooltipText
                    content={
                      principle.phases.length > 0
                        ? principle.phases[0].name
                        : ''
                    }
                    displayEllipsisWidth={220}
                  />
                )
              ) : (
                <Select
                  options={selectablePhases}
                  isClearable
                  onClear={() =>
                    props.updatePrincipleItemById({
                      principleId,
                      principleItemId: null,
                      principleItemType: 'phases',
                      principleItems: props.phases,
                    })
                  }
                  onChange={(phaseId) =>
                    props.updatePrincipleItemById({
                      principleId,
                      principleItemId: phaseId,
                      principleItemType: 'phases',
                      principleItems: props.phases,
                    })
                  }
                  value={principle.phases.length > 0 && principle.phases[0].id}
                  appendToBody
                />
              )}
            </div>
          ),
        },
        {
          id: `type_${principleId}`,
          content: (
            <div
              css={styles.rowCell}
              className="planningSettingsTable__rowCell planningSettingsTable__rowCell--type"
            >
              {isPresentationView ? (
                <EllipsisTooltipText
                  content={
                    principle.principle_types.length > 0
                      ? principle.principle_types[0].name
                      : ''
                  }
                  displayEllipsisWidth={220}
                />
              ) : (
                <Select
                  options={selectableTypes}
                  isClearable
                  onClear={() =>
                    props.updatePrincipleItemById({
                      principleId,
                      principleItemId: null,
                      principleItemType: 'principle_types',
                      principleItems: props.types,
                    })
                  }
                  onChange={(typeId) =>
                    props.updatePrincipleItemById({
                      principleId,
                      principleItemId: typeId,
                      principleItemType: 'principle_types',
                      principleItems: props.types,
                    })
                  }
                  value={
                    principle.principle_types.length > 0 &&
                    principle.principle_types[0].id
                  }
                  invalid={
                    props.isValidationCheckAllowed &&
                    principle.principle_types.length === 0
                  }
                  appendToBody
                />
              )}
            </div>
          ),
        },
        {
          id: `squad_${principleId}`,
          content: (
            <div
              css={styles.rowCell}
              className="planningSettingsTable__rowCell planningSettingsTable__rowCell--squad"
            >
              {isPresentationView ? (
                principle.squads.length > 0 && (
                  <EllipsisTooltipText
                    content={squadNames}
                    displayEllipsisWidth={220}
                  />
                )
              ) : (
                <>
                  <Select
                    options={selectableSquads}
                    onChange={(squadIds) =>
                      props.updatePrincipleItemById({
                        principleId,
                        principleItemId: squadIds,
                        principleItemType: 'squads',
                        principleItems: props.squads,
                      })
                    }
                    value={
                      withSquads ? principleSquads.map((squad) => squad.id) : []
                    }
                    isMulti
                    inlineShownSelection
                    inlineShownSelectionMaxWidth={isNewPrinciple ? 110 : 160}
                    allowSelectAll
                    allowClearAll
                    appendToBody
                  />
                  {isNewPrinciple && (
                    <IconButton
                      icon="icon-close"
                      isBorderless
                      isTransparent
                      onClick={() => props.onDeleteNew(principleId)}
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
      onCallAction: (principleId: PrincipleId) => {
        TrackEvent('Org Settings Planning', 'Delete', 'Principles');
        props.onDeletePrinciple(principleId);
      },
    },
  ];

  return (
    <main
      css={styles.table}
      className={classNames('planningSettingsTable', {
        'planningSettingsTable--edit': !isPresentationView,
      })}
      data-testid="PrinciplesTable|principleTable"
    >
      <DataGrid
        columns={columns}
        rows={rows}
        rowActions={isPresentationView && rowActions}
        isFullyLoaded={!props.isLoading}
        isTableEmpty={isPresentationView && props.principles.length === 0}
        emptyTableText={props.t('No principles added')}
        scrollOnBody
      />
      {!isPresentationView && (
        <div css={styles.action} className="planningSettingsTable__action">
          <TextButton
            type="link"
            text={props.t('Add principle')}
            onClick={props.onAdd}
            kitmanDesignSystem
          />
        </div>
      )}
    </main>
  );
};

export default PrinciplesTable;
export const PrinciplesTableTranslated: ComponentType<Props> =
  withNamespaces()(PrinciplesTable);
