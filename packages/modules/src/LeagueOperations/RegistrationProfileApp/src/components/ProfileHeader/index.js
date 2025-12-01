// @flow
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { Box } from '@kitman/playbook/components';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { User } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import HeaderLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout';
import TextItem from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout/components/TextItem';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';

import {
  getDateOrFallback,
  getCountryOrFallback,
  checkUrlParams,
} from '@kitman/modules/src/LeagueOperations/shared/utils';

import { USER_ENDPOINT_DATE_FORMAT } from '@kitman/modules/src/LeagueOperations/shared/consts';
import {
  buildDivisionHeaderItem,
  buildBackBar,
  buildHeaderAvatar,
} from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout/utils';
import getCurrentAge from '@kitman/common/src/utils/getCurrentAge';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';

type Props = {
  user: User,
  isLoading: boolean,
};

const ProfileHeader = (props: I18nProps<Props>) => {
  const urlParams = useLocationSearch();
  const currentSquad = useSelector(getActiveSquad());

  const buildHeaderItems = () => {
    return (
      <>
        <TextItem
          primary="D.O.B."
          secondary={getDateOrFallback(
            props?.user?.date_of_birth,
            USER_ENDPOINT_DATE_FORMAT
          )}
        />
        <TextItem
          primary={props.t('Age')}
          secondary={getCurrentAge(props?.user?.date_of_birth)}
        />
        <TextItem
          primary={props.t('Country')}
          secondary={getCountryOrFallback(props?.user?.address)}
        />
        {window.featureFlags['league-ops-update-registration-status']
          ? buildDivisionHeaderItem({
              division: currentSquad.division[0],
              registrationStatus: props.user.registration_status?.status,
              registrationSystemStatus: props.user.registration_system_status,
            })
          : props.user.registrations.length > 0 &&
            props.user.registrations.map((registration) =>
              buildDivisionHeaderItem({
                division: registration.division,
                registrationStatus: registration.status,
                registrationSystemStatus:
                  registration?.registration_system_status,
              })
            )}
      </>
    );
  };

  const renderContent = () => {
    if (props.isLoading) {
      return <HeaderLayout.Loading withAvatar withItems withTabs />;
    }

    return (
      <HeaderLayout withTabs>
        {buildBackBar({ hasUrlParams: checkUrlParams(urlParams) })}
        <HeaderLayout.Content>
          {buildHeaderAvatar({
            name: props.user?.firstname,
            avatarUrl: props.user?.avatar_url,
          })}
          <HeaderLayout.MainContent>
            <HeaderLayout.TitleBar>
              <HeaderLayout.Title>{`${props.user.firstname} ${props.user.lastname}`}</HeaderLayout.Title>
            </HeaderLayout.TitleBar>
            <HeaderLayout.Items>{buildHeaderItems()}</HeaderLayout.Items>
          </HeaderLayout.MainContent>
        </HeaderLayout.Content>
      </HeaderLayout>
    );
  };

  return (
    <Box
      data-testid="profile-header"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {renderContent()}
    </Box>
  );
};

export const ProfileHeaderTranslated = withNamespaces()(ProfileHeader);
export default ProfileHeader;
