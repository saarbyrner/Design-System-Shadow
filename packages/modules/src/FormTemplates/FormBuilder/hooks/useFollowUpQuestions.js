// @flow

import { useState } from 'react';

import i18n from '@kitman/common/src/utils/i18n';

import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';

import { FollowUpQuestionsModalTranslated as FollowUpQuestionsModal } from '@kitman/modules/src/FormTemplates/FormBuilder/components/FollowUpQuestionsModal';

type UseFollowUpQuestions = {
  initialQuestionElement: HumanInputFormElement,
};

export const getFollowUpQuestionsModalText = () => ({
  addFollowUpQuestionsTitle: i18n.t('Add follow up questions'),
  editChildFollowUpQuestionTitle: i18n.t('Edit follow up question'),
  actions: {
    ctaButton: i18n.t('Save'),
    cancelButton: i18n.t('Cancel'),
  },
});

const useFollowUpQuestions = ({
  initialQuestionElement,
}: UseFollowUpQuestions) => {
  const [
    shouldOpenFollowUpQuestionsModal,
    setShouldOpenFollowUpQuestionsModal,
  ] = useState(false);

  const [
    shouldOpenEditChildFollowUpQuestionModal,
    setShouldOpenEditChildFollowUpQuestionModal,
  ] = useState(false);

  const closeModal = () => {
    setShouldOpenFollowUpQuestionsModal(false);
    setShouldOpenEditChildFollowUpQuestionModal(false);
  };
  const openModal = () => setShouldOpenFollowUpQuestionsModal(true);
  const openEditChildFollowUpQuestionModal = () =>
    setShouldOpenEditChildFollowUpQuestionModal(true);

  const modalTranslations = getFollowUpQuestionsModalText();

  const followUpQuestionsModal = (
    <FollowUpQuestionsModal
      initialQuestionElement={initialQuestionElement}
      isModalOpen={shouldOpenFollowUpQuestionsModal}
      isEditChildFollowUpQuestionModalOpen={
        shouldOpenEditChildFollowUpQuestionModal
      }
      translatedText={modalTranslations}
      onCancel={closeModal}
      onClose={closeModal}
    />
  );

  return {
    openModal,
    followUpQuestionsModal,
    shouldOpenFollowUpQuestionsModal,
    shouldOpenEditChildFollowUpQuestionModal,
    openEditChildFollowUpQuestionModal,
  };
};

export default useFollowUpQuestions;
