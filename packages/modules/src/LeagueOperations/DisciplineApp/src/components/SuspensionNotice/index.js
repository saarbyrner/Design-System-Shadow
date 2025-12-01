/* eslint-disable camelcase */
// @flow
import { Box, Typography, List, ListItem } from '@kitman/playbook/components';
import i18n from '@kitman/common/src/utils/i18n';
import moment from 'moment';
import type {
  NextGameDisciplineIssueResponse,
  NextGameDisciplineIssue,
} from '@kitman/modules/src/LeagueOperations/shared/services/fetchNextGameDisciplineIssue';
import type {
  DisciplineProfile,
  DisciplineOrganisation,
} from '@kitman/modules/src/LeagueOperations/shared/types/discipline';

type SuspensionNoticeType = {
  profile: DisciplineProfile,
  numberOfGames: number,
  startDateFormatted: string,
  games: NextGameDisciplineIssueResponse,
};

const renderOppositionTeam = (
  organisations: Array<DisciplineOrganisation>,
  game: NextGameDisciplineIssue
) => {
  // Get the opposition team for a given game, this function determines which team is the opponent
  // based on the game data and the user's organisation
  const getOppositionTeam = () => {
    const orgIds = organisations?.map((org) => org.id);
    const { squad, opponent_squad } = game;

    const isSquadOpposition = squad && !orgIds?.includes(squad?.owner_id);
    const isOpponentSquadOpposition =
      opponent_squad && !orgIds?.includes(opponent_squad?.owner_id);

    if (isSquadOpposition && !isOpponentSquadOpposition) {
      return squad;
    }
    if (isOpponentSquadOpposition && !isSquadOpposition) {
      return opponent_squad;
    }
    // Fallback
    return opponent_squad;
  };

  const oppositionTeam = getOppositionTeam();
  return (
    <Typography variant="body2">
      vs {oppositionTeam.owner_name} ({oppositionTeam.name}) -{' '}
      {moment(game.start_date).format('MMMM DD, YYYY')}
    </Typography>
  );
};

export const OppositionList = ({
  organisations,
  games,
}: {
  organisations: Array<DisciplineOrganisation>,
  games: Array<NextGameDisciplineIssue>,
}) => (
  <>
    {games.map((game) => (
      <ListItem key={game.id} sx={{ p: 0, display: 'list-item' }}>
        {renderOppositionTeam(organisations, game)}
      </ListItem>
    ))}
  </>
);

const SuspensionNotice = ({
  profile,
  games,
  numberOfGames,
  startDateFormatted,
}: SuspensionNoticeType) => {
  const body1Text = i18n.t(
    '{{name}} will be suspended for {{numberOfGames}} games starting {{startDateFormatted}}. The games are:',
    { name: profile.name, numberOfGames, startDateFormatted }
  );

  return (
    <Box>
      <Typography variant="body1" gutterBottom>
        {body1Text}
      </Typography>

      <List sx={{ listStyleType: 'disc', pl: 4 }}>
        <OppositionList organisations={profile.organisations} games={games} />
      </List>

      <Typography variant="body1">
        {i18n.t(
          'Suspensions shift to the next available game if postponed/canceled. The user is ineligible for all games (any age group) until the suspension is fully served.'
        )}
      </Typography>
    </Box>
  );
};

export default SuspensionNotice;
