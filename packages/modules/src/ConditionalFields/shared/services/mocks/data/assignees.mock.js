// @flow
import type { Assignees } from '../../../types';

export const data: Assignees = {
  screening_ruleset: {
    archive_reason: null,
    archived_at: null,
    archived_by: null,
    creator: {
      id: 176973,
      fullname: 'Sergiu Tripon-admin-eu',
    },
    current_version: 3,
    id: 1,
    name: 'Ruleset 1',
    owner_id: 6,
    owner_type: 'Organisation',
    versions: [
      {
        id: 3,
        name: 'Ruleset 1',
        version: 3,
        creator: {
          id: 176973,
          fullname: 'Sergiu Tripon-admin-eu',
        },
        published_at: '2023-11-16T10:56:24Z',
        publisher: {
          id: 176973,
          fullname: 'Sergiu Tripon-admin-eu',
        },
        assigned_organisations: [],
        assigned_squads: [],
      },
      {
        id: 2,
        name: 'Ruleset 1',
        version: 2,
        creator: {
          id: 176973,
          fullname: 'Sergiu Tripon-admin-eu',
        },
        published_at: '2023-11-15T10:56:24Z',
        publisher: {
          id: 176973,
          fullname: 'Sergiu Tripon-admin-eu',
        },
        assigned_organisations: [],
        assigned_squads: [],
      },
      {
        id: 1,
        name: 'Ruleset 1',
        version: 1,
        creator: {
          id: 176973,
          fullname: 'Sergiu Tripon-admin-eu',
        },
        published_at: '2023-11-13T00:00:00Z',
        publisher: {
          id: 176973,
          fullname: 'Sergiu Tripon-admin-eu',
        },
        assigned_organisations: [],
        assigned_squads: [],
      },
    ],
  },
  screening_ruleset_version_id: 1,
  assignments: [
    {
      id: null,
      assignee_type: 'squad',
      assignee: {
        id: 8,
        name: 'International Squad',
        sport: null,
        active_athlete_count: 110,
      },
      assigned_organisations: [],
      assigned_squads: [],
    },
    {
      id: 123,
      active: true,
      assignee_type: 'squad',
      assignee: {
        id: 73,
        name: 'Academy Squad',
        sport: null,
        active_athlete_count: 34,
      },
      creator: {
        id: 176973,
        fullname: 'Sergiu Tripon-admin-eu',
      },
      created_at: '2023-11-20T11:32:00Z',
      updated_at: '2023-11-20T13:23:00Z',
    },
    {
      id: null,
      assignee_type: 'squad',
      assignee: {
        id: 262,
        name: 'Test',
        sport: null,
        active_athlete_count: 12,
      },
    },
    {
      id: null,
      assignee_type: 'squad',
      assignee: {
        id: 744,
        name: 'Kitman Labs - Staff',
        sport: null,
        active_athlete_count: 40,
      },
    },
    {
      id: null,
      assignee_type: 'squad',
      assignee: {
        id: 1038,
        name: 'Technical Director',
        sport: null,
        active_athlete_count: 10,
      },
    },
    {
      id: null,
      assignee_type: 'squad',
      assignee: {
        id: 1238,
        name: 'Kitman Test Squad',
        sport: null,
        active_athlete_count: 2,
      },
    },
    {
      id: null,
      assignee_type: 'squad',
      assignee: {
        id: 1374,
        name: 'Player view',
        sport: null,
        active_athlete_count: 7,
      },
    },
    {
      id: null,
      assignee_type: 'squad',
      assignee: {
        id: 2188,
        name: 'Test RPE Issue',
        sport: null,
        active_athlete_count: 0,
      },
    },
    {
      id: null,
      assignee_type: 'squad',
      assignee: {
        id: 2431,
        name: 'team_1',
        sport: null,
        active_athlete_count: 4,
      },
    },
    {
      id: null,
      assignee_type: 'squad',
      assignee: {
        id: 2432,
        name: 'team_2',
        sport: null,
        active_athlete_count: 5,
      },
    },
    {
      id: null,
      assignee_type: 'squad',
      assignee: {
        id: 2731,
        name: '1st team',
        sport: null,
        active_athlete_count: 6,
      },
    },
    {
      id: null,
      assignee_type: 'squad',
      assignee: {
        id: 2732,
        name: 'Academy team',
        sport: null,
        active_athlete_count: 4,
      },
    },
    {
      id: null,
      assignee_type: 'squad',
      assignee: {
        id: 6407,
        name: 'rob test',
        sport: null,
        active_athlete_count: 0,
      },
    },
  ],
};

export const response = {
  data,
};
