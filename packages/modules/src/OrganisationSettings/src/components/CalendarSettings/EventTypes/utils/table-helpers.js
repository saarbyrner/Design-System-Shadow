/* eslint-disable camelcase */
// @flow
import classNames from 'classnames';

import { Checkbox } from '@kitman/components';
import { Chip, Box } from '@kitman/playbook/components';

import type { Translation } from '@kitman/common/src/types/i18n';
import type { CustomEventTypeIP } from '@kitman/services/src/services/OrganisationSettings/CalendarSettings/EventTypes/utils/types';
import type { CalendarSettingsPermissions } from '@kitman/common/src/contexts/PermissionsContext/calendarSettings/types';
import type { Cells, Row, Rows } from '@kitman/components/src/DataGrid/index';
import { UNGROUPED_ID } from './consts';
import { createTextCell } from '../../utils/helpers';
import { pageModeEnumLike } from '../../utils/enum-likes';
import type {
  GroupRowAction,
  SelectedEventTypes,
  GroupedEventTypes,
  UngroupedEventTypes,
  UngroupedArchivedEventTypes,
  GroupedEventTypesArray,
  GroupedArchivedEventTypesArray,
  NewCustomEvent,
  EventRowAction,
  SquadIdToNameMap,
} from './types';
import type { PageMode } from '../../utils/types';

export const createColumns = (t: Translation): Cells => {
  const columns = [
    {
      id: 'checkbox',
      content: <div />,
    },
    {
      id: 'eventGroups',
      content: <div>{t('Event Groups')}</div>,
      isHeader: true,
    },
  ];

  if (window.getFlag('shared-custom-events')) {
    columns.push({
      id: 'shared',
      content: <div />,
      isHeader: true,
    });
  }

  if (window.getFlag('squad-scoped-custom-events')) {
    columns.push({
      id: 'squad',
      content: <div>{t('Squad')}</div>,
      isHeader: true,
    });
  }

  return columns;
};

export const createSquadsText = (
  squadsNames: Array<string>,
  t: Translation
) => {
  const numberOfSquads = squadsNames.length;
  if (numberOfSquads === 0) return t('No squads selected.');
  return `${numberOfSquads} - ${squadsNames
    .filter((name) => !!name)
    .join(', ')}`;
};

type CreateRow = {
  eventType: CustomEventTypeIP | NewCustomEvent,
  squadIdToNameMap: SquadIdToNameMap,
  parentId: string,
  pageMode: PageMode,
  t: Translation,
  eventRowAction: EventRowAction,
  permissions: CalendarSettingsPermissions,
  ...SelectedEventTypes,
};

const createRow = ({
  eventType,
  parentId,
  pageMode,
  selectedEventTypes,
  setSelectedEventTypes,
  t,
  eventRowAction,
  permissions,
  squadIdToNameMap,
}: CreateRow): Row => {
  const { id, name, squads, colour } = eventType;
  const onClickCheckbox = (rowId: string) => {
    setSelectedEventTypes((prev) => {
      const localPrev = new Set([...prev]);
      if (localPrev.has(rowId)) {
        localPrev.delete(rowId);
        localPrev.delete(parentId); // if the parent has been added it should be removed, else nothing will happen
      } else {
        localPrev.add(rowId);
      }
      return localPrev;
    });
  };

  const cells = [
    {
      id: `checkbox_${id}`,
      content: (
        <Checkbox.New
          id={id}
          checked={selectedEventTypes.has(id)}
          onClick={onClickCheckbox}
        />
      ),
    },
    createTextCell({ rowId: id, text: name, colour }),
  ];

  if (window.getFlag('shared-custom-events')) {
      cells.push({
        id: `shared_${id}`,
        content: eventType.shared && parentId === UNGROUPED_ID ? (
          <Box display="flex" justifyContent="start">
            <Chip label={t('Shared')} size="small" />
          </Box>
        ) : null,
      });
  }

  if (window.getFlag('squad-scoped-custom-events')) {
    const squadNames: Array<string> = squads.map(
      (squadId) => squadIdToNameMap.get(squadId) ?? ''
    );
    cells.push(
      createTextCell({
        rowId: id,
        text: createSquadsText(squadNames, t),
      })
    );
  }

  return {
    id,
    cells,

    ...(permissions.canArchiveCustomEvents
      ? {
          rowActions: [
            {
              id: 'archive',
              text:
                pageMode === pageModeEnumLike.Archive
                  ? t('Unarchive')
                  : t('Archive'),
              onCallAction: () => {
                eventRowAction(id);
              },
            },
          ],
        }
      : {}),
  };
};

