// @flow
import { withNamespaces } from 'react-i18next';
import { type ComponentType, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import ConfirmationModal from '@kitman/playbook/components/ConfirmationModal';
import { Stack, Typography, Box } from '@kitman/playbook/components';

import {
  getAllDescendantIds,
  initializeRepeatableGroupsValidation,
} from '@kitman/modules/src/HumanInput/hooks/helperHooks/usePopulateFormState';
import { flattenElements } from '@kitman/modules/src/HumanInput/shared/utils/form';
import {
  onHideRecoveryModal,
  onUpdateField,
} from '../../redux/slices/formStateSlice';
import { onUpdateValidation } from '../../redux/slices/formValidationSlice';
import {
  getLocalDraftFactory,
  getShouldShowRecoveryModalFactory,
  getFormStructureState,
  getFormState,
} from '../../redux/selectors/formStateSelectors';

import { validateElement } from '../../utils';
import { elementIsChildOfRepeatableGroup } from '../../utils/form';
import { LAYOUT_ELEMENTS } from '../../constants';

type Props = {};

const RecoveryModal = ({ t }: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const [isRecovering, setIsRecovering] = useState(false);

  const showRecoveryModal = useSelector(getShouldShowRecoveryModalFactory());
  const localDraft = useSelector(getLocalDraftFactory());
  const structure = useSelector(getFormStructureState);
  const currentFormState = useSelector(getFormState);

  const serverTimestamp = structure?.form_template_version?.updated_at;

  // Rebuild logic to find group elements, as validation depends on it.
  const allElements = structure?.form_template_version?.form_elements || [];
  const groupElements = allElements
    .flat()
    .filter((e) => e.element_type === LAYOUT_ELEMENTS.Group);
  const repeatableGroupElements = groupElements.filter(
    (e) => e.config.repeatable
  );
  const conditionalChildrenIds = new Set<number>();
  groupElements
    .filter((e) => e.config.condition)
    .forEach((group) => {
      getAllDescendantIds(group.form_elements, conditionalChildrenIds);
    });

  const removeItemFromLocalStorage = () => {
    const formId = structure?.form?.id || '';
    const athleteId = structure?.athlete?.id || '';

    localStorage?.removeItem(`autosave_form_${formId}_${athleteId}`);
  };

  const handleRestore = () => {
    const allFormElements =
      structure?.form_template_version?.form_elements || [];
    if (
      !localDraft?.data ||
      allFormElements.length === 0 ||
      !currentFormState
    ) {
      return;
    }

    setIsRecovering(true);

    // Create a temporary map of elements indexed by their numeric ID for quick lookups.
    const elementsById = Object.fromEntries(
      flattenElements(allFormElements).map((el) => [el.id, el])
    );

    Object.entries(localDraft.data).forEach(([id, localValue]) => {
      const elementId = Number(id);
      const serverValue = currentFormState[elementId];

      // Only dispatch actions if the local value is different from the server value to avoid unnecessary updates.
      if (JSON.stringify(localValue) !== JSON.stringify(serverValue)) {
        const element = elementsById[elementId];
        if (!element) return;

        // Update the field's value.
        dispatch(onUpdateField({ [elementId]: localValue }));

        // Update the field's validation state.
        if (
          elementIsChildOfRepeatableGroup(repeatableGroupElements, elementId) &&
          Array.isArray(localValue)
        ) {
          initializeRepeatableGroupsValidation(
            element,
            // $FlowIgnore[incompatible-call]
            localValue,
            dispatch,
            conditionalChildrenIds
          );
        } else {
          // $FlowIgnore[incompatible-call]
          const { status, message } = validateElement(element, localValue);
          dispatch(
            onUpdateValidation({
              [elementId]: {
                status,
                message,
              },
            })
          );
        }
      }
    });

    removeItemFromLocalStorage();
    dispatch(onHideRecoveryModal());
    setIsRecovering(false);
  };

  const handleDiscard = () => {
    removeItemFromLocalStorage();
    dispatch(onHideRecoveryModal());
  };

  const formatTimestamp = (ts: ?string) => {
    if (!ts) return 'N/A';
    return new Date(ts).toLocaleString();
  };

  const dialogContent = (
    <Stack spacing="medium">
      <Typography>
        {t(
          'We found a version of this form that was saved locally but not on the server.'
        )}
      </Typography>
      <Box sx={{ py: 2 }}>
        <Typography>
          <strong>{t('Locally saved version: ')}</strong>
          {formatTimestamp(localDraft?.timestamp)}
        </Typography>
        <Typography>
          <strong>{t('Last server version: ')}</strong>
          {formatTimestamp(serverTimestamp)}
        </Typography>
      </Box>
      <Typography>
        {t('Would you like to restore the locally saved version?')}
      </Typography>
    </Stack>
  );

  return (
    <ConfirmationModal
      fullWidth
      isModalOpen={showRecoveryModal}
      onClose={handleDiscard}
      onConfirm={handleRestore}
      onCancel={handleDiscard}
      isLoading={isRecovering}
      maxWidth="sm"
      translatedText={{
        title: t('Unsaved changes found'),
        actions: {
          ctaButton: t('Restore local version'),
          cancelButton: t('Discard'),
        },
      }}
      dialogContent={dialogContent}
    />
  );
};

export const RecoveryModalTranslated: ComponentType<Props> =
  withNamespaces()(RecoveryModal);

export default RecoveryModalTranslated;
