import {
  ClubPhysicianDMRRequiredRole,
  dmrEventStatusProgress,
  DmrStatuses,
} from '@kitman/modules/src/PlanningEvent/src/hooks/useUpdateDmrStatus';
import {
  validateRpe,
  getPrincipleNameWithItems,
  getDmrBannerChecks,
  checkIsDmrLocked,
  getTeamMatchDayCompletionStatus,
} from '..';

describe('validateRpe', () => {
  describe('when the rpe-0-12-w-fractions flag is on', () => {
    beforeEach(() => {
      window.setFlag('rpe-0-12-w-fractions', true);
    });

    afterEach(() => {
      window.setFlag('rpe-0-12-w-fractions', false);
    });

    it('returns a null error message and sets valid to true if the value is an empty string', () => {
      expect(validateRpe('')).toEqual({
        error: null,
        isValid: true,
      });
    });

    it('returns a null error message and sets valid to true if the value is undefined', () => {
      expect(validateRpe(undefined)).toEqual({
        error: null,
        isValid: true,
      });
    });

    it('returns the correct error message and sets valid to false if the value is less than 0', () => {
      expect(validateRpe(-1)).toEqual({
        error: 'RPE must be between 1 and 12 (inclusive)',
        isValid: false,
      });
    });

    it('returns the correct error message and sets valid to false if the value is more than 12', () => {
      expect(validateRpe(45)).toEqual({
        error: 'RPE must be between 1 and 12 (inclusive)',
        isValid: false,
      });
    });

    it('returns the correct error message and sets valid to false if the value has more than 1 decimal place', () => {
      expect(validateRpe(4.45)).toEqual({
        error: 'RPE must have only one decimal place',
        isValid: false,
      });
    });

    it('returns the null and sets valid to true if the value is valid', () => {
      expect(validateRpe(4)).toEqual({
        error: null,
        isValid: true,
      });
    });

    it('returns the null and sets valid to true if the value is a fraction and is valid', () => {
      expect(validateRpe(4.7)).toEqual({
        error: null,
        isValid: true,
      });
    });
  });

  describe('when the rpe-0-12-w-fractions-game flag is on', () => {
    beforeEach(() => {
      window.setFlag('rpe-0-12-w-fractions-game', true);
    });

    afterEach(() => {
      window.setFlag('rpe-0-12-w-fractions-game', false);
    });

    it('returns the correct error message and sets valid to false if the value is less than 0', () => {
      expect(validateRpe(-1)).toEqual({
        error: 'RPE must be between 1 and 12 (inclusive)',
        isValid: false,
      });
    });

    it('returns the correct error message and sets valid to false if the value is more than 12', () => {
      expect(validateRpe(45)).toEqual({
        error: 'RPE must be between 1 and 12 (inclusive)',
        isValid: false,
      });
    });

    it('returns the null and sets valid to true if the value is valid', () => {
      expect(validateRpe(4)).toEqual({
        error: null,
        isValid: true,
      });
    });

    it('returns the null and sets valid to true if the value is a fraction and is valid', () => {
      expect(validateRpe(4.7)).toEqual({
        error: null,
        isValid: true,
      });
    });
  });

  it('returns the correct error message and sets valid to false if the value is less than 0', () => {
    expect(validateRpe(-1)).toEqual({
      error: 'RPE must be between 1 and 10 (inclusive)',
      isValid: false,
    });
  });
  it('returns the correct error message and sets valid to false if the value is more than 10', () => {
    expect(validateRpe(34567)).toEqual({
      error: 'RPE must be between 1 and 10 (inclusive)',
      isValid: false,
    });
  });

  it('returns the correct error message and sets valid to false if the value is not an integer', () => {
    expect(validateRpe(4.8)).toEqual({
      error: 'RPE must be an integer',
      isValid: false,
    });
  });

  it('should return null for error and true for isValid if the value is valid', () => {
    expect(validateRpe(4)).toEqual({
      error: null,
      isValid: true,
    });
  });
});

describe('getPrincipleNameWithItems', () => {
  let mockedPrinciple;

  beforeEach(() => {
    mockedPrinciple = {
      id: 1,
      name: 'Catching skills',
      principle_categories: [
        {
          id: 1,
          name: 'Line-out',
        },
      ],
      phases: [
        {
          id: 1,
          name: 'Backline',
        },
      ],
      principle_types: [
        {
          id: 1,
          name: 'Technical',
        },
      ],
      squads: [],
    };
  });

  it('should return the expected string', () => {
    expect(getPrincipleNameWithItems(mockedPrinciple)).toEqual(
      'Catching skills (Line-out, Backline, Technical)'
    );
  });

  it('should return the expected string when there is no category', () => {
    mockedPrinciple.principle_categories = [];
    expect(getPrincipleNameWithItems(mockedPrinciple)).toEqual(
      'Catching skills (Backline, Technical)'
    );
  });

  it('should return the expected string when there is no phase', () => {
    mockedPrinciple.phases = [];
    expect(getPrincipleNameWithItems(mockedPrinciple)).toEqual(
      'Catching skills (Line-out, Technical)'
    );
  });

  it('should return the expected string when there are no category and phase', () => {
    mockedPrinciple.principle_categories = [];
    mockedPrinciple.phases = [];
    expect(getPrincipleNameWithItems(mockedPrinciple)).toEqual(
      'Catching skills (Technical)'
    );
  });
});

