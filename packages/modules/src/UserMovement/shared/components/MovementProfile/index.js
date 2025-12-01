// @flow
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import type { Node } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  getId,
  getUserProfile,
} from '@kitman/modules/src/UserMovement/shared/redux/selectors/movementProfileSelectors';
import type { UserData } from '@kitman/services/src/services/fetchUserData';
import {
  Card,
  CardHeader,
  Avatar,
  CardContent,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@kitman/playbook/components';

import type { MovementOrganisation } from '../../types';

type Props = {
  exclude_org: ?boolean,
};

type ProfileItem = {
  label: string,
  value: string | number,
};

const MovementProfile = (props: I18nProps<Props>): Node => {
  const userId = useSelector(getId);
  const profile: UserData = useSelector(
    getUserProfile({
      userId,
      include_athlete: true,
    })
  );

  const profileItems: Array<ProfileItem> = useMemo(() => {
    return [
      {
        label: props.t('DOB'),
        value: profile?.athlete?.date_of_birth || 'N/A',
      },
      {
        label: props.t('Email'),
        value: profile?.email || 'N/A',
      },
      {
        label: props.t('Athlete ID'),
        value: profile?.athlete?.id || 'N/A',
      },
    ];
  }, [props, profile]);

  const renderProfileItems = (): Node => {
    return profileItems.map((item) => {
      return (
        <Stack direction="row" spacing={2} key={item.label}>
          <Typography
            variant="body2"
            sx={{ color: 'text.primary', fontWeight: 'bold' }}
          >
            {item.label}:
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            {item.value}
          </Typography>
        </Stack>
      );
    });
  };

  const renderOrganisationItem = (org: MovementOrganisation): Node => {
    return (
      <ListItem disablePadding key={org.id}>
        <ListItemAvatar>
          <Avatar
            sx={{ width: 27, height: 27 }}
            alt={org?.name || ''}
            src={org?.logo_full_path || null}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              {org?.name}
            </Typography>
          }
        />
      </ListItem>
    );
  };

  const renderCurrentOrganisations = () => {
    if (props.exclude_org) return null;

    return (
      <Stack direction="column">
        <Typography
          variant="body2"
          sx={{ color: 'text.primary', fontWeight: 'bold' }}
        >
          {props.t('Assigned To')}:
        </Typography>
        <List>
          {profile?.athlete?.organisations?.map(renderOrganisationItem)}
        </List>
      </Stack>
    );
  };

  return (
    <Card elevation={0}>
      <CardHeader
        sx={{ p: 0, color: 'text.primary' }}
        avatar={
          <Avatar
            alt={profile?.fullname || ''}
            src={profile?.athlete?.avatar_url || null}
          />
        }
        title={profile?.fullname || ''}
      />
      <CardContent
        sx={{ p: 0, pt: 2, gap: 1, display: 'flex', flexDirection: 'column' }}
      >
        {renderProfileItems()}
        {renderCurrentOrganisations()}
      </CardContent>
    </Card>
  );
};

export const MovementProfileTranslated = withNamespaces()(MovementProfile);
export default MovementProfile;
