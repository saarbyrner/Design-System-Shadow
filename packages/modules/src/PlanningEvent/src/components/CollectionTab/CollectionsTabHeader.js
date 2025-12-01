// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { TextButton, TooltipMenu, EditableInput } from '@kitman/components';
import { AssessmentFormTranslated as AssessmentForm } from '@kitman/modules/src/Assessments/components/AssessmentForm';
import type { ParticipationLevel } from '@kitman/services/src/services/getParticipationLevels';
import type { Event } from '@kitman/common/src/types/Event';
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { AssessmentGroup, AssessmentTemplate } from '../../../types';

type Props = {
  bulkUpdateAttributes: Function,
  canAnswerAssessment: boolean,
  canCreateAssessment: boolean,
  canCreateAssessmentFromTemplate: boolean,
  cancelUpdate: Function,
  canEditEvent: boolean,
  disableSave: boolean,
  editMode: boolean,
  event: Event,
  isGridLoading: boolean,
  orgTimezone: string,
  assessmentGroups?: Array<AssessmentGroup>,
  turnaroundList: Array<Turnaround>,
  assessmentTemplates: Array<AssessmentTemplate>,
  participationLevels: Array<ParticipationLevel>,
  onClickAddAssessmentColumns: Function,
  onClickAddStatus: Function,
  onClickComments: Function,
  updateAssessment: Function,
  onClickOpenCollectionChannels: Function,
  onClickOpenReorderColumnModal: Function,
  onSetSelectedGridDetails: Function,
  selectedCollection: {
    id: number | string,
    name: string,
    type: string,
    participationLevels?: Array<{ id: number, name: string }>,
  },
  setEditMode: Function,
  showComments: boolean,
};

