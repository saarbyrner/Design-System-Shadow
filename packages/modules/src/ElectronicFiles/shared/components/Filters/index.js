// @flow
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import moment from 'moment';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import { Box, Tooltip, IconButton } from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import {
  STATUS_KEY,
  FILTER_KEY,
  type GridFilters,
} from '@kitman/modules/src/ElectronicFiles/shared/types';
import {
  MENU_ITEM,
  selectSelectedMenuItem,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import {
  selectPersistedFilters,
  selectPagination,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/gridSlice';
import {
  useLazyGetUnreadCountQuery,
  useLazySearchInboundElectronicFileListQuery,
  useLazySearchOutboundElectronicFileListQuery,
} from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import { getHasEndpointLoaded } from '@kitman/modules/src/ElectronicFiles/shared/utils';
import { SearchFilterTranslated as SearchFilter } from '@kitman/modules/src/ElectronicFiles/shared/components/Filters/Search';
import { DateRangeFilterTranslated as DateRangeFilter } from '@kitman/modules/src/ElectronicFiles/shared/components/Filters/DateRange';
import { SelectFilterTranslated as SelectFilter } from '@kitman/modules/src/ElectronicFiles/shared/components/Filters/Select';

type Props = {
  allowedFilters?: Array<$Keys<typeof FILTER_KEY>>,
  onSearch: (searchString: string) => void,
  onUpdateFilter?: (partialFilter: $Shape<GridFilters>) => void,
  showRefreshAction?: boolean,
};

const Filters = ({
  allowedFilters = [FILTER_KEY.search, FILTER_KEY.dateRange],
  onSearch,
  onUpdateFilter,
  showRefreshAction = false,
  t,
}: I18nProps<Props>) => {
  const selectedMenuItem = useSelector(selectSelectedMenuItem);
  const persistedFilters = useSelector(selectPersistedFilters);
  const pagination = useSelector(selectPagination);
  const filters = persistedFilters[selectedMenuItem];
  const [refreshUnreadCount] = useLazyGetUnreadCountQuery();
  const [refreshInboundList] = useLazySearchInboundElectronicFileListQuery();
  const [refreshOutboundList] = useLazySearchOutboundElectronicFileListQuery();
  const queries = useSelector((state) => state.electronicFilesApi.queries);

  const hasEndpointLoaded = getHasEndpointLoaded(queries);

  const shouldDisableInboundGridFilters =
    selectedMenuItem === MENU_ITEM.inbox &&
    !hasEndpointLoaded.searchInboundElectronicFileList;
  const shouldDisableOutboundGridFilters =
    selectedMenuItem === MENU_ITEM.sent &&
    !hasEndpointLoaded.searchOutboundElectronicFileList;

  const [search, setSearch] = useState<string>('');

  const statuses = {
    [`${STATUS_KEY.sending}`]: t('Sending'),
    [`${STATUS_KEY.sent}`]: t('Sent'),
    [`${STATUS_KEY.error}`]: t('Error'),
  };

  // reset filters to default when sidebar menu item changes
  useEffect(() => {
    setSearch('');
  }, [selectedMenuItem]);

  return (
    <Box
      mb={2}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box display="flex" gap={1}>
        {allowedFilters.includes(FILTER_KEY.search) && (
          <SearchFilter
            value={search}
            onChange={(value) => {
              setSearch(value);
              onSearch(value);
            }}
          />
        )}
        {allowedFilters.includes(FILTER_KEY.dateRange) && (
          <DateRangeFilter
            value={[
              filters.start_date && moment(filters.start_date),
              filters.end_date && moment(filters.end_date),
            ]}
            onChange={(value) => {
              if ((!value[0] && value[1]) || (value[0] && !value[1])) {
                return;
              }
              onUpdateFilter?.({
                start_date:
                  value[0] && moment(value[0]).format(dateTransferFormat),
                end_date:
                  value[1] && moment(value[1]).format(dateTransferFormat),
              });
            }}
            disabled={
              shouldDisableInboundGridFilters ||
              shouldDisableOutboundGridFilters
            }
          />
        )}
        {allowedFilters.includes(FILTER_KEY.status) && (
          <SelectFilter
            label={t('Status')}
            options={Object.keys(statuses).map((statusKey) => ({
              id: statusKey,
              label: statuses[statusKey],
            }))}
            value={
              filters.status && statuses[filters.status]
                ? {
                    id: filters.status,
                    label: statuses[filters.status],
                  }
                : null
            }
            onChange={(value) => {
              onUpdateFilter?.({
                status: value ? value.id.toString() : null,
              });
            }}
            disabled={shouldDisableOutboundGridFilters}
          />
        )}
      </Box>
      {showRefreshAction && (
        <Box>
          <Tooltip title={t('Refresh')}>
            <IconButton
              color="primary"
              onClick={() => {
                if (selectedMenuItem === MENU_ITEM.inbox) {
                  refreshUnreadCount();
                  refreshInboundList({
                    filters,
                    pagination,
                  });
                } else {
                  refreshOutboundList({ filters, pagination });
                }
              }}
            >
              <KitmanIcon name={KITMAN_ICON_NAMES.RefreshOutlined} />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export const FiltersTranslated: ComponentType<Props> =
  withNamespaces()(Filters);
export default Filters;