type Parent =
  | GroupedEventTypes
  | UngroupedEventTypes
  | UngroupedArchivedEventTypes;

type CreateParentRow = {
  parent: Parent,
  squadIdToNameMap: SquadIdToNameMap,
  groupRowAction: GroupRowAction,
  pageMode: PageMode,
  isUngroupedRow: boolean,
  t: Translation,
  permissions: CalendarSettingsPermissions,
  ...SelectedEventTypes,
};

const createParentRow = ({
  parent,
  squadIdToNameMap,
  t,
  groupRowAction,
  pageMode,
  selectedEventTypes,
  setSelectedEventTypes,
  isUngroupedRow,
  permissions,
}: CreateParentRow) => {
  const {
    children,
    id: parentId,
    name: parentName,
    is_archived,
    squads,
    shared: isParentShared = false,
  } = parent;

  const childrenIds = children.map(({ id }) => id);
  const isArchiveMode = pageMode === pageModeEnumLike.Archive;

  const onClickCheckbox = (rowId: string) => {
    setSelectedEventTypes((prev) => {
      const localPrev = new Set([...prev]);
      const idsToManipulate = [...childrenIds, parentId];
      if (localPrev.has(rowId)) {
        idsToManipulate.forEach((idToManipulate) =>
          localPrev.delete(idToManipulate)
        );
      } else {
        idsToManipulate.forEach((idToManipulate) =>
          localPrev.add(idToManipulate)
        );
      }
      return localPrev;
    });
  };

  const isCheckboxIndeterminate =
    !selectedEventTypes.has(parentId) &&
    childrenIds.some((childId) => selectedEventTypes.has(childId));

  const isDisabled = isArchiveMode && !is_archived; // parent isn't archived, children are

  const cells = [
    {
      id: `checkbox_${parentId}`,
      content: (
        <Checkbox.New
          disabled={isDisabled}
          id={parentId}
          indeterminate={!isDisabled && isCheckboxIndeterminate}
          checked={!isDisabled && selectedEventTypes.has(parentId)}
          onClick={onClickCheckbox}
        />
      ),
    },
    createTextCell({ rowId: parentId, text: parentName }),
  ];

  if (window.getFlag('shared-custom-events')) {
    cells.push({
      id: `shared_${parentId}`,
      content: isParentShared ? (
        <Box display="flex" justifyContent="start">
          <Chip label={t('Shared')} size="small" />
        </Box>
      ) : null,
    });
  }

  if (window.getFlag('squad-scoped-custom-events')) {
    const squadNames: Array<string> = squads.map(
      (squadId) => squadIdToNameMap.get(squadId) ?? ''
    );
    cells.push(
      ...(isUngroupedRow
        ? [createTextCell({ rowId: parentId, text: '' })] // This cell is important for styling
        : [
            createTextCell({
              rowId: parentId,
              text: createSquadsText(squadNames, t),
            }),
          ])
    );
  }

  return {
    classnames: classNames('eventTypeParent'),
    id: parentId,
    name: parentName,
    cells,
    ...(isDisabled || isUngroupedRow || !permissions.canArchiveCustomEvents
      ? {}
      : {
          rowActions: [
            {
              id: 'archiveGroup',
              onCallAction: groupRowAction,
              text: isArchiveMode ? t('Unarchive group') : t('Archive group'),
            },
          ],
        }),
  };
};

