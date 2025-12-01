// @flow
import { withNamespaces } from 'react-i18next';
import {
  InputTextField,
  Modal,
  TextButton,
  ColorPicker,
} from '@kitman/components';
import { useSelector, useDispatch } from 'react-redux';
import type { Translation } from '@kitman/common/src/types/i18n';
import { isEmptyString } from '@kitman/modules/src/OrganisationSettings/src/components/CalendarSettings/utils/helpers';
import colors from '@kitman/common/src/variables/colors';
import {
  useCreateLabelMutation,
  useUpdateLabelMutation,
} from '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi';
import useLabelsGrid from '@kitman/modules/src/DynamicCohorts/Labels/ListLabels/src/components/LabelsGrid/useLabelsGrid';
import style from '@kitman/modules/src/DynamicCohorts/shared/styles';
import { onCloseLabelModal } from '@kitman/modules/src/DynamicCohorts/Labels/ListLabels/redux/slices/manageLabelsSlice';
import {
  onUpdateForm,
  onReset,
  onUpdateErrorState,
  onClearErrorState,
} from '@kitman/modules/src/DynamicCohorts/Labels/ListLabels/redux/slices/labelSlice';
import { duplicateNameErrorCode } from '@kitman/modules/src/DynamicCohorts/shared/utils/consts';

const LabelModal = ({ t }: { t: Translation }) => {
  const dispatch = useDispatch();
  const { isLabelModalOpen } = useSelector((state) => state.manageLabelsSlice);
  const { formState, errorState, isEditing } = useSelector(
    (state) => state.labelSlice
  );

  const [onCreateLabel] = useCreateLabelMutation();
  const [onUpdateLabel] = useUpdateLabelMutation();
  const { resetLabelsGrid } = useLabelsGrid();
  const closeModal = () => {
    dispatch(onReset());
    dispatch(onCloseLabelModal());
  };

  const onSaveLabel = () => {
    if (isEmptyString(formState.name)) {
      dispatch(onUpdateErrorState(t('Label name required.')));
    } else if (isEditing) {
      onUpdateLabel(formState)
        .unwrap()
        .then(() => {
          closeModal();
          resetLabelsGrid();
        });
    } else {
      onCreateLabel(formState)
        .unwrap()
        .then(() => {
          closeModal();
          resetLabelsGrid();
        })
        .catch((error) => {
          // check if error was from name already existing
          if (error.status === duplicateNameErrorCode) {
            dispatch(onUpdateErrorState(t('Label name already exists.')));
          }
        });
    }
  };

  return (
    <Modal
      isOpen={isLabelModalOpen}
      onPressEscape={closeModal}
      onClose={closeModal}
    >
      <Modal.Header>
        <Modal.Title>
          {isEditing ? t('Edit athlete label') : t('Create athlete label')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <div className="row">
          <div className="col-6">
            <InputTextField
              label={t('Athlete label')}
              value={formState.name}
              onChange={(e) => {
                dispatch(
                  onUpdateForm({
                    name: e.target.value,
                  })
                );
                if (isEmptyString(e.target.value)) {
                  dispatch(onUpdateErrorState(t('Label name required.')));
                } else {
                  dispatch(onClearErrorState());
                }
              }}
              disabled={isEditing}
              kitmanDesignSystem
              updatedValidationDesign
              errors={errorState}
              invalid={!!errorState?.length}
            />
          </div>
          <div>
            <div css={style.labelText}>{t('Color')}</div>
            <ColorPicker
              onDeleteColor={() =>
                dispatch(
                  onUpdateForm({
                    color: '',
                  })
                )
              }
              initialColor={formState.color || colors.neutral_200}
              onChange={(colour) =>
                dispatch(
                  onUpdateForm({
                    color: colour,
                  })
                )
              }
              kitmanDesignSystem
            />
          </div>
        </div>

        <InputTextField
          label={t('Description')}
          value={formState.description}
          onChange={(e) =>
            dispatch(
              onUpdateForm({
                description: e.target.value,
              })
            )
          }
          kitmanDesignSystem
        />
      </Modal.Content>
      <Modal.Footer>
        <TextButton
          text={t('Cancel')}
          onClick={closeModal}
          type="subtle"
          isDisabled={false}
          kitmanDesignSystem
        />
        <TextButton
          text={isEditing ? t('Edit') : t('Create')}
          type="primary"
          onClick={onSaveLabel}
          isDisabled={!!errorState?.length}
          kitmanDesignSystem
        />
      </Modal.Footer>
    </Modal>
  );
};

export const LabelModalTranslated = withNamespaces()(LabelModal);
export default LabelModal;
