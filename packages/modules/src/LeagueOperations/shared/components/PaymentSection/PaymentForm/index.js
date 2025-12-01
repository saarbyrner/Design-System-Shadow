// @flow
import { withNamespaces } from 'react-i18next';
import _intersection from 'lodash/intersection';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { colors } from '@kitman/common/src/variables';
import { add, remove } from '@kitman/modules/src/Toasts/toastsSlice';
import { TextButton, InputTextField, Modal } from '@kitman/components';
import { usePayRegistrationMutation } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationPaymentApi';
import type { ClubPayment } from '@kitman/modules/src/LeagueOperations/shared/types/payment';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { formatCurrency } from '../utils';

const styles = {
  paymentAmount: {
    display: 'grid',
    gridGap: '12px',
    gridTemplateColumns: '2fr 1fr 1fr',
    textAlign: 'right',
  },
  paymentSummaryHeader: {
    fontWeight: 600,
    color: `${colors.grey_200}`,
  },
  payBtn: {
    textAlign: 'right',
    marginTop: '8px',
  },
};

const PAYMENT_LOADING_TOAST_ID = 'PAYMENT_LOADING_TOAST';

type Props = {
  clubPayment: ClubPayment,
};

const PaymentForm = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [registrationAmount, setRegistrationAmount] = useState('0');
  const [revealValidationState, setRevealValidationState] = useState(false);

  const [payRegistration, { isPayRegistrationLoading }] =
    usePayRegistrationMutation();

  const getSubtotal = () => {
    const amount =
      registrationAmount.length > 0 ? parseInt(registrationAmount, 10) : 0;
    return props.clubPayment.price.user * amount;
  };

  const onConfirmPayment = () => {
    dispatch(
      add({
        id: PAYMENT_LOADING_TOAST_ID,
        status: 'LOADING',
        title: props.t('Payment processing'),
      })
    );
    setIsConfirmModalOpen(false);

    payRegistration(getSubtotal())
      .unwrap()
      .then(({ data }) => {
        if (data?.error) {
          dispatch(
            add({
              status: 'ERROR',
              title: data.error,
            })
          );
        } else {
          dispatch(
            add({
              status: 'SUCCESS',
              title: props.t('Payment successful'),
            })
          );
        }
      })
      .catch(() => {
        dispatch(
          add({
            status: 'ERROR',
            title: props.t('Payment failed'),
          })
        );
      })
      .then(() => {
        setRevealValidationState(false);
        setRegistrationAmount('0');
        dispatch(remove(PAYMENT_LOADING_TOAST_ID));
      });
  };

  const getConfirmModal = () => (
    <Modal
      width="small"
      isOpen={isConfirmModalOpen}
      onPressEscape={() => setIsConfirmModalOpen(false)}
      close={() => setIsConfirmModalOpen(false)}
    >
      <Modal.Header>
        <Modal.Title>{props.t('Confirm payment')}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        {props.t(
          'By clicking "Pay", I confirm that I authorise payment of {{amount}}',
          { amount: formatCurrency(getSubtotal()) }
        )}
      </Modal.Content>
      <Modal.Footer>
        <TextButton
          onClick={() => setIsConfirmModalOpen(false)}
          text={props.t('Cancel')}
          type="subtle"
          kitmanDesignSystem
        />
        <TextButton
          onClick={() => onConfirmPayment()}
          text={props.t('Pay')}
          type="primary"
          kitmanDesignSystem
        />
      </Modal.Footer>
    </Modal>
  );

  const onAmountChange = (value: string) => {
    setRevealValidationState(true);
    setRegistrationAmount(value);
  };

  const onAmountBlur = (value: string) => {
    if (value === '') setRegistrationAmount('0');
  };

  const isAmountInvalid = () => {
    const invalidChars = ['-', '.'];
    return (
      registrationAmount === '0' ||
      _intersection([...registrationAmount], invalidChars).length > 0
    );
  };

  return (
    <section data-testid="PaymentForm">
      <div css={styles.paymentAmount}>
        <div css={styles.paymentSummaryHeader}>
          {props.t('Price per registration')}
        </div>
        <div css={styles.paymentSummaryHeader}>{props.t('Quantity')}</div>
        <div css={styles.paymentSummaryHeader}>{props.t('Subtotal')}</div>
        <div>{formatCurrency(props.clubPayment.price.user)}</div>
        <div>
          <InputTextField
            value={registrationAmount}
            textAlign="right"
            inputType="number"
            onChange={(e) => onAmountChange(e.target.value)}
            onBlur={(e) => onAmountBlur(e.target.value)}
            invalid={revealValidationState && isAmountInvalid()}
            name="Amount"
            disabled={isPayRegistrationLoading}
            updatedValidationDesign
            kitmanDesignSystem
          />
        </div>
        <div data-testid="PaymentForm|Subtotal">
          {formatCurrency(getSubtotal())}
        </div>
      </div>
      <div css={styles.payBtn}>
        <TextButton
          text={props.t('Pay')}
          type="primary"
          onClick={() => setIsConfirmModalOpen(true)}
          isDisabled={isAmountInvalid()}
          kitmanDesignSystem
        />
      </div>
      {getConfirmModal()}
    </section>
  );
};

export default PaymentForm;
export const PaymentFormTranslated = withNamespaces()(PaymentForm);