const emptyGroupBeforeUngroupedId = 'emptyRowBeforeUngrouped';

const createArchiveModeFillerRow = (
  numberOfColumns: number,
  t: Translation
) => {
  const cells = [
    createTextCell({
      rowId: `${emptyGroupBeforeUngroupedId}Cell${0}`,
      text: '',
    }),
    createTextCell({
      rowId: `${emptyGroupBeforeUngroupedId}Cell${1}`,
      text: t('Ungrouped'),
    }),
  ];
  return {
    id: emptyGroupBeforeUngroupedId,
    classnames: classNames('emptyRow'),
    // There has to be enough empty cells here to fill the row to ensure that the *whole* row
    // has the correct background (see ../../styles.js)
    cells: cells.concat(
      Array(numberOfColumns - cells.length)
        .fill(0)
        .map((_, index) =>
          createTextCell({
            rowId: `${emptyGroupBeforeUngroupedId}Cell${index}`,
            text: '',
          })
        )
    ),
  };
};
type CreateSingleGroup = {
  parent: Parent,
  squadIdToNameMap: SquadIdToNameMap,
  groupRowAction: GroupRowAction,
  eventRowAction: EventRowAction,
  t: Translation,
  pageMode: PageMode,
  numberOfColumns: number,
  permissions: CalendarSettingsPermissions,
  ...SelectedEventTypes,
};

const createSingleGroup = ({
  parent,
  t,
  groupRowAction,
  eventRowAction,
  pageMode,
  numberOfColumns,
  permissions,
  squadIdToNameMap,
  selectedEventTypes,
  setSelectedEventTypes,
}: CreateSingleGroup): Rows => {
  const { children, id: parentId } = parent;

  const isUngroupedRow = parentId === UNGROUPED_ID;

  const shouldUseFillerRow =
    isUngroupedRow && pageMode === pageModeEnumLike.Archive;

  let firstRow: Row;
  if (shouldUseFillerRow) {
    firstRow = createArchiveModeFillerRow(numberOfColumns, t);
  } else {
    const parentRow = createParentRow({
      parent,
      t,
      pageMode,
      groupRowAction,
      selectedEventTypes,
      setSelectedEventTypes,
      isUngroupedRow,
      permissions,
      squadIdToNameMap,
    });
    firstRow = parentRow;
  }
  const groupRows = [firstRow];

  children.forEach((childEventType) => {
    groupRows.push(
      createRow({
        t,
        parentId,
        pageMode,
        eventType: childEventType,
        setSelectedEventTypes,
        selectedEventTypes,
        eventRowAction,
        permissions,
        squadIdToNameMap,
      })
    );
  });

  return groupRows;
};

type CreateRows = $Exact<{
  eventTypes: GroupedEventTypesArray | GroupedArchivedEventTypesArray,
  squadIdToNameMap: SquadIdToNameMap,
  groupRowAction: GroupRowAction,
  eventRowAction: EventRowAction,
  t: Translation,
  pageMode: PageMode,
  numberOfColumns: number,
  permissions: CalendarSettingsPermissions,
  ...SelectedEventTypes,
}>;

export const createRows = ({
  eventTypes,
  groupRowAction,
  ...rest
}: CreateRows): Rows => {
  const groupRows = eventTypes.reduce((prevArr, parent, index) => {
    const localGroupRows = createSingleGroup({
      // $FlowIgnore[incompatible-call] - Flow cannot understand that this is OK
      parent,
      ...rest,
      groupRowAction: groupRowAction.bind(null, index),
    });

    const concatenated = prevArr.concat(localGroupRows);
    return concatenated;
  }, ([]: Rows));

  return groupRows;
};
