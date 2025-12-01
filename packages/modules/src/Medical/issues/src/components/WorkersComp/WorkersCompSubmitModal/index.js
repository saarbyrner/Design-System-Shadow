// @flow
import { useState } from 'react';
import { Modal, TextButton, AppStatus } from '@kitman/components';
import { submitWorkersComp } from '@kitman/services';
import { css } from '@emotion/react';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  closeWorkersCompSubmitModal,
  openWorkersCompSidePanel,
} from '../../../../../shared/redux/actions';
import { useIssue } from '../../../../../shared/contexts/IssueContext';

type Props = {};

const WorkersCompSubmitModal = (props: I18nProps<Props>) => {
  const { issue, updateIssue } = useIssue();
  const dispatch = useDispatch();
  const [submitRequestStatus, setSubmitRequestStatus] = useState(null);
  const { isOpen: isModalOpen, formState: modalFormState } = useSelector(
    (state) => state.addWorkersCompSidePanel.submitModal
  );

  const handleCancel = () => {
    dispatch(closeWorkersCompSubmitModal());
    dispatch(openWorkersCompSidePanel());
  };

  return (
    <Modal
      isOpen={isModalOpen}
      width="medium"
      onPressEscape={() => {
        handleCancel();
      }}
    >
      <Modal.Header>
        <Modal.Title>
          {window.getFlag('pm-mls-emr-demo-froi')
            ? props.t('Submit FROI form')
            : props.t("Submit workers' comp form")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <p>
          {window.getFlag('pm-mls-emr-demo-froi')
            ? props.t(
                'By clicking the submit button, you will send the FROI form. Please make sure you have accurately filled in and completed everything in the form before submitting.'
              )
            : props.t(
                'By clicking the submit button, you will send the workers comp form to the insurance company. Please make sure you have accurately filled in and completed everything in the form before submitting.'
              )}
        </p>
      </Modal.Content>
      <Modal.Footer>
        <div
          css={css`
            display: flex;
            gap: 16px;
          `}
        >
          <TextButton
            text={props.t('Cancel')}
            type="textOnly"
            kitmanDesignSystem
            onClick={() => {
              handleCancel();
            }}
          />
          <TextButton
            text={props.t('Submit')}
            type="primary"
            kitmanDesignSystem
            isLoading={submitRequestStatus === 'PENDING'}
            onClick={() => {
              setSubmitRequestStatus('PENDING');
              submitWorkersComp(modalFormState)
                .then((data) => {
                  updateIssue({
                    ...issue,
                    workers_comp: {
                      ...data.workers_comp,
                      claim_number: data.claimNumber,
                    },
                  });
                  setSubmitRequestStatus('SUCCESS');
                  dispatch(closeWorkersCompSubmitModal());
                })
                .catch((err) => {
                  setSubmitRequestStatus('FAILURE');
                  console.error(err.responseText);
                });
            }}
          />
          {submitRequestStatus === 'FAILURE' && <AppStatus status="error" />}
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export const WorkersCompSubmitModalTranslated = withNamespaces()(
  WorkersCompSubmitModal
);
export default WorkersCompSubmitModal;
