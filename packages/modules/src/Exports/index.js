// @flow
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { useEffect, useState } from 'react';
import i18n from '@kitman/common/src/utils/i18n';
import { getExportBilling } from '@kitman/services';
import {
  usePermissions,
  PermissionsProvider,
} from '@kitman/common/src/contexts/PermissionsContext';
import {
  useOrganisation,
  OrganisationProvider,
} from '@kitman/common/src/contexts/OrganisationContext';
import type { ExportsItem } from '@kitman/common/src/types/Exports';
import {
  AppStatus,
  DelayedLoadingFeedback,
  ErrorBoundary,
} from '@kitman/components';
import ToastDialog from '@kitman/components/src/Toast/KitmanDesignSystem/ToastDialog';
import exportAthleteOwnData from '@kitman/services/src/services/exports/exportAthleteOwnData';
import { ExportListTranslated as ExportList } from './ExportList';
import useExports from '../Medical/shared/hooks/useExports';
import store from './redux/store';

const INITIAL_PAGE_NUMBER = 1;
const ITEMS_PER_PAGE = 25;

const ExportsListApp = () => {
  const { permissions, permissionsRequestStatus } = usePermissions();
  const { organisation, organisationRequestStatus } = useOrganisation();
  const [data, setData] = useState<ExportsItem[]>([]);
  const [dataRequestStatus, setDataRequestStatus] = useState('PENDING');
  const [nextPage, setNextPage] = useState<number | null>(INITIAL_PAGE_NUMBER);

  const isLoginOrganisation =
    organisation?.organisation_type === 'login_organisation';

  const { toasts, closeToast, exportReports } = useExports(
    null,
    isLoginOrganisation || permissions?.user?.canExportOwnMedicalData
  );

  const fetchData = () => {
    getExportBilling({
      nextPage: INITIAL_PAGE_NUMBER,
      itemsPerPage: ITEMS_PER_PAGE,
      isAthleteExport: permissions.user.canViewOwnExports,
    }).then(
      (responseData) => {
        setData(responseData.data);
        setNextPage(responseData.meta.next_page || null);
        setDataRequestStatus('SUCCESS');
      },
      () => setDataRequestStatus('FAILURE')
    );
  };
  const triggerAthleteExport = () =>
    exportReports(
      exportAthleteOwnData,
      () => {
        fetchData();

        return {
          description: i18n.t(
            'Your request has been processed, you can download the link when it is ready'
          ),
          links: [],
        };
      },
      () => ({
        links: [],
      })
    );

  useEffect(() => {
    if (
      permissionsRequestStatus === 'SUCCESS' &&
      organisationRequestStatus === 'SUCCESS'
    ) {
      fetchData();
    }
  }, [permissionsRequestStatus, permissions, organisationRequestStatus]);

  const fetchMoreItems = () => {
    if (!nextPage) {
      return;
    }

    setDataRequestStatus('PENDING');

    getExportBilling({
      nextPage,
      itemsPerPage: ITEMS_PER_PAGE,
      isAthleteExport: permissions.user.canViewOwnExports,
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
    organisationRequestStatus === 'FAILURE' ||
    dataRequestStatus === 'FAILURE'
  ) {
    return <AppStatus status="error" isEmbed />;
  }
  if (
    permissionsRequestStatus === 'PENDING' ||
    organisationRequestStatus === 'PENDING'
  ) {
    return <DelayedLoadingFeedback />;
  }
  if (
    permissionsRequestStatus === 'SUCCESS' &&
    organisationRequestStatus === 'SUCCESS'
  ) {
    return (
      <>
        <ExportList
          onTriggerExport={triggerAthleteExport}
          isNextPageAvailable={!!nextPage}
          fetchedData={data}
          onRefreshList={fetchData}
          fetchMoreItems={fetchMoreItems}
          isLoading={dataRequestStatus === 'PENDING'}
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
      <OrganisationProvider>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <ErrorBoundary>
              <ExportsListApp />
            </ErrorBoundary>
          </I18nextProvider>
        </Provider>
      </OrganisationProvider>
    </PermissionsProvider>
  );
};
