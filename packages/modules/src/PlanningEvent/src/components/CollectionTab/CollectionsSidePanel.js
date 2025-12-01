// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import { SlidingPanel, IconButton } from '@kitman/components';
import { AssessmentFormTranslated as AssessmentForm } from '@kitman/modules/src/Assessments/components/AssessmentForm';
import type { Event } from '@kitman/common/src/types/Event';
import type { ParticipationLevel } from '@kitman/services/src/services/getParticipationLevels';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { AssessmentGroup, AssessmentTemplate } from '../../../types';

type Props = {
  event: Event,
  assessmentGroups?: Array<AssessmentGroup>,
  setIsCollectionsPanelOpen: Function,
  canViewAssessments: boolean,
  canCreateAssessment: boolean,
  canCreateAssessmentFromTemplate: boolean,
  isOpen: boolean,
  isLoading: boolean,
  orgTimezone: string,
  turnaroundList: Array<Turnaround>,
  assessmentTemplates: Array<AssessmentTemplate>,
  participationLevels: Array<ParticipationLevel>,
  setShowForbiddenError: Function,
  onSetSelectedGridDetails: Function,
  fetchWorkloadGrid: Function,
  fetchAssessmentGrid: Function,
  saveAssessment: Function,
};

const CollectionsSidePanel = (props: I18nProps<Props>) => {
  const [assessmentFormOpen, setAssessmentFormOpen] = useState(false);

  return (
    <div className="collectionSidePanel">
      <SlidingPanel
        align="left"
        cssTop={0}
        isOpen={props.isOpen}
        kitmanDesignSystem
        title=""
        togglePanel={() => props.setIsCollectionsPanelOpen(false)}
        width={345}
        position="absolute"
        leftMargin={0}
      >
        <div className="collectionSidePanel__headerItem">
          <span className="collectionSidePanel__headerItem__title">
            {props.t('Collections')}
          </span>

          {props.canViewAssessments &&
            (props.canCreateAssessment ||
              props.canCreateAssessmentFromTemplate) && (
              <span className="collectionSidePanel__headerItem--addAssessment">
                <IconButton
                  icon="icon-add"
                  isSmall
                  isTransparent
                  onClick={() => setAssessmentFormOpen(true)}
                />
              </span>
            )}
        </div>
        <ul className="collectionSidePanel__list">
          <li
            className="collectionSidePanel__item"
            onClick={() => {
              props.setShowForbiddenError(false);
              props.fetchWorkloadGrid(props.event.id, true, null);
              props.setIsCollectionsPanelOpen(false);
            }}
          >
            {props.t('Workload')}
          </li>
          {props.canViewAssessments &&
            props.assessmentGroups &&
            props.assessmentGroups.map((assessment) => (
              <li
                className="collectionSidePanel__item"
                key={assessment.id}
                onClick={() => {
                  props.setShowForbiddenError(false);
                  props.onSetSelectedGridDetails({
                    id: assessment.id,
                    name: assessment.name,
                    type: 'ASSESSMENT',
                    participationLevels: assessment.participation_levels,
                  });
                  props.fetchAssessmentGrid(props.event.id, true, null);
                  props.setIsCollectionsPanelOpen(false);
                }}
              >
                {assessment.name}
              </li>
            ))}
          {!props.canViewAssessments && (
            <li
              className="collectionSidePanel__item collectionSidePanel__item--locked"
              onClick={() => {
                props.setShowForbiddenError(true);
              }}
            >
              {props.t('Assessments')}
              <i className="collectionSidePanel__item--icon icon-lock" />
            </li>
          )}
          {props.isLoading && (
            <li className="collectionSidePanel__item collectionSidePanel__item--loading">
              {props.t('Loading templates...')}
            </li>
          )}
        </ul>
      </SlidingPanel>

      {assessmentFormOpen && (
        <AssessmentForm
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
            props.saveAssessment(assessment);
            setAssessmentFormOpen(false);
            props.setIsCollectionsPanelOpen(false);
          }}
          participationLevels={props.participationLevels}
        />
      )}
    </div>
  );
};

export const CollectionsSidePanelTranslated =
  withNamespaces()(CollectionsSidePanel);
export default CollectionsSidePanel;
