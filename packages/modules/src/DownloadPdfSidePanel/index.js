// @flow

import { useState } from 'react';
import { DownloadPdfSidePanelLayoutTranslated as DownloadPdfSidePanelLayout } from './src/components/DownloadPdfSidePanelLayout';

type DownloadPdfSidePanelProps = {
  isOpen: boolean,
  onClose: () => void,
  onConfirm: () => void,
  onCancel: () => void,
  headerEnabled: boolean,
  selfAssessmentEnabled: boolean,
  coachingCommentsEnabled: boolean,
  goalStatusEnabled: boolean,
  onHeaderChange: (checked: boolean) => void,
  onSelfAssessmentChange: (checked: boolean) => void,
  onCoachingCommentsChange: (checked: boolean) => void,
  onGoalStatusChange: (checked: boolean) => void,
};

const DownloadPdfSidePanel = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  headerEnabled,
  selfAssessmentEnabled,
  coachingCommentsEnabled,
  goalStatusEnabled,
  onHeaderChange,
  onSelfAssessmentChange,
  onCoachingCommentsChange,
  onGoalStatusChange,
}: DownloadPdfSidePanelProps) => {
  const [headerState, setHeaderState] = useState(headerEnabled);
  const [selfAssessmentState, setSelfAssessmentState] = useState(
    selfAssessmentEnabled
  );
  const [coachingCommentsState, setCoachingCommentsState] = useState(
    coachingCommentsEnabled
  );
  const [goalStatusState, setGoalStatusState] = useState(goalStatusEnabled);

  const handleHeaderChange = (checked: boolean) => {
    setHeaderState(checked);
    onHeaderChange(checked);
  };

  const handleSelfAssessmentChange = (checked: boolean) => {
    setSelfAssessmentState(checked);
    onSelfAssessmentChange(checked);
  };

  const handleCoachingCommentsChange = (checked: boolean) => {
    setCoachingCommentsState(checked);
    onCoachingCommentsChange(checked);
  };

  const handleGoalStatusChange = (checked: boolean) => {
    setGoalStatusState(checked);
    onGoalStatusChange(checked);
  };

  return (
    <DownloadPdfSidePanelLayout
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      onCancel={onCancel}
      headerEnabled={headerState}
      selfAssessmentEnabled={selfAssessmentState}
      coachingCommentsEnabled={coachingCommentsState}
      goalStatusEnabled={goalStatusState}
      onHeaderChange={handleHeaderChange}
      onSelfAssessmentChange={handleSelfAssessmentChange}
      onCoachingCommentsChange={handleCoachingCommentsChange}
      onGoalStatusChange={handleGoalStatusChange}
    />
  );
};

export default DownloadPdfSidePanel;
