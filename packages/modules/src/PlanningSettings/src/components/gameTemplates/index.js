// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { EditorTranslated as Editor } from './editor';
import { HeaderTranslated as Header } from '../header';
import type { AssessmentTemplate } from '../../../types';

type Props = {
  assessmentTemplates: Array<AssessmentTemplate>,
  editedGameTemplates: ?Array<number>,
  getGameTemplates: Function,
  onCancelEdit: Function,
  onClickSave: Function,
  onSelectAssessmentType: Function,
  requestStatus: 'LOADING' | 'FAILURE' | 'SUCCESS',
  gameTemplates: Array<number>,
};

const GameTemplates = (props: I18nProps<Props>) => {
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    props.getGameTemplates();
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
            title={props.t('Games')}
          />
          <Editor
            assessmentTemplates={props.assessmentTemplates}
            editedGameTemplates={props.editedGameTemplates}
            isEditMode={isEditMode}
            onSelectAssessmentType={(selectedAssessmentTypeArray) => {
              props.onSelectAssessmentType(selectedAssessmentTypeArray);
            }}
            gameTemplates={props.gameTemplates}
          />
        </>
      );
    default:
      return null;
  }
};

export const GameTemplatesTranslated = withNamespaces()(GameTemplates);
export default GameTemplates;