describe('getDmrBannerChecks', () => {
  const mockEvent = {
    id: 1,
    type: 'game_event',
    competition: {
      min_substitutes: 10,
      min_staffs: 5,
    },
    venue_type: { name: 'Home' },
    dmr: ['staff', 'lineup', 'players', 'subs', 'captain', 'physician'],
  };

  const mockActivities = [
    {
      id: 1,
      kind: 'formation_change',
      absolute_minute: 0,
      relation: { id: 1, number_of_players: 11 },
    },
  ];

  const mockPeriod = {
    id: 1,
    absolute_duration_start: 0,
    absolute_duration_end: 90,
  };

  it('returns the default dmr selected information checks for a game event', () => {
    expect(
      getDmrBannerChecks({
        event: mockEvent,
        gameActivities: mockActivities,
        eventPeriod: mockPeriod,
      })
    ).toEqual({
      complianceCheckValues: {
        isPhysicianEnabled: false,
        isCaptainEnabled: false,
        minNumberOfPlayersSelected: 11,
        minNumberOfStaff: 5,
        minNumberOfSubs: 10,
      },
      complianceValidationChecks: {
        captainAssigned: true,
        lineupDone: true,
        physicianSelected: true,
        playersSelected: true,
        staffSelected: true,
        subsSelected: true,
      },
    });
  });

  it('returns the dmr selected information checks with the physician rule for a game event', () => {
    expect(
      getDmrBannerChecks({
        event: {
          ...mockEvent,
          competition: {
            ...mockEvent.competition,
            required_designation_roles: [ClubPhysicianDMRRequiredRole],
          },
        },
        gameActivities: mockActivities,
        eventPeriod: mockPeriod,
      })
    ).toEqual({
      complianceCheckValues: {
        isPhysicianEnabled: true,
        isCaptainEnabled: false,
        minNumberOfPlayersSelected: 11,
        minNumberOfStaff: 5,
        minNumberOfSubs: 10,
      },
      complianceValidationChecks: {
        captainAssigned: true,
        lineupDone: true,
        physicianSelected: true,
        playersSelected: true,
        staffSelected: true,
        subsSelected: true,
      },
    });
  });

  it('returns the dmr selected information checks with the captain rule enabled for a game event', () => {
    expect(
      getDmrBannerChecks({
        event: {
          ...mockEvent,
          competition: {
            ...mockEvent.competition,
            show_captain: true,
          },
          dmr: ['captain', 'players', 'subs'],
        },
        gameActivities: mockActivities,
        eventPeriod: mockPeriod,
      })
    ).toEqual({
      complianceCheckValues: {
        isPhysicianEnabled: false,
        isCaptainEnabled: true,
        minNumberOfPlayersSelected: 11,
        minNumberOfStaff: 5,
        minNumberOfSubs: 10,
      },
      complianceValidationChecks: {
        captainAssigned: true,
        lineupDone: false,
        physicianSelected: false,
        playersSelected: true,
        staffSelected: false,
        subsSelected: true,
      },
    });
  });

  it('returns the dmr selected information checks for a session event', () => {
    expect(
      getDmrBannerChecks({
        event: { ...mockEvent, type: 'session_event' },
        gameActivities: mockActivities,
        eventPeriod: mockPeriod,
      })
    ).toEqual({
      complianceCheckValues: {
        isCaptainEnabled: false,
        isPhysicianEnabled: false,
        minNumberOfPlayersSelected: 11,
        minNumberOfStaff: null,
        minNumberOfSubs: null,
      },
      complianceValidationChecks: {
        captainAssigned: false,
        lineupDone: false,
        physicianSelected: false,
        playersSelected: false,
        staffSelected: false,
        subsSelected: false,
      },
    });
  });
});

