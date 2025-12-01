import { useDispatch, useSelector } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import { containsAnEmoji } from '@kitman/common/src/utils';
import { ChooseNameModal } from '@kitman/components';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { closeModal, requestError, savingRequest } from '../actions';
import { isAUniqueTemplateName } from '../utils';
import duplicateTemplate from '../services/duplicateTemplate';

function DuplicateTemplateModal() {
  const dispatch = useDispatch();
  const locationAssign = useLocationAssign();
  const isOpen = useSelector((state) => state.modals.duplicateTemplateVisible);
  const templates = useSelector((state) => state.templates);
  const templateId = useSelector((state) => state.modals.templateId);
  const templateName = useSelector(
    (state) => templates[state.modals.templateId]?.name
  );

  return (
    <ChooseNameModal
      title={i18n.t('Duplicate Form: {{name}}', {
        name: templateName || '',
      })}
      label={i18n.t('Name')}
      isOpen={isOpen}
      value=""
      customValidations={[
        (value) => isAUniqueTemplateName(value, templates),
        (value) => containsAnEmoji(value),
      ]}
      closeModal={() => {
        dispatch(closeModal());
      }}
      onConfirm={(name) => {
        dispatch(savingRequest());
        duplicateTemplate(templateId, name).then(
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

export default DuplicateTemplateModal;
