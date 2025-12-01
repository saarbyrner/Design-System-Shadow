// @flow
import { withNamespaces } from 'react-i18next';
import type { Translation } from '@kitman/common/src/types/i18n';
import { useSelector, useDispatch } from 'react-redux';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants/index';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { isEmptyString } from '@kitman/modules/src/OrganisationSettings/src/components/CalendarSettings/utils/helpers';
import { TextButton } from '@kitman/components';
import {
  onReset,
  onUpdateForm,
  onUpdateErrorState,
} from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/slices/segmentSlice';
import {
  useCreateSegmentMutation,
  useUpdateSegmentMutation,
} from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/services/segmentsApi';
import useValidationHook from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/hooks/useValidationHook';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import { duplicateNameErrorCode } from '@kitman/modules/src/DynamicCohorts/shared/utils/consts';
import styles from '../styles';
import { mapExpressionToLabels } from '../utils';

const FormFooter = ({ mode, t }: { mode: string, t: Translation }) => {
  const dispatch = useDispatch();
  const locationAssign = useLocationAssign();
  const { validateName, validateExpression } = useValidationHook();

  const { formState, errorState } = useSelector((state) => state.segmentSlice);
  const [createSegment] = useCreateSegmentMutation();
  const [updateSegment] = useUpdateSegmentMutation();

  const addSuccessToast = ({ name }: { name: string }) => {
    const title =
      mode === MODES.CREATE
        ? t('Successfully created {{name}}.', { name })
        : t('Successfully updated {{name}}.', { name });
    dispatch(
      add({
        status: 'SUCCESS',
        title,
      })
    );
  };

  const addErrorToast = (customMessage?: string) => {
    const title =
      mode === MODES.CREATE
        ? t('Could not create the group.')
        : t('Could not update the group.');
    dispatch(
      add({
        status: 'ERROR',
        title: customMessage || title,
      })
    );
  };

  const onSaveSegment = () => {
    if (
      formState.expression &&
      mapExpressionToLabels(formState.expression)?.length &&
      !isEmptyString(formState.name)
    ) {
      if (mode === MODES.CREATE) {
        createSegment(formState)
          .unwrap()
          .then((segment) => {
            addSuccessToast({ name: segment.name });
            dispatch(onReset());
            locationAssign(`/administration/groups/${segment.id}/edit`);
          })
          .catch((error) => {
            // check if error was from name already existing
            if (error.status === duplicateNameErrorCode) {
              dispatch(
                onUpdateErrorState({ formInputKey: 'name', isInvalid: true })
              );
              addErrorToast(t('Group name already exists.'));
            } else {
              addErrorToast();
            }
          });
      } else if (mode === MODES.EDIT) {
        updateSegment(formState)
          .unwrap()
          .then(({ name, expression, id }) => {
            addSuccessToast({ name: formState.name });
            dispatch(
              onUpdateForm({ id, name, expression: JSON.parse(expression) })
            );
          })
          .catch(() => {
            addErrorToast();
          });
      }
    } else {
      validateName(formState.name);
      validateExpression(formState.expression);
    }
  };

  const onCancel = () => {
    dispatch(onReset());
    locationAssign('/administration/groups');
  };

  return (
    <div css={styles.formActionButtons}>
      <TextButton
        text={t('Cancel')}
        onClick={onCancel}
        type="secondary"
        isDisabled={false}
        kitmanDesignSystem
      />
      <TextButton
        text={mode === MODES.CREATE ? t('Save') : t('Update')}
        type="primary"
        onClick={onSaveSegment}
        isDisabled={errorState.name || errorState.expression}
        kitmanDesignSystem
      />
    </div>
  );
};

export const FormFooterTranslated = withNamespaces()(FormFooter);
export default FormFooter;
