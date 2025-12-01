// @flow
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import { DataGrid, EllipsisTooltipText, Select } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { AssessmentTemplate, SessionAssessment } from '../../../types';

type Props = {
  assessmentTemplates: Array<AssessmentTemplate>,
  editedSessionAssessments: { number: Array<number> },
  isEditMode: boolean,
  onSelectAssessmentType: Function,
  sessionAssessments: Array<SessionAssessment>,
};

const Table = (props: I18nProps<Props>) => {
  const columns = [
    {
      id: 'sessionType',
      content: (
        <div className="sessionAssessmentTable__columnCell">
          {props.t('Session type')}
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

  const getSessionTemplateNames = (sessionAssessment: SessionAssessment) => {
    if (sessionAssessment.templates.length) {
      const templateNames = sessionAssessment.templates.map(
        (template) => template.name
      );

      return templateNames.join();
    }
    return '';
  };

  const rows = props.sessionAssessments.map((sessionAssessment) => {
    return {
      id: sessionAssessment.id,
      classnames: classNames('sessionAssessmentTable__row'),
      cells: [
        {
          id: `sessionType_${sessionAssessment.id}`,
          content: (
            <div className="sessionAssessmentTable__rowCell sessionAssessmentTable__rowCell--name">
              <EllipsisTooltipText
                content={sessionAssessment.name}
                displayEllipsisWidth={380}
              />
            </div>
          ),
        },
        {
          id: `assessmentType_${sessionAssessment.id}`,
          content: (
            <div className="sessionAssessmentTable__rowCell sessionAssessmentTable__rowCell--assessment">
              {!props.isEditMode ? (
                <EllipsisTooltipText
                  content={getSessionTemplateNames(sessionAssessment)}
                  displayEllipsisWidth={210}
                />
              ) : (
                <>
                  <Select
                    options={props.assessmentTemplates.map((template) => {
                      return { label: template.name, value: template.id };
                    })}
                    value={
                      props.editedSessionAssessments[sessionAssessment.id] ||
                      sessionAssessment.templates.map((template) => template.id)
                    }
                    onChange={(selectedId) => {
                      props.onSelectAssessmentType(
                        sessionAssessment.id,
                        selectedId
                      );
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
    };
  });

  return (
    <main
      className={classNames('sessionAssessmentTable', {
        'sessionAssessmentTable--edit': props.isEditMode,
      })}
    >
      <DataGrid
        columns={columns}
        rows={rows}
        isTableEmpty={props.sessionAssessments.length === 0}
        emptyTableText={props.t('No session types')}
        scrollOnBody
      />
    </main>
  );
};

export const TableTranslated = withNamespaces()(Table);
export default Table;
