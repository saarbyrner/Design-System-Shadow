// @flow
import { css } from '@emotion/react';

import { useFetchClubPaymentQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationPaymentApi';
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import _isEmpty from 'lodash/isEmpty';

import CardLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/CardLayout';
import { PaymentInformationTranslated as PaymentInformation } from '../PaymentInformation';
import { PaymentFormTranslated as PaymentForm } from '../PaymentForm';
import { BillingInformationTranslated as BillingInformation } from '../BillingInformation';

const styles = {
  container: css`
    display: flex;
    width: 100%;
    flex-direction: column;
    height: auto;
  `,
};

const PaymentSection = () => {
  const { permissions } = usePermissions();
  const {
    data: clubPayment,
    error: isFetchClubPaymentError,
    isLoading: isFetchClubPaymentLoading,
  } = useFetchClubPaymentQuery();

  if (isFetchClubPaymentLoading) return <DelayedLoadingFeedback />;
  if (isFetchClubPaymentError) return <AppStatus status="error" isEmbed />;

  return (
    <CardLayout>
      <div css={styles.container}>
        <PaymentInformation clubPayment={clubPayment} />

        {!_isEmpty(clubPayment.payment_method) && (
          <>
            <CardLayout.Divider />
            <BillingInformation paymentMethod={clubPayment.payment_method} />

            {permissions.registration.payment.canCreate && (
              <>
                <CardLayout.Divider />
                <PaymentForm clubPayment={clubPayment} />
              </>
            )}
          </>
        )}
      </div>
    </CardLayout>
  );
};

export default PaymentSection;
