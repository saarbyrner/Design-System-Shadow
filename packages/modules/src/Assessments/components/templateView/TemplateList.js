// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { TrackEvent } from '@kitman/common/src/utils';
import { AppStatus, ChooseNameModal } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { AssessmentTemplate } from '../../types';

type Props = {
  templates: Array<AssessmentTemplate>,
  onClickDeleteTemplate: Function,
  onClickRenameTemplate: Function,
};

const TemplateList = (props: I18nProps<Props>) => {
  const [templateToEdit, setTemplateToEdit] = useState(null);
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);

  return (
    <div className="assessmentsTemplateList">
      <table className="table km-table">
        <tbody>
          {props.templates.map((template) => (
            <tr key={template.id}>
              <td>
                <span className="assessmentsTemplateList__templateName">
                  {template.name}
                </span>

                <button
                  className="assessmentsTemplateList__deleteIcon icon-bin"
                  type="button"
                  onClick={() => {
                    setTemplateToEdit(template);
                    setShowConfirmDeletion(true);
                    TrackEvent('assessments', 'click', 'delete template');
                  }}
                />
                <button
                  className="assessmentsTemplateList__editIcon icon-edit"
                  type="button"
                  onClick={() => {
                    setTemplateToEdit(template);
                    setShowRenameModal(true);
                    TrackEvent('assessments', 'click', 'rename template');
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showConfirmDeletion && (
        <AppStatus
          status="warning"
          message={props.t('Delete template?')}
          secondaryMessage={props.t(
            'Deleting the template will remove it from the template list. This will not delete any forms associated with it.'
          )}
          deleteAllButtonText={props.t('Delete')}
          hideConfirmation={() => setShowConfirmDeletion(false)}
          confirmAction={() => {
            setShowConfirmDeletion(false);
            props.onClickDeleteTemplate(templateToEdit?.id);
          }}
        />
      )}
      <ChooseNameModal
        value={templateToEdit?.name}
        title={props.t('Rename Template')}
        label={props.t('Template Name')}
        closeModal={() => setShowRenameModal(false)}
        onConfirm={(templateName) => {
          setShowRenameModal(false);
          props.onClickRenameTemplate(templateToEdit?.id, templateName);
        }}
        actionButtonText={props.t('Save')}
        customEmptyMessage={props.t('A name is required.')}
        maxLength={50}
        isOpen={showRenameModal}
      />
    </div>
  );
};

export const TemplateListTranslated = withNamespaces()(TemplateList);
export default TemplateList;