const CollectionsTabHeader = (props: I18nProps<Props>) => {
  const [assessmentFormOpen, setAssessmentFormOpen] = useState(false);

  const buildAssessmentTooltipMenuItems = () => {
    return [
      {
        description: props.t('Reorder'),
        onClick: () => props.onClickOpenReorderColumnModal(),
      },
      {
        description: props.t('Edit details'),
        onClick: () => setAssessmentFormOpen(true),
      },
    ];
  };

  const getActionButtons = () => {
    return (
      <>
        {props.selectedCollection.type === 'ASSESSMENT' && (
          <>
            <TextButton
              text={props.t('Edit values')}
              onClick={() =>
                props.canAnswerAssessment && props.setEditMode(true)
              }
              isDisabled={props.isGridLoading || !props.canAnswerAssessment}
              type="secondary"
              kitmanDesignSystem
            />
            <TextButton
              text={props.t('Columns')}
              onClick={() =>
                props.canCreateAssessment && props.onClickAddAssessmentColumns()
              }
              isDisabled={props.isGridLoading || !props.canCreateAssessment}
              type="secondary"
              kitmanDesignSystem
            />
            {props.showComments && (
              <TextButton
                text={props.t('Comments')}
                onClick={() => props.onClickComments()}
                isDisabled={props.isGridLoading}
                type="secondary"
                kitmanDesignSystem
              />
            )}
            <TooltipMenu
              placement="bottom-end"
              offset={[0, 0]}
              menuItems={buildAssessmentTooltipMenuItems()}
              tooltipTriggerElement={
                <TextButton
                  iconAfter="icon-more"
                  type="secondary"
                  isDisabled={props.isGridLoading}
                  kitmanDesignSystem
                />
              }
              disabled={props.isGridLoading}
              kitmanDesignSystem
            />
          </>
        )}
        {props.selectedCollection.type !== 'ASSESSMENT' && (
          <>
            <TextButton
              text={props.t('Edit values')}
              onClick={() => props.setEditMode(true)}
              isDisabled={props.isGridLoading}
              type="secondary"
              kitmanDesignSystem
            />
            <TextButton
              text={props.t('Columns')}
              onClick={() => props.onClickAddStatus()}
              isDisabled={props.isGridLoading}
              type="secondary"
              kitmanDesignSystem
            />
            <TextButton
              text={props.t('Collection channels')}
              onClick={() => props.onClickOpenCollectionChannels()}
              type="secondary"
              kitmanDesignSystem
            />
            <TooltipMenu
              placement="bottom-end"
              offset={[0, 0]}
              menuItems={[
                {
                  description: props.t('Reorder'),
                  onClick: () => props.onClickOpenReorderColumnModal(),
                },
              ]}
              tooltipTriggerElement={
                <TextButton
                  iconAfter="icon-more"
                  type="secondary"
                  isDisabled={props.isGridLoading}
                  kitmanDesignSystem
                />
              }
              disabled={props.isGridLoading}
              kitmanDesignSystem
            />
          </>
        )}
      </>
    );
  };
  return (
    <>
      <header className="planningEventGridTab__header">
        {props.selectedCollection.type === 'ASSESSMENT' ? (
          <div className="planningEventGridTab__assessment">
            <h3 className="planningEventGridTab__title">
              <EditableInput
                value={`${props.selectedCollection.name || ''}`}
                maxLength={250}
                allowSavingEmpty={false}
                onSubmit={(value) => {
                  const newCollection = {
                    ...props.selectedCollection,
                    name: value,
                  };
                  props.onSetSelectedGridDetails({
                    id: newCollection.id,
                    name: newCollection.name,
                    type: 'ASSESSMENT',
                  });
                  props.updateAssessment(newCollection, props.event.id);
                }}
              />
            </h3>
            {props.selectedCollection.participationLevels &&
              props.selectedCollection.participationLevels.length > 0 && (
                <p className="planningEventGridTab__assessment--participationLevels">
                  {props.selectedCollection.participationLevels
                    .map((participationLevel) => participationLevel.name)
                    .join(' | ')}
                </p>
              )}
          </div>
        ) : (
          <h3 className="planningEventGridTab__title">
            {props.selectedCollection.name}
          </h3>
        )}

        <div className="planningEventGridTab__actions">
          {props.canEditEvent && props.editMode && (
            <>
              <TextButton
                testId="save-attributes-button"
                text={props.t('Save')}
                onClick={props.bulkUpdateAttributes}
                isDisabled={props.disableSave}
                type="secondary"
                kitmanDesignSystem
              />

              <TextButton
                text={props.t('Cancel')}
                onClick={() => props.cancelUpdate()}
                type="secondary"
                kitmanDesignSystem
              />
            </>
          )}
          {props.canEditEvent && !props.editMode ? getActionButtons() : null}
        </div>
      </header>
      {assessmentFormOpen && (
        <AssessmentForm
          assessment={
            props.assessmentGroups &&
            props.assessmentGroups.find(
              (group) => group.id === props.selectedCollection.id
            )
          }
          permissions={{
            createAssessment: props.canCreateAssessment,
            createAssessmentFromTemplate: props.canCreateAssessmentFromTemplate,
          }}
          orgTimezone={props.orgTimezone}
          event={props.event}
          assessmentTemplates={props.assessmentTemplates}
          turnaroundList={props.turnaroundList}
          onClickClose={() => {
            setAssessmentFormOpen(false);
          }}
          onClickSubmit={(assessment) => {
            setAssessmentFormOpen(true);
            props.onSetSelectedGridDetails({
              id: assessment.id,
              name: assessment.name,
              type: 'ASSESSMENT',
              participationLevels: props.participationLevels.filter(
                (participationLevel) =>
                  assessment.participation_levels.includes(
                    participationLevel.id
                  )
              ),
            });
            props.updateAssessment(assessment, props.event.id);
            setAssessmentFormOpen(false);
          }}
          participationLevels={props.participationLevels}
          hideTemplateDropdown
        />
      )}
    </>
  );
};

export const CollectionsTabHeaderTranslated =
  withNamespaces()(CollectionsTabHeader);
export default CollectionsTabHeader;
