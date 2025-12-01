jest.mock(
  '@kitman/services/src/services/settings/organisation_switcher/put',
  () => jest.fn()
);

describe('openLastKnownPageOnSignIn', () => {
  const userId = 'user123';
  const orgId = 'org456';
  const squadId = 'squad789';
  const validSquadIds = ['squad789', 'squad101', 'squad202'];

  // Those are imported dynamically because some mocks must be set up before
  // importing the file.
  let openLastKnownPageOnSignIn;
  let setLastKnownSquad;
  let setLastKnownOrg;
  let switchOrganisation;

  let sessionStorageSetItemSpy;
  let sessionStorageGetItemSpy;

  let originalLocation;
  let originalSessionStorage;

  beforeEach(async () => {
    jest.resetModules();

    process.env.REACT_APP_TARGET = '';

    originalLocation = window.location;
    originalSessionStorage = window.sessionStorage;

    const mockLocation = {
      toString: jest.fn().mockReturnValue('http://localhost/'),
      pathname: '/',
      href: '',
      assign: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      origin: 'http://localhost',
      protocol: 'http:',
      host: 'localhost',
      hostname: 'localhost',
      port: '',
      search: '',
      hash: '',
    };

    const mockSessionStorage = {
      getItem: jest.fn().mockReturnValue(null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      length: 0,
      key: jest.fn(),
    };

    delete window.location;
    window.location = mockLocation;

    delete window.sessionStorage;
    window.sessionStorage = mockSessionStorage;

    sessionStorageSetItemSpy = mockSessionStorage.setItem;
    sessionStorageGetItemSpy = mockSessionStorage.getItem;

    window.featureFlags = {
      'cp-open-last-known-page-on-sign-in': true,
      'homepage-medical-area': false,
      'homepage-availability-sheet': false,
      'web-home-page': false,
    };

    global.URL = jest.fn().mockImplementation((url) => ({
      pathname: url === 'http://localhost/' ? '/' : '/some-path',
      href: url,
    }));

    const openLastKnownPageOnSignInModule = await import(
      '../openLastKnownPageOnSignIn'
    );
    openLastKnownPageOnSignIn =
      openLastKnownPageOnSignInModule.openLastKnownPageOnSignIn;
    setLastKnownSquad = openLastKnownPageOnSignInModule.setLastKnownSquad;
    setLastKnownOrg = openLastKnownPageOnSignInModule.setLastKnownOrg;

    const organisationSwitcherModule = await import(
      '@kitman/services/src/services/settings/organisation_switcher/put'
    );
    switchOrganisation = organisationSwitcherModule.default;
    switchOrganisation.mockResolvedValue({});
  });

  afterEach(() => {
    delete process.env.REACT_APP_TARGET;
    delete window.featureFlags;

    delete window.location;
    window.location = originalLocation;

    delete window.sessionStorage;
    window.sessionStorage = originalSessionStorage;

    delete global.URL;
  });

  describe('when `sessionStorage` isn’t available', () => {
    beforeEach(async () => {
      jest.resetModules();

      delete window.sessionStorage;
      window.sessionStorage = undefined;

      const openLastKnownPageOnSignInModule = await import(
        '../openLastKnownPageOnSignIn'
      );
      openLastKnownPageOnSignIn =
        openLastKnownPageOnSignInModule.openLastKnownPageOnSignIn;
      setLastKnownSquad = openLastKnownPageOnSignInModule.setLastKnownSquad;
      setLastKnownOrg = openLastKnownPageOnSignInModule.setLastKnownOrg;
    });

    it('handles missing `sessionStorage`', async () => {
      window.featureFlags['cp-open-last-known-page-on-sign-in'] = false;

      const setLastKnownPage = await openLastKnownPageOnSignIn(
        userId,
        orgId,
        validSquadIds,
        squadId
      );

      expect(setLastKnownPage).toBeNull();
      expect(() => {
        setLastKnownSquad(123, userId);
      }).not.toThrow();
      expect(() => {
        setLastKnownOrg(456, userId);
      }).not.toThrow();
    });

    it('returns a function when ‘cp-open-last-known-page-on-sign-in’ feature flag is enabled and `sessionStorage` is missing', async () => {
      window.featureFlags['cp-open-last-known-page-on-sign-in'] = true;
      window.location.toString.mockReturnValue('http://localhost/some-page');
      window.location.pathname = '/some-page';

      const setLastKnownPage = await openLastKnownPageOnSignIn(
        userId,
        orgId,
        validSquadIds,
        squadId
      );

      expect(typeof setLastKnownPage).toBe('function');
    });
  });

  it('invalidates all stored values and returns `null` when ‘cp-open-last-known-page-on-sign-in’ feature flag is disabled', async () => {
    window.featureFlags['cp-open-last-known-page-on-sign-in'] = false;

    const setLastKnownPage = await openLastKnownPageOnSignIn(
      userId,
      orgId,
      validSquadIds,
      squadId
    );

    expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
      'lastKnownPageOfuser123',
      ''
    );
    expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
      'lastKnownSquadOfuser123',
      ''
    );
    expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
      'lastKnownOrgOfuser123',
      ''
    );
    expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
      'isTryingToRestoreLastKnownPage',
      false
    );
    expect(setLastKnownPage).toBeNull();
  });

  it('handles missing currentSquadId', async () => {
    window.location.toString.mockReturnValue('http://localhost/some-page');
    window.location.pathname = '/some-page';

    const setLastKnownPage = await openLastKnownPageOnSignIn(
      userId,
      orgId,
      validSquadIds
    );

    expect(setLastKnownPage).toBeDefined();
  });

  it('handles process.env access errors', async () => {
    const originalProcess = global.process;

    global.process = new Proxy(
      {},
      {
        get() {
          throw new Error('process is not defined');
        },
      }
    );

    const setLastKnownPage = await openLastKnownPageOnSignIn(
      userId,
      orgId,
      validSquadIds,
      squadId
    );

    global.process = originalProcess;
    expect(setLastKnownPage).toBeDefined();
  });

  it('handles empty session storage values', async () => {
    sessionStorageGetItemSpy.mockReturnValue('');

    const setLastKnownPage = await openLastKnownPageOnSignIn(
      userId,
      orgId,
      validSquadIds,
      squadId
    );

    expect(typeof setLastKnownPage).toBe('function');
  });

  describe('when ‘cp-open-last-known-page-on-sign-in’ feature flag is enabled', () => {
    it('detects the dashboard homepage', async () => {
      window.location.toString.mockReturnValue(
        'http://localhost/dashboards/show'
      );

      const setLastKnownPage = await openLastKnownPageOnSignIn(
        userId,
        orgId,
        validSquadIds
      );

      expect(setLastKnownPage).not.toBeNull();
      expect(typeof setLastKnownPage).toBe('function');
    });

    it('detects root path as homepage', async () => {
      window.location.pathname = '/';

      const setLastKnownPage = await openLastKnownPageOnSignIn(
        userId,
        orgId,
        validSquadIds
      );

      expect(setLastKnownPage).not.toBeNull();
      expect(typeof setLastKnownPage).toBe('function');
    });

    it('detects the medical area homepage', async () => {
      window.featureFlags['homepage-medical-area'] = true;
      window.location.toString.mockReturnValue(
        'http://localhost/medical/rosters'
      );

      const setLastKnownPage = await openLastKnownPageOnSignIn(
        userId,
        orgId,
        validSquadIds
      );

      expect(setLastKnownPage).not.toBeNull();
      expect(typeof setLastKnownPage).toBe('function');
    });

    it('detects the availability sheet homepage', async () => {
      window.featureFlags['homepage-availability-sheet'] = true;
      window.location.toString.mockReturnValue(
        'http://localhost/athletes/availability'
      );

      const setLastKnownPage = await openLastKnownPageOnSignIn(
        userId,
        orgId,
        validSquadIds
      );

      expect(setLastKnownPage).not.toBeNull();
      expect(typeof setLastKnownPage).toBe('function');
    });

    it('detects the web home page', async () => {
      window.featureFlags['web-home-page'] = true;
      window.location.toString.mockReturnValue(
        'http://localhost/home_dashboards'
      );

      const setLastKnownPage = await openLastKnownPageOnSignIn(
        userId,
        orgId,
        validSquadIds
      );

      expect(setLastKnownPage).not.toBeNull();
      expect(typeof setLastKnownPage).toBe('function');
    });

    it('detects service page', async () => {
      window.location.toString.mockReturnValue(
        'http://localhost/settings/set_squad'
      );

      const setLastKnownPage = await openLastKnownPageOnSignIn(
        userId,
        orgId,
        validSquadIds
      );

      expect(setLastKnownPage).not.toBeNull();
      expect(typeof setLastKnownPage).toBe('function');
    });

    describe('org restoration', () => {
      beforeEach(() => {
        window.location.toString.mockReturnValue(
          'http://admin.injuryprofiler.net/some-page'
        );
      });

      it('restores the last known org for an admin account', async () => {
        sessionStorageGetItemSpy.mockImplementation((key) => {
          if (key === 'lastKnownOrgOfuser123') return 'differentOrg';
          return null;
        });

        const setLastKnownPage = await openLastKnownPageOnSignIn(
          userId,
          orgId,
          validSquadIds,
          squadId
        );

        expect(switchOrganisation).toHaveBeenCalledWith('differentOrg');
        expect(setLastKnownPage).toBeNull();
      });

      it('restores the last known org when connected to staging environment', async () => {
        jest.resetModules();
        process.env.REACT_APP_TARGET = 'staging';

        window.location.toString.mockReturnValue('http://localhost/some-page');
        sessionStorageGetItemSpy.mockImplementation((key) => {
          if (key === 'lastKnownOrgOfuser123') return 'differentOrg';
          return null;
        });

        const openLastKnownPageOnSignInModule = await import(
          '../openLastKnownPageOnSignIn'
        );
        const openLastKnownPageOnSignInStaging =
          openLastKnownPageOnSignInModule.openLastKnownPageOnSignIn;

        const organisationSwitcherModule = await import(
          '@kitman/services/src/services/settings/organisation_switcher/put'
        );
        const freshSwitchOrganisation = organisationSwitcherModule.default;
        freshSwitchOrganisation.mockResolvedValue({});

        const setLastKnownPage = await openLastKnownPageOnSignInStaging(
          userId,
          orgId,
          validSquadIds,
          squadId
        );

        expect(freshSwitchOrganisation).toHaveBeenCalledWith('differentOrg');
        expect(setLastKnownPage).toBe(null);
      });

      it('doesn’t restore the last known org if the current org matches', async () => {
        sessionStorageGetItemSpy.mockImplementation((key) => {
          if (key === 'lastKnownOrgOfuser123') return orgId;
          return null;
        });

        await openLastKnownPageOnSignIn(userId, orgId, validSquadIds, squadId);

        expect(switchOrganisation).not.toHaveBeenCalled();
      });

      it('handles an org switch failure', async () => {
        sessionStorageGetItemSpy.mockImplementation((key) => {
          if (key === 'lastKnownOrgOfuser123') return 'differentOrg';
          return null;
        });

        switchOrganisation.mockRejectedValue(new Error('Switch failed'));

        const setLastKnownPage = await openLastKnownPageOnSignIn(
          userId,
          orgId,
          validSquadIds,
          squadId
        );

        expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
          'lastKnownPageOfuser123',
          ''
        );
        expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
          'lastKnownSquadOfuser123',
          ''
        );
        expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
          'lastKnownOrgOfuser123',
          ''
        );
        expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
          'isTryingToRestoreLastKnownPage',
          false
        );
        expect(typeof setLastKnownPage).toBe('function');
      });
    });

    describe('squad restoration', () => {
      beforeEach(() => {
        window.location.toString.mockReturnValue(
          'http://localhost/some-other-page'
        );
        window.location.pathname = '/some-other-page';
      });

      it('restores the last known squad when it’s valid', async () => {
        sessionStorageGetItemSpy.mockImplementation((key) => {
          if (key === 'lastKnownSquadOfuser123') return 'squad101';
          return null;
        });

        const setLastKnownPage = await openLastKnownPageOnSignIn(
          userId,
          orgId,
          validSquadIds,
          squadId
        );

        expect(window.location.href).toBe('/settings/set_squad/squad101');
        expect(setLastKnownPage).toBeNull();
      });

      it('doesn’t restore the last known squad when it’s not a valid ID', async () => {
        sessionStorageGetItemSpy.mockImplementation((key) => {
          if (key === 'lastKnownSquadOfuser123') return 'invalidSquad';
          return null;
        });

        await openLastKnownPageOnSignIn(userId, orgId, validSquadIds, squadId);

        expect(window.location.href).toBe('');
        expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
          'lastKnownPageOfuser123',
          ''
        );
        expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
          'lastKnownSquadOfuser123',
          ''
        );
      });

      it('doesn’t restore the last known squad if the current squad matches', async () => {
        sessionStorageGetItemSpy.mockImplementation((key) => {
          if (key === 'lastKnownSquadOfuser123') return squadId;
          return null;
        });

        await openLastKnownPageOnSignIn(userId, orgId, validSquadIds, squadId);

        expect(window.location.href).toBe('');
      });

      it('doesn’t restore the last known squad when connected to staging environment', async () => {
        jest.resetModules();
        process.env.REACT_APP_TARGET = 'staging';

        window.location.toString.mockReturnValue(
          'http://localhost/some-other-page'
        );
        window.location.pathname = '/some-other-page';
        sessionStorageGetItemSpy.mockImplementation((key) => {
          if (key === 'lastKnownSquadOfuser123') return 'squad101';
          return null;
        });

        const openLastKnownPageOnSignInModule = await import(
          '../openLastKnownPageOnSignIn'
        );
        const freshOpenLastKnownPageOnSignIn =
          openLastKnownPageOnSignInModule.openLastKnownPageOnSignIn;

        const setLastKnownPage = await freshOpenLastKnownPageOnSignIn(
          userId,
          orgId,
          validSquadIds,
          squadId
        );

        expect(window.location.href).toBe('');
        expect(typeof setLastKnownPage).toBe('function');
      });
    });

    describe('page restoration', () => {
      beforeEach(() => {
        window.location.toString.mockReturnValue(
          'http://localhost/dashboards/show'
        );
        window.location.pathname = '/dashboards/show';
      });

      it('restores the last known page from homepage', async () => {
        const lastKnownPage = 'http://localhost/some-page';
        sessionStorageGetItemSpy.mockImplementation((key) => {
          if (key === 'lastKnownPageOfuser123') return lastKnownPage;
          if (key === 'isTryingToRestoreLastKnownPage') return null;
          return null;
        });

        const setLastKnownPage = await openLastKnownPageOnSignIn(
          userId,
          orgId,
          validSquadIds,
          squadId
        );

        expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
          'isTryingToRestoreLastKnownPage',
          true
        );
        expect(window.location).toBe(lastKnownPage);
        expect(setLastKnownPage).toBeNull();
      });

      it('prevents infinite redirects', async () => {
        sessionStorageGetItemSpy.mockImplementation((key) => {
          if (key === 'lastKnownPageOfuser123') {
            return 'http://localhost/some-page';
          }
          if (key === 'isTryingToRestoreLastKnownPage') return 'true';
          return null;
        });

        const setLastKnownPage = await openLastKnownPageOnSignIn(
          userId,
          orgId,
          validSquadIds,
          squadId
        );

        expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
          'isTryingToRestoreLastKnownPage',
          false
        );
        expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
          'lastKnownPageOfuser123',
          ''
        );
        expect(window.location.href).toBe('/');
        expect(typeof setLastKnownPage).toBe('function');
      });

      it('doesn’t restore the last known page if not on homepage', async () => {
        window.location.toString.mockReturnValue(
          'http://localhost/some-other-page'
        );
        window.location.pathname = '/some-other-page';

        sessionStorageGetItemSpy.mockImplementation((key) => {
          if (key === 'lastKnownPageOfuser123') {
            return 'http://localhost/some-page';
          }
          return null;
        });

        const setLastKnownPage = await openLastKnownPageOnSignIn(
          userId,
          orgId,
          validSquadIds,
          squadId
        );

        expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
          'isTryingToRestoreLastKnownPage',
          false
        );
        expect(window.location).not.toBe('http://localhost/some-page');
        expect(typeof setLastKnownPage).toBe('function');
      });

      it('doesn’t restore the last known page if there isn’t one', async () => {
        sessionStorageGetItemSpy.mockImplementation((key) => {
          if (key === 'lastKnownPageOfuser123') return '';
          return null;
        });

        const setLastKnownPage = await openLastKnownPageOnSignIn(
          userId,
          orgId,
          validSquadIds,
          squadId
        );

        expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
          'isTryingToRestoreLastKnownPage',
          false
        );
        expect(window.location).not.toBe('http://localhost/');
        expect(typeof setLastKnownPage).toBe('function');
      });

      it('doesn’t restore the last known page if home page is visited intentionally', async () => {
        sessionStorageGetItemSpy.mockImplementation((key) => {
          if (key === 'isHomePageVisitedIntentionally') return 'true';
          if (key === 'lastKnownPageOfuser123') {
            return 'http://localhost/some-page';
          }

          return null;
        });

        const setLastKnownPage = await openLastKnownPageOnSignIn(
          userId,
          orgId,
          validSquadIds,
          squadId
        );

        expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
          'isTryingToRestoreLastKnownPage',
          false
        );
        expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
          'isHomePageVisitedIntentionally',
          false
        );
        expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
          'lastKnownPageOfuser123',
          ''
        );
        expect(window.location).not.toBe('http://localhost/some-page');
        expect(typeof setLastKnownPage).toBe('function');
      });
    });

    describe('when no restoration occurs', () => {
      beforeEach(() => {
        window.location.toString.mockReturnValue(
          'http://localhost/some-regular-page'
        );
        window.location.pathname = '/some-regular-page';
      });

      it('returns setLastKnownPage function', async () => {
        const setLastKnownPage = await openLastKnownPageOnSignIn(
          userId,
          orgId,
          validSquadIds,
          squadId
        );

        expect(typeof setLastKnownPage).toBe('function');
        expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
          'lastKnownPageOfuser123',
          window.location
        );
      });
    });
  });

  describe('setLastKnownSquad', () => {
    it('sets a squad and invalidates the last known page', () => {
      setLastKnownSquad(123, userId);

      expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
        'lastKnownPageOfuser123',
        ''
      );
      expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
        'isTryingToRestoreLastKnownPage',
        false
      );
      expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
        'lastKnownSquadOfuser123',
        123
      );
      expect(window.location.reload).not.toHaveBeenCalled();
    });

    it('sets a squad, invalidates the last known page and reloads the page when connected to staging environment', async () => {
      jest.resetModules();
      process.env.REACT_APP_TARGET = 'staging';

      const openLastKnownPageOnSignInModule = await import(
        '../openLastKnownPageOnSignIn'
      );
      setLastKnownSquad = openLastKnownPageOnSignInModule.setLastKnownSquad;

      setLastKnownSquad(123, userId);

      expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
        'lastKnownPageOfuser123',
        ''
      );
      expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
        'isTryingToRestoreLastKnownPage',
        false
      );
      expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
        'lastKnownSquadOfuser123',
        123
      );
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  describe('setLastKnownOrg', () => {
    it('sets an org and invalidates the last known page and squad', () => {
      setLastKnownOrg(456, userId);

      expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
        'lastKnownPageOfuser123',
        ''
      );
      expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
        'lastKnownSquadOfuser123',
        ''
      );
      expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
        'isTryingToRestoreLastKnownPage',
        false
      );
      expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
        'lastKnownOrgOfuser123',
        456
      );
    });
  });
});
