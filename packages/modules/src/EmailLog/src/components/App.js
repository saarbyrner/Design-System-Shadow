// @flow

import { withNamespaces } from 'react-i18next';
import { useState } from 'react';
import { Box } from '@kitman/playbook/components';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import type { EmailResponse } from '@kitman/services/src/services/notifications/shared/types';
import type {
  Filters,
  Search,
  FilterKeys,
  SearchKeys,
} from '../../shared/types';
import { defaultFilters, defaultSearch } from '../../shared/constants';
import { useSearchEmailsQuery } from '../redux/rtk/emailsApi';
import { HeaderTranslated as Header } from './Header';
import { EmailFiltersTranslated as EmailFilters } from './EmailFilters';
import { EmailDataGridTranslated as EmailDataGrid } from './EmailDataGrid';
import { EmailDetailsPanelTranslated as EmailDetailsPanel } from './EmailDetailsPanel';

const EmailLogsApp = () => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [search, setSearch] = useState<Search>(defaultSearch);
  const [debouncedSearch, setDebouncedSearch] = useState<Search>(defaultSearch);
  const [page, setPage] = useState(1);
  const [isOpenPanel, setIsOpenPanel] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<EmailResponse | null>(
    null
  );

  const { emails, isLoadingEmails, meta } = useSearchEmailsQuery(
    {
      kind: filters.type,
      notificationable_id: filters.notificationableId,
      notificationable_type: filters.notificationableType,
      recipient: debouncedSearch.recipient,
      subject: debouncedSearch.subject,
      version: filters.version,
      message_status: filters.messageStatus,
      trigger_kind: filters.distributionType,
      date_range: {
        start_date: filters.dateRange[0],
        end_date: filters.dateRange[1],
      },
      page,
      per_page: 10,
    },
    {
      selectFromResult: ({ data, isLoading }) => ({
        isLoadingEmails: isLoading,
        emails: data?.data ?? [],
        meta: data?.meta ?? {},
      }),
    }
  );

  const handleFiltersChange = (key: FilterKeys, value: string) => {
    setPage(1); // reset page to 1 when filters change
    setFilters({ ...filters, [(key: string)]: value });
  };

  const handleDebouncedSearch = useDebouncedCallback(
    (key: SearchKeys, value: string | null) => {
      setDebouncedSearch({ ...debouncedSearch, [(key: string)]: value });
      setPage(1); // reset page to 1 when search changes
    },
    500
  );

  const handleSearchChange = (key: SearchKeys, value: string) => {
    let searchValue = value;
    if (value === '') {
      searchValue = null;
    }
    setSearch({ ...search, [(key: string)]: searchValue });
    handleDebouncedSearch(key, searchValue);
  };

  const handleRowClick = (row) => {
    setSelectedEmail(row);
    setIsOpenPanel(true);
  };

  return (
    <>
      <Header />
      <Box sx={{ width: '100%', overflowX: 'scroll' }}>
        <Box
          sx={{
            overflowX: 'scroll',
            width: 'max-content',
          }}
        >
          <EmailFilters
            filters={filters}
            handleFiltersChange={handleFiltersChange}
            search={search}
            handleSearchChange={handleSearchChange}
          />

          <EmailDataGrid
            emails={emails}
            isLoading={isLoadingEmails}
            meta={meta}
            page={page}
            setPage={setPage}
            onRowClick={handleRowClick}
          />
          <EmailDetailsPanel
            isOpen={isOpenPanel}
            onClose={() => setIsOpenPanel(false)}
            email={selectedEmail}
          />
        </Box>
      </Box>
    </>
  );
};

export const EmailLogsAppTranslated = withNamespaces()(EmailLogsApp);
export default EmailLogsApp;
