// @flow
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import { DataGrid, Select } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { AssessmentTemplate } from '../../../types';

type Props = {
  assessmentTemplates: Array<AssessmentTemplate>,
  isEditMode: boolean,
  gameTemplates: Array<number>,
  editedGameTemplates: ?Array<number>,
  onSelectAssessmentType: Function,
};

const Editor = (props: I18nProps<Props>) => {
  const findTemplateName = (id: number) => {
    const data = props.assessmentTemplates.find((a) => a.id === id);
    return data?.name;
  };

  const getGameTemplateNames = (templates: Array<number>) => {
    if (templates.length) {
      const templateNames = templates.map((template) =>
        findTemplateName(template)
      );
      return templateNames.join(', ');
    }
    return props.t('No templates set');
  };

  const columns = [
    {
      id: 'gameType',
      content: (
        <div className="sessionAssessmentTable__columnCell">
          {props.t('Game type')}
        </div>
      ),
      isHeader: true,
    },
    {
      id: 'assessmentType',
      content: (
        <div className="sessionAssessmentTable__columnCell">
          {props.t('Assessment type')}
        </div>
      ),
      isHeader: true,
    },
  ];

  const rows = [
    {
      id: 'game',
      classnames: classNames('sessionAssessmentTable__row'),
      cells: [
        {
          id: `game`,
          content: (
            <div className="sessionAssessmentTable__rowCell sessionAssessmentTable__rowCell--name">
              {props.t('Game')}
            </div>
          ),
        },
        {
          id: `assessmenttype`,
          content: (
            <div className="sessionAssessmentTable__rowCell sessionAssessmentTable__rowCell--assessment">
              {!props.isEditMode ? (
                getGameTemplateNames(props.gameTemplates)
              ) : (
                <>
                  <Select
                    options={props.assessmentTemplates.map((template) => {
                      return { label: template.name, value: template.id };
                    })}
                    value={props.editedGameTemplates || props.gameTemplates}
                    onChange={(selectedId) => {
                      props.onSelectAssessmentType(selectedId);
                    }}
                    isMulti
                    inlineShownSelection
                    allowSelectAll
                    allowClearAll
                    appendToBody
                    showAutoWidthDropdown
                  />
                </>
              )}
            </div>
          ),
        },
      ],
    },
  ];

  return (
    <main
      className={classNames('sessionAssessmentTable', {
        'sessionAssessmentTable--edit': props.isEditMode,
      })}
    >
      <DataGrid columns={columns} rows={rows} scrollOnBody />
    </main>
  );
};

export const EditorTranslated = withNamespaces()(Editor);
export default Editor;
