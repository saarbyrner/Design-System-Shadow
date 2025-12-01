// @flow
import { I18nextProvider } from 'react-i18next';
import { useEffect, useState } from 'react';
import i18n from '@kitman/common/src/utils/i18n';
import {
  usePermissions,
  PermissionsProvider,
} from '@kitman/common/src/contexts/PermissionsContext';
import type { ImportsItem } from '@kitman/common/src/types/Imports';
import {
  AppStatus,
  DelayedLoadingFeedback,
  ErrorBoundary,
} from '@kitman/components';
import ToastDialog from '@kitman/components/src/Toast/KitmanDesignSystem/ToastDialog';
import importMassAthletes from '@kitman/services/src/services/imports/importMassAthletes';
import type { ImportFilters } from '@kitman/services/src/services/imports/importMassAthletes';
import { ImportListTranslated as ImportList } from './ImportList';
import useImports from '../Medical/shared/hooks/useImports';

const INITIAL_PAGE_NUMBER = 1;
const ITEMS_PER_PAGE = 25;

const ImportsListApp = () => {
  const { permissions, permissionsRequestStatus } = usePermissions();
  const [data, setData] = useState<ImportsItem[]>([]);
  const [filters, setFilters] = useState<ImportFilters>({});
  const [dataRequestStatus, setDataRequestStatus] = useState('PENDING');
  const [nextPage, setNextPage] = useState<number | null>(INITIAL_PAGE_NUMBER);
  const isImportEnabled = permissions.settings.canViewImports;

  const { toasts, closeToast } = useImports(isImportEnabled);

  const fetchData = () => {
    importMassAthletes({
      nextPage: INITIAL_PAGE_NUMBER,
      itemsPerPage: ITEMS_PER_PAGE,
      filters,
    }).then(
      (responseData) => {
        setData(responseData.data);
        setNextPage(responseData.meta.next_page || null);
        setDataRequestStatus('SUCCESS');
      },
      () => setDataRequestStatus('FAILURE')
    );
  };

  useEffect(() => {
    if (permissionsRequestStatus === 'SUCCESS') {
      fetchData();
    }
  }, [permissionsRequestStatus, permissions, filters]);

  const fetchMoreItems = () => {
    if (!nextPage) {
      return;
    }

    setDataRequestStatus('PENDING');

    importMassAthletes({
      nextPage: INITIAL_PAGE_NUMBER,
      itemsPerPage: ITEMS_PER_PAGE,
      filters,
    }).then(
      (fetchedData) => {
        setData((prevData) => [...prevData, ...fetchedData.data]);
        setNextPage(fetchedData.meta.next_page || null);
        setDataRequestStatus('SUCCESS');
      },
      () => setDataRequestStatus('FAILURE')
    );
  };

  if (
    permissionsRequestStatus === 'FAILURE' ||
    dataRequestStatus === 'FAILURE'
  ) {
    return <AppStatus status="error" isEmbed />;
  }
  if (permissionsRequestStatus === 'PENDING') {
    return <DelayedLoadingFeedback />;
  }
  if (permissionsRequestStatus === 'SUCCESS') {
    return (
      <>
        <ImportList
          isNextPageAvailable={!!nextPage}
          fetchedData={data}
          onRefreshList={fetchData}
          fetchMoreItems={fetchMoreItems}
          isLoading={dataRequestStatus === 'PENDING'}
          filters={filters}
          setFilters={setFilters}
        />
        <ToastDialog toasts={toasts} onCloseToast={closeToast} />
      </>
    );
  }
  return null;
};

export default () => {
  return (
    <PermissionsProvider>
      <I18nextProvider i18n={i18n}>
        <ErrorBoundary>
          <ImportsListApp />
        </ErrorBoundary>
      </I18nextProvider>
    </PermissionsProvider>
  );
};
