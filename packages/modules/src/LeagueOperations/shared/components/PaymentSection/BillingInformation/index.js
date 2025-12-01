// @flow
import { useState } from 'react';
import { colors } from '@kitman/common/src/variables';
import { TextButton, Modal, IconButton } from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { add, remove } from '@kitman/modules/src/Toasts/toastsSlice';
import { useDeletePaymentMethodMutation } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationPaymentApi';
import CardLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/CardLayout';
import type { ClubPayment } from '@kitman/modules/src/LeagueOperations/shared/types/payment';
import type { I18nProps } from '@kitman/common/src/types/i18n';

const styles = {
  detailsItem: {
    color: colors.grey_200,
    flex: 1,
    marginTop: '8px',
    minWidth: '50%',
    maxWidth: '50%',
    b: {
      fontWeight: 600,
    },
  },
  position: {
    position: 'relative',
  },
};

type Item = {
  label: string,
  value: string | number | null,
};

type Props = {
  paymentMethod: $PropertyType<ClubPayment, 'payment_method'>,
};

const PAYMENT_METHOD_DELETION_TOAST_ID = 'PAYMENT_METHOD_DELETION_TOAST';

const BillingInformation = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const { permissions } = usePermissions();
  const [isConfirmDeletionModalOpen, setIsConfirmDeletionModalOpen] =
    useState(false);
  const [deletePaymentMethod, { isLoading: isDeletePaymentMethodLoading }] =
    useDeletePaymentMethodMutation();

  const billingDetails = [
    {
      label: props.t('Name'),
      value: props.paymentMethod.full_name,
    },
    {
      label: props.t('Card No'),
      value: `*************${props.paymentMethod.last_four_digits}`,
    },
    {
      label: props.t('Security Code'),
      value: '***',
    },
    {
      label: props.t('Exp. Date'),
      value: props.paymentMethod.exp_date,
    },
  ];

  const onConfirmDeletion = () => {
    dispatch(
      add({
        id: PAYMENT_METHOD_DELETION_TOAST_ID,
        status: 'LOADING',
        title: 'Payment method deletion in progress',
      })
    );
    setIsConfirmDeletionModalOpen(false);

    deletePaymentMethod()
      .unwrap()
      .then(() => {
        dispatch(
          add({
            status: 'SUCCESS',
            title: props.t('Payment method deleted'),
          })
        );
        setIsConfirmDeletionModalOpen(false);
      })
      .catch(() => {
        dispatch(
          add({
            status: 'ERROR',
            title: props.t('Payment method deletion failed'),
          })
        );
      })
      .then(() => {
        dispatch(remove(PAYMENT_METHOD_DELETION_TOAST_ID));
      });
  };

  const getItemList = (items: Array<Item>) => (
    <CardLayout.Flex>
      {items.map((item) => {
        return (
          <span css={styles.detailsItem} key={item.label}>
            <b>{item.label}:</b> {item.value}
          </span>
        );
      })}
    </CardLayout.Flex>
  );

  return (
    <section css={styles.position} data-testid="BillingInformation">
      <CardLayout.Header>
        <CardLayout.Title title={props.t('Billing information')} />
        {permissions.registration.payment.canEdit && (
          <CardLayout.Actions>
            <IconButton
              icon="icon-bin"
              onClick={() => setIsConfirmDeletionModalOpen(true)}
              isDisabled={isDeletePaymentMethodLoading}
              isDarkIcon
              isSmall
            />
          </CardLayout.Actions>
        )}
      </CardLayout.Header>

      {getItemList(billingDetails)}

      <Modal
        width="small"
        isOpen={isConfirmDeletionModalOpen}
        onPressEscape={() => setIsConfirmDeletionModalOpen(false)}
        close={() => setIsConfirmDeletionModalOpen(false)}
      >
        <Modal.Header>
          <Modal.Title>{props.t('Delete card details')}</Modal.Title>
        </Modal.Header>
        <Modal.Content>
          {props.t(
            'Do you wish to remove the card details? You will no longer be able to pay for players or staff'
          )}
        </Modal.Content>
        <Modal.Footer>
          <TextButton
            onClick={() => setIsConfirmDeletionModalOpen(false)}
            text={props.t('Cancel')}
            type="subtle"
            kitmanDesignSystem
          />
          <TextButton
            onClick={() => onConfirmDeletion()}
            text={props.t('Delete')}
            type="primaryDestruct"
            kitmanDesignSystem
          />
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default BillingInformation;
export const BillingInformationTranslated =
  withNamespaces()(BillingInformation);
