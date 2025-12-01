// @flow
import { useState } from 'react';
import { useSelector } from 'react-redux';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';
import { getCurrentUser } from '@kitman/common/src/redux/global/selectors';
import {
  FF_LEAGUE_OPS_FORMS_QA,
  ACCOUNT_ADMIN,
} from '@kitman/modules/src/LeagueOperations/shared/consts/index';
import { useFetchFormsListQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/formsApi';
/**
 * Custom hook to manage QA registration forms.
 * This hook verifies if the current user has the required role and if the feature flag is enabled.
 * It fetches the list of forms.
 *
 * @returns {ReturnType} - An object containing the following properties:
 *   - isPermitted: Boolean indicating if the user has the required permissions.
 *   - isLoading: Boolean indicating if the form data is currently being loaded.
 *   - isError: Boolean indicating if there was an error during the form data retrieval.
 *   - isSuccess: Boolean indicating if the form data was successfully retrieved.
 *   - qaFormList: The form data retrieved from the API.
 *   - qaFormList: The form data retrieved from the API.
 */

type ReturnType = {
  qaFormList: Array<Object>,
  isLoading: boolean,
  isError: boolean,
  isSuccess: boolean,
  isPermitted: boolean,
  onSelectFilter: (value: string) => void,
  filterOptions: Array<{ key: string, value: string }>,
  formFilter: ?string,
};

const FORM_FILTERS = [
  { key: 'medical', value: 'Medical' },
  { key: 'concussion', value: 'Concussion' },
  { key: 'registration', value: 'Registration' },
  { key: 'internal', value: 'Internal' },
];

const useQAFormsList = (): ReturnType => {
  const [formFilter, setFormFilter] = useState('registration');
  const {
    isLoading: isGlobalLoading,
    hasFailed: hasGlobalFailed,
    isSuccess: isGlobalSuccess,
  } = useGlobal();

  const currentUser = useSelector(getCurrentUser());

  const isPermitted =
    currentUser?.role === ACCOUNT_ADMIN && !!FF_LEAGUE_OPS_FORMS_QA;

  const onSelectFilter = (value: string) => {
    setFormFilter(value);
  };

  const {
    data: qaFormList,
    isLoading: isLoadingForms,
    isError: isErrorForms,
    isSuccess: isSuccessForms,
  } = useFetchFormsListQuery(
    { category: formFilter },
    { skip: !isPermitted || !currentUser }
  );

  const isLoading = [isLoadingForms, isGlobalLoading].includes(true);

  const isError = [isErrorForms, hasGlobalFailed].includes(true);

  const isSuccess = [isSuccessForms, isGlobalSuccess].every((v) => v === true);

  return {
    isPermitted,
    isLoading,
    isError,
    isSuccess,
    qaFormList,
    onSelectFilter,
    filterOptions: FORM_FILTERS,
    formFilter,
  };
};

export default useQAFormsList;
