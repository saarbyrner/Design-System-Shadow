// @flow
import { useMemo, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';

import { DataGrid } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { createColumns, createRows } from './utils/table-helpers';
import type {
  GroupedEventTypesArray,
  SelectedEventTypes,
  GroupedArchivedEventTypesArray,
  GroupRowAction,
  EventRowAction,
  SquadIdToNameMap,
} from './utils/types';
import type { PageMode } from '../utils/types';
import { createTableStyles } from '../utils/styles';
import { useGetCalendarSettingsPermissions } from '../utils/hooks';

const cellMaxWidthRem = 18.75; // This is the max-width of DataGrid's cell

type Props = {
  data: GroupedEventTypesArray | GroupedArchivedEventTypesArray,
  pageMode: PageMode,
  groupRowAction: GroupRowAction,
  eventRowAction: EventRowAction,
  squadIdToNameMap: SquadIdToNameMap,
  ...SelectedEventTypes,
};

const Table = ({
  t,
  data,
  pageMode,
  groupRowAction,
  eventRowAction,
  selectedEventTypes,
  setSelectedEventTypes,
  squadIdToNameMap,
}: I18nProps<Props>) => {
  const columns = useMemo(() => createColumns(t), [t]);
  const permissions = useGetCalendarSettingsPermissions();

  const tableStyles = useMemo(() => {
    const { canArchiveCustomEvents } = permissions;
    return createTableStyles({
      includeCheckboxes: canArchiveCustomEvents,
      cellWidthRem: cellMaxWidthRem,
      canArchiveCustomEvents,
    });
  }, [permissions]);

  const rows = useMemo(
    () =>
      createRows({
        eventTypes: data,
        t,
        groupRowAction,
        eventRowAction,
        selectedEventTypes,
        setSelectedEventTypes,
        pageMode,
        numberOfColumns: columns.length,
        permissions,
        squadIdToNameMap,
      }),
    [
      data,
      pageMode,
      selectedEventTypes,
      setSelectedEventTypes,
      groupRowAction,
      eventRowAction,
      columns,
      t,
      permissions,
      squadIdToNameMap,
    ]
  );

  return (
    <main css={tableStyles}>
      <DataGrid columns={columns} rows={rows} />
    </main>
  );
};

export const TranslatedTable: ComponentType<Props> = withNamespaces()(Table);
export default Table;
