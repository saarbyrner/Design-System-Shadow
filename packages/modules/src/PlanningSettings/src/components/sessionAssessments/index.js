// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { HeaderTranslated as Header } from '../header';
import { TableTranslated as Table } from './table';
import type { AssessmentTemplate, SessionAssessment } from '../../../types';

type Props = {
  assessmentTemplates: Array<AssessmentTemplate>,
  editedSessionAssessments: { number: Array<number> },
  getSessionTemplates: Function,
  onCancelEdit: Function,
  onClickSave: Function,
  onSelectAssessmentType: Function,
  requestStatus: 'LOADING' | 'FAILURE' | 'SUCCESS',
  sessionAssessments: Array<SessionAssessment>,
};

const SessionAssessments = (props: I18nProps<Props>) => {
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    props.getSessionTemplates();
  }, []);

  switch (props.requestStatus) {
    case 'FAILURE':
      return <AppStatus status="error" isEmbed />;
    case 'LOADING':
      return <DelayedLoadingFeedback />;
    case 'SUCCESS':
      return (
        <>
          <Header
            isEditMode={isEditMode}
            onCancelEdit={() => {
              setIsEditMode(false);
              props.onCancelEdit();
            }}
            onClickEditValues={() => setIsEditMode(!isEditMode)}
            onClickSave={() => {
              setIsEditMode(false);
              props.onClickSave();
            }}
            title={props.t('Session Types')}
          />
          <Table
            assessmentTemplates={props.assessmentTemplates}
            editedSessionAssessments={props.editedSessionAssessments}
            isEditMode={isEditMode}
            onSelectAssessmentType={(
              sessionTypeId,
              selectedAssessmentTypeArray
            ) => {
              props.onSelectAssessmentType(
                sessionTypeId,
                selectedAssessmentTypeArray
              );
            }}
            sessionAssessments={props.sessionAssessments}
          />
        </>
      );
    default:
      return null;
  }
};

export const SessionAssessmentsTranslated =
  withNamespaces()(SessionAssessments);
export default SessionAssessments;
