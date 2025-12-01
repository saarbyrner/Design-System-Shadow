import { useDispatch, useSelector } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import { containsAnEmoji } from '@kitman/common/src/utils';
import { ChooseNameModal } from '@kitman/components';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { savingRequest, requestError, closeModal } from '../actions';
import { isAUniqueTemplateName } from '../utils';
import addTemplate from '../services/addTemplate';

function AddTemplateModal() {
  const dispatch = useDispatch();
  const locationAssign = useLocationAssign();
  const isOpen = useSelector((state) => state.modals.addTemplateVisible);
  const templates = useSelector((state) => state.templates);

  return (
    <ChooseNameModal
      title={i18n.t('New Form')}
      label={i18n.t('Name')}
      isOpen={isOpen}
      customValidations={[
        (value) => isAUniqueTemplateName(value, templates),
        (value) => containsAnEmoji(value),
      ]}
      closeModal={() => {
        dispatch(closeModal());
      }}
      onConfirm={(value) => {
        dispatch(savingRequest());
        addTemplate(value).then(
          (response) => {
            setTimeout(() => {
              locationAssign(
                `/settings/questionnaire_templates/${response.template.id}`
              );
            }, 1000);
          },
          () => dispatch(requestError())
        );
      }}
    />
  );
}

export default AddTemplateModal;
