// @flow
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import type {
  UserType,
  Organisation,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { PreferenceType } from '@kitman/common/src/contexts/PreferenceContext/types';
import { Grid } from '@kitman/playbook/components';
import { getOrganisation } from '@kitman/common/src/redux/global/selectors';
import type { RegistrationPermissions } from '@kitman/modules/src/LeagueOperations/shared/types/permissions';
import {
  getRegistrationPermissions,
  getRegistrationUserTypeFactory,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import { buildAddress } from '@kitman/modules/src/LeagueOperations/shared/utils/index';
import {
  FALLBACK_DASH,
  USER_TYPES,
} from '@kitman/modules/src/LeagueOperations/shared/consts';
import ColumnLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/ColumnLayout';
import DetailsCardLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/DetailCardLayout';
import PaymentSection from '../../PaymentSection/PaymentSection';

type Props = {
  preferences?: PreferenceType,
};

const TabClubDetails = (props: I18nProps<Props>) => {
  const organisation: Organisation = useSelector(getOrganisation());
  const registrationPermissions: RegistrationPermissions = useSelector(
    getRegistrationPermissions()
  );

  const currentUserType: UserType = useSelector(
    getRegistrationUserTypeFactory()
  );
  const items = [
    { label: props.t('Name'), value: organisation?.name },
    {
      label: props.t('Address'),
      value: organisation?.address
        ? buildAddress(organisation.address)
        : FALLBACK_DASH,
    },
  ];

  const canRenderPaymentInformation =
    window.featureFlags['league-ops-payments-registration'] &&
    props.preferences?.registration_payments_display &&
    currentUserType === USER_TYPES.ORGANISATION_ADMIN &&
    registrationPermissions.payment.canView;

  return (
    <ColumnLayout sx={{ p: 2 }}>
      <ColumnLayout.Body>
        <ColumnLayout.Column
          sx={{ md: canRenderPaymentInformation ? 8 : 12, sm: 12 }}
        >
          <DetailsCardLayout>
            <DetailsCardLayout.Title>
              {props.t('Club details')}
            </DetailsCardLayout.Title>
            <Grid container spacing={2}>
              {items.map((item) => (
                <DetailsCardLayout.Item
                  key={item.label}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </Grid>
          </DetailsCardLayout>
        </ColumnLayout.Column>
        {canRenderPaymentInformation && (
          <ColumnLayout.Column sx={{ md: 4, sm: 12 }}>
            <PaymentSection />
          </ColumnLayout.Column>
        )}
      </ColumnLayout.Body>
    </ColumnLayout>
  );
};

export default TabClubDetails;

export const TabClubDetailsTranslated = withNamespaces()(TabClubDetails);
