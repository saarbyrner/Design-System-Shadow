// @flow

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Box } from '@kitman/playbook/components';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import { tabContainerSx } from '@kitman/modules/src/StaffProfile/shared/utils/styles';
import { ProductAreaValues } from '@kitman/services/src/services/documents/generic/redux/services/consts';
import { DocumentsBodyTranslated as DocumentsBody } from '@kitman/modules/src/StaffProfile/shared/components/DocumentsTab/Components/DocumentsBody';
import { DocumentsHeaderTranslated as DocumentsHeader } from '@kitman/modules/src/StaffProfile/shared/components/DocumentsTab/Components/DocumentsHeader';
import { DocumentSidePanelTranslated as DocumentSidePanel } from '@kitman/modules/src/StaffProfile/shared/components/DocumentsTab/Components/DocumentSidePanel';
import {
  getIsOpenDocumentSidePanelFactory,
  getFiltersFactory,
} from '@kitman/modules/src/StaffProfile/shared/redux/selectors/documentsTabSelectors';
import {
  onCloseDocumentSidePanel,
  onResetSidePanelForm,
} from '@kitman/modules/src/StaffProfile/shared/redux/slices/documentsTabSlice';
import {
  onBuildGenericDocumentsState,
  onBuildGenericDocumentsCategoriesState,
} from '@kitman/services/src/services/documents/generic/redux/slices/genericDocumentsSlice';
import {
  useSearchDocumentsQuery,
  useFetchGenericDocumentsCategoriesQuery,
} from '@kitman/services/src/services/documents/generic';
import type { GenericDocumentStatus } from '@kitman/services/src/services/documents/generic/redux/services/types';
import type { DocumentsTabFilters } from '@kitman/modules/src/StaffProfile/shared/redux/slices/documentsTabSlice';
import { useGetEntity } from './utils/helpers';

const DocumentsTab = () => {
  const dispatch = useDispatch();
  const isDocumentSidePanelOpen = useSelector(
    getIsOpenDocumentSidePanelFactory()
  );

  const userEntity = useGetEntity();

  const {
    search: searchTerm,
    organisation_generic_document_categories: categories,
    statuses,
  }: DocumentsTabFilters = useSelector<DocumentsTabFilters>(
    getFiltersFactory()
  );

  const [debouncedFilteredSearchParams, setDebouncedFilteredSearchParams] =
    useState<
      $Exact<{
        filename: string,
        statuses: Array<GenericDocumentStatus>,
        organisation_generic_document_categories: Array<number>,
      }>
    >({
      filename: '',
      organisation_generic_document_categories: [],
      statuses: [],
    });

  const {
    data: documentsData,
    isLoading: isDocumentsDataLoading,
    isError,
  } = useSearchDocumentsQuery({
    filters: {
      entities: [userEntity],
      ...debouncedFilteredSearchParams,
    },
    product_area: ProductAreaValues.STAFF_PROFILE,
  });

  const { data: genericDocumentsCategoriesData = [] } =
    useFetchGenericDocumentsCategoriesQuery(ProductAreaValues.STAFF_PROFILE);

  useEffect(() => {
    dispatch(onBuildGenericDocumentsState(documentsData));
  }, [documentsData, dispatch]);

  useEffect(() => {
    dispatch(
      onBuildGenericDocumentsCategoriesState(genericDocumentsCategoriesData)
    );
  }, [genericDocumentsCategoriesData, dispatch]);

  const handleDebounceSearch = useDebouncedCallback(
    () =>
      setDebouncedFilteredSearchParams({
        filename: searchTerm,
        organisation_generic_document_categories: categories,
        statuses,
      }),
    400
  );

  useEffect(() => {
    handleDebounceSearch();
    return () => {
      handleDebounceSearch.cancel?.();
    };
  }, [searchTerm, categories, statuses.length, handleDebounceSearch]);

  return (
    <Box sx={tabContainerSx}>
      <DocumentsHeader />
      <DocumentsBody isLoading={isDocumentsDataLoading} isError={isError} />
      <DocumentSidePanel
        isOpen={isDocumentSidePanelOpen}
        onClose={() => {
          dispatch(onCloseDocumentSidePanel());
          dispatch(onResetSidePanelForm());
        }}
      />
    </Box>
  );
};

export default DocumentsTab;
