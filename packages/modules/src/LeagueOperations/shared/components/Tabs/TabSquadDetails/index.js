// @flow
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { Squad } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Grid } from '@kitman/playbook/components';
import { getSquad } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationSquadSelectors';

import { FALLBACK_DASH } from '@kitman/modules/src/LeagueOperations/shared/consts';
import ColumnLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/ColumnLayout';
import DetailsCardLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/DetailCardLayout';

const TabSquadDetails = (props: I18nProps<{}>) => {
  const squad: Squad | null = useSelector(getSquad);

  const items = [
    { label: props.t('Name'), value: squad?.name },
    {
      label: props.t('Address'),
      value: squad?.address
        ? Object.values(squad.address).join(', ')
        : FALLBACK_DASH,
    },
  ];

  return (
    <ColumnLayout sx={{ p: 2 }}>
      <ColumnLayout.Body>
        <ColumnLayout.Column sx={{ md: 12, sm: 12 }}>
          <DetailsCardLayout>
            <DetailsCardLayout.Title>
              {props.t('Team details')}
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
      </ColumnLayout.Body>
    </ColumnLayout>
  );
};

export default TabSquadDetails;

export const TabSquadDetailsTranslated = withNamespaces()(TabSquadDetails);
