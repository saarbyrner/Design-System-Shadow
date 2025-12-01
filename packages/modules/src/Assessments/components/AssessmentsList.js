// @flow
import $ from 'jquery';
import { useState, useEffect, useContext } from 'react';
import { withNamespaces } from 'react-i18next';
import classnames from 'classnames';
import InfiniteScroll from 'react-infinite-scroll-component';
import useWindowSize from '@kitman/common/src/hooks/useWindowSize';
import { TrackEvent } from '@kitman/common/src/utils';
import type { StatusVariable } from '@kitman/common/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import type { OrganisationTrainingVariables } from '@kitman/common/src/types/Workload';
import { AssessmentFormTranslated as AssessmentForm } from './AssessmentForm';
import { AssessmentsHeaderTranslated as AssessmentsHeader } from './AssessmentsHeader';
import { AssessmentWidgetTranslated as AssessmentWidget } from './AssessmentWidget';
import { TemplatesSidePanelTranslated as TemplatesSidePanel } from './TemplatesSidePanel';
import PermissionsContext from '../contexts/PermissionsContext';
import AssessmentFormVisibilityContext from '../contexts/AssessmentFormVisibilityContext';
import TimezonesContext from '../contexts/TimezonesContext';
import type {
  Assessment as AssessmentType,
  AssessmentTemplate,
  User,
  ViewType,
} from '../types';

type Props = {
  viewType: ViewType,
  assessments: Array<AssessmentType>,
  selectedAthlete: number,
  filteredTemplates: Array<number>,
  onClickSaveAssessment: Function,
  onClickDeleteAssessment: Function,
  deleteAssessmentItem: Function,
  saveAssessmentItem: Function,
  saveAssessmentItemComments: Function,
  saveMetricScores: Function,
  onClickSaveTemplate: Function,
  onClickDeleteTemplate: Function,
  onClickRenameTemplate: Function,
  onClickUpdateTemplate: Function,
  onApplyTemplateFilter: Function,
  onClickSaveReordering: Function,
  onClickSaveAthletes: Function,
  onErrorCalculatingStatusValues: Function,
  fetchItemAnswers: Function,
  assessmentTemplates: Array<AssessmentTemplate>,
  users: Array<User>,
  organisationTrainingVariables: Array<OrganisationTrainingVariables>,
  statusVariables: Array<StatusVariable>,
  turnaroundList: Array<Turnaround>,
  fetchAssessments: Function,
  isFullyLoaded: boolean,
  isLoading: boolean,
};

const checkAllowingExtraLoad = (
  windowHeight: number,
  scrollContainerHeight: number,
  assessmentListLength: number,
  isAssessmentListFullyLoaded: boolean
) => {
  if (
    windowHeight >= scrollContainerHeight &&
    assessmentListLength > 0 &&
    !isAssessmentListFullyLoaded
  ) {
    return true;
  }

  return false;
};

