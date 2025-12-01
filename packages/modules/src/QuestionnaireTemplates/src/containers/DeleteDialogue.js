import { useSelector, useDispatch } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import { Dialogue } from '@kitman/components';
import { hideDeleteDialogue, deleteTemplateRequest } from '../actions';

export default () => {
  const dispatch = useDispatch();
  const deleteDialogue = useSelector((state) => state.dialogues.delete);
  const templateName = useSelector(
    (state) => state.templates[deleteDialogue.templateId]?.name
  );
  const deleteMessage = deleteDialogue.templateId
    ? i18n.t('Are you sure you want to delete "{{templateName}}"?', {
        templateName,
      })
    : '';

  return (
    <Dialogue
      message={deleteMessage}
      visible={deleteDialogue.isVisible}
      confirmButtonText={i18n.t('Delete')}
      confirmAction={() => {
        dispatch(deleteTemplateRequest(deleteDialogue.templateId));
        dispatch(hideDeleteDialogue());
      }}
      cancelAction={() =>
        dispatch(hideDeleteDialogue(deleteDialogue.templateId))
      }
      isEmbed={false}
    />
  );
};
