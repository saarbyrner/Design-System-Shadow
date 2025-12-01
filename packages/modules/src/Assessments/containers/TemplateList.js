import { useSelector, useDispatch } from 'react-redux';
import { TemplateListTranslated as TemplateList } from '../components/templateView/TemplateList';
import { deleteTemplate, renameTemplate } from '../redux/actions';

export default () => {
  const dispatch = useDispatch();
  const assessmentTemplates = useSelector((state) => state.assessmentTemplates);

  return (
    <TemplateList
      templates={assessmentTemplates}
      onClickDeleteTemplate={(templateId) =>
        dispatch(deleteTemplate(templateId))
      }
      onClickRenameTemplate={(templateId, templateName) =>
        dispatch(renameTemplate(templateId, templateName))
      }
    />
  );
};
