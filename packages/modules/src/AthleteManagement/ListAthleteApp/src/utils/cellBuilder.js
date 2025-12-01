// @flow
import moment from 'moment';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import type { Node } from 'react';
import { Chip, Tooltip } from '@kitman/playbook/components';
import {
  TextCell,
  AvatarCell,
} from '@kitman/modules/src/LeagueOperations/technicalDebt/components/Cells';
import type { Organisation } from '@kitman/services/src/services/getOrganisation';

import { cellStyle } from '@kitman/modules/src/LeagueOperations/technicalDebt/components/CommonGridStyle';
import OrganisationsTableCell from '../components/OrganisationsTableCell';
import type { SearchAthleteProfile } from '../../../../UserMovement/shared/types';

const careerStatusColour = {
  Assigned: 'success',
  Retired: 'error',
  Released: 'warning',
};

const buildCellContent = (
  { row_key: rowKey }: { row_key: string },
  athlete: SearchAthleteProfile,
  currentOrganisation: ?Organisation
): Node | Array<Node> => {
  const isInCurrentOrg = athlete?.organisations
    .map((org) => org?.id)
    .includes(currentOrganisation?.id);

  const status = {
    available: 'Available',
    unavailable: 'Unavailable',
  };

  const matchCaseAvailable = new RegExp(`^${status.available}`);
  const chipLabel =
    athlete?.athlete_game_status &&
    matchCaseAvailable.test(athlete.athlete_game_status)
      ? status.available
      : status.unavailable;

  switch (rowKey) {
    case 'name':
      if (isInCurrentOrg) {
        return (
          <AvatarCell
            text={athlete.name}
            avatar_url={athlete.avatar}
            href={`/settings/athletes/${athlete.id}/edit`}
          />
        );
      }
      return <AvatarCell text={athlete.name} avatar_url={athlete.avatar} />;
    case 'assigned_to':
      return <OrganisationsTableCell organisations={athlete.organisations} />;
    case 'email':
      return <TextCell text={athlete.email} />;
    case 'date_of_birth':
      return <TextCell text={athlete.date_of_birth} />;
    case 'id':
      return <TextCell text={athlete.id} />;
    case 'username':
      return <TextCell text={athlete.username} />;
    case 'position':
      return <TextCell text={athlete.position} />;
    case 'career_status':
      if (window.featureFlags['league-ops-player-movement-trade']) {
        // TODO: Using hardcode values until athlete career status is setup in BE, need to write test for this later
        return (
          <Chip
            size="small"
            label="Assigned"
            color={careerStatusColour.Assigned}
          />
        );
      }
      return <TextCell text="N/A" />;
    case 'athlete_game_status':
      if (athlete?.athlete_game_status) {
        return (
          <Tooltip
            title={
              <span style={{ whiteSpace: 'pre-line' }}>
                {athlete?.athlete_game_status}
              </span>
            }
            placement="bottom"
          >
            <Chip
              color={chipLabel === status.available ? 'success' : 'error'}
              label={chipLabel}
              size="small"
            />
          </Tooltip>
        );
      }
      return <span css={cellStyle.textCell}>{athlete[rowKey]}</span>;
    case 'squads':
      return <TextCell text={athlete.squads} />;
    case 'creation_date':
      return (
        <TextCell
          text={formatStandard({
            date: moment(athlete.created),
            displayLongDate: true,
          })}
        />
      );
    default:
      return <span css={cellStyle.textCell}>{athlete[rowKey]}</span>;
  }
};

export default buildCellContent;
