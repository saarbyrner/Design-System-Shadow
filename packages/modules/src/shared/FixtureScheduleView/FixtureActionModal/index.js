// @flow

import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { colors } from '@kitman/common/src/variables';
import { Modal, TextButton } from '@kitman/components';

import { menuButtonTypes, fixtureReports } from '../helpers';
import type { FixtureReportTypes } from '../types';

type Props = {
  reportType?: FixtureReportTypes,
  actionType: string,
  actionId: number,
  clearActionInfo: () => void,
  onFixtureMenuActionSuccess: () => void,
  isLoading: boolean,
};
const FixtureActionModal = (props: I18nProps<Props>) => {
  const getReportName = () => {
    switch (props.reportType) {
      case fixtureReports.matchMonitorReport:
        return 'match monitor report';
      default:
        return 'match report';
    }
  };

  const getReportUser = () => {
    switch (props.reportType) {
      case fixtureReports.matchMonitorReport:
        return 'match monitors';
      default:
        return 'officials';
    }
  };

  const getFixtureActionTitle = () => {
    const reportName = getReportName();
    switch (props.actionType) {
      case menuButtonTypes.unlock:
        return props.t('Unlock {{reportName}}?', { reportName });
      case menuButtonTypes.reset:
        return props.t('Reset {{reportName}}?', { reportName });
      case menuButtonTypes.withdraw:
        return props.t('Withdraw request?');
      default:
        return '';
    }
  };

  const getFixtureActionContent = () => {
    const reportUser = getReportUser();

    switch (props.actionType) {
      case menuButtonTypes.unlock:
        return props.t(
          'If you unlock this report, the report will become editable for the assigned {{reportUser}}.',
          { reportUser }
        );
      case menuButtonTypes.reset:
        return props.t(
          'If you reset this report, the report will revert to its initial default state.'
        );
      case menuButtonTypes.withdraw:
        return props.t(
          'This removes the scout from the game, revoking their access. To regain access, another request must be submitted.'
        );
      default:
        return '';
    }
  };

  const getFixtureActionConfirmText = () => {
    switch (props.actionType) {
      case menuButtonTypes.unlock:
        return props.t('Unlock');
      case menuButtonTypes.reset:
        return props.t('Reset');
      default:
        return props.t('Submit');
    }
  };

  const getFixtureActionConfirmStyle = () => {
    if (props.actionType === menuButtonTypes.withdraw) {
      return {
        backgroundColor: colors.grey_200,
        color: colors.white,
      };
    }

    return {
      backgroundColor: colors.red_100,
      color: colors.white,
    };
  };

  return (
    <Modal
      isOpen={props.actionId !== null}
      onPressEscape={props.clearActionInfo}
      close={props.clearActionInfo}
      overlapSidePanel
    >
      <Modal.Header>
        <Modal.Title>{getFixtureActionTitle()}</Modal.Title>
      </Modal.Header>
      <Modal.Content>{getFixtureActionContent()}</Modal.Content>
      <Modal.Footer>
        <TextButton
          text={props.t('Cancel')}
          onClick={props.clearActionInfo}
          kitmanDesignSystem
          type="textOnly"
        />
        <TextButton
          text={getFixtureActionConfirmText()}
          onClick={props.onFixtureMenuActionSuccess}
          kitmanDesignSystem
          isLoading={props.isLoading}
          style={getFixtureActionConfirmStyle()}
        />
      </Modal.Footer>
    </Modal>
  );
};

export const FixtureActionModalTranslated =
  withNamespaces()(FixtureActionModal);
export default FixtureActionModal;
