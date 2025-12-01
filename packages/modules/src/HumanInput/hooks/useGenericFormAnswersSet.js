// @flow

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  useFetchFormAnswersSetQuery,
  useCreateFormAnswersSetMutation,
} from '@kitman/services/src/services/humanInput/humanInput';
import {
  onSetMode,
  onUpdateShowMenuIcons,
  onResetForm,
  onClearFormAnswersSetId,
} from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import { getFormAnswerSetIdFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import type { ReduxMutation } from '@kitman/common/src/types/Redux';
import type { HumanInputForm } from '@kitman/modules/src/HumanInput/types/forms';
import { usePopulateFormState } from './helperHooks/usePopulateFormState';
import useGetFormAnswersSetIdFromPath from './useGetFormAnswersSetIdFromPath';

type UseFetchFormAnswersSetQueryReturnType = {
  isLoading: boolean,
  isFetching: boolean,
  isError: boolean,
  isSuccess: boolean,
  data: HumanInputForm,
};

type ReturnType = {
  isLoading: boolean,
  isError: boolean,
  isSuccess: boolean,
};

type UseCreateFormAnswersSetMutationReturnType = {
  ...ReturnType,
};

/**
 * This hook is the primary data handler for the form page. It's responsible for:
 * - Fetching the form structure and answers for an existing form (Edit Mode).
 * - Fetching the form structure for a new form (Create Mode).
 * - Managing the loading/spinner state for the page, with special logic to handle transitions.
 */
const useGenericFormAnswersSet = (): ReturnType => {
  const dispatch = useDispatch();
  const locationSearch = useLocationSearch();

  // Clean up the form's session state when the component unmounts.
  // This is crucial to ensure a fresh state when re-opening a form.
  useEffect(() => {
    return () => {
      dispatch(onClearFormAnswersSetId());
    };
  }, [dispatch]);

  const formAnswersSetIdFromState = useSelector(getFormAnswerSetIdFactory());
  const prevIdFromStateRef = useRef();
  useEffect(() => {
    prevIdFromStateRef.current = formAnswersSetIdFromState;
  });
  const prevIdFromState = prevIdFromStateRef.current;

  // This flag is true only for the first render after the initial autosave (Create -> Edit).
  // It's used to prevent a refetch and spinner on that specific transition.
  const justSwitchedToEditMode =
    !prevIdFromState && !!formAnswersSetIdFromState;

  const formAnswersSetId = useGetFormAnswersSetIdFromPath();
  const isCreateMode = !formAnswersSetId;

  const formId = locationSearch.get('formId');
  const organisationId = locationSearch.get('oid') || null;
  const userId = locationSearch.get('uid') || null;

  const {
    isLoading: isFetchFormAnswersSetLoading,
    isFetching: isFetchFormAnswersSetFetching,
    isError: isFetchFormAnswersSetError,
    isSuccess: isFetchFormAnswersSetSuccess,
    data: formAnswersSetData,
  }: UseFetchFormAnswersSetQueryReturnType = useFetchFormAnswersSetQuery(
    formAnswersSetId,
    {
      skip: isCreateMode,
      // This option controls the refetching behavior.
      // It's set to `false` during the "Create -> Edit" transition to use the pre-populated cache.
      // For all other navigations, it's `true`, allowing RTK Query's default behavior.
      refetchOnMountOrArgChange: !justSwitchedToEditMode,
    }
  );

  const [
    createFormAnswersSet,
    {
      isLoading: isCreateFormAnswersSetLoading,
      isError: isCreateFormAnswersSetError,
      isSuccess: isCreateFormAnswersSetSuccess,
      data: formStructureData,
    },
  ]: [
    ReduxMutation<
      { formId: string, userId?: number, organisationId?: number },
      HumanInputForm
    >,
    UseCreateFormAnswersSetMutationReturnType & { data?: HumanInputForm }
  ] = useCreateFormAnswersSetMutation();

  // Fetch the form structure when in create mode.
  useEffect(() => {
    if (isCreateMode && formId) {
      createFormAnswersSet({
        formId,
        userId: +userId || undefined,
        organisationId: +organisationId || undefined,
      });
    }
  }, [isCreateMode, formId, userId, organisationId, createFormAnswersSet]);

  useEffect(() => {
    if (isCreateMode) {
      dispatch(onResetForm());
      dispatch(onSetMode({ mode: MODES.CREATE }));
    }
    dispatch(onUpdateShowMenuIcons({ showMenuIcons: true }));
  }, [isCreateMode, dispatch]);

  usePopulateFormState(formStructureData || formAnswersSetData);

  // Show a spinner if loading for the first time, OR if refetching while stale data is on screen.
  // This prevents a jarring "pop" of new data without a loading indicator.
  const showSpinner =
    isFetchFormAnswersSetLoading ||
    (isFetchFormAnswersSetFetching && !!formAnswersSetData);

  return {
    isLoading: isCreateFormAnswersSetLoading || showSpinner,
    isError: isCreateFormAnswersSetError || isFetchFormAnswersSetError,
    isSuccess: isCreateFormAnswersSetSuccess || isFetchFormAnswersSetSuccess,
  };
};

export default useGenericFormAnswersSet;
