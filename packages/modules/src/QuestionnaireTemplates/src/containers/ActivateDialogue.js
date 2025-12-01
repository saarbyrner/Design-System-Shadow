import { useSelector, useDispatch } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import { Dialogue } from '@kitman/components';
import { hideActivateDialogue, activateTemplateRequest } from '../actions';

const getMessage = (template) => {
  if (template.active_athlete_count === 0) {
    return i18n.t(
      'You should have at least one question selected if you want to make this form active'
    );
  }

  if (template.active_athlete_count === template.total_athlete_count) {
    return i18n.t('Are you sure you want to set this form as active?');
  }

  return i18n.t(
    '{{activeCount}} out of {{totalCount}} athletes have questions assigned to them, set this form as active?',
    {
      activeCount: template.active_athlete_count,
      totalCount: template.total_athlete_count,
    }
  );
};

export default () => {
  const dispatch = useDispatch();
  const activateDialogue = useSelector((state) => state.dialogues.activate);
  const template = useSelector(
    (state) => state.templates[activateDialogue.templateId]
  );

  const message = template ? getMessage(template) : '';
  const type = template?.active_athlete_count === 0 ? 'info' : 'confirm';

  return (
    <Dialogue
      message={message}
      type={type}
      visible={activateDialogue.isVisible}
      confirmButtonText={i18n.t('Make active')}
      confirmAction={() => {
        dispatch(activateTemplateRequest(activateDialogue.templateId));
        dispatch(hideActivateDialogue());
      }}
      cancelAction={() =>
        dispatch(hideActivateDialogue(activateDialogue.templateId))
      }
      isEmbed={false}
    />
  );
};
