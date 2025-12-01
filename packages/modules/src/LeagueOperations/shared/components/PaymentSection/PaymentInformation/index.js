// @flow
import { useState } from 'react';
import { TextButton } from '@kitman/components';

import { withNamespaces } from 'react-i18next';
import _isEmpty from 'lodash/isEmpty';

import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type {
  ClubPayment,
  Item,
} from '@kitman/modules/src/LeagueOperations/shared/types/payment';
import CardLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/CardLayout';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { AddPaymentMethodModalTranslated as AddPaymentMethodModal } from '../AddPaymentMethodModal';
import { formatCurrency, getPaymentDetails } from '../utils';
import styles from './styles';

type Props = {
  clubPayment: ClubPayment,
};

const PaymentInformation = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);

  const paymentDetails = [
    {
      label: props.t('Season'),
      value: props.clubPayment.season,
    },
    {
      label: props.t('Registrations'),
      value: props.clubPayment.count.registration,
    },
    {
      label: props.t('Price'),
      value: formatCurrency(props.clubPayment.price.user),
    },
    {
      label: props.t('Total Registrations Paid'),
      value: props.clubPayment.count.registered,
    },
    {
      label: props.t('Amount Paid'),
      value: formatCurrency(props.clubPayment.balance.paid),
    },
    {
      label: props.t('Wallet'),
      value: formatCurrency(props.clubPayment.balance.wallet),
    },
    {
      label: props.t('Unpaid'),
      value: formatCurrency(props.clubPayment.balance.unpaid),
    },
  ];

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

  const shouldShowAddCardButton = () =>
    _isEmpty(props.clubPayment.payment_method) &&
    permissions.registration.payment.canEdit;

  return (
    <section data-testid="PaymentInformation">
      <CardLayout.Header>
        <CardLayout.Title title={props.t('Payment')} />

        {shouldShowAddCardButton() && (
          <CardLayout.Actions>
            <TextButton
              text={props.t('Add a card')}
              type="secondary"
              onClick={() => setIsAddCardOpen(true)}
              kitmanDesignSystem
            />
          </CardLayout.Actions>
        )}
      </CardLayout.Header>
      {window.featureFlags['league-ops-registration-module-v2']
        ? getPaymentDetails(paymentDetails)
        : getItemList(paymentDetails)}

      {isAddCardOpen && (
        <AddPaymentMethodModal
          isOpen={isAddCardOpen}
          onClose={() => setIsAddCardOpen(false)}
        />
      )}
    </section>
  );
};

export default PaymentInformation;
export const PaymentInformationTranslated =
  withNamespaces()(PaymentInformation);
