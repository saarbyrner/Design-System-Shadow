// @flow
import { useState, useEffect } from 'react';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import _isEmpty from 'lodash/isEmpty';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { AppStatus } from '@kitman/components';
import type { DrugLotFilters } from '@kitman/modules/src/Medical/shared/types/medical';
import { isCanceledError } from '@kitman/common/src/utils/services';
import { useGetMedicationListSourcesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { AddStockSidePanelTranslated as AddStockSidePanel } from '../components/AddStockSidePanel';
import { RemoveStockSidePanelTranslated as RemoveStockSidePanel } from '../components/RemoveStockSidePanel';
import useDrugStocks from '../hooks/useDrugStocks';
import { StockListTranslated as StockList } from '../components/StockList';
import { HeaderTranslated as Header } from '../components/Header';
import { StockManagementFiltersTranslated as Filters } from '../components/Filters';

const style = {
  container: css`
    padding: 24px 24px 0 24px;
  `,
  header: css`
    padding: 24px;
    background: ${colors.p06};
    border: 1px solid #e8eaed;
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
};

type Props = {};

const StockListContainer = () => {
  const controller = new AbortController();

  const [filters, setFilters] = useState<DrugLotFilters>({});

  const {
    data: medicationListSources = null,
    error: medicationListSourcesError,
    isLoading: isMedicationListSourcesLoading,
  } = useGetMedicationListSourcesQuery();

  const {
    drugList,
    fetchDrugList,
    resetDrugList,
    resetNextPage,
    nextPage,
    isInitialDataLoaded,
    drugListRequestStatus,
    setDrugListRequestStatus,
  } = useDrugStocks();

  const getNextDrugs = useDebouncedCallback(
    ({ abortSignal, resetList = false } = {}) => {
      setDrugListRequestStatus('PENDING');

      if (resetList) {
        resetDrugList();
      }

      fetchDrugList(filters, resetList, abortSignal)
        .then(() => setDrugListRequestStatus('SUCCESS'))
        .catch((error) =>
          isCanceledError(error)
            ? setDrugListRequestStatus('PENDING')
            : setDrugListRequestStatus('FAILURE')
        );
    },
    400
  );

  const buildDrugList = () => {
    if (_isEmpty(filters)) {
      return;
    }
    resetNextPage();
    getNextDrugs({ abortSignal: controller.signal, resetList: true });
  };

  useEffect(() => {
    buildDrugList();

    return () => {
      controller.abort();
    };
  }, [filters]);

  const isFullyLoaded = drugListRequestStatus === 'SUCCESS' && !nextPage;

  const isGeneralAvailabilityOn =
    window.featureFlags['medications-general-availability'];

  return (
    <>
      <div css={style.container}>
        <header css={style.header}>
          <Header />
          <Filters
            filters={filters}
            onUpdateFilters={(updatedFilter) => setFilters(updatedFilter)}
            isDisabled={!isInitialDataLoaded}
          />
        </header>
        <StockList
          drugStocks={drugList}
          hasMore={!isFullyLoaded}
          onReachingEnd={getNextDrugs}
          isTableEmpty={
            drugListRequestStatus === 'SUCCESS' && drugList.length === 0
          }
        />

        {(drugListRequestStatus === 'FAILURE' ||
          medicationListSourcesError) && <AppStatus status="error" />}

        {!isMedicationListSourcesLoading && !medicationListSourcesError && (
          <AddStockSidePanel
            onSaveStock={buildDrugList}
            medicationSourceListName={
              isGeneralAvailabilityOn
                ? medicationListSources?.primary?.name
                : undefined
            }
          />
        )}
        <RemoveStockSidePanel onRemoveStock={buildDrugList} />
      </div>
    </>
  );
};

export const StockListContainerTranslated: ComponentType<Props> =
  withNamespaces()(StockListContainer);

export default StockListContainer;
