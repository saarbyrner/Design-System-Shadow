import { data as mockDashboardGroups } from '@kitman/services/src/mocks/handlers/analysis/getDashboardGroups';
import {
  analysisMenuItems,
  formsMenuItems,
  settingsMenuItems,
  workloadsMenuItems,
  metricDashboardMenuItems,
  athletesMenuItems,
  mediaMenuItems,
} from '../secondaryMenuItems';

import { analysisMenuItemsArrayPositions } from '../../consts';

describe('secondaryMenuItems', () => {
  describe('/reviews', () => {
    afterEach(() => {
      window.featureFlags['tso-forms-reviews'] = false;
    });

    it('returns formsMenuItems with reviews - false', () => {
      window.featureFlags['tso-forms-reviews'] = false;
      const items = formsMenuItems('reviews', false, {
        canViewTSOReviews: false,
      });

      expect(items[3].id).toEqual('reviews');
      expect(items[3].href).toEqual('/reviews');
      expect(items[3].title).toEqual('Reviews');
      expect(items[3].allowed).toEqual(false);
    });

    it('returns formsMenuItems with /reviews - true', () => {
      window.featureFlags['tso-forms-reviews'] = true;
      const items = formsMenuItems('/reviews', false, {
        canViewTSOReviews: true,
      });

      expect(items[3].id).toEqual('reviews');
      expect(items[3].href).toEqual('/reviews');
      expect(items[3].title).toEqual('Reviews');
      expect(items[3].allowed).toEqual(true);
    });
  });

  describe('/growth_and_maturation', () => {
    const path = 'growth_and_maturation';

    afterEach(() => {
      window.setFlag('growth-and-maturation-area', false);
      window.setFlag('performance-optimisation-imports', false);
    });

    it('returns formsMenuItems with growth_and_maturation - false', () => {
      window.setFlag('growth-and-maturation-area', false);
      window.setFlag('performance-optimisation-imports', false);
      const items = formsMenuItems(path, false, {});

      expect(items[4].id).toEqual('growth_and_maturation');
      expect(items[4].href).toEqual('/growth_and_maturation');
      expect(items[4].title).toEqual('Growth and maturation');
      expect(items[4].allowed).toEqual(false);
    });

    it('returns formsMenuItems with /growth_and_maturation - true', () => {
      window.setFlag('growth-and-maturation-area', true);
      window.setFlag('performance-optimisation-imports', true);
      const items = formsMenuItems(path, false, {
        canViewGrowthAndMaturationImportArea: true,
      });

      expect(items[4].id).toEqual('growth_and_maturation');
      expect(items[4].href).toEqual('/growth_and_maturation');
      expect(items[4].title).toEqual('Growth and maturation');
      expect(items[4].allowed).toEqual(true);
    });

    const trainingVariablesImporterIndex = 8;
    const title = 'Data importer';

    const checkIfIdIsCorrect = (items) =>
      expect(items[trainingVariablesImporterIndex].id).toEqual('data_importer');

    describe('when ‘training-variables-importer’ feature flag is on', () => {
      beforeEach(() => {
        window.setFlag('training-variables-importer', true);
      });

      afterEach(() => {
        window.setFlag('training-variables-importer', false);
      });

      it(`formsMenuItems returns ${title}`, () => {
        const items = formsMenuItems(path, false, {
          canCreateImports: true,
        });

        checkIfIdIsCorrect(items);
        expect(items[trainingVariablesImporterIndex].title).toEqual(
          'Data importer'
        );
        expect(items[trainingVariablesImporterIndex].href).toEqual(
          '/data_importer'
        );
      });

      it(`${title} is allowed if \`canCreateImports\` permission is on`, () => {
        const items = formsMenuItems(path, false, {
          canCreateImports: true,
        });

        checkIfIdIsCorrect(items);
        expect(items[trainingVariablesImporterIndex].allowed).toEqual(true);
      });

      it(`${title} isn’t allowed if \`canCreateImports\` permission is off`, () => {
        const items = formsMenuItems(path, false);

        checkIfIdIsCorrect(items);
        expect(items[trainingVariablesImporterIndex].allowed).toBeFalsy();
      });
    });

    describe('when ‘training-variables-importer’ feature flag is off', () => {
      it(`${title} isn’t allowed if \`canCreateImports\` permission is on`, () => {
        const items = formsMenuItems(path, false, {
          canCreateImports: true,
        });

        checkIfIdIsCorrect(items);
        expect(items[trainingVariablesImporterIndex].allowed).toEqual(
          undefined
        );
      });

      it(`${title} isn’t allowed if \`canCreateImports\` permission is off`, () => {
        const items = formsMenuItems(path, false);

        checkIfIdIsCorrect(items);
        expect(items[trainingVariablesImporterIndex].allowed).toEqual(
          undefined
        );
      });
    });
  });

  describe('/analysis/template_dashboards/growth_and_maturation', () => {
    const index = 4;
    const title = 'Growth & Maturation Report';
    const path = '/analysis/template_dashboards/growth_and_maturation';

    afterEach(() => {
      window.setFlag('rep-show-growth-and-maturation-report', false);
    });

    it(`‘${title}’ isn’t allowed by default`, () => {
      expect(
        analysisMenuItems(path, {}).find(
          ({ title: itemTitle }) => itemTitle === title
        )
      ).toBeUndefined();
    });

    it(`‘${title}’ isn’t allowed but exists if \`rep-show-growth-and-maturation-report\` feature flag is on`, () => {
      window.setFlag('rep-show-growth-and-maturation-report', true);

      expect(analysisMenuItems(path, {})[index].allowed).toBe(undefined);
    });

    it(`‘${title}’ is allowed if all the relevant feature flags are on and \`canViewGrowthAndMaturationReportArea\` permission is on`, () => {
      window.setFlag('rep-show-growth-and-maturation-report', true);

      expect(
        analysisMenuItems(path, { canViewGrowthAndMaturationReportArea: true })[
          index
        ].allowed
      ).toBe(true);
    });

    it(`‘${title}’ is allowed if all the relevant feature flags are on and \`analysis.growthAndMaturationReportArea.canView\` permission is on`, () => {
      window.setFlag('rep-show-growth-and-maturation-report', true);

      expect(
        analysisMenuItems(path, {
          analysis: { growthAndMaturationReportArea: { canView: true } },
        })[index].allowed
      ).toBe(true);
    });
  });

  describe('/benchmark/test_validation', () => {
    afterEach(() => {
      window.setFlag('benchmark-testing-area', false);
    });

    it('returns formsMenuItems with /benchmark/test_validation - false', () => {
      window.setFlag('benchmark-testing-area', false);
      const items = formsMenuItems('benchmark_test_validation', false, {});

      expect(items[5].id).toEqual('benchmark_test_validation');
      expect(items[5].href).toEqual('/benchmark/test_validation');
      expect(items[5].title).toEqual('Benchmark validation');
      expect(items[5].allowed).toEqual(false);
    });

    it('returns formsMenuItems with /benchmark/test_validation - true', () => {
      window.setFlag('benchmark-testing-area', true);
      const items = formsMenuItems('benchmark_test_validation', false, {
        canViewBenchmarkValidation: true,
      });

      expect(items[5].id).toEqual('benchmark_test_validation');
      expect(items[5].href).toEqual('/benchmark/test_validation');
      expect(items[5].title).toEqual('Benchmark validation');
      expect(items[5].allowed).toEqual(true);
    });
  });

  describe('/benchmark/league_benchmarking', () => {
    afterEach(() => {
      window.setFlag('benchmark-testing', false);
      window.setFlag('performance-optimisation-imports', false);
    });

    it('returns formsMenuItems with /benchmark/league_benchmarking - false', () => {
      window.setFlag('benchmark-testing', false);
      window.setFlag('performance-optimisation-imports', false);
      const items = formsMenuItems('league_benchmarking', false, {});

      expect(items[6].id).toEqual('league_benchmarking');
      expect(items[6].href).toEqual('/benchmark/league_benchmarking');
      expect(items[6].title).toEqual('League benchmarking');
      expect(items[6].allowed).toEqual(false);
    });

    it('returns formsMenuItems with /benchmark/league_benchmarking - true', () => {
      window.setFlag('benchmark-testing', true);
      window.setFlag('performance-optimisation-imports', true);
      const items = formsMenuItems('league_benchmarking', false, {
        canViewBenchmarkingTestingImportArea: true,
      });

      expect(items[6].id).toEqual('league_benchmarking');
      expect(items[6].href).toEqual('/benchmark/league_benchmarking');
      expect(items[6].title).toEqual('League benchmarking');
      expect(items[6].allowed).toEqual(true);
    });
  });

  describe('/private_forms', () => {
    afterEach(() => {
      window.featureFlags['tso-private-forms'] = false;
    });

    const privateFormsId = 'private_forms';
    it('returns formsMenuItems with private forms - false', () => {
      window.featureFlags['tso-private-forms'] = false;
      const items = formsMenuItems(privateFormsId, false, {
        canViewTSOPrivateForms: true,
      });

      expect(items[7].id).toEqual(privateFormsId);
      expect(items[7].href).toEqual(`/${privateFormsId}`);
      expect(items[7].title).toEqual('Private forms');
      expect(items[7].allowed).toEqual(false);
    });

    it('returns formsMenuItems with /private_forms - true', () => {
      window.featureFlags['tso-private-forms'] = true;
      const items = formsMenuItems('privateFormsId', false, {
        canViewTSOPrivateForms: true,
      });

      expect(items[7].id).toEqual(privateFormsId);
      expect(items[7].href).toEqual(`/${privateFormsId}`);
      expect(items[7].title).toEqual('Private forms');
      expect(items[7].allowed).toEqual(true);
    });
  });

  describe('when the league-ops-squad-management feature flag is enabled', () => {
    beforeEach(() => {
      window.featureFlags['league-ops-squad-management'] = true;
    });

    afterEach(() => {
      window.featureFlags['league-ops-squad-management'] = false;
    });

    it('returns settingsMenuItems with manage_squads item matchPath being true', () => {
      const items = settingsMenuItems('/administration/squads', {
        canEditSquad: true,
      });
      expect(items[1].id).toEqual('manage_squads');
      expect(items[1].href).toEqual('/administration/squads');
      expect(items[1].title).toEqual('Manage Squads');
      expect(items[1].allowed).toEqual(true);
    });
  });

  describe('league-ops-mass-create-athlete-staff', () => {
    const menuPositionIndex = 9;

    beforeEach(() => {
      window.featureFlags['league-ops-mass-create-athlete-staff'] = true;
    });

    afterEach(() => {
      window.featureFlags['league-ops-mass-create-athlete-staff'] = false;
    });

    it('returns settingsMenuItems with settings/imports item matchPath being true', () => {
      const items = settingsMenuItems('/imports', {
        canViewImports: true,
      });
      expect(items[menuPositionIndex].id).toEqual('imports');
      expect(items[menuPositionIndex].href).toEqual('/settings/imports');
      expect(items[menuPositionIndex].title).toEqual('Imports');
      expect(items[menuPositionIndex].allowed).toEqual(true);
    });
  });

  describe('fixture-management', () => {
    const menuPositionIndex = 11;

    beforeEach(() => {
      window.featureFlags['tso-league-fixture-management'] = true;
    });

    afterEach(() => {
      window.featureFlags['tso-league-fixture-management'] = false;
    });

    it('return workloadsMenuItems with fixture-management values', () => {
      const items = settingsMenuItems('/fixture_management', {
        canViewTSOFixtureManagement: true,
      });

      expect(items[menuPositionIndex].id).toEqual('fixture_management');
      expect(items[menuPositionIndex].href).toEqual('/fixture_management');
      expect(items[menuPositionIndex].title).toEqual('Fixture Management');
      expect(items[menuPositionIndex].allowed).toEqual(true);
    });
  });

  describe('jtc-fixture-management', () => {
    const menuPositionIndex = 12;

    beforeEach(() => {
      window.featureFlags['tso-league-jtc-fixture-management'] = true;
    });

    afterEach(() => {
      window.featureFlags['tso-league-jtc-fixture-management'] = false;
    });

    it('return workloadsMenuItems with pre_academy_fixture_management values - true', () => {
      const items = settingsMenuItems('/pre_academy_fixture_management', {
        canViewTSOJtcFixtureRequests: true,
      });

      expect(items[menuPositionIndex].id).toEqual('jtc_fixture_management');
      expect(items[menuPositionIndex].href).toEqual(
        '/pre_academy_fixture_management'
      );
      expect(items[menuPositionIndex].title).toEqual(
        'Pre-Academy Fixture Management'
      );
      expect(items[menuPositionIndex].allowed).toEqual(true);
    });

    it('return workloadsMenuItems with jtc-fixture-management values - false', () => {
      const items = settingsMenuItems('/jtc_fixture_management', {
        canViewTSOJtcFixtureRequests: false,
      });

      expect(items[menuPositionIndex].id).toEqual('jtc_fixture_management');
      expect(items[menuPositionIndex].href).toEqual(
        '/pre_academy_fixture_management'
      );
      expect(items[menuPositionIndex].title).toEqual(
        'Pre-Academy Fixture Management'
      );
      expect(items[menuPositionIndex].allowed).toEqual(false);
    });
  });

  describe('coaching-library', () => {
    beforeEach(() => {
      window.setFlag('coaching-library', true);
      window.setFlag('planning-tab-sessions', true);
    });

    afterEach(() => {
      window.setFlag('coaching-library', false);
      window.setFlag('planning-tab-sessions', false);
    });

    it('return workloadsMenuItems with coaching-library values', () => {
      const items = workloadsMenuItems('/fixture_negotiation', {
        isPlanningAdmin: true,
      });

      expect(items[5].id).toEqual('coachingLibrary');
      expect(items[5].href).toEqual('/planning_hub/coaching_library');
      expect(items[5].title).toEqual('Coaching library');
      expect(items[5].allowed).toEqual(true);
    });
  });

  describe('discipline', () => {
    beforeEach(() => {
      window.setFlag('league-ops-discipline-area', true);
    });

    afterEach(() => {
      window.setFlag('league-ops-discipline-area', false);
    });

    it('return workloadsMenuItems with discipline values', () => {
      const items = workloadsMenuItems('/league-fixtures/discipline', {
        canViewDisciplineArea: true,
      });

      expect(items[1].id).toEqual('discipline');
      expect(items[1].href).toEqual('/league-fixtures/discipline');
      expect(items[1].title).toEqual('Discipline');
      expect(items[1].allowed).toEqual(true);
    });
  });

  describe('fixture-negotiation', () => {
    beforeEach(() => {
      window.featureFlags['tso-club-fixture-negotiation'] = true;
    });

    afterEach(() => {
      window.featureFlags['tso-club-fixture-negotiation'] = false;
    });

    it('return workloadsMenuItems with fixture-negotiation values', () => {
      const items = workloadsMenuItems('/fixture_negotiation', {
        canViewTSOFixtureNegotiation: true,
      });

      expect(items[6].id).toEqual('fixture_negotiation');
      expect(items[6].href).toEqual('/fixture_negotiation');
      expect(items[6].title).toEqual('Fixture Negotiation');
      expect(items[6].allowed).toEqual(true);
    });
  });

  describe('jtc-fixture-negotiation', () => {
    beforeEach(() => {
      window.featureFlags['tso-club-jtc-fixture-negotiation'] = true;
    });

    afterEach(() => {
      window.featureFlags['tso-club-jtc-fixture-negotiation'] = false;
    });

    it('return workloadsMenuItems with pre_academy_fixture_negotiation values - true', () => {
      const items = workloadsMenuItems('/pre_academy_fixture_negotiation', {
        canViewTSOJtcFixtureRequests: true,
      });

      expect(items[7].id).toEqual('jtc_fixture_negotiation');
      expect(items[7].href).toEqual('/pre_academy_fixture_negotiation');
      expect(items[7].title).toEqual('Pre-Academy Fixture Negotiation');
      expect(items[7].allowed).toEqual(true);
    });

    it('return workloadsMenuItems with pre_academy_fixture_negotiation values - false', () => {
      const items = workloadsMenuItems('/pre_academy_fixture_negotiation', {
        canViewTSOJtcFixtureRequests: false,
      });

      expect(items[7].id).toEqual('jtc_fixture_negotiation');
      expect(items[7].href).toEqual('/pre_academy_fixture_negotiation');
      expect(items[7].title).toEqual('Pre-Academy Fixture Negotiation');
      expect(items[7].allowed).toEqual(false);
    });
  });

  describe('fixture-finder', () => {
    beforeEach(() => {
      window.featureFlags['tso-fixture-finder'] = true;
    });

    afterEach(() => {
      window.featureFlags['tso-fixture-finder'] = false;
    });

    it('returns workloadsMenuItems with fixture-finder values', () => {
      const items = workloadsMenuItems('/fixture_finder', {
        canViewTSOEvent: true,
      });

      expect(items[8].id).toEqual('fixture_finder');
      expect(items[8].href).toEqual('/fixture_finder');
      expect(items[8].title).toEqual('Fixture Finder');
      expect(items[8].allowed).toEqual(true);
    });

    describe('league-schedule', () => {
      beforeEach(() => {
        window.featureFlags['league-schedule-club-view'] = true;
      });

      afterEach(() => {
        window.featureFlags['league-schedule-club-view'] = false;
      });

      it('returns workloadsMenuItems with league schedule item', () => {
        const items = workloadsMenuItems('/planning_hub/league-schedule', [], {
          isOrgSupervised: false,
        });

        expect(items[10].id).toEqual('leagueSchedule');
        expect(items[10].href).toEqual('/planning_hub/league-schedule');
        expect(items[10].title).toEqual('League Schedule');
        expect(items[10].allowed).toEqual(false);
      });

      it('allows league schedule when the user is NOT an association admin and the org is supervised', () => {
        const items = workloadsMenuItems('/planning_hub/league-schedule', [], {
          isAssociationAdmin: false,
          isOrgSupervised: true,
        });

        expect(items[10].id).toEqual('leagueSchedule');
        expect(items[10].allowed).toEqual(true);
      });
    });
  });

  describe('events-management', () => {
    beforeEach(() => {
      window.featureFlags['tso-event-management'] = true;
    });

    afterEach(() => {
      window.featureFlags['tso-event-management'] = false;
    });

    it('returns workloadsMenuItems with events-management values', () => {
      const items = workloadsMenuItems('/events_management', {
        canViewTSOEvent: true,
      });

      expect(items[9].id).toEqual('events_management');
      expect(items[9].href).toEqual('/events_management');
      expect(items[9].title).toEqual('Events Management');
      expect(items[9].allowed).toEqual(true);
    });
  });

  describe('when the league-ops-scouts-user-type feature flag is enabled', () => {
    beforeEach(() => {
      window.featureFlags = {
        'league-ops-scouts-user-type': true,
        'league-ops-squad-management': false,
      };
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('returns settingsMenuItems with manage_scouts item matchPath being true', () => {
      const items = settingsMenuItems('/administration/scouts', {
        canManageScouts: true,
        canEditSquad: false,
        canManageGeneralSettings: false,
      });
      expect(items[3].id).toEqual('manage_scouts');
      expect(items[3].href).toEqual('/administration/scouts');
      expect(items[3].title).toEqual('Manage Scouts');
      expect(items[3].allowed).toEqual(true);
    });
  });

  describe('scout-schedule', () => {
    const menuPositionIndex = 11;

    afterEach(() => {
      window.featureFlags['scout-schedule-view'] = false;
    });

    describe('with scout-schedule-view feature flag true and canViewScoutSchedule permission true', () => {
      it('returns workloadsMenuItems with scout schedule item', () => {
        window.featureFlags['scout-schedule-view'] = true;
        const items = workloadsMenuItems('/scout-schedule', {
          canViewScoutSchedule: true,
        });

        expect(items[menuPositionIndex].id).toEqual('scoutSchedule');
        expect(items[menuPositionIndex].href).toEqual('/scout-schedule');
        expect(items[menuPositionIndex].title).toEqual('Scout Schedule');
        expect(items[menuPositionIndex].allowed).toEqual(true);
      });
    });

    describe('with scout-schedule-view feature flag false and canViewScoutSchedule permission true', () => {
      it('disallow scout schedule menu item', () => {
        window.featureFlags['scout-schedule-view'] = false;
        const items = workloadsMenuItems('/scout-schedule', {
          canViewScoutSchedule: true,
        });

        expect(items[menuPositionIndex].id).toEqual('scoutSchedule');
        expect(items[menuPositionIndex].href).toEqual('/scout-schedule');
        expect(items[menuPositionIndex].title).toEqual('Scout Schedule');
        expect(items[menuPositionIndex].allowed).toEqual(false);
      });
    });

    describe('with scout-schedule-view feature flag true and canViewScoutSchedule permission false', () => {
      it('disallow scout schedule menu item', () => {
        window.featureFlags['scout-schedule-view'] = true;
        const items = workloadsMenuItems('/scout-schedule', {
          canViewScoutSchedule: false,
        });

        expect(items[menuPositionIndex].id).toEqual('scoutSchedule');
        expect(items[menuPositionIndex].href).toEqual('/scout-schedule');
        expect(items[menuPositionIndex].title).toEqual('Scout Schedule');
        expect(items[menuPositionIndex].allowed).toEqual(false);
      });
    });
  });

  describe('conditional-fields', () => {
    const menuPositionIndex = 13;

    afterEach(() => {
      window.featureFlags['conditional-fields-creation-in-ip'] = false;
    });

    describe('with conditional-fields-in-ip feature flag true and canAdmin permission true', () => {
      it('returns settingsMenuItems with conditional fields item', () => {
        window.featureFlags['conditional-fields-creation-in-ip'] = true;
        const items = settingsMenuItems('/conditional_fields', {
          canAdminInjurySurveillance: true,
        });

        expect(items[menuPositionIndex].id).toEqual('conditional_fields');
        expect(items[menuPositionIndex].href).toEqual(
          '/administration/conditional_fields'
        );
        expect(items[menuPositionIndex].title).toEqual('Logic Builder');
        expect(items[menuPositionIndex].allowed).toEqual(true);
      });
    });

    describe('with conditional-fields-in-ip feature flag false and canAdmin permission true', () => {
      it("doesn't return conditional fields menu item", () => {
        window.featureFlags['conditional-fields-creation-in-ip'] = false;
        const items = settingsMenuItems('/conditional_fields', {
          canAdminInjurySurveillance: true,
        });

        expect(
          items.findIndex((item) => item.id === 'conditional_fields')
        ).toEqual(-1);
      });
    });

    describe('with conditional-fields-in-ip feature flag true and canAdmin permission false', () => {
      it("doesn't conditional fields menu item1", () => {
        window.featureFlags['conditional-fields-creation-in-ip'] = true;
        const items = settingsMenuItems('/conditional_fields', {
          canAdminInjurySurveillance: false,
        });

        expect(
          items.findIndex((item) => item.id === 'conditional_fields')
        ).toEqual(-1);
      });
    });
  });

  describe('staff-development', () => {
    afterEach(() => {
      window.setFlag('rep-show-staff-development', false);
    });

    describe('with staff-development feature flag true and canViewStaffDevelopment permission true', () => {
      const menuPositionIndex = 5;

      it('returns analysisMenuItems with staff development item', () => {
        window.setFlag('rep-show-staff-development', true);
        const items = analysisMenuItems(
          '/analysis/template_dashboards/staff_development',
          {
            canViewStaffDevelopment: true,
          }
        );

        expect(items[menuPositionIndex].id).toEqual('staff_development');
        expect(items[menuPositionIndex].href).toEqual(
          '/analysis/template_dashboards/staff_development'
        );
        expect(items[menuPositionIndex].title).toEqual('Staff Development');
        expect(items[menuPositionIndex].allowed).toEqual(true);
      });
    });

    describe('with rep-show-staff-development feature flag false and canViewStaffDevelopment permission true', () => {
      const menuPositionIndex = 5;
      it('disallow staff development menu item', () => {
        window.setFlag('rep-show-staff-development', false);
        const items = analysisMenuItems(
          '/analysis/template_dashboards/staff_development',
          {
            canViewStaffDevelopment: true,
          }
        );

        expect(items[menuPositionIndex].id).not.toEqual('staff_development');
        expect(items[menuPositionIndex].href).not.toEqual(
          '/analysis/template_dashboards/staff_development'
        );
        expect(items[menuPositionIndex].title).not.toEqual('Staff Development');
      });
    });

    describe('with rep-show-staff-development feature flag true and canViewStaffDevelopment permission false', () => {
      const menuPositionIndex = 4;

      it('disallow staff development menu item', () => {
        window.setFlag('rep-show-staff-development', true);
        const items = analysisMenuItems(
          '/analysis/template_dashboards/staff_development',
          {
            canViewStaffDevelopment: false,
          }
        );

        expect(items[menuPositionIndex].id).not.toEqual('staff_development');
        expect(items[menuPositionIndex].href).not.toEqual(
          '/analysis/template_dashboards/staff_development'
        );
        expect(items[menuPositionIndex].title).not.toEqual('Staff Development');
      });
    });

    describe('with staff-development feature flag true and permissions?.analysis?.staffDevelopment?.canView true', () => {
      const menuPositionIndex = 5;
      it('returns analysisMenuItems with staff development item', () => {
        window.setFlag('rep-show-staff-development', true);
        const items = analysisMenuItems(
          '/analysis/template_dashboards/staff_development',
          {
            analysis: {
              staffDevelopment: {
                canView: true,
              },
            },
          }
        );

        expect(items[menuPositionIndex].id).toEqual('staff_development');
        expect(items[menuPositionIndex].href).toEqual(
          '/analysis/template_dashboards/staff_development'
        );
        expect(items[menuPositionIndex].title).toEqual('Staff Development');
        expect(items[menuPositionIndex].allowed).toEqual(true);
      });
    });

    describe('with staff-development feature flag true and permissions?.analysis?.staffDevelopment?.canView false', () => {
      const menuPositionIndex = 5;
      it('returns analysisMenuItems with staff development item', () => {
        window.setFlag('rep-show-staff-development', true);
        const items = analysisMenuItems(
          '/analysis/template_dashboards/staff_development',
          {
            analysis: {
              staffDevelopment: {
                canView: false,
              },
            },
          }
        );

        expect(items[menuPositionIndex].id).not.toEqual('staff_development');
        expect(items[menuPositionIndex].href).not.toEqual(
          '/analysis/template_dashboards/staff_development'
        );
        expect(items[menuPositionIndex].title).not.toEqual('Staff Development');
      });
    });
  });

  describe('Coaching and Medical summary FF and permissions validity', () => {
    const generateTestCases = (
      name,
      menuItemIndexToCheck,
      path,
      title,
      permission
    ) => {
      describe(`with rep-show-${name} feature flag`, () => {
        const truthyPermissionsAnalysisMenuItems = () =>
          analysisMenuItems(path, permission);

        it(`allows ${name} menu item when the feature flag is true`, () => {
          window.featureFlags[`rep-show-${name}-summary`] = true;
          const items = truthyPermissionsAnalysisMenuItems();

          expect(items[menuItemIndexToCheck].id).toEqual(`${name}_dashboard`);
          expect(items[menuItemIndexToCheck].href).toEqual(
            `/analysis/template_dashboards/${path}`
          );
          expect(items[menuItemIndexToCheck].title).toEqual(`${title} Summary`);
        });

        it(`disallows ${name} menu item when the feature flag is false`, () => {
          window.featureFlags[`rep-show-${name}-summary`] = false;
          const items = truthyPermissionsAnalysisMenuItems();

          expect(items[menuItemIndexToCheck].id).not.toEqual(
            `${name}_dashboard`
          );
          expect(items[menuItemIndexToCheck].href).not.toEqual(
            `/analysis/template_dashboards/${path}`
          );
          expect(items[menuItemIndexToCheck].title).not.toEqual(
            `${title} Summary`
          );
        });
      });
    };

    // Coaching
    generateTestCases('coaching', 1, 'coaching_summary', 'Coaching', {
      canViewCoachingSummary: true,
    });

    // Medical with `canView*` prefix which is equivalent to
    // medical.medical-graphing and analysis.view-medical-summary-dashboard.
    generateTestCases('medical', 3, 'medical', 'Medical', {
      canViewMedicalGraphing: true,
      canViewMedicalSummary: true,
    });

    // Medical with `permissions.*.*.canView` pattern guarded 2 permissions type only.
    generateTestCases('medical', 3, 'medical', 'Medical', {
      analysis: {
        medicalSummary: {
          canView: true,
        },
      },
      medical: {
        medicalGraphing: {
          canView: true,
        },
      },
    });
  });

  describe('labels and groups FF', () => {
    beforeEach(() => {
      window.setFlag('labels-and-groups', true);
    });

    afterEach(() => {
      window.setFlag('labels-and-groups', false);
    });

    describe('labels', () => {
      it('returns the labels menu item when permissions is true', () => {
        const items = settingsMenuItems('/labels', {
          canViewLabels: true,
        });

        expect(items[13].id).toEqual('labels');
        expect(items[13].href).toEqual('/administration/labels/manage');
        expect(items[13].title).toEqual('Athlete Labels');
        expect(items[13].allowed).toEqual(true);
      });

      it('not allowed when permission is false', () => {
        const items = settingsMenuItems('/labels', {
          canViewLabels: false,
        });
        expect(items[13].allowed).toEqual(false);
      });
    });

    describe('groups', () => {
      it('returns the groups menu item when the FF is on and when permissions is true', () => {
        const items = settingsMenuItems('/groups', {
          canViewSegments: true,
        });

        expect(items[14].id).toEqual('groups');
        expect(items[14].href).toEqual('/administration/groups');
        expect(items[14].title).toEqual('Athlete Groups');
        expect(items[14].allowed).toEqual(true);
      });

      it('not allowed when permission is false', () => {
        const items = settingsMenuItems('/groups', {
          canViewSegments: false,
        });
        expect(items[14].allowed).toEqual(false);
      });
    });
  });

  describe('kit-matrix', () => {
    it('returns the kit matrix menu item when the correct preference and permission is on', () => {
      const items = settingsMenuItems(
        '/settings/kit-matrix',
        { canViewKitMatrix: true },
        {},
        { league_game_kits: true }
      );

      const menu = items.find((item) => item.id === 'kit_matrix');
      expect(menu).toEqual({
        id: 'kit_matrix',
        title: 'Kit Matrix',
        href: '/settings/kit-matrix',
        matchPath: {
          params: {
            '*': '',
          },
          pathname: '/settings/kit-matrix',
          pathnameBase: '/settings/kit-matrix',
          pattern: {
            caseSensitive: false,
            end: true,
            path: '/settings/kit-matrix/*',
          },
        },
        allowed: true,
      });
    });

    it('hides the kit matrix menu item when one or all preference/permission is false', () => {
      const items = settingsMenuItems(
        '/settings/kit-matrix',
        {
          canViewKitMatrix: true,
        },
        {},
        {
          league_game_kits: false,
        }
      );

      const menu = items.find((item) => item.id === 'kit_matrix');
      expect(menu).toEqual({
        id: 'kit_matrix',
        title: 'Kit Matrix',
        href: '/settings/kit-matrix',
        matchPath: {
          params: {
            '*': '',
          },
          pathname: '/settings/kit-matrix',
          pathnameBase: '/settings/kit-matrix',
          pattern: {
            caseSensitive: false,
            end: true,
            path: '/settings/kit-matrix/*',
          },
        },
        allowed: false,
      });
    });
  });

  describe('/form_templates', () => {
    const menuPositionIndex = 9;

    const checkIfIdIsCorrect = (items) =>
      expect(items[menuPositionIndex].id).toEqual('form_templates');

    describe('when view-form-templates-page feature flag is on', () => {
      beforeAll(() => {
        window.setFlag('view-form-templates-page', true);
      });

      afterAll(() => {
        window.setFlag('view-form-templates-page', false);
      });

      const path = 'forms/form_templates';

      it('formsMenuItems returns Form Templates if canManageFormTemplates permission is true', () => {
        const items = formsMenuItems(path, false, {
          canManageFormTemplates: true,
        });

        checkIfIdIsCorrect(items);
        expect(items[menuPositionIndex].title).toEqual('Form Templates');
        expect(items[menuPositionIndex].href).toEqual('/forms/form_templates');
        expect(items[menuPositionIndex].allowed).toBeTruthy();
      });

      it('does not return formsMenuItems Form Templates if canManageFormTemplates permission is false', () => {
        const items = formsMenuItems(path, false, {
          canManageFormTemplates: false,
        });

        checkIfIdIsCorrect(items);
        expect(items[menuPositionIndex].title).toEqual('Form Templates');
        expect(items[menuPositionIndex].href).toEqual('/forms/form_templates');
        expect(items[menuPositionIndex].allowed).toBeFalsy();
      });

      it('formsMenuItems form_templates hide if athlete', () => {
        const items = formsMenuItems(path, true);

        checkIfIdIsCorrect(items);
        expect(items[menuPositionIndex].title).toEqual('Form Templates');
        expect(items[menuPositionIndex].href).toEqual('/forms/form_templates');
        expect(items[menuPositionIndex].allowed).toBeFalsy();
      });

      it('‘Data importer’ isn’t allowed if `canCreateImports` permission is off', () => {
        window.setFlag('view-form-templates-page', false);
        const items = formsMenuItems(path, false);

        checkIfIdIsCorrect(items);
        expect(items[menuPositionIndex].allowed).toBeFalsy();
      });
    });
  });

  describe('contacts', () => {
    it('returns the contacts menu item when  all permission/preferences are true', () => {
      const items = settingsMenuItems(
        '/settings/contacts',
        {
          canViewContacts: true,
        },
        {},
        {
          league_game_contacts: true,
        }
      );

      const menu = items.find((item) => item.id === 'contacts');
      expect(menu).toEqual({
        id: 'contacts',
        title: 'Contacts',
        href: '/settings/contacts',
        matchPath: {
          params: {
            '*': '',
          },
          pathname: '/settings/contacts',
          pathnameBase: '/settings/contacts',
          pattern: {
            caseSensitive: false,
            end: true,
            path: '/settings/contacts/*',
          },
        },
        allowed: true,
      });
    });

    it('does not returns the contacts menu item when either permission/preferences are false', () => {
      const items = settingsMenuItems(
        '/settings/contacts',
        {
          canViewContacts: false,
        },
        {},
        {
          league_game_contacts: true,
        }
      );

      const menu = items.find((item) => item.id === 'contacts');
      expect(menu).toEqual({
        id: 'contacts',
        title: 'Contacts',
        href: '/settings/contacts',
        matchPath: {
          params: {
            '*': '',
          },
          pathname: '/settings/contacts',
          pathnameBase: '/settings/contacts',
          pattern: {
            caseSensitive: false,
            end: true,
            path: '/settings/contacts/*',
          },
        },
        allowed: false,
      });
    });
  });

  describe('/form_answers_sets', () => {
    const menuPositionIndex = 10;

    const checkIfMenuPositionIdIsCorrect = (items) =>
      expect(items[menuPositionIndex].id).toEqual('completed_form_answer_sets');

    beforeAll(() => {
      window.setFlag('view-completed-forms-page', true);
    });

    afterAll(() => {
      window.setFlag('view-completed-forms-page', false);
    });

    const path = 'forms/form_answers_set';

    it('formsMenuItems returns Form Responses allowed if canViewEforms permission is true', () => {
      const items = formsMenuItems(path, false, { canViewEforms: true });

      checkIfMenuPositionIdIsCorrect(items);
      expect(items[menuPositionIndex].title).toEqual('Form Responses');
      expect(items[menuPositionIndex].href).toEqual('/forms/form_answers_sets');
      expect(items[menuPositionIndex].allowed).toBeTruthy();
    });

    it('formsMenuItems returns Form Responses allowed as false if canViewForms permission is false', () => {
      const items = formsMenuItems(path, true, { canViewForms: false });

      checkIfMenuPositionIdIsCorrect(items);
      expect(items[menuPositionIndex].title).toEqual('Form Responses');
      expect(items[menuPositionIndex].href).toEqual('/forms/form_answers_sets');
      expect(items[menuPositionIndex].allowed).toBeFalsy();
    });

    it('formsMenuItems returns Form Responses allowed as false', () => {
      const items = formsMenuItems(path, true);

      checkIfMenuPositionIdIsCorrect(items);
      expect(items[menuPositionIndex].title).toEqual('Form Responses');
      expect(items[menuPositionIndex].href).toEqual('/forms/form_answers_sets');
      expect(items[menuPositionIndex].allowed).toBeFalsy();
    });

    it('formsMenuItems returns Form Responses not allowed when feature flag off and is not athlete', () => {
      window.setFlag('view-completed-forms-page');
      const items = formsMenuItems(path, false);

      checkIfMenuPositionIdIsCorrect(items);
      expect(items[menuPositionIndex].allowed).toBeFalsy();
    });

    it('formsMenuItems returns Form Responses not allowed when feature flag off and is athlete', () => {
      window.setFlag('view-completed-forms-page', false);
      const items = formsMenuItems(path, true);

      checkIfMenuPositionIdIsCorrect(items);
      expect(items[menuPositionIndex].allowed).toBeFalsy();
    });
  });

  describe('/administration/additional_users', () => {
    const menuPositionIndex = 3;

    beforeEach(() => {
      window.featureFlags['league-ops-officials-user-type'] = true;
      window.featureFlags['league-ops-additional-users'] = true;
    });
    it('returns settingsMenuItems with manage_squads item matchPath being true', () => {
      const items = settingsMenuItems('/administration/scouts', {
        canManageScouts: true,
        canEditSquad: false,
        canManageGeneralSettings: false,
      });
      expect(items[menuPositionIndex].id).toEqual('manage_additional_users');
      expect(items[menuPositionIndex].href).toEqual(
        '/administration/additional_users'
      );
      expect(items[menuPositionIndex].title).toEqual('Manage Additional Users');
      expect(items[menuPositionIndex].allowed).toEqual(true);
    });
  });

  describe('/settings/email-log', () => {
    let items;
    let emailLogMenuItem;

    const getEmailLogMenuItem = (canViewEmails) => {
      items = settingsMenuItems('/settings/email-log', {
        canViewEmails,
      });
      emailLogMenuItem = items.find((item) => item.id === 'email-log');
    };

    it('returns the email log menu item when "canViewEmails" permission is true', () => {
      getEmailLogMenuItem(true);
      expect(emailLogMenuItem.id).toEqual('email-log');
      expect(emailLogMenuItem.href).toEqual('/settings/email-log');
      expect(emailLogMenuItem.title).toEqual('Email Log');
      expect(emailLogMenuItem.allowed).toEqual(true);
    });

    it('returns the email log menu item when "canViewEmails" permission is false', () => {
      getEmailLogMenuItem(false);
      expect(emailLogMenuItem.id).toEqual('email-log');
      expect(emailLogMenuItem.href).toEqual('/settings/email-log');
      expect(emailLogMenuItem.title).toEqual('Email Log');
      expect(emailLogMenuItem.allowed).toEqual(false);
    });
  });

  describe('/forms/my_forms', () => {
    const menuPositionIndex = 11;

    const checkIfMenuPositionIdIsCorrect = (items) =>
      expect(items[menuPositionIndex].id).toEqual('assigned_athlete_forms');

    beforeAll(() => {
      window.setFlag('cp-forms-athlete-forms-on-web', true);
    });

    afterAll(() => {
      window.setFlag('cp-forms-athlete-forms-on-web', false);
    });

    const path = 'forms/my_forms';

    it('formsMenuItems returns Assigned Forms allowed - ff on and isAthlete true', () => {
      const items = formsMenuItems(path, true);

      checkIfMenuPositionIdIsCorrect(items);
      expect(items[menuPositionIndex].title).toEqual('Assigned Forms');
      expect(items[menuPositionIndex].href).toEqual('/forms/my_forms');
      expect(items[menuPositionIndex].allowed).toBeTruthy();
    });

    it('formsMenuItems returns Assigned Forms not allowed - ff on and isAthlete false', () => {
      const items = formsMenuItems(path, false);

      checkIfMenuPositionIdIsCorrect(items);
      expect(items[menuPositionIndex].title).toEqual('Assigned Forms');
      expect(items[menuPositionIndex].href).toEqual('/forms/my_forms');
      expect(items[menuPositionIndex].allowed).toBeFalsy();
    });

    it('formsMenuItems returns Assigned Forms not allowed - ff off and isAthlete false', () => {
      window.setFlag('cp-forms-athlete-forms-on-web', false);
      const items = formsMenuItems(path, false);

      checkIfMenuPositionIdIsCorrect(items);
      expect(items[menuPositionIndex].title).toEqual('Assigned Forms');
      expect(items[menuPositionIndex].href).toEqual('/forms/my_forms');
      expect(items[menuPositionIndex].allowed).toBeFalsy();
    });

    it('formsMenuItems returns Assigned Forms not allowed - ff off and isAthlete true', () => {
      window.setFlag('cp-forms-athlete-forms-on-web', false);
      const items = formsMenuItems(path, true);

      checkIfMenuPositionIdIsCorrect(items);
      expect(items[menuPositionIndex].title).toEqual('Assigned Forms');
      expect(items[menuPositionIndex].href).toEqual('/forms/my_forms');
      expect(items[menuPositionIndex].allowed).toBeFalsy();
    });
  });

  describe('power bi reports', () => {
    const mockPowerBiReports = [
      { id: 1, name: 'Report 1' },
      { id: 2, name: 'Report 2' },
      { id: 3, name: 'Report 3' },
    ];

    it('should map each report to a menu item', () => {
      const items = analysisMenuItems(
        '/power_bi_embedded_reports/*',
        { canViewPowerBiEmbeddedReports: true },
        mockPowerBiReports
      ).filter((item) => item.allowed);

      expect(items).toHaveLength(mockPowerBiReports.length);
      mockPowerBiReports.forEach((report, index) => {
        expect(items[index]).toEqual({
          id: `powerBiEmbeddedReport${report.id}`,
          title: report.name,
          href: `power_bi_embedded_reports/${report.id}`,
          icon: 'icon-mail',
          matchPath: null,
          allowed: true,
        });
      });
    });

    it('should set allowed to true if canView powerBiReports is true', () => {
      const items = analysisMenuItems(
        '/power_bi_embedded_reports/*',
        { canViewPowerBiEmbeddedReports: true },
        mockPowerBiReports
      ).filter((item) => item.allowed);

      mockPowerBiReports.forEach((report, index) => {
        expect(items[index].allowed).toBe(true);
      });
    });

    it('should set allowed to false if canView powerBiReports is false', () => {
      const items = analysisMenuItems(
        '/power_bi_embedded_reports/*',
        { canViewPowerBiEmbeddedReports: false },
        mockPowerBiReports
      ).filter((item) => item.id.includes('powerBiEmbeddedReport'));

      mockPowerBiReports.forEach((report, index) => {
        expect(items[index].allowed).toBe(false);
      });
    });

    it('should not return any menu items if there are no reports', () => {
      const items = analysisMenuItems(
        '/power_bi_embedded_reports/*',
        {},
        []
      ).filter((item) => item.allowed);
      expect(items).toHaveLength(0);
    });
  });

  describe('Looker Dashboard Group menu items', () => {
    const items = analysisMenuItems(
      '/report/*',
      {
        canViewLookerDashboardGroup: true,
      },
      [],
      mockDashboardGroups
    ).filter((item) => item.id.includes('dashboard_group'));

    it('should return the correct dashboard group items', () => {
      expect(items).toHaveLength(1);
      expect(items[0].href).toEqual('/report/workload_dashboards/123');
      expect(items[0].title).toEqual('Workload Dashboards');
    });

    it('should set allowed to true if canViewLookerDashboardGroup is true', () => {
      items.forEach((item) => {
        expect(item.allowed).toBe(true);
      });
    });

    it('should set allowed to false if canViewLookerDashboardGroup is false', () => {
      const disallowedItems = analysisMenuItems('/report/*', {
        canViewLookerDashboardGroup: false,
      }).filter((item) => item.id.includes('dashboard_group'));

      disallowedItems.forEach((item) => {
        expect(item.allowed).toBe(false);
      });
    });
  });
});

describe('old .spec file rewrite', () => {
  describe('metricDashboardMenuItems', () => {
    beforeEach(() => {
      window.featureFlags = {
        'admin-manage-fixtures-visibility': true,
        'league-ops-officials-user-type': true,
      };
    });

    describe('when the path starts with /dashboards', () => {
      it('returns metricDashboardMenuItems with metric_dashboard_view item matchPath being true', () => {
        const items = metricDashboardMenuItems('/dashboards');

        expect(items[0].id).toEqual('metric_dashboard_view');

        expect(items[1].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /dashboards/templates', () => {
      it('returns metricDashboardMenuItems with metric_dashboard_templates item matchPath being true', () => {
        const items = metricDashboardMenuItems('/dashboards/templates');

        expect(items[1].id).toEqual('metric_dashboard_templates');

        expect(items[0].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /dashboards/:dashboardId/edit', () => {
      it('returns metricDashboardMenuItems with metric_dashboard_templates item matchPath being true', () => {
        const items = metricDashboardMenuItems('/dashboards/:dashboardId/edit');

        expect(items[1].id).toEqual('metric_dashboard_templates');

        expect(items[0].matchPath).toEqual(null);
      });
    });

    describe('metricDashboardMenuItems permissions', () => {
      it('returns the correct permissions', () => {
        // canViewDashboard
        const itemsCanViewDashboardTrue = metricDashboardMenuItems('', {
          canViewDashboard: true,
        });
        expect(itemsCanViewDashboardTrue[0].id).toEqual(
          'metric_dashboard_view'
        );
        expect(itemsCanViewDashboardTrue[0].allowed).toEqual(true);

        const itemsCanViewDashboardFalse = metricDashboardMenuItems('', {
          canViewDashboard: false,
        });
        expect(itemsCanViewDashboardFalse[0].id).toEqual(
          'metric_dashboard_view'
        );
        expect(itemsCanViewDashboardFalse[0].allowed).toEqual(false);

        // canManageDashboard
        const itemsCanManageDashboardTrue = metricDashboardMenuItems('', {
          canManageDashboard: true,
        });
        expect(itemsCanManageDashboardTrue[1].id).toEqual(
          'metric_dashboard_templates'
        );
        expect(itemsCanManageDashboardTrue[1].allowed).toEqual(true);

        const itemsCanManageDashboardFalse = metricDashboardMenuItems('', {
          canManageDashboard: false,
        });
        expect(itemsCanManageDashboardFalse[1].id).toEqual(
          'metric_dashboard_templates'
        );
        expect(itemsCanManageDashboardFalse[1].allowed).toEqual(false);
      });

      describe('[feature-flag] athlete-sharing-hide-athlete-analysis-page', () => {
        beforeEach(() => {
          window.setFlag('athlete-sharing-hide-athlete-analysis-page', true);
        });

        it('hides page when false even if permission is true', () => {
          const menuItems = analysisMenuItems('', {
            canViewAthleteAnalysis: true,
          });

          expect(
            menuItems.find(({ id }) => id === 'athlete_analysis')?.allowed
          ).toEqual(false);
        });
      });

      describe('[feature-flag] athlete-sharing-hide-athlete-report-page', () => {
        beforeEach(() => {
          window.setFlag('athlete-sharing-hide-athlete-report-page', true);
        });

        it('hides page when false even if permission is true', () => {
          const menuItems = analysisMenuItems('', {
            canViewAthletes: true,
            isQuestionnairesAdmin: true,
          });

          expect(
            menuItems.find(({ id }) => id === 'athlete_reports')?.allowed
          ).toEqual(false);
        });
      });
    });
  });

  describe('settingsMenuItems', () => {
    describe('when the path starts with /settings/athletes', () => {
      it('returns settingsMenuItems with manage_athletes item matchPath being true', () => {
        const items = settingsMenuItems('/settings/athletes/sub_path');

        expect(items[0].id).toEqual('manage_athletes');

        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
      });

      describe('when the side-nav-update feature flag is enabled', () => {
        beforeEach(() => {
          window.featureFlags['side-nav-update'] = true;
        });

        afterEach(() => {
          window.featureFlags['side-nav-update'] = false;
        });

        it('returns settingsMenuItems with manage_athletes item matchPath being true', () => {
          const items = settingsMenuItems('/administration/athletes/sub_path');

          expect(items[0].id).toEqual('manage_athletes');

          expect(items[1].matchPath).toEqual(null);
          expect(items[2].matchPath).toEqual(null);
          expect(items[3].matchPath).toEqual(null);
        });
      });
    });

    describe('when the path starts with /users', () => {
      it('returns settingsMenuItems with manage_staff item matchPath being true', () => {
        const items = settingsMenuItems('/users/sub_path');

        expect(items[2].id).toEqual('manage_staff');

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /fixtures', () => {
      it('returns settingsMenuItems with manage_fixtures item matchPath being true', () => {
        window.setFlag('league-ops-officials-user-type', true);

        const items = settingsMenuItems('/fixtures/sub_path', {
          canManageWorkload: true,
        });

        expect(items[5].id).toEqual('manage_fixtures');

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /settings/organisation/edit', () => {
      it('returns settingsMenuItems with manage_org item matchPath being true', () => {
        window.setFlag('league-ops-officials-user-type', true);

        const items = settingsMenuItems('/settings/organisation/edit/sub_path');

        expect(items[6].id).toEqual('manage_org');

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
      });

      describe('when the side-nav-update feature flag is enabled', () => {
        it('returns settingsMenuItems with manage_org item matchPath being true', () => {
          window.setFlag('league-ops-officials-user-type', true);
          window.setFlag('side-nav-update', true);

          const items = settingsMenuItems(
            '/administration/organisation/edit/sub_path'
          );

          expect(items[7].id).toEqual('manage_org');

          expect(items[0].matchPath).toEqual(null);
          expect(items[1].matchPath).toEqual(null);
          expect(items[2].matchPath).toEqual(null);
        });
      });
    });

    describe('when the path starts with /exports', () => {
      it('returns settingsMenuItems with exports item matchPath being true', () => {
        window.setFlag('league-ops-officials-user-type', true);

        const items = settingsMenuItems('/settings/exports');

        expect(items[9].id).toEqual('exports');

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
      });

      describe('when the side-nav-update feature flag is enabled', () => {
        it('returns settingsMenuItems with exports item matchPath being true', () => {
          window.setFlag('league-ops-officials-user-type', true);
          window.setFlag('side-nav-update', true);

          const items = settingsMenuItems('/administration/exports');

          expect(items[10].id).toEqual('exports');

          expect(items[1].matchPath).toEqual(null);
          expect(items[2].matchPath).toEqual(null);
          expect(items[3].matchPath).toEqual(null);
        });
      });
    });

    describe('when the path starts with /pre_academy_fixture_management', () => {
      it('returns settingsMenuItems with pre_academy_fixture_management item matchPath being true', () => {
        window.setFlag('league-ops-officials-user-type', true);

        const items = settingsMenuItems(
          '/pre_academy_fixture_management/sub_path'
        );

        expect(items[13].id).toEqual('jtc_fixture_management');

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
      });
    });

    describe('settingsMenuItems permissions', () => {
      it('returns the correct permissions', () => {
        window.setFlag('league-ops-officials-user-type', true);
        window.setFlag('admin-manage-fixtures-visibility', true);

        // canManageAthletes
        const itemsCanManageAthletesFalse = settingsMenuItems('', {
          canManageAthletes: false,
        });
        expect(itemsCanManageAthletesFalse[0].id).toEqual('manage_athletes');
        expect(itemsCanManageAthletesFalse[0].allowed).toEqual(false);

        const itemsCanManageAthletesTrue = settingsMenuItems('', {
          canManageAthletes: true,
        });
        expect(itemsCanManageAthletesTrue[0].id).toEqual('manage_athletes');
        expect(itemsCanManageAthletesTrue[0].allowed).toEqual(true);

        // canManageGeneralSettings
        const itemsCanManageGeneralSettingsFalse = settingsMenuItems('', {
          canManageGeneralSettings: false,
          canViewStaffUsers: false,
        });
        expect(itemsCanManageGeneralSettingsFalse[2].id).toEqual(
          'manage_staff'
        );
        expect(itemsCanManageGeneralSettingsFalse[2].allowed).toEqual(false);

        const itemsCanManageGeneralSettingsTrue = settingsMenuItems('', {
          canManageGeneralSettings: true,
        });
        expect(itemsCanManageGeneralSettingsTrue[2].id).toEqual('manage_staff');
        expect(itemsCanManageGeneralSettingsTrue[2].allowed).toEqual(true);

        const itemsCanViewStaffUsersTrue = settingsMenuItems('', {
          canViewStaffUsers: true,
          canManageGeneralSettings: false,
        });
        expect(itemsCanViewStaffUsersTrue[2].id).toEqual('manage_staff');
        expect(itemsCanViewStaffUsersTrue[2].allowed).toEqual(true);
        // canManageOfficials
        const itemsCanManageOfficialsFalse = settingsMenuItems('', {
          canManageOfficials: false,
        });
        expect(itemsCanManageOfficialsFalse[3].id).toEqual('manage_officials');
        expect(itemsCanManageOfficialsFalse[3].allowed).toEqual(false);

        const itemsCanManageOfficialsTrue = settingsMenuItems('', {
          canManageOfficials: true,
        });
        expect(itemsCanManageOfficialsTrue[3].id).toEqual('manage_officials');
        expect(itemsCanManageOfficialsTrue[3].allowed).toEqual(true);

        // canManageWorkload
        const itemsCanManageWorkloadFalse = settingsMenuItems('', {
          canManageWorkload: false,
        });
        expect(itemsCanManageWorkloadFalse[5].id).toEqual('manage_fixtures');
        expect(itemsCanManageWorkloadFalse[5].allowed).toEqual(false);

        const itemsCanManageWorkloadTrue = settingsMenuItems('', {
          canManageWorkload: true,
        });
        expect(itemsCanManageWorkloadTrue[5].id).toEqual('manage_fixtures');
        expect(itemsCanManageWorkloadTrue[5].allowed).toEqual(true);
      });
    });

    describe('settingsMenuItems modules', () => {
      it('returns the correct modules', () => {
        window.setFlag('league-ops-officials-user-type', true);

        // hasRiskAdvisor
        const itemsHasRiskAdvisorFalse = settingsMenuItems(
          '',
          {
            canViewMetrics: false,
          },
          { hasRiskAdvisor: false }
        );

        expect(itemsHasRiskAdvisorFalse[7].id).toEqual('manage_metric');
        expect(itemsHasRiskAdvisorFalse[7].allowed).toEqual(false);

        const itemsHasRiskAdvisorTrue = settingsMenuItems(
          '',
          {
            canViewMetrics: true,
          },
          { hasRiskAdvisor: true }
        );
        expect(itemsHasRiskAdvisorTrue[7].id).toEqual('manage_metric');
        expect(itemsHasRiskAdvisorTrue[7].allowed).toEqual(true);
      });
    });

    describe('when the side-nav-update feature flag is enabled', () => {
      beforeEach(() => {
        window.featureFlags['side-nav-update'] = true;
        window.featureFlags['alerts-area'] = false;
      });

      afterEach(() => {
        window.featureFlags['side-nav-update'] = false;
      });

      it('does not contains the alerts item', () => {
        const items = settingsMenuItems('', { canViewAlerts: false });

        expect(items[3].id).toEqual('alerts');
        expect(items[3].allowed).toEqual(false);
      });
    });
  });

  describe('analysisMenuItems', () => {
    describe('when the path starts with /analysis/dashboard', () => {
      it('returns analysisMenuItems with analytic_dashboard item matchPath being true', () => {
        const items = analysisMenuItems('/analysis/dashboard/sub_path');

        expect(items[0].id).toEqual('analytic_dashboard');

        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[7].matchPath).toEqual(null);
      });

      describe('when the analysis-alarm-analysis feature flag is disabled', () => {
        beforeEach(() => {
          window.setFlag('analysis-alarm-analysis', false);
        });

        afterEach(() => {
          window.setFlag('analysis-alarm-analysis', true);
        });

        it('does not contains the alerts item', () => {
          const items = analysisMenuItems('');

          expect(items[7].id).toEqual('alarm_analysis');
          expect(items[7].allowed).toEqual(false);
        });
      });
    });

    describe('when the path starts with /analysis/template_dashboards/', () => {
      describe('when the rep-show-coaching-summary, rep-show-development-journey, rep-show-medical-summary, rep-show-growth-and-maturation-report and rep-show-staff-development feature flag is disabled', () => {
        beforeEach(() => {
          window.setFlag('rep-show-coaching-summary', false);
          window.setFlag('rep-show-development-journey', false);
          window.setFlag('rep-show-medical-summary', false);
          window.setFlag('rep-show-growth-and-maturation-report', false);
          window.setFlag('rep-show-staff-development', false);
        });

        afterEach(() => {
          window.setFlag('rep-show-coaching-summary', true);
          window.setFlag('rep-show-development-journey', true);
          window.setFlag('rep-show-medical-summary', true);
          window.setFlag('rep-show-growth-and-maturation-report', true);
          window.setFlag('rep-show-staff-development', true);
        });

        it('does not contain coaching dashboard, development journey, medical summary or growth and maturation', () => {
          const items = analysisMenuItems('');

          expect(items[1].id).not.toEqual('coaching_dashboard');
          expect(items[1].allowed).toEqual(undefined);
          expect(items[2].id).not.toEqual('development_journey_dashboard');
          expect(items[2].allowed).toEqual(undefined);
          expect(items[3].id).not.toEqual('medical_summary_dashboard');
          expect(items[3].allowed).toEqual(undefined);
          expect(items[4].id).not.toEqual('growth_and_maturation');
          expect(items[4].allowed).toEqual(undefined);
          expect(items[5].id).not.toEqual('rep-show-staff-development');
          expect(items[5].allowed).toEqual(undefined);
        });
      });

      describe('when the rep-show-coaching-summary, rep-show-development-journey, rep-show-medical-summary & rep-show-growth-and-maturation-report feature flag & medical-graphing permissions is enabled', () => {
        beforeEach(() => {
          window.setFlag('rep-show-coaching-summary', true);
          window.setFlag('rep-show-development-journey', true);
          window.setFlag('rep-show-medical-summary', true);
          window.setFlag('rep-show-growth-and-maturation-report', true);
          window.setFlag('rep-show-staff-development', true);
          window.setFlag('rep-show-benchmark-reporting', true);
        });

        afterEach(() => {
          window.setFlag('rep-show-coaching-summary', false);
          window.setFlag('rep-show-development-journey', false);
          window.setFlag('rep-show-medical-summary', false);
          window.setFlag('rep-show-growth-and-maturation-report', false);
          window.setFlag('rep-show-staff-development', false);
          window.setFlag('rep-show-benchmark-reporting', false);
        });

        it('does contain coaching dashboard, development journey, medical summary, growth and maturation, staff development and benchmark reporting', () => {
          // medical-graphing permissions for medical summary
          const items = analysisMenuItems('', {
            canViewMedicalGraphing: true,
            canViewMedicalSummary: true,
            canViewStaffDevelopment: true,
            canViewCoachingSummary: true,
            canViewDevelopmentJourney: true,
            canViewBenchmarkReport: true,
          });

          expect(
            items[analysisMenuItemsArrayPositions.CoachingDashboard].id
          ).toEqual('coaching_dashboard');
          expect(
            items[analysisMenuItemsArrayPositions.CoachingDashboard].title
          ).toEqual('Coaching Summary');
          expect(
            items[analysisMenuItemsArrayPositions.CoachingDashboard].allowed
          ).toEqual(true);
          expect(
            items[analysisMenuItemsArrayPositions.DevelopmentJourneyDashboard]
              .id
          ).toEqual('development_journey_dashboard');
          expect(
            items[analysisMenuItemsArrayPositions.DevelopmentJourneyDashboard]
              .title
          ).toEqual('Development Journey');
          expect(
            items[analysisMenuItemsArrayPositions.DevelopmentJourneyDashboard]
              .allowed
          ).toEqual(true);
          expect(
            items[analysisMenuItemsArrayPositions.MedicalDashboard].id
          ).toEqual('medical_dashboard');
          expect(
            items[analysisMenuItemsArrayPositions.MedicalDashboard].title
          ).toEqual('Medical Summary');
          expect(
            items[analysisMenuItemsArrayPositions.MedicalDashboard].allowed
          ).toEqual(true);
          expect(
            items[analysisMenuItemsArrayPositions.GrowthAndMaturationDashboard]
              .id
          ).toEqual('growth_and_maturation_dashboard');
          expect(
            items[analysisMenuItemsArrayPositions.GrowthAndMaturationDashboard]
              .title
          ).toEqual('Growth & Maturation Report');
          expect(
            items[analysisMenuItemsArrayPositions.StaffDevelopment].id
          ).not.toEqual('rep-show-staff-development');
          expect(
            items[analysisMenuItemsArrayPositions.StaffDevelopment].allowed
          ).toEqual(true);
          expect(
            items[analysisMenuItemsArrayPositions.LeagueBenchmarkReporting].id
          ).toEqual('league_benchmark_reporting');
          expect(
            items[analysisMenuItemsArrayPositions.LeagueBenchmarkReporting]
              .title
          ).toEqual('League Benchmark Reporting');
          expect(
            items[analysisMenuItemsArrayPositions.LeagueBenchmarkReporting]
              .allowed
          ).toEqual(true);
        });
      });
    });

    describe('when the path starts with /analysis/graph/builder', () => {
      it('returns analysisMenuItems with graph_builder item matchPath being true', () => {
        const items = analysisMenuItems('/analysis/graph/builder/sub_path');

        expect(items[1].id).toEqual('graph_builder');

        expect(items[0].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[7].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /analysis/squad', () => {
      it('returns analysisMenuItems with squad_analysis item matchPath being true', () => {
        const items = analysisMenuItems('/analysis/squad/sub_path');

        expect(items[2].id).toEqual('squad_analysis');

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[7].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /analysis/athletes', () => {
      it('returns analysisMenuItems with athlete_analysis item matchPath being true', () => {
        const items = analysisMenuItems('/analysis/athletes/sub_path');

        expect(items[3].id).toEqual('athlete_analysis');

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[7].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /athletes/reports', () => {
      it('returns analysisMenuItems with athlete_reports item matchPath being true', () => {
        const items = analysisMenuItems('/athletes/reports/sub_path');

        expect(items[4].id).toEqual('athlete_reports');

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[7].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /analysis/injuries', () => {
      it('returns analysisMenuItems with injury_analysis item matchPath being true', () => {
        const items = analysisMenuItems('/analysis/injuries/sub_path');

        expect(items[5].id).toEqual('injury_analysis');

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[7].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /analysis/biomechanical', () => {
      it('returns analysisMenuItems with biomech_analysis item matchPath being true', () => {
        const items = analysisMenuItems('/analysis/biomechanical/sub_path');

        expect(items[6].id).toEqual('biomech_analysis');

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[7].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /analysis/alarm', () => {
      it('returns analysisMenuItems with alarm_analysis item matchPath being true', () => {
        const items = analysisMenuItems('/analysis/alarm/sub_path');

        expect(items[7].id).toEqual('alarm_analysis');

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
      });
    });

    describe('analysisMenuItems permissions', () => {
      beforeEach(() => {
        window.setFlag('athlete-sharing-hide-athlete-analysis-page', false);
        window.setFlag('athlete-sharing-hide-athlete-report-page', false);
      });

      it('returns the correct permissions', () => {
        // canViewAnalyticalDashboard
        const itemsCanViewAnalyticalDashboardTrue = analysisMenuItems('', {
          canViewAnalyticalDashboard: true,
        });
        expect(itemsCanViewAnalyticalDashboardTrue[0].id).toEqual(
          'analytic_dashboard'
        );
        expect(itemsCanViewAnalyticalDashboardTrue[0].allowed).toEqual(true);

        const itemsCanViewAnalyticalDashboardFalse = analysisMenuItems('', {
          canViewAnalyticalDashboard: false,
        });
        expect(itemsCanViewAnalyticalDashboardFalse[0].id).toEqual(
          'analytic_dashboard'
        );
        expect(itemsCanViewAnalyticalDashboardFalse[0].allowed).toEqual(false);

        // canViewAnalyticalGraphs
        const itemsCanViewAnalyticalGraphsTrue = analysisMenuItems('', {
          canViewAnalyticalGraphs: true,
        });
        expect(itemsCanViewAnalyticalGraphsTrue[1].id).toEqual('graph_builder');
        expect(itemsCanViewAnalyticalGraphsTrue[1].allowed).toEqual(true);

        const itemsCanViewAnalyticalGraphsFalse = analysisMenuItems('', {
          canViewAnalyticalGraphs: false,
        });
        expect(itemsCanViewAnalyticalGraphsFalse[1].id).toEqual(
          'graph_builder'
        );
        expect(itemsCanViewAnalyticalGraphsFalse[1].allowed).toEqual(false);

        // canViewSquadAnalysis
        const itemsCanViewSquadAnalysisTrue = analysisMenuItems('', {
          canViewSquadAnalysis: true,
        });
        expect(itemsCanViewSquadAnalysisTrue[2].id).toEqual('squad_analysis');
        expect(itemsCanViewSquadAnalysisTrue[2].allowed).toEqual(true);

        const itemsCanViewSquadAnalysisFalse = analysisMenuItems('', {
          canViewSquadAnalysis: false,
        });
        expect(itemsCanViewSquadAnalysisFalse[2].id).toEqual('squad_analysis');
        expect(itemsCanViewSquadAnalysisFalse[2].allowed).toEqual(false);

        // canViewAthleteAnalysis
        const itemsCanViewAthleteAnalysisTrue = analysisMenuItems('', {
          canViewAthleteAnalysis: true,
        });
        expect(itemsCanViewAthleteAnalysisTrue[3].id).toEqual(
          'athlete_analysis'
        );
        expect(itemsCanViewAthleteAnalysisTrue[3].allowed).toEqual(true);

        const itemsCanViewAthleteAnalysisFalse = analysisMenuItems('', {
          canViewAthleteAnalysis: false,
        });
        expect(itemsCanViewAthleteAnalysisFalse[3].id).toEqual(
          'athlete_analysis'
        );
        expect(itemsCanViewAthleteAnalysisFalse[3].allowed).toEqual(false);

        // isQuestionnairesAdmin && canViewAthletes
        const itemsAthleteReportForbidden = analysisMenuItems('', {
          isQuestionnairesAdmin: false,
          canViewAthletes: true,
        });
        expect(itemsAthleteReportForbidden[4].id).toEqual('athlete_reports');
        expect(itemsAthleteReportForbidden[4].allowed).toEqual(false);

        const itemsAthleteReportAllowed = analysisMenuItems('', {
          isQuestionnairesAdmin: true,
          canViewAthletes: true,
        });
        expect(itemsAthleteReportAllowed[4].id).toEqual('athlete_reports');
        expect(itemsAthleteReportAllowed[4].allowed).toEqual(true);

        // canViewInjuryAnalysis
        const itemsCanViewInjuryAnalysisTrue = analysisMenuItems('', {
          canViewInjuryAnalysis: true,
        });
        expect(itemsCanViewInjuryAnalysisTrue[5].id).toEqual('injury_analysis');
        expect(itemsCanViewInjuryAnalysisTrue[5].allowed).toEqual(true);

        const itemsCanViewInjuryAnalysisFalse = analysisMenuItems('', {
          canViewInjuryAnalysis: false,
        });
        expect(itemsCanViewInjuryAnalysisFalse[5].id).toEqual(
          'injury_analysis'
        );
        expect(itemsCanViewInjuryAnalysisFalse[5].allowed).toEqual(false);

        // canViewBiomechanicalAnalysis
        const itemsCanViewBiomechanicalAnalysisTrue = analysisMenuItems('', {
          canViewBiomechanicalAnalysis: true,
        });
        expect(itemsCanViewBiomechanicalAnalysisTrue[6].id).toEqual(
          'biomech_analysis'
        );
        expect(itemsCanViewBiomechanicalAnalysisTrue[6].allowed).toEqual(true);

        const itemsCanViewBiomechanicalAnalysisFalse = analysisMenuItems('', {
          canViewBiomechanicalAnalysis: false,
        });
        expect(itemsCanViewBiomechanicalAnalysisFalse[6].id).toEqual(
          'biomech_analysis'
        );
        expect(itemsCanViewBiomechanicalAnalysisFalse[6].allowed).toEqual(
          false
        );
      });
    });

    describe('when the side-nav-update feature flag is enabled', () => {
      beforeEach(() => {
        window.featureFlags['side-nav-update'] = true;
      });

      afterEach(() => {
        window.featureFlags['side-nav-update'] = false;
      });

      it('does not contain the metric_dashboard_view item', () => {
        const items = analysisMenuItems('', { canViewDashboard: false });

        expect(items[6].id).toEqual('metric_dashboard_view');
        expect(items[6].allowed).toEqual(false);
      });
    });

    describe('dashboard group items', () => {
      it('returns dashboard_group items with correct href, id, title, matchPath and allowed', () => {
        const dashboardGroups = {
          dashboard_groups: [
            {
              id: 10,
              name: 'daily workload',
              slug: 'daily_workload',
              dashboards: [{ id: 101 }, { id: 103 }],
            },
          ],
        };

        const items = analysisMenuItems(
          '/report/daily_workload/101',
          {
            canViewLookerDashboardGroup: true,
          },
          [],
          dashboardGroups
        );

        const dashboardGroupItem = items.find(
          (i) => i.id === 'dashboard_group_10'
        );

        expect(dashboardGroupItem.title).toEqual('daily workload');
        expect(dashboardGroupItem.href).toEqual('/report/daily_workload/101');
        expect(dashboardGroupItem.matchPath).not.toBeNull();
        expect(dashboardGroupItem.allowed).toEqual(true);
      });
    });

    describe('single dashboard items', () => {
      it('returns dashboard_ items with correct href, id, title, matchPath and allowed', () => {
        const dashboardGroups = {
          dashboards: [{ id: 201, name: 'Single Dashboard' }],
        };

        const items = analysisMenuItems(
          '/report/201',
          {
            canViewLookerDashboardGroup: true,
          },
          [],
          dashboardGroups
        );

        const singleDashboardItem = items.find((i) => i.id === 'dashboard_201');

        expect(singleDashboardItem.title).toEqual('Single Dashboard');
        expect(singleDashboardItem.href).toEqual('/report/201');
        expect(singleDashboardItem.matchPath).not.toBeNull();
        expect(singleDashboardItem.allowed).toEqual(true);
      });
    });
  });

  describe('athletesMenuItems', () => {
    describe('when the path starts with /athletes/reports', () => {
      it('returns athletesMenuItems with item matchPath being null', () => {
        const items = athletesMenuItems('/athletes/reports');

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /athletes', () => {
      it('returns athletesMenuItems with athletes item matchPath being true', () => {
        const items = athletesMenuItems('/athletes/sub_path');

        expect(items[0].id).toEqual('athletes');

        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /athletes/availability', () => {
      it('returns athletesMenuItems with availability item matchPath being true', () => {
        const items = athletesMenuItems('/athletes/availability/sub_path');

        expect(items[1].id).toEqual('availability');

        expect(items[0].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /athletes/availability_report', () => {
      it('returns athletesMenuItems with availability_report item matchPath being true', () => {
        const items = athletesMenuItems(
          '/athletes/availability_report/sub_path'
        );

        expect(items[2].id).toEqual('availability_report');

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /athletes/availability_history', () => {
      it('returns athletesMenuItems with availability_report item matchPath being true', () => {
        const items = athletesMenuItems(
          '/athletes/availability_history/sub_path'
        );

        expect(items[2].id).toEqual('availability_report');

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /athletes/screenings', () => {
      it('returns athletesMenuItems with screenings item matchPath being true', () => {
        const items = athletesMenuItems('/athletes/screenings/sub_path');

        expect(items[3].id).toEqual('screenings');

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
      });
    });

    describe('athletesMenuItems permissions', () => {
      it('returns the correct permissions', () => {
        // canViewAthletes
        const itemsCanViewAthletesTrue = athletesMenuItems('', {
          canViewAthletes: true,
        });
        expect(itemsCanViewAthletesTrue[0].id).toEqual('athletes');
        expect(itemsCanViewAthletesTrue[0].allowed).toEqual(true);

        const itemsCanViewAthletesFalse = athletesMenuItems('', {
          canViewAthletes: false,
        });
        expect(itemsCanViewAthletesFalse[0].id).toEqual('athletes');
        expect(itemsCanViewAthletesFalse[0].allowed).toEqual(false);

        // isAvailabilityAdmin
        const itemsIsAvailabilityAdminTrue = athletesMenuItems('', {
          isAvailabilityAdmin: true,
        });
        expect(itemsIsAvailabilityAdminTrue[1].id).toEqual('availability');
        expect(itemsIsAvailabilityAdminTrue[1].allowed).toEqual(true);

        const itemsIsAvailabilityAdminFalse = athletesMenuItems('', {
          isAvailabilityAdmin: false,
        });
        expect(itemsIsAvailabilityAdminFalse[1].id).toEqual('availability');
        expect(itemsIsAvailabilityAdminFalse[1].allowed).toEqual(false);

        // isAvailabilityAdmin && canViewAvailability
        const itemsAvailabilityForbidden = athletesMenuItems('', {
          isAvailabilityAdmin: false,
          canViewAvailability: false,
        });
        expect(itemsAvailabilityForbidden[2].id).toEqual('availability_report');
        expect(itemsAvailabilityForbidden[2].allowed).toEqual(false);

        const itemsAvailabilityAllowed = athletesMenuItems('', {
          isAvailabilityAdmin: true,
          canViewAvailability: false,
        });
        expect(itemsAvailabilityAllowed[2].id).toEqual('availability_report');
        expect(itemsAvailabilityAllowed[2].allowed).toEqual(true);

        // isQuestionnairesAdmin
        const itemsIsQuestionnairesAdminTrue = athletesMenuItems('', {
          isQuestionnairesAdmin: true,
        });
        expect(itemsIsQuestionnairesAdminTrue[3].id).toEqual('screenings');
        expect(itemsIsQuestionnairesAdminTrue[3].allowed).toEqual(true);

        const itemsIsQuestionnairesAdminFalse = athletesMenuItems('', {
          isQuestionnairesAdmin: false,
        });
        expect(itemsIsQuestionnairesAdminFalse[3].id).toEqual('screenings');
        expect(itemsIsQuestionnairesAdminFalse[3].allowed).toEqual(false);
      });
    });

    describe('when the athlete-report-section feature flag is enabled', () => {
      beforeEach(() => {
        window.setFlag('athlete-report-section', true);
      });

      afterEach(() => {
        window.setFlag('athlete-report-section', false);
      });

      it('returns the correct permission for the availability report menu when canViewAvailability is false', () => {
        const itemsAvailabilityAllowed = athletesMenuItems('', {
          canViewAvailabilityReport: false,
          canViewAthletes: true,
        });
        expect(itemsAvailabilityAllowed[2].id).toEqual('availability_report');
        expect(itemsAvailabilityAllowed[2].allowed).toEqual(false);
      });

      it('returns the correct permission for the availability report menu when canViewAthletes is false', () => {
        const itemsAvailabilityAllowed = athletesMenuItems('', {
          canViewAvailabilityReport: true,
          canViewAthletes: false,
        });
        expect(itemsAvailabilityAllowed[2].id).toEqual('availability_report');
        expect(itemsAvailabilityAllowed[2].allowed).toEqual(false);
      });
    });
  });

  describe('workloadsMenuItems', () => {
    describe('when the path starts with /planning_hub/events', () => {
      it('returns workloadsMenuItems with planning item matchPath being true', () => {
        const items = workloadsMenuItems('/planning_hub/events');

        expect(items[0].id).toEqual('planning');

        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /workloads/squad', () => {
      it('returns workloadsMenuItems with squad item matchPath being true', () => {
        const items = workloadsMenuItems('/workloads/squad/sub_path');

        expect(items[2].id).toEqual('squad');

        expect(items[0].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /workloads/athletes', () => {
      it('returns workloadsMenuItems with athlete item matchPath being true', () => {
        const items = workloadsMenuItems('/workloads/athletes/sub_path');

        expect(items[3].id).toEqual('athlete');

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
      });
    });

    describe('workloadsMenuItems permissions', () => {
      beforeEach(() => {
        window.setFlag('planning-session-planning', true);
      });

      afterEach(() => {
        window.setFlag('planning-session-planning', false);
      });

      it('returns the correct permissions', () => {
        // canViewWorkload
        const itemsCanViewWorkloadTrue = workloadsMenuItems('', {
          canViewWorkload: true,
        });
        expect(itemsCanViewWorkloadTrue[0].id).toEqual('planning');
        expect(itemsCanViewWorkloadTrue[0].allowed).toEqual(true);
        expect(itemsCanViewWorkloadTrue[2].id).toEqual('squad');
        expect(itemsCanViewWorkloadTrue[2].allowed).toEqual(true);
        expect(itemsCanViewWorkloadTrue[3].id).toEqual('athlete');
        expect(itemsCanViewWorkloadTrue[3].allowed).toEqual(true);

        const itemsCanViewWorkloadFalse = workloadsMenuItems('', {
          canViewWorkload: false,
        });
        expect(itemsCanViewWorkloadFalse[0].id).toEqual('planning');
        expect(itemsCanViewWorkloadFalse[0].allowed).toEqual(false);
        expect(itemsCanViewWorkloadFalse[2].id).toEqual('squad');
        expect(itemsCanViewWorkloadFalse[2].allowed).toEqual(false);
        expect(itemsCanViewWorkloadFalse[3].id).toEqual('athlete');
        expect(itemsCanViewWorkloadFalse[3].allowed).toEqual(false);
      });
    });
  });

  describe('formsMenuItems', () => {
    describe('when the path starts with /select_athlete', () => {
      it('returns formsMenuItems with kiosk item matchPath being true', () => {
        const items = formsMenuItems('/select_athlete/sub_path', false);

        expect(items[0].id).toEqual('kiosk');

        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /settings/questionnaire_templates', () => {
      it('returns formsMenuItems with manage_forms item matchPath being true', () => {
        const items = formsMenuItems(
          '/settings/questionnaire_templates/sub_path',
          false
        );

        expect(items[1].id).toEqual('manage_forms');

        expect(items[0].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
      });

      describe('when the side-nav-update feature flag is enabled', () => {
        beforeEach(() => {
          window.featureFlags['side-nav-update'] = true;
        });

        afterEach(() => {
          window.featureFlags['side-nav-update'] = false;
        });

        it('returns formsMenuItems with manage_forms item matchPath being true', () => {
          const items = formsMenuItems(
            '/administration/questionnaire_templates/sub_path',
            false
          );

          expect(items[1].id).toEqual('manage_forms');

          expect(items[0].matchPath).toEqual(null);
          expect(items[2].matchPath).toEqual(null);
        });
      });
    });

    describe('when the path starts with /assessments', () => {
      it('returns formsMenuItems with assessments item matchPath being true', () => {
        const items = formsMenuItems('/assessments', false);

        expect(items[2].id).toEqual('assessments');

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
      });
    });

    describe('formsMenuItems permissions', () => {
      beforeEach(() => {
        window.featureFlags['staff-review-area'] = true;
      });

      afterEach(() => {
        window.featureFlags['staff-review-area'] = false;
      });

      it('returns the correct permissions', () => {
        // canViewQuestionnaires
        const itemsCanViewQuestionnairesTrue = formsMenuItems('', false, {
          canViewQuestionnaires: true,
        });
        expect(itemsCanViewQuestionnairesTrue[0].id).toEqual('kiosk');
        expect(itemsCanViewQuestionnairesTrue[0].allowed).toEqual(true);

        const itemsCanViewQuestionnairesFalse = formsMenuItems('', false, {
          canViewQuestionnaires: false,
        });
        expect(itemsCanViewQuestionnairesFalse[0].id).toEqual('kiosk');
        expect(itemsCanViewQuestionnairesFalse[0].allowed).toEqual(false);

        // canManageQuestionnaires
        const itemsCanManageQuestionnairesTrue = formsMenuItems('', false, {
          canManageQuestionnaires: true,
        });
        expect(itemsCanManageQuestionnairesTrue[1].id).toEqual('manage_forms');
        expect(itemsCanManageQuestionnairesTrue[1].allowed).toEqual(true);

        const itemsCanManageQuestionnairesFalse = formsMenuItems('', false, {
          canManageQuestionnaires: false,
        });
        expect(itemsCanManageQuestionnairesFalse[1].id).toEqual('manage_forms');
        expect(itemsCanManageQuestionnairesFalse[1].allowed).toEqual(false);

        // canViewAssessments
        const itemsCanViewAssessmentsTrue = formsMenuItems('', false, {
          canViewAssessments: true,
        });
        expect(itemsCanViewAssessmentsTrue[2].id).toEqual('assessments');
        expect(itemsCanViewAssessmentsTrue[2].allowed).toEqual(true);

        const itemsCanViewAssessmentsFalse = formsMenuItems('', false, {
          canViewAssessments: false,
        });
        expect(itemsCanViewAssessmentsFalse[2].id).toEqual('assessments');
        expect(itemsCanViewAssessmentsFalse[2].allowed).toEqual(false);
      });
    });
  });

  describe('mediaMenuItems', () => {
    beforeEach(() => {
      window.featureFlags = {
        'tso-video-analysis': true,
        'tso-document-management': true,
      };
    });

    describe('when the path starts with /videos', () => {
      it('returns mediaMenuItems with videos item allowed being false if permission doesnt exist', () => {
        const items = mediaMenuItems('/media/videos', {
          canViewTSOVideo: false,
        });

        expect(items[0].id).toEqual('videos');
        expect(items[0].allowed).toEqual(false);
      });

      it('returns mediaMenuItems with videos item matchPath being true', () => {
        const items = mediaMenuItems('/media/videos', {
          canViewTSOVideo: true,
        });

        expect(items[0].id).toEqual('videos');
        expect(items[0].allowed).toEqual(true);
      });

      it('returns mediaMenuItems with documents item allowed being false if permission doesnt exist', () => {
        const items = mediaMenuItems('/media/documents', {
          canViewTSODocument: false,
        });

        expect(items[1].id).toEqual('documents');
        expect(items[1].allowed).toEqual(false);
      });

      it('returns mediaMenuItems with documents item matchPath being true', () => {
        const items = mediaMenuItems('/media/documents');

        expect(items[1].id).toEqual('documents');
      });
    });
  });
});
