// @flow
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { Box, Button } from '@kitman/playbook/components';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import type { User } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import HeaderLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout';
import TextItem from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout/components/TextItem';
import BackLink from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout/components/BackLink';

import {
  getDateOrFallback,
  getCountryOrFallback,
} from '@kitman/modules/src/LeagueOperations/shared/utils';

import { USER_ENDPOINT_DATE_FORMAT } from '@kitman/modules/src/LeagueOperations/shared/consts';
import { buildHeaderAvatar } from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout/utils';
import getCurrentAge from '@kitman/common/src/utils/getCurrentAge';
import { onTogglePanel } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/disciplinaryIssueSlice';
import { getDisciplinePermissions } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import type { DisciplinePermissions } from '@kitman/modules/src/LeagueOperations/shared/types/permissions';

type Props = {
  user: User,
  isLoading: boolean,
  suspendAction: () => void,
};

const ProfileHeader = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const disciplinePermissions: DisciplinePermissions = useSelector(
    getDisciplinePermissions()
  );

  const handleOnToggle = () => {
    props.suspendAction();
    dispatch(onTogglePanel({ isOpen: true }));
  };

  const buildHeaderItems = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '40%',
          justifyContent: 'space-between',
        }}
      >
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
      </Box>
    );
  };

  const renderBackLink = () => {
    return (
      <HeaderLayout.BackBar>
        <BackLink />
      </HeaderLayout.BackBar>
    );
  };

  const renderContent = () => {
    if (props.isLoading) {
      return <HeaderLayout.Loading withAvatar withItems withTabs />;
    }

    return (
      <HeaderLayout withTabs>
        {renderBackLink()}
        <HeaderLayout.Content>
          {buildHeaderAvatar({
            name: props.user?.firstname,
            avatarUrl: props.user?.avatar_url,
          })}
          <HeaderLayout.MainContent>
            <HeaderLayout.TitleBar>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: 2,
                  width: '100%',
                }}
              >
                <HeaderLayout.Title>{`${props.user.firstname} ${props.user.lastname}`}</HeaderLayout.Title>
                {disciplinePermissions.canManageDiscipline && (
                  <Button color="primary" onClick={handleOnToggle}>
                    {props.t('Suspend')}
                  </Button>
                )}
              </Box>
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
