import { getEventName, getOrgTeamName, getOpponentName } from '../workload';

describe('workload', () => {
  describe('getEventName', () => {
    it.each([
      {
        description: 'returns the correct name when the session is a game',
        input: {
          id: '37198',
          type: 'game_event',
          duration: 80,
          local_timezone: 'Europe/Dublin',
          start_date: '2020-12-31T12:03:00+00:00',
          score: 2,
          opponent_score: 3,
          opponent_team: {
            id: 1,
            name: 'Cork',
          },
          venue_type: {
            id: 1,
            name: 'Home',
          },
          competition: {
            id: 1,
            name: 'Premier league',
          },
        },
        expected: 'Cork (Home), Premier league (2-3)',
      },
      {
        description: 'returns the correct name when the score is 0 - 0',
        input: {
          id: '37198',
          type: 'game_event',
          duration: 80,
          local_timezone: 'Europe/Dublin',
          start_date: '2020-12-31T12:03:00+00:00',
          score: 0,
          opponent_score: 0,
          opponent_team: {
            id: 1,
            name: 'Cork',
          },
          venue_type: {
            id: 1,
            name: 'Home',
          },
          competition: {
            id: 1,
            name: 'Premier league',
          },
        },
        expected: 'Cork (Home), Premier league (0-0)',
      },
      {
        description:
          'returns the correct name when the session is a training session',
        input: {
          id: '454565',
          type: 'session_event',
          session_type: { id: 1, name: 'Speed' },
          duration: 30,
          local_timezone: 'Europe/Berlin',
          start_date: '2020-12-19T17:00:00+00:00',
        },
        expected: 'Speed (Dec 19, 2020)',
      },
      {
        description:
          'returns the correct name when the training session has custom name',
        input: {
          id: '454565',
          type: 'session_event',
          name: 'Upper Body',
          session_type: { id: 1, name: 'Speed' },
          duration: 30,
          local_timezone: 'Europe/Berlin',
          start_date: '2020-12-19T17:00:00+00:00',
        },
        expected: 'Upper Body — Speed (Dec 19, 2020)',
      },
    ])('$description', ({ input, expected }) =>
      expect(getEventName(input)).toEqual(expected)
    );
  });

  describe('getOrgTeamName', () => {
    it('should return the correct name when the it is a league event name', () => {
      const orgName = getOrgTeamName({
        squadName: 'Test Squad',
        organisationTeamName: 'Liverpool',
        organisationOwnerName: 'Liverpool FC',
        isLeague: true,
      });

      expect(orgName).toEqual('Test Squad Liverpool FC');
    });

    it('should return the correct name when the it is a league event and no squad is provided', () => {
      const orgName = getOrgTeamName({
        squadName: '',
        organisationTeamName: 'Liverpool',
        organisationOwnerName: '',
        isLeague: true,
      });

      expect(orgName).toEqual('Liverpool');
    });

    it('should return the correct name when it is a normal game and the team is provided', () => {
      const orgName = getOrgTeamName({
        squadName: '',
        organisationTeamName: 'Liverpool',
        organisationOwnerName: '',
        isLeague: false,
      });

      expect(orgName).toEqual('Liverpool');
    });

    it('should return the correct name when it is a normal game and the squad is provided', () => {
      const orgName = getOrgTeamName({
        squadName: 'Test Squad',
        organisationTeamName: '',
        organisationOwnerName: '',
        isLeague: false,
      });

      expect(orgName).toEqual('Test Squad');
    });
  });

  describe('getOpponentName', () => {
    const opponentSquad = { name: 'Squad', owner_name: 'Owner' };
    const opponentTeam = { name: 'Team' };

    it('should return the correct name when opponentSquad is null', () => {
      const opponentName = getOpponentName({
        opponent_squad: null,
        opponent_team: opponentTeam,
      });

      expect(opponentName).toEqual(opponentTeam.name);
    });
    it('should return the correct name when opponentTeam is null', () => {
      const opponentName = getOpponentName({
        opponent_squad: opponentSquad,
        opponent_team: null,
      });

      expect(opponentName).toEqual(
        `${opponentSquad.name} ${opponentSquad.owner_name}`
      );
    });
  });
});
