// @flow
import { useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { Modal, AppStatus, TextButton } from '@kitman/components';

import { add, remove } from '@kitman/modules/src/Toasts/toastsSlice';

import {
  useFetchRepayFormQuery,
  useStorePaymentMethodMutation,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationPaymentApi';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  isOpen: boolean,
  onClose: Function,
};

const STORE_PAYMENT_METHOD_TOAST_ID = 'STORE_PAYMENT_METHOD_TOAST';

const AddPaymentMethodModal = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const {
    data: repayForm,
    error: fetchRepayFormError,
    isFetching: fetchRepayFormFetching,
    refetch: refetchRepayForm,
  } = useFetchRepayFormQuery();
  const [storePaymentMethod] = useStorePaymentMethodMutation();

  useEffect(() => {
    if (props.isOpen) refetchRepayForm();
  }, [props.isOpen]);

  const listenForRepayMessage = (event) => {
    const formURL = new URL(repayForm.form_url);
    if (event.origin !== formURL.origin) return;

    /*
     * Repay sends either PAYMENT_SUCCESS or PAYMENT_ERROR once the payment is done
     * as documented in https://docs.google.com/document/d/11lm4WoPNN1X6Mt0uFIpM7GSOZTaZZ9tR
     */
    if (event.data === 'PAYMENT_SUCCESS') {
      dispatch(
        add({
          id: STORE_PAYMENT_METHOD_TOAST_ID,
          status: 'LOADING',
          title: props.t('Storing payment method'),
        })
      );

      storePaymentMethod({
        formId: repayForm.checkout_form_id,
        customerId: repayForm.customer_id,
      })
        .unwrap()
        .then(() => {
          dispatch(
            add({
              status: 'SUCCESS',
              title: props.t('Payment method stored'),
            })
          );
        })
        .catch(() => {
          dispatch(
            add({
              status: 'ERROR',
              title: props.t('Storing payment method failed'),
            })
          );
        })
        .then(() => {
          dispatch(remove(STORE_PAYMENT_METHOD_TOAST_ID));
        });
    }
  };

  useEffect(() => {
    window.addEventListener('message', listenForRepayMessage);

    return () => window.removeEventListener('message', listenForRepayMessage);
  });

  if (fetchRepayFormFetching)
    return <AppStatus status="loading" message={props.t('Loading')} />;
  if (fetchRepayFormError) return <AppStatus status="error" isEmbed />;

  return (
    <Modal
      width="large"
      isOpen
      onPressEscape={() => props.onClose()}
      close={() => props.onClose()}
      additionalStyle={css`
        min-height: 80vh !important;
      `}
    >
      <Modal.Header>
        <Modal.Title>{props.t('Add a card')}</Modal.Title>
      </Modal.Header>
      <Modal.Content
        additionalStyle={css`
          display: flex;
        `}
      >
        <iframe
          title="Repay - Store Payment Method"
          css={css`
            width: 100%;
            border: 1px solid ${colors.s14};
          `}
          src={repayForm?.form_url}
        />
      </Modal.Content>
      <Modal.Footer>
        <TextButton
          onClick={() => props.onClose()}
          text={props.t('Close')}
          type="subtle"
          kitmanDesignSystem
        />
      </Modal.Footer>
    </Modal>
  );
};

export default AddPaymentMethodModal;
export const AddPaymentMethodModalTranslated = withNamespaces()(
  AddPaymentMethodModal
);
