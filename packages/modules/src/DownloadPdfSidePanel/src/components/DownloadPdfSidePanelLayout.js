// @flow
import { withNamespaces } from 'react-i18next';
import { Box, Typography } from '@kitman/playbook/components';
import { TextButton } from '@kitman/components';
import SlidingPanel from '@kitman/components/src/SlidingPanelResponsive';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import ContentSelector from './ContentSelector';
import style from '../style';

type LayoutProps = {
  isOpen: boolean,
  onClose: () => void,
  onConfirm: () => void,
  onCancel: () => void,
  headerEnabled: boolean,
  onHeaderChange: (checked: boolean) => void,
  selfAssessmentEnabled: boolean,
  onSelfAssessmentChange: (checked: boolean) => void,
  coachingCommentsEnabled: boolean,
  onCoachingCommentsChange: (checked: boolean) => void,
  goalStatusEnabled: boolean,
  onGoalStatusChange: (checked: boolean) => void,
};

const DownloadPdfSidePanelLayout = (props: I18nProps<LayoutProps>) => {
  const {
    isOpen,
    onClose,
    onConfirm,
    onCancel,
    headerEnabled,
    onHeaderChange,
    selfAssessmentEnabled,
    onSelfAssessmentChange,
    coachingCommentsEnabled,
    onCoachingCommentsChange,
    goalStatusEnabled,
    onGoalStatusChange,
  } = props;
  return (
    <SlidingPanel
      isOpen={isOpen}
      onClose={onClose}
      width={450}
      title={props.t('Download')}
      css={{
        position: 'relative',
        right: 'unset',
        top: 'unset',
        minHeight: 'unset',
        height: 'auto',
        boxShadow: 'none',
      }}
    >
      <SlidingPanel.Content>
        <Box>
          <Typography variant="h6">{props.t('Download Options')}</Typography>
          <ContentSelector
            headerEnabled={headerEnabled}
            onHeaderChange={onHeaderChange}
            selfAssessmentEnabled={selfAssessmentEnabled}
            onSelfAssessmentChange={onSelfAssessmentChange}
            coachingCommentsEnabled={coachingCommentsEnabled}
            onCoachingCommentsChange={onCoachingCommentsChange}
            goalStatusEnabled={goalStatusEnabled}
            onGoalStatusChange={onGoalStatusChange}
          />
        </Box>
        <div
          css={style.actionButtons}
          data-testid="DownloadPdfSidePanel|ActionButtons"
        >
          <TextButton
            onClick={onCancel}
            text={props.t('Cancel')}
            type="secondary"
            kitmanDesignSystem
          />
          <TextButton
            onClick={onConfirm}
            text={props.t('Download')}
            type="primary"
            kitmanDesignSystem
          />
        </div>
      </SlidingPanel.Content>
    </SlidingPanel>
  );
};

export const DownloadPdfSidePanelLayoutTranslated = withNamespaces()(
  DownloadPdfSidePanelLayout
);
export default DownloadPdfSidePanelLayoutTranslated;
