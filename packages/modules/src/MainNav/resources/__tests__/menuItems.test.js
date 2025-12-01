import menuItems, { getFirstSubmenuUrl, hasSubMenu } from '../menuItems';

describe('menuItems', () => {
  describe('getFirstSubmenuUrl', () => {
    it('returns the url of the first submenu item allowed', () => {
      const url = getFirstSubmenuUrl([
        {
          href: '/forbiddenUrl',
          allowed: false,
        },
        {
          href: '/allowedUrl1',
          allowed: true,
        },
        {
          href: '/allowedUrl2',
          allowed: true,
        },
      ]);

      expect(url).toEqual('/allowedUrl1');
    });

    describe('when the submenu list is empty', () => {
      it('returns an empty string', () => {
        const url = getFirstSubmenuUrl([]);

        expect(url).toEqual('');
      });
    });

    describe('when all the submenu items are forbidden', () => {
      it('returns an empty string', () => {
        const url = getFirstSubmenuUrl([
          {
            href: '/forbiddenUrl1',
            allowed: false,
          },
          {
            href: '/forbiddenUrl2',
            allowed: false,
          },
        ]);

        expect(url).toEqual('');
      });
    });
  });

  describe('hasSubMenu', () => {
    it('returns true if at least two submenu items are allowed', () => {
      expect(
        hasSubMenu([
          {
            allowed: false,
          },
          {
            allowed: true,
          },
          {
            allowed: true,
          },
        ])
      ).toEqual(true);
    });

    it('returns false when the submenu list is empty', () => {
      expect(hasSubMenu([])).toEqual(false);
    });

    it('returns false when the submenu has only one item allowed', () => {
      expect(
        hasSubMenu([
          {
            allowed: false,
          },
          {
            allowed: true,
          },
        ])
      ).toEqual(false);
    });
  });

  describe('menuItems', () => {
    const permissions = {
      canViewDashboard: true,
      canViewAthleteAnalysis: true,
      canViewAthletes: true,
      canViewWorkload: true,
      canViewQuestionnaires: true,
      canViewAnalyticalDashboard: true,
      canViewAnalyticalGraphs: true,
      canViewSquadAnalysis: true,
      canManageAthletes: true,
      canManageGeneralSettings: true,
      canManageWorkload: true,
      canManageQuestionnaires: true,
      canViewAlerts: true,
      canViewMessaging: true,
      canViewHomepage: true,
      canViewTSOVideo: true,
      canViewTSODocument: true,
      canViewTSOEvent: true,
      canViewTSORecruitment: true,
    };

    beforeEach(() => {
      window.featureFlags['mls-emr-documents-area'] = true;
      window.featureFlags['chat-web'] = true;
      window.setFlag('web-home-page', true);
      window.featureFlags['medical-module-parent'] = true;
      window.featureFlags['league-ops-registration-module'] = true;
      window.setFlag('growth-and-maturation-area', true);
      window.setFlag('training-variables-importer', true);
    });

    afterEach(() => {
      window.featureFlags['mls-emr-documents-area'] = false;
      window.featureFlags['chat-web'] = false;
      window.setFlag('web-home-page', false);
      window.featureFlags['medical-module-parent'] = false;
      window.featureFlags['league-ops-registration-module'] = false;
      window.setFlag('growth-and-maturation-area', false);
      window.setFlag('training-variables-importer', false);
    });

    describe('when the path starts with /home_dashboards', () => {
      it('returns menuItems with homepage item matchPath being true', () => {
        const items = menuItems('/home_dashboards/sub_path', permissions, true);

        expect(items[0].id).toEqual('homepage');
        expect(items[0].href).toEqual('/home_dashboards');
        expect(items[0].matchPath).not.toEqual(null);

        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[7].matchPath).toEqual(false);
        expect(items[8].matchPath).toEqual(null);
        expect(items[9].matchPath).toEqual(null);
        expect(items[10].matchPath).toEqual(null);
        expect(items[11].matchPath).toEqual(null);
        expect(items[12].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /dashboards', () => {
      it('returns menuItems with dashboard item matchPath being true', () => {
        const items = menuItems('/dashboards/sub_path', permissions);

        expect(items[1].id).toEqual('metric_dashboard');
        expect(items[1].href).toEqual('/dashboards/show');
        expect(items[1].matchPath).not.toEqual(null);

        expect(items[0].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[7].matchPath).toEqual(false);
        expect(items[8].matchPath).toEqual(null);
        expect(items[9].matchPath).toEqual(null);
        expect(items[10].matchPath).toEqual(null);
        expect(items[11].matchPath).toEqual(null);
        expect(items[12].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /analysis', () => {
      it('returns menuItems with analysis item matchPath being true', () => {
        const items = menuItems('/analysis/sub_path', permissions);

        expect(items[2].id).toEqual('analysis');
        expect(items[2].href).toEqual('/analysis/dashboard');
        expect(items[2].matchPath).not.toEqual(null);

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[7].matchPath).toEqual(false);
        expect(items[8].matchPath).toEqual(null);
        expect(items[9].matchPath).toEqual(null);
        expect(items[10].matchPath).toEqual(null);
        expect(items[11].matchPath).toEqual(null);
        expect(items[12].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /alerts', () => {
      beforeEach(() => {
        window.featureFlags = {
          'alerts-area': true,
        };
      });

      afterEach(() => {
        window.featureFlags = {};
      });

      it('returns menuItems with alerts item matchPath being true', () => {
        const items = menuItems('/alerts/sub_path', permissions);

        expect(items[3].id).toEqual('alerts');
        expect(items[3].href).toEqual('/alerts');
        expect(items[3].matchPath).not.toEqual(null);

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[7].matchPath).toEqual(false);
        expect(items[8].matchPath).toEqual(null);
        expect(items[9].matchPath).toEqual(null);
        expect(items[10].matchPath).toEqual(null);
        expect(items[11].matchPath).toEqual(null);
        expect(items[12].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /athletes', () => {
      it('returns menuItems with analysis item matchPath being true', () => {
        const items = menuItems('/athletes/sub_path', permissions);

        expect(items[4].id).toEqual('athletes');
        expect(items[4].href).toEqual('/athletes');
        expect(items[4].matchPath).not.toEqual(null);

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[7].matchPath).toEqual(false);
        expect(items[8].matchPath).toEqual(null);
        expect(items[9].matchPath).toEqual(null);
        expect(items[10].matchPath).toEqual(null);
        expect(items[11].matchPath).toEqual(null);
        expect(items[12].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /athletes/reports', () => {
      it('returns menuItems with analysis item matchPath being true', () => {
        const items = menuItems('/athletes/reports/sub_path', permissions);

        expect(items[4].id).toEqual('athletes');
        expect(items[4].href).toEqual('/athletes');
        expect(items[4].matchPath).toEqual(null);

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[7].matchPath).toEqual(false);
        expect(items[8].matchPath).toEqual(null);
        expect(items[9].matchPath).toEqual(null);
        expect(items[10].matchPath).toEqual(null);
        expect(items[11].matchPath).toEqual(null);
        expect(items[12].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /medical/rosters', () => {
      it('returns menuItems with medical item matchPath being true', () => {
        const items = menuItems('/medical/sub_path', permissions);

        expect(items[5].id).toEqual('medical');
        expect(items[5].href).toEqual('/medical/rosters');
        expect(items[5].matchPath).toEqual(null);

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[7].matchPath).toEqual(false);
        expect(items[8].matchPath).toEqual(null);
        expect(items[9].matchPath).toEqual(null);
        expect(items[10].matchPath).toEqual(null);
        expect(items[11].matchPath).toEqual(null);
        expect(items[12].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /medical/athletes', () => {
      it('returns menuItems with medical item matchPath being true', () => {
        const items = menuItems('/medical/sub_path', permissions);

        expect(items[5].id).toEqual('medical');
        expect(items[5].matchPath).toEqual(null);

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[7].matchPath).toEqual(false);
        expect(items[8].matchPath).toEqual(null);
        expect(items[9].matchPath).toEqual(null);
        expect(items[10].matchPath).toEqual(null);
        expect(items[11].matchPath).toEqual(null);
        expect(items[12].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /workloads', () => {
      it('returns menuItems with workloads item matchPath being true', () => {
        const items = menuItems('/workloads/sub_path', permissions);

        expect(items[6].id).toEqual('workloads');
        expect(items[6].href).toEqual('/workloads/squad');
        expect(items[6].matchPath).not.toEqual(null);

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[7].matchPath).toEqual(false);
        expect(items[8].matchPath).toEqual(null);
        expect(items[9].matchPath).toEqual(null);
        expect(items[10].matchPath).toEqual(null);
        expect(items[11].matchPath).toEqual(null);
        expect(items[12].matchPath).toEqual(null);
      });

      it('sets allowed to false when the user is a league staff user', () => {
        permissions.canViewWorkload = true;
        const items = menuItems('/workloads/sub_path', permissions, false, {
          isLeagueStaffUser: true,
        });

        expect(items[6].id).toEqual('workloads');
        expect(items[6].allowed).toEqual(false);
      });

      it('sets allowed to false when the user is an scout', () => {
        permissions.canViewWorkload = true;
        const items = menuItems(
          '/planning_hub/events/sub_path',
          permissions,
          false,
          {
            isLeagueStaffUser: false,
            isScout: true,
          }
        );

        expect(items[6].id).toEqual('workloads');
        expect(items[6].allowed).toEqual(false);
      });
    });

    describe('when the path starts with /questionnaires', () => {
      it('returns menuItems with form item matchPath being true', () => {
        const items = menuItems('/questionnaires/sub_path', permissions);

        expect(items[7].id).toEqual('forms');
        expect(items[7].href).toEqual('/select_athlete');
        expect(items[7].matchPath).not.toEqual(null);

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[8].matchPath).toEqual(null);
        expect(items[9].matchPath).toEqual(null);
        expect(items[10].matchPath).toEqual(null);
        expect(items[11].matchPath).toEqual(null);
        expect(items[12].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /select_athlete', () => {
      it('returns menuItems with forms item matchPath being true', () => {
        const items = menuItems('/select_athlete/sub_path', permissions);

        expect(items[7].id).toEqual('forms');
        expect(items[7].matchPath).not.toEqual(null);

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[8].matchPath).toEqual(null);
        expect(items[9].matchPath).toEqual(null);
        expect(items[10].matchPath).toEqual(null);
        expect(items[11].matchPath).toEqual(null);
        expect(items[12].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /settings/questionnaire_templates', () => {
      it('returns menuItems with forms item matchPath being true', () => {
        const items = menuItems(
          '/settings/questionnaire_templates/sub_path',
          permissions
        );

        expect(items[7].id).toEqual('forms');
        expect(items[7].matchPath).not.toEqual(null);

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[8].matchPath).toEqual(null);
        expect(items[9].matchPath).toEqual(null);
        expect(items[10].matchPath).toEqual(null);
        expect(items[11].matchPath).toEqual(null);
        expect(items[12].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /assessments', () => {
      it('returns menuItems with forms item matchPath being true', () => {
        const items = menuItems('/assessments', permissions);

        expect(items[7].id).toEqual('forms');
        expect(items[7].matchPath).not.toEqual(null);

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[8].matchPath).toEqual(null);
        expect(items[9].matchPath).toEqual(null);
        expect(items[10].matchPath).toEqual(null);
        expect(items[11].matchPath).toEqual(null);
        expect(items[12].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /reviews', () => {
      it('returns menuItems with forms item matchPath being true', () => {
        const items = menuItems('/reviews', permissions);

        expect(items[7].id).toEqual('forms');
        expect(items[7].matchPath).not.toEqual(null);

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[8].matchPath).toEqual(null);
        expect(items[9].matchPath).toEqual(null);
        expect(items[10].matchPath).toEqual(null);
        expect(items[11].matchPath).toEqual(null);
        expect(items[12].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /growth_and_maturation', () => {
      it('returns menuItems with forms item matchPath being true', () => {
        const items = menuItems('/growth_and_maturation', permissions);

        expect(items[7].id).toEqual('forms');
        expect(items[7].matchPath).not.toEqual(null);

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[8].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /benchmark', () => {
      it('returns menuItems with forms item matchPath being true', () => {
        const items = menuItems('/benchmark', permissions);

        expect(items[7].id).toEqual('forms');
        expect(items[7].matchPath).not.toEqual(null);

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[8].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /calendar', () => {
      it('returns menuItems with calendar item matchPath being true', () => {
        const items = menuItems('/calendar/sub_path', permissions);

        expect(items[8].id).toEqual('calendar');
        expect(items[8].href).toEqual('/calendar');
        expect(items[8].matchPath).not.toEqual(null);

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[7].matchPath).toEqual(false);
        expect(items[9].matchPath).toEqual(null);
        expect(items[10].matchPath).toEqual(null);
        expect(items[11].matchPath).toEqual(null);
        expect(items[12].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /documents', () => {
      it('returns menuItems with documents item matchPath being true', () => {
        const items = menuItems('/documents', permissions);

        expect(items[9].id).toEqual('documents');
        expect(items[9].href).toEqual('/documents');
        expect(items[9].matchPath).not.toEqual(null);

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[7].matchPath).toEqual(false);
        expect(items[8].matchPath).toEqual(null);
        expect(items[10].matchPath).toEqual(null);
        expect(items[11].matchPath).toEqual(null);
        expect(items[12].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /activity', () => {
      it('returns menuItems with activity item matchPath being true', () => {
        const items = menuItems('/activity/sub_path', permissions);

        expect(items[10].id).toEqual('activity');
        expect(items[10].href).toEqual('/activity');
        expect(items[10].matchPath).not.toEqual(null);

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[7].matchPath).toEqual(false);
        expect(items[8].matchPath).toEqual(null);
        expect(items[9].matchPath).toEqual(null);
        expect(items[11].matchPath).toEqual(null);
        expect(items[12].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /messaging', () => {
      it('returns menuItems with chat item matchPath being true', () => {
        const items = menuItems('/messaging/sub_path', permissions);

        expect(items[11].id).toEqual('messaging');
        expect(items[11].href).toEqual('/messaging');
        expect(items[11].matchPath).not.toEqual(null);

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[7].matchPath).toEqual(false);
        expect(items[8].matchPath).toEqual(null);
        expect(items[9].matchPath).toEqual(null);
        expect(items[10].matchPath).toEqual(null);
        expect(items[12].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /settings', () => {
      it('returns menuItems with settings item matchPath being true', () => {
        const items = menuItems('/settings/sub_path', permissions);

        expect(items[17].id).toEqual('settings');
        expect(items[17].href).toEqual('/settings/athletes');
        expect(items[17].matchPath).not.toEqual(null);

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[7].matchPath).toEqual(false);
        expect(items[8].matchPath).toEqual(null);
        expect(items[9].matchPath).toEqual(null);
        expect(items[10].matchPath).toEqual(null);
        expect(items[11].matchPath).toEqual(null);
        expect(items[12].matchPath).toEqual(null);
        expect(items[13].matchPath).toEqual(null);
        expect(items[14].matchPath).toEqual(null);
      });

      it('sets allowed to false for the settings item if all relevant permissions are false', () => {
        permissions.canManageAthletes = false;
        permissions.canManageGeneralSettings = false;
        permissions.canManageWorkload = false;
        window.featureFlags['tso-league-fixture-management'] = false;
        window.featureFlags['tso-league-jtc-fixture-management'] = false;

        const items = menuItems('/settings/sub_path', permissions);

        expect(items[17].id).toEqual('settings');
        expect(items[17].allowed).toEqual(false);
      });

      it('sets allowed to true for the settings item if canManageAthletes is false but other relevant permissions are true', () => {
        permissions.canManageAthletes = false;
        permissions.canManageGeneralSettings = true;
        permissions.canManageWorkload = true;

        const items = menuItems('/settings/sub_path', permissions);

        expect(items[17].id).toEqual('settings');
        expect(items[17].allowed).toEqual(true);
      });

      it('sets allowed to true for the settings item if canManageGeneralSettings is false but other relevant permissions are true', () => {
        permissions.canManageAthletes = true;
        permissions.canManageGeneralSettings = false;
        permissions.canManageWorkload = true;

        const items = menuItems('/settings/sub_path', permissions);

        expect(items[17].id).toEqual('settings');
        expect(items[17].allowed).toEqual(true);
      });

      it('sets allowed to true for the settings item if canManageWorkload is false but other relevant permissions are true', () => {
        permissions.canManageAthletes = true;
        permissions.canManageGeneralSettings = true;
        permissions.canManageWorkload = false;

        const items = menuItems('/settings/sub_path', permissions);

        expect(items[17].id).toEqual('settings');
        expect(items[17].allowed).toEqual(true);
      });

      it('sets allowed to true for the settings item if fixture management feature flag is true', () => {
        window.featureFlags['tso-league-club-admin'] = true;

        const items = menuItems('/fixture-management', permissions);

        expect(items[17].id).toEqual('settings');
        expect(items[17].allowed).toEqual(true);
      });

      it('returns the homepage as forbidden when includeHomepage is false', () => {
        const includeHomepage = false;
        const items = menuItems(
          '/settings/sub_path',
          permissions,
          includeHomepage
        );

        expect(items[0].id).toEqual('homepage');
        expect(items[0].allowed).toEqual(false);
      });

      it('returns the homepage as forbidden when canViewHomepage is false', () => {
        permissions.canViewHomepage = false;
        const includeHomepage = true;
        const items = menuItems(
          '/settings/sub_path',
          permissions,
          includeHomepage
        );

        expect(items[0].id).toEqual('homepage');
        expect(items[0].allowed).toEqual(false);
      });

      describe('when the side-nav-update feature flag is enabled', () => {
        beforeEach(() => {
          window.featureFlags['side-nav-update'] = true;
        });

        afterEach(() => {
          window.featureFlags['side-nav-update'] = false;
        });

        it('returns the homepage and alerts items as forbidden', () => {
          const items = menuItems('/', permissions);

          expect(items[0].id).toEqual('homepage');
          expect(items[0].allowed).toEqual(false);
          expect(items[3].id).toEqual('alerts');
          expect(items[3].allowed).toEqual(false);
        });

        it('returns menuItems with settings item matchPath being true', () => {
          const items = menuItems('/administration/sub_path', permissions);

          expect(items[17].id).toEqual('settings');
          expect(items[17].href).toEqual('/administration/athletes');
          expect(items[17].matchPath).not.toEqual(null);

          expect(items[0].matchPath).toEqual(null);
          expect(items[1].matchPath).toEqual(null);
          expect(items[2].matchPath).toEqual(null);
          expect(items[3].matchPath).toEqual(null);
          expect(items[4].matchPath).toEqual(null);
          expect(items[5].matchPath).toEqual(null);
          expect(items[6].matchPath).toEqual(null);
          expect(items[7].matchPath).toEqual(false);
          expect(items[8].matchPath).toEqual(null);
          expect(items[9].matchPath).toEqual(null);
          expect(items[10].matchPath).toEqual(null);
          expect(items[11].matchPath).toEqual(null);
          expect(items[12].matchPath).toEqual(null);
          expect(items[13].matchPath).toEqual(null);
          expect(items[14].matchPath).toEqual(null);
        });

        describe('when the path starts with /administration/questionnaire_templates', () => {
          it('returns menuItems with forms item matchPath being true', () => {
            const items = menuItems(
              '/administration/questionnaire_templates/sub_path',
              permissions
            );

            expect(items[7].id).toEqual('forms');
            expect(items[7].matchPath).not.toEqual(null);

            expect(items[0].matchPath).toEqual(null);
            expect(items[1].matchPath).toEqual(null);
            expect(items[2].matchPath).toEqual(null);
            expect(items[3].matchPath).toEqual(null);
            expect(items[4].matchPath).toEqual(null);
            expect(items[5].matchPath).toEqual(null);
            expect(items[6].matchPath).toEqual(null);
            expect(items[8].matchPath).toEqual(null);
            expect(items[9].matchPath).toEqual(null);
            expect(items[10].matchPath).toEqual(null);
            expect(items[11].matchPath).toEqual(null);
            expect(items[12].matchPath).toEqual(null);
          });
        });
      });
    });

    describe('when the path starts with /media/videos', () => {
      beforeEach(() => {
        window.featureFlags = {
          'tso-video-analysis': true,
        };
      });

      afterEach(() => {
        window.featureFlags = {};
      });

      it('returns menuItems with videos item matchPath being true', () => {
        const items = menuItems('/media/videos', permissions);

        expect(items[12].id).toEqual('media');
        expect(items[12].href).toEqual('/media/videos');
        expect(items[12].matchPath).not.toEqual(null);

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[7].matchPath).toEqual(false);
        expect(items[8].matchPath).toEqual(null);
        expect(items[10].matchPath).toEqual(null);
        expect(items[11].matchPath).toEqual(null);
      });

      it('returns menuItems with videos item allowed being false if permission in false', () => {
        permissions.canViewTSOVideo = false;
        const items = menuItems('/media/videos', permissions);

        expect(items[12].id).toEqual('media');
        expect(items[12].allowed).toEqual(false);
      });
    });

    describe('when the path starts with /media/documents', () => {
      beforeEach(() => {
        window.featureFlags = {
          'tso-document-management': true,
        };
      });

      afterEach(() => {
        window.featureFlags = {};
      });

      it('returns menuItems with documents item matchPath being true', () => {
        const items = menuItems('/media/documents', permissions);

        expect(items[12].id).toEqual('media');
        expect(items[12].href).toEqual('/media/documents');
        expect(items[12].matchPath).not.toEqual(null);

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[7].matchPath).toEqual(false);
        expect(items[8].matchPath).toEqual(null);
        expect(items[10].matchPath).toEqual(null);
        expect(items[11].matchPath).toEqual(null);
      });

      it('returns menuItems with documents item allowed being false if permission in false', () => {
        permissions.canViewTSODocument = false;
        const items = menuItems('/media/documents', permissions);

        expect(items[12].id).toEqual('media');
        expect(items[12].allowed).toEqual(false);
      });
    });

    describe('when the path starts with /recruitment', () => {
      beforeEach(() => {
        window.featureFlags = {
          'tso-recruitment': true,
        };
      });

      afterEach(() => {
        window.featureFlags = {};
      });

      it('returns menuItems with recruitment item matchPath being true', () => {
        const items = menuItems('/recruitment', permissions);

        expect(items[13].id).toEqual('recruitment');
        expect(items[13].href).toEqual('/recruitment');
        expect(items[13].matchPath).not.toEqual(null);

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[7].matchPath).toEqual(false);
        expect(items[8].matchPath).toEqual(null);
        expect(items[10].matchPath).toEqual(null);
        expect(items[11].matchPath).toEqual(null);
        expect(items[12].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /registration', () => {
      it('returns menuItems with registration item matchPath being true', () => {
        const items = menuItems('/registration', permissions);

        expect(items[14].id).toEqual('registration');
        expect(items[14].href).toEqual('/registration');
        expect(items[14].matchPath).not.toEqual(null);

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[7].matchPath).toEqual(false);
        expect(items[8].matchPath).toEqual(null);
        expect(items[9].matchPath).toEqual(null);
        expect(items[10].matchPath).toEqual(null);
        expect(items[11].matchPath).toEqual(null);
        expect(items[12].matchPath).toEqual(null);
        expect(items[13].matchPath).toEqual(null);
      });
    });

    describe('when the path starts with /league-fixtures', () => {
      it('sets allowed to true when the user is a league staff user', () => {
        permissions.canViewGameSchedule = true;
        const items = menuItems('/league-fixtures', permissions, false, {
          isLeagueStaffUser: true,
        });

        expect(items[15].id).toEqual('league-fixtures');
        expect(items[15].allowed).toEqual(true);
      });

      it('sets allowed to true when the user is an scout', () => {
        permissions.canViewGameSchedule = true;
        const items = menuItems('/league-fixtures', permissions, false, {
          isLeagueStaffUser: false,
          isScout: true,
        });

        expect(items[15].id).toEqual('league-fixtures');
        expect(items[15].allowed).toEqual(true);
      });
    });

    describe('when the path starts with /efile', () => {
      it('returns menuItems with efile item matchPath being true', () => {
        const items = menuItems('/efile');

        expect(items[16].id).toEqual('efile');
        expect(items[16].href).toEqual('/efile/inbox');
        expect(items[16].matchPath).not.toEqual(null);
        expect(items[16].allowed).toEqual(undefined);

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[7].matchPath).toEqual(false);
        expect(items[8].matchPath).toEqual(null);
        expect(items[9].matchPath).toEqual(null);
        expect(items[10].matchPath).toEqual(null);
        expect(items[11].matchPath).toEqual(null);
        expect(items[12].matchPath).toEqual(null);
        expect(items[13].matchPath).toEqual(null);
        expect(items[14].matchPath).toEqual(null);
        expect(items[15].matchPath).toEqual(null);
      });

      it('sets allowed to true when the nfl-efile FF is true and permissions.canViewElectronicFiles = true', () => {
        window.featureFlags['nfl-efile'] = true;
        const items = menuItems('/efile', {
          ...permissions,
          canViewElectronicFiles: true,
        });

        expect(items[16].id).toEqual('efile');
        expect(items[16].allowed).toEqual(true);
      });

      it('sets allowed to true when the nfl-efile FF is false', () => {
        window.featureFlags['nfl-efile'] = false;
        const items = menuItems('/efile');

        expect(items[16].id).toEqual('efile');
        expect(items[16].allowed).toEqual(false);
      });

      it('sets allowed to false when permissions.canViewElectronicFiles = false', () => {
        window.setFlag('nfl-efile', true);
        const items = menuItems('/efile', {
          ...permissions,
          canViewElectronicFiles: false,
        });

        expect(items[16].id).toEqual('efile');
        expect(items[16].allowed).toEqual(false);
      });
    });
  });

  describe('when the path starts with ‘/training_data_importer’', () => {
    beforeAll(() => {
      window.featureFlags = {};
    });

    describe('when ‘training-variables-importer’ feature flag is on', () => {
      beforeEach(() => {
        window.setFlag('training-variables-importer', true);
      });

      afterEach(() => {
        window.setFlag('training-variables-importer', false);
      });

      it('returns an array with ‘Forms’ section matched only', () => {
        const items = menuItems('/training_data_importer');
        expect(items[7].matchPath).toEqual(true);

        expect(items[0].matchPath).toEqual(null);
        expect(items[1].matchPath).toEqual(null);
        expect(items[2].matchPath).toEqual(null);
        expect(items[3].matchPath).toEqual(null);
        expect(items[4].matchPath).toEqual(null);
        expect(items[5].matchPath).toEqual(null);
        expect(items[6].matchPath).toEqual(null);
        expect(items[8].matchPath).toEqual(null);
        expect(items[9].matchPath).toEqual(null);
        expect(items[10].matchPath).toEqual(null);
        expect(items[11].matchPath).toEqual(null);
        expect(items[12].matchPath).toEqual(null);
        expect(items[13].matchPath).toEqual(null);
        expect(items[14].matchPath).toEqual(null);
        expect(items[15].matchPath).toEqual(null);
        expect(items[16].matchPath).toEqual(null);
        expect(items[17].matchPath).toEqual(null);
        expect(items[18].matchPath).toEqual(null);
      });

      it('‘Forms’ section is allowed', () => {
        const items = menuItems('/training_data_importer');

        expect(items[7].allowed).toEqual(true);
      });
    });

    describe('when ‘training-variables-importer’ feature flag is off', () => {
      it('‘Forms’ section isn’t allowed', () => {
        const items = menuItems('/training_data_importer');

        expect(items[7].allowed).toEqual(false);
      });
    });
  });
});

describe('menuitems from the login_organisation perspective', () => {
  describe('when the path starts with /home_dashboards', () => {
    const leagueOperations = {
      isLoginOrganisation: true,
    };

    it('returns menuItems with athlete_exports item matchPath being true', () => {
      const items = menuItems('/my_exports', {}, true, leagueOperations);
      expect(items[18].id).toEqual('athlete_exports');
      expect(items[18].href).toEqual('/my_exports');
      expect(items[18].matchPath).not.toEqual(null);
      expect(items[18].allowed).toEqual(true);
    });
  });
});

describe('[feature-flag] cp-hide-forms-in-player-portal', () => {
  const permissions = {
    canViewQuestionnaires: true,
    canViewAssessments: true,
  };

  beforeEach(() => {
    window.featureFlags['side-nav-update'] = true;
  });

  afterEach(() => {
    window.featureFlags['side-nav-update'] = false;
  });

  it('returns menuItems with forms item allowed = true when FF is off', () => {
    const items = menuItems(
      '/administration/questionnaire_templates/*',
      permissions
    );

    expect(items[7].id).toEqual('forms');
    expect(items[7].allowed).toEqual(true);
  });

  it('returns menuItems with forms item allowed = true when FF is on', () => {
    window.setFlag('cp-hide-forms-in-player-portal', true);

    const items = menuItems(
      '/administration/questionnaire_templates/*',
      permissions
    );

    expect(items[7].id).toEqual('forms');
    expect(items[7].allowed).toEqual(false);

    window.setFlag('cp-hide-forms-in-player-portal', false);
  });
});

describe('menuItems for the analysis module', () => {
  const permissions = {
    canViewAnalyticalDashboard: false,
    canViewAnalyticalGraphs: false,
    canViewSquadAnalysis: false,
    canViewAthleteAnalysis: false,
    canViewInjuryAnalysis: false,
    canViewBiomechanicalAnalysis: false,
    canViewPowerBiEmbeddedReports: false,
  };

  test.each(Object.keys(permissions))(
    'it allows the analysis menu when %s is active',
    (permission) => {
      const updatedPermissions = {
        ...permissions,
        [permission]: true,
      };
      const items = menuItems('/analysis', updatedPermissions, false, {}, {}, [
        { id: 122, name: 'Power BI Report' }, // mocking power BI reports
      ]);
      const analysisItem = items.find((item) => item.id === 'analysis');

      expect(analysisItem.allowed).toEqual(true);
    }
  );

  it('renders the correct href for the analysis item when canViewPowerBiEmbeddedReports is true', () => {
    const updatedPermissions = {
      ...permissions,
      canViewPowerBiEmbeddedReports: true,
    };
    const items = menuItems('/analysis', updatedPermissions, false, {}, {}, [
      { id: 122, name: 'Power BI Report' }, // mocking power BI reports
    ]);
    const analysisItem = items.find((item) => item.id === 'analysis');

    expect(analysisItem.href).toEqual('power_bi_embedded_reports/122');
  });
});
