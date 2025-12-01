// @flow
import { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  useAutosaveBulkCreateFormAnswersSetMutation,
  useAutosavePatchFormAnswersSetMutation,
  humanInputApi,
} from '@kitman/services/src/services/humanInput/humanInput';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import {
  getFormAnswersFactory,
  getFormAnswerSetIdFactory,
  getLastSavedFactory,
  getFormSettingsConfigFactory,
  getFormStructureState,
  getOriginalFormFactory,
} from '../shared/redux/selectors/formStateSelectors';
import {
  onSetFormAnswersSetId,
  onSyncOriginalState,
  onSetLastSaved,
  onSetMode,
} from '../shared/redux/slices/formStateSlice';

import {
  createFormAnswersRequestBody,
  createPatchAnswersPayload,
} from '../shared/utils';

// Autosave will trigger after this period of inactivity.
const AUTOSAVE_DELAY = 20000; // 20 seconds

type Props = {
  formTemplateId: ?string,
  userId: ?number,
  organisationId: ?number,
  hasUnsavedChanges: boolean,
};

/*
    This hook implements an autosave strategy to provide a better user experience.

    HOW IT WORKS:
    1.  An inactivity timer (`useEffect` with `setTimeout`) triggers the `runSave` function. The timer is reset every time the user types.

    2.  The `runSave` function handles two distinct flows: Create and Update.

    3.  CREATE FLOW (first save):
        - If no `formAnswersSetId` exists, it uses the `createDraft` mutation.
        - Upon success, it performs a critical operation: `dispatch(humanInputApi.util.upsertQueryData(...))`.
        - This manually injects the new form data into the RTK Query cache *before* navigating.
        - This pre-population of the cache is essential to prevent a loading spinner on the subsequent edit page, as the corresponding `useFetchFormAnswersSetQuery` hook is configured to trust the cache during this specific transition.
        - It then navigates the user to the new edit URL.

    4.  UPDATE FLOW (subsequent saves):
        - If a `formAnswersSetId` exists, it uses the `updateDraft` mutation.
        - This mutation is intentionally configured *without* `invalidatesTags`. This is a deliberate choice to avoid a race condition where an automatic refetch could overwrite the user's most recent (unsaved) input with slightly older
         data from the server. This ensures the user can continue typing without interruption or data loss.

    5.  After any successful save, it dispatches `onSyncOriginalState` to update the form's "pristine" state, ensuring the `hasUnsavedChanges` logic remains accurate.
  */

export const useAutosave = ({
  formTemplateId,
  userId,
  organisationId,
  hasUnsavedChanges,
}: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const formAnswers = useSelector(getFormAnswersFactory());
  const originalFormValues = useSelector(getOriginalFormFactory());
  const formAnswersSetId = useSelector(getFormAnswerSetIdFactory());
  const formTemplateSettingsConfig = useSelector(
    getFormSettingsConfigFactory()
  );
  const formStructure = useSelector(getFormStructureState);

  const isAutosaveAsDraftSettingEnabled =
    formTemplateSettingsConfig?.autosave_as_draft || false;

  const [createDraft, { isLoading: isCreating }] =
    useAutosaveBulkCreateFormAnswersSetMutation();
  const [patchDraft, { isLoading: isPatching }] =
    useAutosavePatchFormAnswersSetMutation();
  const lastSaved = useSelector(getLastSavedFactory());

  const [autosaveError, setAutosaveError] = useState<?string>(null);
  const timeoutRef = useRef<?TimeoutID>(null);

  const isAutosaving = isCreating || isPatching;

  const runSave = useCallback(async () => {
    if (isAutosaving || !hasUnsavedChanges) {
      return;
    }

    setAutosaveError(null);
    const answersBeingSaved = { ...formAnswers };

    try {
      if (formAnswersSetId) {
        const changedAnswers = Object.keys(answersBeingSaved).reduce(
          (acc, id) => {
            const currentValue = answersBeingSaved[id];
            const originalValue = originalFormValues[id];

            if (
              JSON.stringify(currentValue) !== JSON.stringify(originalValue)
            ) {
              acc[id] = currentValue;
            }
            return acc;
          },
          {}
        );

        // if no answers have changed, do not proceed with the update
        if (Object.keys(changedAnswers).length === 0) {
          return;
        }

        // Update flow

        // We are only patching the changed answers to minimize payload size and improve performance
        const payload = createPatchAnswersPayload(
          changedAnswers,
          formAnswersSetId
        );

        await patchDraft(payload).unwrap();
      } else {
        // Create flow
        const { status, answers } = createFormAnswersRequestBody(
          // $FlowIgnore[incompatible-call]
          null,
          answersBeingSaved,
          true
        );

        const payload = {
          formId: +formTemplateId,
          userId,
          organisationId,
          status,
          answers,
        };

        const result = await createDraft(payload).unwrap();

        const newFormAnswersSet = Array.isArray(result) ? result[0] : result;
        const newId = newFormAnswersSet?.id;

        if (newId) {
          // Manually insert the response into the RTK Query cache.
          // This prevents a refetch when navigating to the new edit URL.
          dispatch(
            humanInputApi.util.upsertQueryData(
              'fetchFormAnswersSet',
              newId.toString(),
              newFormAnswersSet
            )
          );

          dispatch(onSetFormAnswersSetId({ id: newId }));
          const newPath = `/forms/form_answers_sets/${newId}`;
          dispatch(onSetLastSaved(new Date().toISOString()));

          dispatch(onSetMode({ mode: MODES.EDIT }));

          navigate(`${newPath}${location.search}`, { replace: true });
        }
      }

      // Sync the saved answers with the "original" state to correctly track future unsaved changes.
      dispatch(onSyncOriginalState({ answers: answersBeingSaved }));
      dispatch(onSetLastSaved(new Date().toISOString()));
      localStorage?.removeItem(
        `autosave_form_${formStructure?.form?.id || ''}_${
          formStructure?.athlete?.id || ''
        }`
      );
    } catch {
      // If the backend save fails, save a copy to localStorage as a fallback.
      setAutosaveError('Failed to save. Progress saved locally.');
      const localCopy = {
        timestamp: new Date().toISOString(),
        data: formAnswers,
      };

      const formId = formStructure?.form?.id || '';
      const athleteId = formStructure?.athlete?.id || '';

      localStorage?.setItem(
        `autosave_form_${formId}_${athleteId}`,
        JSON.stringify(localCopy)
      );
    }
  }, [
    isAutosaving,
    hasUnsavedChanges,
    formAnswersSetId,
    formAnswers,
    originalFormValues,
    patchDraft,
    createDraft,
    formTemplateId,
    userId,
    organisationId,
    formStructure?.form?.id,
    formStructure?.athlete?.id,
    dispatch,
    location,
    navigate,
  ]);

  // This effect manages the autosave timer.
  // It resets the timer every time the form answers change.
  useEffect(() => {
    const isAutosaveEnabled =
      window.getFlag('cp-eforms-autosave-as-draft') &&
      isAutosaveAsDraftSettingEnabled;

    // If FF is disabled, do not set up the autosave timer.
    if (!isAutosaveEnabled) {
      return undefined;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      runSave();
    }, AUTOSAVE_DELAY);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [formAnswers, isAutosaveAsDraftSettingEnabled, runSave]);

  return { isAutosaving, lastSaved, autosaveError, triggerSave: runSave };
};

export default useAutosave;
