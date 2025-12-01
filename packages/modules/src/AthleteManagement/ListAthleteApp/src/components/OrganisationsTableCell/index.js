// @flow
import {
  Avatar,
  Tooltip,
  AvatarGroup,
} from '@kitman/playbook/components/index';

import { cellStyle } from '@kitman/modules/src/LeagueOperations/technicalDebt/components/CommonGridStyle/index';
import type { MovementOrganisation } from '@kitman/modules/src/UserMovement/shared/types/index';

type Props = {
  organisations: Array<MovementOrganisation>,
};

const OrganisationsTableCell = (props: Props) => {
  const renderAthleteOrganisations = () => {
    return props.organisations.map((org) => {
      return (
        <Tooltip title={org.name} key={org.id}>
          <Avatar
            src={org.logo_full_path}
            variant="square"
            sx={{
              height: '32px',
              width: '32px',
              marginRight: '20px',
              '&:first-of-type': {
                marginRight: '0px',
              },
            }}
          />
        </Tooltip>
      );
    });
  };

  return (
    props.organisations.length > 0 && (
      <div css={cellStyle.avatarCell}>
        <AvatarGroup max={5} data-testid="AssignedTo|Avatars">
          {renderAthleteOrganisations()}
        </AvatarGroup>
      </div>
    )
  );
};

export default OrganisationsTableCell;
