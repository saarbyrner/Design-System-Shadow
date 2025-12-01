// @flow
import { useState, useEffect, useContext } from 'react';
import { withNamespaces } from 'react-i18next';
import classnames from 'classnames';

import { TrackEvent } from '@kitman/common/src/utils';
import { MultiSelectDropdown, TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import PermissionsContext from '../contexts/PermissionsContext';
import type { AssessmentTemplate } from '../types';

type Props = {
  assessmentTemplates: Array<AssessmentTemplate>,
  filteredTemplates: Array<number | null>,
  onClickAddAssessment: Function,
  onClickEditTemplates: Function,
  onApplyTemplateFilter: Function,
};

const AssessmentsHeader = (props: I18nProps<Props>) => {
  const permissions = useContext(PermissionsContext);
  const [filteredTemplates, setFilteredTemplates] = useState([]);

  const squadHasNoTemplate = props.assessmentTemplates.length === 0;

  useEffect(() => {
    setFilteredTemplates(props.filteredTemplates);
  }, [props.filteredTemplates]);

  const getDropdownTitle = () => {
    const templateNames = props.assessmentTemplates
      .filter((template) => props.filteredTemplates.includes(template.id))
      .map((template) => template.name);

    if (props.filteredTemplates.includes(null)) {
      templateNames.push(props.t('Unidentified'));
    }

    return templateNames.join(', ');
  };

  return (
    <header className="assessmentsHeader">
      {window.featureFlags['assessments-grid-view'] ? (
        <>
          <div>
            <div className="assessmentsHeader__filterDropdown">
              <MultiSelectDropdown
                dropdownTitle={
                  getDropdownTitle() || props.t('Filter templates')
                }
                listItems={[
                  ...props.assessmentTemplates,
                  { id: 'UNIDENTIFIED', name: props.t('Unidentified') },
                ]}
                selectedItems={filteredTemplates.map((filteredTemplate) =>
                  filteredTemplate === null
                    ? 'UNIDENTIFIED'
                    : filteredTemplate.toString()
                )}
                onItemSelect={(checkbox) => {
                  const clickedTemplateId =
                    checkbox.id === 'UNIDENTIFIED'
                      ? null
                      : parseInt(checkbox.id, 10);

                  if (checkbox.checked) {
                    setFilteredTemplates((prevFilteredTemplates) => [
                      ...prevFilteredTemplates,
                      clickedTemplateId,
                    ]);
                  } else {
                    setFilteredTemplates((prevFilteredTemplates) =>
                      prevFilteredTemplates.filter(
                        (templateId) => templateId !== clickedTemplateId
                      )
                    );
                  }
                }}
                onApply={() => {
                  props.onApplyTemplateFilter(
                    filteredTemplates.map((templateId) => templateId)
                  );
                  TrackEvent('assessments', 'click', 'filter templates');
                }}
                disabled={squadHasNoTemplate}
                buttonSize="extraSmall"
                hasApply
              />
            </div>
          </div>

          <TextButton
            text={props.t('Add')}
            type="primary"
            onClick={() => {
              props.onClickAddAssessment();
              TrackEvent('assessments', 'click', 'add form');
            }}
            isDisabled={!permissions.createAssessment}
            kitmanDesignSystem
          />
        </>
      ) : (
        <>
          <div
            className={classnames('assessmentsHeader__addAssessmentBtn', {
              'assessmentsHeader__addAssessmentBtn--disabled':
                !permissions.createAssessment &&
                !permissions.createAssessmentFromTemplate,
            })}
            onClick={() => {
              if (
                !permissions.createAssessment &&
                !permissions.createAssessmentFromTemplate
              ) {
                return;
              }

              props.onClickAddAssessment();
              TrackEvent('assessments', 'click', 'add form');
            }}
          >
            <div className="icon-add assessmentsHeader__addAssessmentBtnIcon" />
            <div className="assessmentsHeader__addAssessmentBtnLabel">
              {props.t('Add form')}
            </div>
          </div>

          <div>
            <div className="assessmentsHeader__templateFilterActions">
              <div className="assessmentsHeader__filterLabel">
                {props.t('Filter templates')}
              </div>
              <button
                type="button"
                className={classnames('assessmentsHeader__editTemplates', {
                  'assessmentsHeader__editTemplates--disabled':
                    !permissions.manageAssessmentTemplate || squadHasNoTemplate,
                })}
                onClick={() => {
                  if (
                    !permissions.manageAssessmentTemplate ||
                    squadHasNoTemplate
                  ) {
                    return;
                  }
                  props.onClickEditTemplates();
                  TrackEvent('assessments', 'click', 'manage templates');
                }}
              >
                {props.t('Edit')}
              </button>
            </div>
            <div className="assessmentsHeader__filterDropdown">
              <MultiSelectDropdown
                dropdownTitle={getDropdownTitle()}
                listItems={[
                  ...props.assessmentTemplates,
                  { id: 'UNIDENTIFIED', name: props.t('Unidentified') },
                ]}
                selectedItems={filteredTemplates.map((filteredTemplate) =>
                  filteredTemplate === null
                    ? 'UNIDENTIFIED'
                    : filteredTemplate.toString()
                )}
                onItemSelect={(checkbox) => {
                  const clickedTemplateId =
                    checkbox.id === 'UNIDENTIFIED'
                      ? null
                      : parseInt(checkbox.id, 10);

                  if (checkbox.checked) {
                    setFilteredTemplates((prevFilteredTemplates) => [
                      ...prevFilteredTemplates,
                      clickedTemplateId,
                    ]);
                  } else {
                    setFilteredTemplates((prevFilteredTemplates) =>
                      prevFilteredTemplates.filter(
                        (templateId) => templateId !== clickedTemplateId
                      )
                    );
                  }
                }}
                onApply={() => {
                  props.onApplyTemplateFilter(
                    filteredTemplates.map((templateId) => templateId)
                  );
                  TrackEvent('assessments', 'click', 'filter templates');
                }}
                disabled={squadHasNoTemplate}
                hasApply
              />
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default AssessmentsHeader;
export const AssessmentsHeaderTranslated = withNamespaces()(AssessmentsHeader);
