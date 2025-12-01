import {
  ASSOCIATION_ORGANISATIONS,
  ASSOCIATION_SQUADS,
  ASSOCIATION_ATHLETES,
  ASSOCIATION_ORGANISATION_ATHLETES,
  ASSOCIATION_STAFF,
  ASSOCIATION_ORGANISATION_STAFF,
  ORGANISATION_ATHLETES,
  ORGANISATION_STAFF,
  ORGANISATION_SQUADS,
  ATHLETE_REGISTRATION,
  ATHLETE_SQUADS,
  STAFF_REGISTRATION,
  REQUIREMENTS,
  DISCIPLINE_ATHLETE,
  DISCIPLINE_USER,
} from '@kitman/modules/src/LeagueOperations/technicalDebt/grids/mlsNext/columnDefinitions';
import MLS_NEXT_GRIDS from '../mlsNext';
import MLS_GRIDS from '../mls';

import { USER_TYPES } from '../../../shared/consts';
import { parseLeagueOperationsGrids } from '..';

// TODO: remove this part when league-ops-discipline-area-v2 FF is removed
const getDisciplineColumns = (disciplineColumns) => {
  if (window.getFlag('league-ops-discipline-area-v2')) {
    return disciplineColumns.filter(
      (col) => col.headerName !== 'Suspended until'
    );
  }
  return disciplineColumns.filter((col) => col.headerName !== 'Suspended');
};
describe('parseLeagueOperationsGrids', () => {
  beforeEach(() => {
    // TODO: remove this when league-ops-discipline-area-v2 FF is removed
    window.getFlag = jest.fn().mockReturnValue(false);
  });
  describe('[USER_TYPE] ASSOCIATION_ADMIN', () => {
    // TODO: remove this when league-ops-discipline-area-v2 FF is removed
    const disciplineAthelete = getDisciplineColumns(DISCIPLINE_ATHLETE);
    const disciplineUser = getDisciplineColumns(DISCIPLINE_USER);

    const assertions = [
      { key: 'organisation', grid: ASSOCIATION_ORGANISATIONS },
      { key: 'squad', grid: ASSOCIATION_SQUADS },
      { key: 'athlete', grid: ASSOCIATION_ATHLETES },
      { key: 'organisation_athlete', grid: ASSOCIATION_ORGANISATION_ATHLETES },
      { key: 'staff', grid: ASSOCIATION_STAFF },
      { key: 'athlete_squad', grid: ATHLETE_SQUADS },
      { key: 'organisation_staff', grid: ASSOCIATION_ORGANISATION_STAFF },
      { key: 'athlete_registration', grid: ATHLETE_REGISTRATION },
      { key: 'staff_registration', grid: STAFF_REGISTRATION },
      { key: 'requirements', grid: REQUIREMENTS },
      { key: 'athlete_discipline', grid: disciplineAthelete },
      { key: 'user_discipline', grid: disciplineUser },
    ];
    assertions.forEach((assertion) => {
      it(`returns the correct columns for ${assertion.key}`, () => {
        expect(
          parseLeagueOperationsGrids({
            userType: USER_TYPES.ASSOCIATION_ADMIN,
            key: assertion.key,
            orgKey: 'MLS NEXT',
          })
        ).toEqual(assertion.grid);
      });
    });
  });
  describe('[USER_TYPE] ORGANISATION_ADMIN', () => {
    // TODO: remove this when league-ops-discipline-area-v2 FF is removed
    const disciplineAthelete = getDisciplineColumns(DISCIPLINE_ATHLETE);
    const disciplineUser = getDisciplineColumns(DISCIPLINE_USER);

    const assertions = [
      { key: 'squad', grid: ORGANISATION_SQUADS },
      { key: 'athlete', grid: ORGANISATION_ATHLETES },
      { key: 'staff', grid: ORGANISATION_STAFF },
      { key: 'athlete_squad', grid: ATHLETE_SQUADS },
      { key: 'athlete_registration', grid: ATHLETE_REGISTRATION },
      { key: 'staff_registration', grid: STAFF_REGISTRATION },
      { key: 'requirements', grid: REQUIREMENTS },
      { key: 'athlete_discipline', grid: disciplineAthelete },
      { key: 'user_discipline', grid: disciplineUser },
    ];
    assertions.forEach((assertion) => {
      it(`returns the correct columns for ${assertion.key}`, () => {
        expect(
          parseLeagueOperationsGrids({
            userType: USER_TYPES.ORGANISATION_ADMIN,
            key: assertion.key,
            orgKey: 'MLS NEXT',
          })
        ).toEqual(assertion.grid);
      });
    });
  });
  describe('[USER_TYPE] ATHLETE', () => {
    const assertions = [
      { key: 'athlete_registration', grid: ATHLETE_REGISTRATION },
      { key: 'squad', grid: ATHLETE_SQUADS },
      { key: 'requirements', grid: REQUIREMENTS },
    ];
    assertions.forEach((assertion) => {
      it(`returns the correct columns for ${assertion.key}`, () => {
        expect(
          parseLeagueOperationsGrids({
            userType: USER_TYPES.ATHLETE,
            key: assertion.key,
            orgKey: 'MLS NEXT',
          })
        ).toEqual(assertion.grid);
      });
    });
  });
  describe('[USER_TYPE] STAFF', () => {
    const assertions = [
      { key: 'staff_registration', grid: STAFF_REGISTRATION },
      { key: 'squad', grid: ATHLETE_SQUADS },
      { key: 'requirements', grid: REQUIREMENTS },
    ];
    assertions.forEach((assertion) => {
      it(`returns the correct columns for ${assertion.key}`, () => {
        expect(
          parseLeagueOperationsGrids({
            userType: USER_TYPES.STAFF,
            key: assertion.key,
            orgKey: 'MLS NEXT',
          })
        ).toEqual(assertion.grid);
      });
    });
  });

  describe('parseLeagueOperationsGrid when FF is TRUE', () => {
    beforeEach(() => {
      window.featureFlags['league-ops-update-registration-status'] = true;
      window.getFlag = jest.fn().mockReturnValue(true); // TODO: remove
    });

    it('should return columns from getGridSet when org is KLS Next', () => {
      const result = parseLeagueOperationsGrids({
        key: 'athlete',
        userType: 'association_admin',
        orgKey: 'KLS Next',
      });
      expect(result).toEqual(MLS_NEXT_GRIDS.association_admin.athlete);
    });
    // TODO: remove this when league-ops-discipline-area-v2 FF is removed
    it('should return columns from discipline when org is MLS Next and FF is ON', () => {
      const result = parseLeagueOperationsGrids({
        key: 'athlete_discipline',
        userType: USER_TYPES.ASSOCIATION_ADMIN,
        orgKey: 'MLS NEXT',
      });
      const disciplineAthelete = getDisciplineColumns(DISCIPLINE_ATHLETE);
      expect(result).toEqual(disciplineAthelete);
    });
    // TODO: remove this when league-ops-discipline-area-v2 FF is removed
    it('should return columns from user discipline when org is MLS Next and FF is ON', () => {
      const result = parseLeagueOperationsGrids({
        key: 'user_discipline',
        userType: USER_TYPES.ASSOCIATION_ADMIN,
        orgKey: 'MLS NEXT',
      });
      const disciplineUser = getDisciplineColumns(DISCIPLINE_USER);
      expect(result).toEqual(disciplineUser);
    });

    it('should return columns from getGridSet When org is MLS', () => {
      const result = parseLeagueOperationsGrids({
        key: 'staff',
        userType: 'association_admin',
        orgKey: 'MLS',
      });
      expect(result).toEqual(MLS_GRIDS.association_admin.staff);
    });

    it('returns default grid, when orgkey does not match corresponding grid configurations', () => {
      const result = parseLeagueOperationsGrids({
        key: 'athlete',
        userType: 'association_admin',
        orgKey: 'Premier League',
      });

      expect(result).toEqual(MLS_NEXT_GRIDS.association_admin.athlete);
    });
  });
});
