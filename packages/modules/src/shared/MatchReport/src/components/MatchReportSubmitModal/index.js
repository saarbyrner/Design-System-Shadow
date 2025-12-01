// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { Modal, TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  showSaveReportModal: boolean,
  finalSubmitMode: boolean,
  saveStatus: string,
  handleOnClose: () => void,
  handleOnSubmit: () => Promise<void>,
};

const MatchReportSubmitModal = (props: I18nProps<Props>) => {
  const submissionDescriptionText = props.finalSubmitMode
    ? props.t(
        'Once this report has been submitted, only league admins will have the ability to make changes.'
      )
    : props.t(
        'Any saved changes will be visible by the league admins and all officials assigned to the report.'
      );

  return (
    <Modal
      isOpen={props.showSaveReportModal}
      onPressEscape={props.handleOnClose}
    >
      <Modal.Header>
        <Modal.Title>
          {props.finalSubmitMode
            ? props.t('Submit Report')
            : props.t('Save Report')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Content>{submissionDescriptionText}</Modal.Content>
      <Modal.Footer>
        <TextButton
          text={props.t('Cancel')}
          onClick={props.handleOnClose}
          isDisabled={props.saveStatus === 'PENDING'}
          kitmanDesignSystem
        />
        <TextButton
          text={props.finalSubmitMode ? props.t('Submit') : props.t('Save')}
          type="primary"
          onClick={props.handleOnSubmit}
          isLoading={props.saveStatus === 'PENDING'}
          kitmanDesignSystem
        />
      </Modal.Footer>
    </Modal>
  );
};

export const MatchReportSubmitModalTranslated: ComponentType<Props> =
  withNamespaces()(MatchReportSubmitModal);
export default MatchReportSubmitModal;