const AssessmentsList = (props: I18nProps<Props>) => {
  const permissions = useContext(PermissionsContext);
  const { orgTimezone } = useContext(TimezonesContext);
  const { isAssessmentFormVisible, setIsAssessmentFormVisible } = useContext(
    AssessmentFormVisibilityContext
  );
  const [isLoadingByScroll, setIsLoadingByScroll] = useState(false);
  const [isTemplateSidePanelOpen, setIsTemplateSidePanelOpen] = useState(false);
  const [assessmentForm, setAssessmentForm] = useState({
    isOpen: false,
    initialData: null,
  });

  useEffect(() => {
    // Close the template side panel when all templates are deleted
    if (props.assessmentTemplates.length === 0) {
      setIsTemplateSidePanelOpen(false);
    }
  }, [props.assessmentTemplates]);

  const { windowHeight } = useWindowSize();

  useEffect(() => {
    const isInitialExtraLoadAllowed = checkAllowingExtraLoad(
      windowHeight,
      $('.infinite-scroll-component').height(),
      props.assessments.length,
      props.isFullyLoaded
    );

    if (isInitialExtraLoadAllowed) {
      props.fetchAssessments();
    }
  }, [props.isFullyLoaded, props.assessments]);

  const getLoader = () => (
    <div className="assessmentsList__loading">
      <p className="assessmentsList__loadingText">{props.t('Loading')} ...</p>
    </div>
  );

  const isTopLoaderShowed = props.isLoading && !isLoadingByScroll;

  const getNoAssessmentContent = () => {
    if (window.featureFlags['assessments-grid-view']) {
      return (
        <div className="assessmentsNoAssessment__warningText">
          {props.t('No assessments')}
        </div>
      );
    }

    return (
      <div
        className={classnames('assessmentsNoAssessment__addAssessmentBtn', {
          'assessmentsNoAssessment__addAssessmentBtn--disabled':
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
          setAssessmentForm({ isOpen: true, initialData: null });
          TrackEvent('assessments', 'click', 'add form');
        }}
      >
        <div className="icon-add assessmentsNoAssessment__addAssessmentBtnIcon" />
        <div className="assessmentsNoAssessment__addAssessmentBtnLabel">
          {props.t('Add form')}
        </div>
      </div>
    );
  };

  return isTopLoaderShowed ? (
    getLoader()
  ) : (
    <div id="assessmentsListScrollableContent" className="assessmentsList">
      {!window.featureFlags['assessments-grid-view'] && (
        <AssessmentsHeader
          onClickAddAssessment={() =>
            setAssessmentForm({ isOpen: true, initialData: null })
          }
          assessmentTemplates={props.assessmentTemplates}
          onClickEditTemplates={() => setIsTemplateSidePanelOpen(true)}
          onApplyTemplateFilter={props.onApplyTemplateFilter}
          filteredTemplates={props.filteredTemplates}
        />
      )}

      <InfiniteScroll
        dataLength={props.assessments.length}
        next={() => {
          setIsLoadingByScroll(true);
          props.fetchAssessments();
        }}
        hasMore={!props.isFullyLoaded}
        loader={getLoader()}
        scrollableTarget="assessmentsListScrollableContent"
      >
        {props.assessments.length > 0 &&
          props.assessments.map((assessment, index) => (
            <div className="assessmentsList__row" key={assessment.id}>
              <AssessmentWidget
                viewType={props.viewType}
                assessment={assessment}
                selectedAthlete={props.selectedAthlete}
                onClickDeleteAssessment={props.onClickDeleteAssessment}
                deleteAssessmentItem={props.deleteAssessmentItem}
                onClickEditAssessment={() => {
                  setAssessmentForm({ isOpen: true, initialData: assessment });
                  setIsAssessmentFormVisible(true);
                }}
                saveAssessmentItem={props.saveAssessmentItem}
                saveAssessmentItemComments={props.saveAssessmentItemComments}
                saveMetricScores={props.saveMetricScores}
                onClickSaveAthletes={props.onClickSaveAthletes}
                onClickSaveTemplate={props.onClickSaveTemplate}
                onClickUpdateTemplate={props.onClickUpdateTemplate}
                fetchItemAnswers={props.fetchItemAnswers}
                users={props.users}
                organisationTrainingVariables={
                  props.organisationTrainingVariables
                }
                statusVariables={props.statusVariables}
                assessmentTemplates={props.assessmentTemplates}
                isFirstAssessment={index === 0}
                onClickSaveReordering={props.onClickSaveReordering}
                onErrorCalculatingStatusValues={
                  props.onErrorCalculatingStatusValues
                }
              />
            </div>
          ))}
      </InfiniteScroll>

      {props.isFullyLoaded && props.assessments.length === 0 && (
        <div className="assessmentsList__row">
          <div className="assessmentsNoAssessment">
            {props.filteredTemplates.length > 0
              ? props.t('No forms meet filter criteria')
              : getNoAssessmentContent()}
          </div>
        </div>
      )}

      {((!window.featureFlags['assessments-grid-view'] &&
        assessmentForm.isOpen) ||
        isAssessmentFormVisible) && (
        <AssessmentForm
          permissions={permissions}
          orgTimezone={orgTimezone}
          assessment={assessmentForm.initialData}
          assessmentTemplates={props.assessmentTemplates}
          turnaroundList={props.turnaroundList}
          onClickClose={() => {
            setAssessmentForm({ isOpen: false, initialData: null });
            setIsAssessmentFormVisible(false);
          }}
          onClickSubmit={(assessment) => {
            setAssessmentForm({ isOpen: false, initialData: null });
            setIsAssessmentFormVisible(false);
            props.onClickSaveAssessment(assessment);
          }}
        />
      )}

      {isTemplateSidePanelOpen && (
        <TemplatesSidePanel
          templates={props.assessmentTemplates}
          onClickClose={() => setIsTemplateSidePanelOpen(false)}
          onClickDeleteTemplate={props.onClickDeleteTemplate}
          onClickRenameTemplate={props.onClickRenameTemplate}
        />
      )}
    </div>
  );
};

export default AssessmentsList;
export const AssessmentsListTranslated = withNamespaces()(AssessmentsList);
