// @flow
import { Typography } from '@kitman/playbook/components';
import CardLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/CardLayout';
import type { Item } from '@kitman/modules/src/LeagueOperations/shared/types/payment';
import {
  WALLET,
  CLUB_WALLET,
  PAYMENT_DETAILS_LABEL,
  FALLBACK_DASH,
} from '@kitman/modules/src/LeagueOperations/shared/consts';
import styles from './PaymentInformation/styles';

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

export const getWalletValue = (details: Array<Item>) => {
  const clubWallet = details.find((detail) => detail.label === WALLET);

  const walletDetails = {
    label: CLUB_WALLET.label,
    value: clubWallet ? clubWallet.value : FALLBACK_DASH,
  };

  return walletDetails;
};

export const getPaymentDetails = (details: Array<Item>) => {
  const mappedPaymentDetails = Object.keys(PAYMENT_DETAILS_LABEL).map(
    (label) => ({
      label: PAYMENT_DETAILS_LABEL[label],
      value:
        details.find((detail) => detail.label === label)?.value ||
        FALLBACK_DASH,
    })
  );

  const walletValue = getWalletValue(details);

  return (
    <>
      <Typography variant="h5" sx={{ flexGrow: 1, marginTop: 3 }}>
        {`${walletValue.label}`}: {walletValue.value}
      </Typography>
      <CardLayout.Flex>
        {mappedPaymentDetails.map((item) => {
          return (
            <span
              css={styles.detailsItem}
              key={item.label}
              data-testid={item.label}
            >
              <b>{item.label}:</b> {item.value}
            </span>
          );
        })}
      </CardLayout.Flex>
    </>
  );
};
