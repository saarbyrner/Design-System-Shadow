// @flow
import { useMemo, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';

import { DataGrid } from '@kitman/components';
import { createTableStyles } from '@kitman/modules/src/OrganisationSettings/src/components/CalendarSettings/utils/styles';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { PageMode } from '@kitman/modules/src/OrganisationSettings/src/components/CalendarSettings/utils/types';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { createColumns, createRows } from './utils/helpers';
import type { Locations, OnChangingArchiveStatus } from './utils/types';

const tableStyles = createTableStyles({
  includeCheckboxes: false,
  cellWidthRem: 25,
});

type Props = {
  data: Locations,
  pageMode: PageMode,
  onChangingArchiveStatus: OnChangingArchiveStatus,
};

const Table = ({
  t,
  data,
  pageMode,
  onChangingArchiveStatus,
}: I18nProps<Props>) => {
  const { data: permissions, isSuccess: isPermissionsSuccess } =
    useGetPermissionsQuery();

  const columns = createColumns(t);
  const rows = useMemo(
    () =>
      createRows({
        t,
        locations: data,
        pageMode,
        permissions: permissions?.eventLocationSettings,
        onChangingArchiveStatus,
      }),
    [data, pageMode, t, isPermissionsSuccess, onChangingArchiveStatus]
  );

  return (
    <main css={tableStyles}>
      <DataGrid columns={columns} rows={rows} />
    </main>
  );
};

export const TableTranslated: ComponentType<Props> = withNamespaces()(Table);
export default Table;
