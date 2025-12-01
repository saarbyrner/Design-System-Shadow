// @flow
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { Box } from '@kitman/playbook/components';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';

import type { User } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import HeaderLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout';
import {
  buildDivisionHeaderItem,
  buildBackBar,
  buildHeaderAvatar,
} from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout/utils';
import {
  checkUrlParams,
  getCountryOrFallback,
  getDateOrFallback,
} from '@kitman/modules/src/LeagueOperations/shared/utils';
import { getRequirementById } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';

import getCurrentAge from '@kitman/common/src/utils/getCurrentAge';
import TextItem from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout/components/TextItem';
import AvatarItem from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout/components/AvatarItem';
import { USER_ENDPOINT_DATE_FORMAT } from '@kitman/modules/src/LeagueOperations/shared/consts';
import RequirementsActions from '../RequirementsActions';

type Props = {
  user: User,
  isLoading: boolean,
};

const RequirementsHeader = ({ user, t, isLoading }: I18nProps<Props>) => {
  const urlParams = useLocationSearch();
  const currentRequirement = useSelector(getRequirementById());

  const buildHeaderItems = () => {
    const shouldRenderDivision = user && !!currentRequirement;
    const userOrganisation = user?.organisations?.[0];

    return (
      <>
        <TextItem
          primary="D.O.B."
          secondary={getDateOrFallback(
            user?.date_of_birth,
            USER_ENDPOINT_DATE_FORMAT
          )}
        />
        <TextItem
          primary={t('Age')}
          secondary={getCurrentAge(user?.date_of_birth)}
        />
        <TextItem
          primary={t('Country')}
          secondary={getCountryOrFallback(user?.address)}
        />
        {userOrganisation && (
          <AvatarItem
            primary="Club"
            secondary={userOrganisation.name}
            src={userOrganisation.logo_full_path}
          />
        )}
        {shouldRenderDivision &&
          buildDivisionHeaderItem({
            division: currentRequirement.division,
            registrationStatus: currentRequirement.status,
            registrationSystemStatus:
              currentRequirement.registration_system_status,
          })}
      </>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return <HeaderLayout.Loading withAvatar withItems withTabs />;
    }

    return (
      <HeaderLayout withTabs>
        {buildBackBar({ hasUrlParams: checkUrlParams(urlParams) })}
        <HeaderLayout.Content>
          {buildHeaderAvatar({
            name: user?.firstname,
            avatarUrl: user?.avatar_url,
          })}
          <HeaderLayout.MainContent>
            <HeaderLayout.TitleBar>
              <HeaderLayout.Title>{`${user?.firstname} ${user?.lastname}`}</HeaderLayout.Title>
              <HeaderLayout.Actions>
                <RequirementsActions
                  user={user}
                  requirementId={
                    currentRequirement?.registration_requirement?.id
                  }
                />
              </HeaderLayout.Actions>
            </HeaderLayout.TitleBar>
            <HeaderLayout.Items>{buildHeaderItems()}</HeaderLayout.Items>
          </HeaderLayout.MainContent>
        </HeaderLayout.Content>
      </HeaderLayout>
    );
  };

  return (
    <Box
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

export const ProfileHeaderTranslated = withNamespaces()(RequirementsHeader);
export default RequirementsHeader;