describe('checkIsDmrLocked', () => {
  const mockEvent = {
    id: 1,
    type: 'game_event',
    game_participants_lock_time: '2020-09-18T10:28:52Z',
    league_setup: true,
  };

  it('returns locked if the current date is after the locked time', () => {
    expect(
      checkIsDmrLocked({
        event: mockEvent,
        isDmrClubUser: true,
        isEditPermsPresent: false,
      })
    ).toEqual(true);
  });

  it('returns unlocked if the current date is before the locked time', () => {
    Date.now = jest.fn(() => new Date('2020-08-18T10:28:52Z'));
    expect(
      checkIsDmrLocked({
        event: mockEvent,
        isDmrClubUser: true,
        isEditPermsPresent: false,
      })
    ).toEqual(false);
  });

  it('returns locked if the user isnt a club user and perms arent present', () => {
    expect(
      checkIsDmrLocked({
        event: mockEvent,
        isDmrClubUser: false,
        isEditPermsPresent: false,
      })
    ).toEqual(true);
  });

  it('returns unlocked if the user isnt a club user and perms are present', () => {
    expect(
      checkIsDmrLocked({
        event: mockEvent,
        isDmrClubUser: false,
        isEditPermsPresent: true,
      })
    ).toEqual(false);
  });
});

describe('getTeamMatchDayCompletionStatus', () => {
  describe('home team', () => {
    it('returns the appropriate status if the home dmr is complete and there are no competition configs set', () => {
      expect(
        getTeamMatchDayCompletionStatus({
          competitionConfig: {},
          dmrStatuses: [DmrStatuses.players, DmrStatuses.lineup],
          isHomeStatuses: true,
        })
      ).toEqual(dmrEventStatusProgress.complete);
    });
    it('returns the appropriate status if the home dmr is complete with full and partial config', () => {
      expect(
        getTeamMatchDayCompletionStatus({
          competitionConfig: {
            min_substitutes: 1,
            min_staffs: 1,
            show_captain: true,
            required_designation_roles: [ClubPhysicianDMRRequiredRole],
          },
          dmrStatuses: [
            DmrStatuses.players,
            DmrStatuses.captain,
            DmrStatuses.subs,
            DmrStatuses.lineup,
            DmrStatuses.staff,
            DmrStatuses.physician,
          ],
          isHomeStatuses: true,
        })
      ).toEqual(dmrEventStatusProgress.complete);

      expect(
        getTeamMatchDayCompletionStatus({
          competitionConfig: {
            min_substitutes: 1,
            min_staffs: 1,
          },
          dmrStatuses: [
            DmrStatuses.players,
            DmrStatuses.subs,
            DmrStatuses.lineup,
            DmrStatuses.staff,
          ],
          isHomeStatuses: true,
        })
      ).toEqual(dmrEventStatusProgress.complete);

      expect(
        getTeamMatchDayCompletionStatus({
          competitionConfig: {
            show_captain: true,
          },
          dmrStatuses: [
            DmrStatuses.players,
            DmrStatuses.captain,
            DmrStatuses.lineup,
          ],
          isHomeStatuses: true,
        })
      ).toEqual(dmrEventStatusProgress.complete);

      expect(
        getTeamMatchDayCompletionStatus({
          competitionConfig: {
            required_designation_roles: [ClubPhysicianDMRRequiredRole],
          },
          dmrStatuses: [
            DmrStatuses.players,
            DmrStatuses.physician,
            DmrStatuses.lineup,
          ],
          isHomeStatuses: true,
        })
      ).toEqual(dmrEventStatusProgress.complete);
    });

    it('returns the appropriate status if the home dmr is partial', () => {
      expect(
        getTeamMatchDayCompletionStatus({
          competitionConfig: {
            min_substitutes: 1,
            min_staffs: 1,
            show_captain: true,
            required_designation_roles: [ClubPhysicianDMRRequiredRole],
          },
          dmrStatuses: [
            DmrStatuses.players,
            DmrStatuses.subs,
            DmrStatuses.lineup,
            DmrStatuses.staff,
            DmrStatuses.physician,
          ],
          isHomeStatuses: true,
        })
      ).toEqual(dmrEventStatusProgress.partial);

      expect(
        getTeamMatchDayCompletionStatus({
          competitionConfig: {
            min_substitutes: 1,
            min_staffs: 1,
            show_captain: true,
            required_designation_roles: [ClubPhysicianDMRRequiredRole],
          },
          dmrStatuses: [
            DmrStatuses.players,
            DmrStatuses.captain,
            DmrStatuses.subs,
            DmrStatuses.lineup,
            DmrStatuses.staff,
          ],
          isHomeStatuses: true,
        })
      ).toEqual(dmrEventStatusProgress.partial);
    });
  });

  it('returns the appropriate status if the home dmr is incomplete', () => {
    expect(
      getTeamMatchDayCompletionStatus({
        dmrStatuses: [],
      })
    ).toEqual('');
  });
});
