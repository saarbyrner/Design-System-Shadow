/* eslint-disable camelcase */
// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { useDispatch, useSelector } from 'react-redux';
import {
  type MultiRegistration,
  type RequirementSection,
  type SectionFormElement,
  type RegistrationStatus,
  type RegistrationSystemStatus,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';

import type { Filters as SearchRequirementsSectionsFilters } from '@kitman/modules/src/LeagueOperations/shared/services/fetchRequirementSections';
import { DEFAULT_PAGE_SIZE } from '@kitman/modules/src/LeagueOperations/shared/consts';
import type { RequirementSectionRow } from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';
import { useFetchRequirementSectionsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationRequirementsApi';
import withGridDataManagement from '@kitman/modules/src/LeagueOperations/shared/components/withGridDataManagement';
import type { TabProps } from '@kitman/modules/src/LeagueOperations/shared/types/tabs';
import { onTogglePanel } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationRequirementsSlice';
import {
  getRequirementById,
  getUserId,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';

import GridFilterSearch from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFilterSearch';
import transformToRequirementRows from './utils';
import { GridSearchTranslated as GridSearch } from '../../GridSearch';

import useCompletedRequirementsForm from '../../../hooks/useCompletedRequirementsForm';

const TabRequirements = (
  props: TabProps<SearchRequirementsSectionsFilters>
) => {
  const dispatch = useDispatch();

  const userId = useSelector(getUserId);
  const currentRequirement: ?MultiRegistration = useSelector(
    getRequirementById()
  );

  const initialFilters: SearchRequirementsSectionsFilters = {
    registration_id: currentRequirement?.id,
    user_id: userId,
    search_expression: '',
    per_page: DEFAULT_PAGE_SIZE,
    page: 1,
  };

  const { isLoading, isError } = useCompletedRequirementsForm();

  const onRowClickCallback = ({
    form_element,
    status,
    registrationSystemStatus,
    sectionId,
  }: {
    form_element: SectionFormElement,
    status: RegistrationStatus,
    registrationSystemStatus: ?RegistrationSystemStatus,
    sectionId: number,
  }) => {
    dispatch(
      onTogglePanel({
        isOpen: true,
        formElement: form_element,
        status,
        registrationSystemStatus,
        sectionId,
      })
    );
  };

  const useResponsiveFilters = window.getFlag('lops-grid-filter-enhancements');

  return withGridDataManagement<
    RequirementSection,
    RequirementSectionRow,
    SearchRequirementsSectionsFilters
  >({
    useSearchQuery: useFetchRequirementSectionsQuery,
    initialFilters,
    title: i18n.t('Requirements'),
    onTransformData: (data) =>
      transformToRequirementRows(data, onRowClickCallback),
    slots: {
      filters: ({ onUpdate, filters, requestStatus }) => {
        const isRequestPending =
          requestStatus.isFetching ||
          requestStatus.isLoading ||
          requestStatus.isError;
        return (
          <>
            {useResponsiveFilters ? (
              <GridFilterSearch
                label="Search"
                param="search_expression"
                onChange={(value) => {
                  onUpdate({
                    search_expression: value,
                    page: 1,
                  });
                }}
                value={filters.search_expression || ''}
                showSearchIcon
                disabled={isRequestPending}
              />
            ) : (
              <GridSearch
                value={filters.search_expression}
                onUpdate={(value) =>
                  onUpdate({
                    search_expression: value,
                    page: 1,
                  })
                }
                requestStatus={requestStatus}
              />
            )}
          </>
        );
      },
    },
    additionalRequestsState: {
      isLoading,
      isError,
    },
  })({
    filterOverrides: props.filterOverrides ?? {},
    gridQueryParams: props.gridQueryParams,
  });
};

export default TabRequirements;
