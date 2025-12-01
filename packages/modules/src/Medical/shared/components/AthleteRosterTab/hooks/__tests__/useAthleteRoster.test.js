import { renderHook, act } from '@testing-library/react-hooks';
import PermissionsContext, {
  DEFAULT_CONTEXT_VALUE,
} from '@kitman/common/src/contexts/PermissionsContext';
import { data as mockAthleteRoster } from '@kitman/services/src/mocks/handlers/medical/getAthleteRoster';
import useAthleteRoster from '../useAthleteRoster';

jest.useFakeTimers();

const renderWithPermissions = (mockedPermissions = {}) => {
  return renderHook(() => useAthleteRoster(), {
    wrapper: ({ children }) => (
      <PermissionsContext.Provider
        value={{
          permissions: {
            ...DEFAULT_CONTEXT_VALUE.permissions,
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              ...mockedPermissions,
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        }}
      >
        {children}
      </PermissionsContext.Provider>
    ),
  });
};

const defaultFilter = {
  athlete_name: '',
  positions: [],
  squads: [],
  availabilities: [],
  issues: [],
};

describe('useAthleteRoster', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockAthleteRoster),
      })
    );
  });

  describe('[initial data]', () => {
    let renderHookResult;

    it('returns initial data', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useAthleteRoster()).result;
      });

      expect(renderHookResult.current).toHaveProperty('requestStatus');
      expect(renderHookResult.current).toHaveProperty('onFetchAthleteRoster');
      expect(renderHookResult.current).toHaveProperty('filteredSearchParams');
      expect(renderHookResult.current).toHaveProperty('onUpdateFilter');
      expect(renderHookResult.current).toHaveProperty('grid');
      expect(renderHookResult.current).toHaveProperty('isInitialDataLoaded');
      expect(renderHookResult.current.grid).toHaveProperty('rows');
      expect(renderHookResult.current.grid).toHaveProperty('columns');
      expect(renderHookResult.current.grid).toHaveProperty('emptyTableText');
      expect(renderHookResult.current.grid).toHaveProperty('id');
      expect(renderHookResult.current.filteredSearchParams).toHaveProperty(
        'athlete_name'
      );
      expect(renderHookResult.current.filteredSearchParams).toHaveProperty(
        'positions'
      );
      expect(renderHookResult.current.filteredSearchParams).toHaveProperty(
        'squads'
      );
      expect(renderHookResult.current.filteredSearchParams).toHaveProperty(
        'availabilities'
      );
      expect(renderHookResult.current.filteredSearchParams).toHaveProperty(
        'issues'
      );
      expect(renderHookResult.current.grid.emptyTableText).toEqual(
        'There are no athletes'
      );
      expect(renderHookResult.current.grid.id).toEqual('AthleteRosterGrid');
    });
  });

  describe('[computed data]', () => {
    let renderHookResult;

    it('fetches the athlete roster', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useAthleteRoster()).result;
      });

      await act(async () => {
        renderHookResult.current.onFetchAthleteRoster({});
      });

      await Promise.resolve();
      await act(async () => {
        expect(renderHookResult.current.grid.rows.length).toEqual(
          mockAthleteRoster.rows.length
        );
      });
    });

    describe('[PERMISSIONS]', () => {
      afterEach(() => {
        window.featureFlags = {};
      });
      it('[DEFAULT] has the correct grid.columns', async () => {
        await act(async () => {
          renderHookResult = renderWithPermissions({}).result;
        });

        await act(async () => {
          renderHookResult.current.onFetchAthleteRoster({});
        });

        await Promise.resolve();
        await act(async () => {
          expect(renderHookResult.current.grid.columns.length).toEqual(2);
          expect(renderHookResult.current.grid.columns[0].id).toEqual(
            'athlete'
          );
          expect(renderHookResult.current.grid.columns[1].id).toEqual('squad');
        });
      });

      it('permissions.medical.availability.canView', async () => {
        window.featureFlags['availability-info-disabled'] = false;
        await act(async () => {
          renderHookResult = renderWithPermissions({
            availability: { canView: true },
          }).result;
        });

        await act(async () => {
          renderHookResult.current.onFetchAthleteRoster({});
        });

        await Promise.resolve();
        await act(async () => {
          expect(renderHookResult.current.grid.columns.length).toEqual(3);

          expect(renderHookResult.current.grid.columns[1].id).toEqual(
            'availability_status'
          );
        });
      });
      it('permissions.medical.issues.canView', async () => {
        await act(async () => {
          renderHookResult = renderWithPermissions({
            issues: { canView: true },
          }).result;
        });

        await act(async () => {
          renderHookResult.current.onFetchAthleteRoster({});
        });

        await Promise.resolve();
        await act(async () => {
          expect(renderHookResult.current.grid.columns.length).toEqual(3);

          expect(renderHookResult.current.grid.columns[1].id).toEqual(
            'open_injuries_illnesses'
          );
        });
      });
      it('permissions.medical.notes.canView', async () => {
        window.featureFlags['emr-show-latest-note-column'] = true;
        await act(async () => {
          renderHookResult = renderWithPermissions({
            notes: { canView: true },
          }).result;
        });
        await act(async () => {
          renderHookResult.current.onFetchAthleteRoster({});
        });

        await Promise.resolve();
        await act(async () => {
          expect(renderHookResult.current.grid.columns.length).toEqual(3);
          expect(renderHookResult.current.grid.columns[1].id).toEqual(
            'latest_note'
          );
        });
      });
      it('permissions.medical.allergies.canView', async () => {
        await act(async () => {
          renderHookResult = renderWithPermissions({
            allergies: { canView: true },
          }).result;
        });
        await act(async () => {
          renderHookResult.current.onFetchAthleteRoster({});
        });

        await Promise.resolve();
        await act(async () => {
          expect(renderHookResult.current.grid.columns.length).toEqual(3);
          expect(renderHookResult.current.grid.columns[1].id).toEqual(
            'allergies'
          );
        });
      });
      it('[ALL] permissions & feature-flags', async () => {
        window.featureFlags['emr-show-latest-note-column'] = true;
        window.featureFlags['availability-info-disabled'] = false;
        await act(async () => {
          renderHookResult = renderWithPermissions({
            notes: { canView: true },
            issues: { canView: true },
            availability: { canView: true },
            allergies: { canView: true },
          }).result;
        });
        await act(async () => {
          renderHookResult.current.onFetchAthleteRoster({});
        });

        await Promise.resolve();
        await act(async () => {
          expect(renderHookResult.current.grid.columns.length).toEqual(6);
          const columns = renderHookResult.current.grid.columns;
          expect(columns[0].id).toEqual('athlete');
          expect(columns[1].id).toEqual('availability_status');
          expect(columns[2].id).toEqual('open_injuries_illnesses');
          expect(columns[3].id).toEqual('latest_note');
          expect(columns[4].id).toEqual('allergies');
          expect(columns[5].id).toEqual('squad');
        });
      });
    });

    it('has the correct grid.rows', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useAthleteRoster()).result;
      });

      await act(async () => {
        renderHookResult.current.onFetchAthleteRoster({});
      });

      await Promise.resolve();
      await act(async () => {
        expect(renderHookResult.current.grid.rows.length).toEqual(
          mockAthleteRoster.rows.length
        );
        const rows = renderHookResult.current.grid.rows;
        expect(rows[0].id).toEqual(mockAthleteRoster.rows[0].id);
        expect(rows[1].id).toEqual(mockAthleteRoster.rows[1].id);
        expect(rows[2].id).toEqual(mockAthleteRoster.rows[2].id);
      });
    });

    describe('[FILTERS]', () => {
      beforeEach(async () => {
        await act(async () => {
          renderHookResult = renderHook(() => useAthleteRoster()).result;
        });

        await act(async () => {
          renderHookResult.current.onFetchAthleteRoster({});
        });

        await Promise.resolve();
      });
      it('correctly updates the filter for athlete_name', async () => {
        await act(async () => {
          renderHookResult.current.onUpdateFilter({
            athlete_name: 'Stone',
          });
        });

        await Promise.resolve();
        await act(async () => {
          expect(renderHookResult.current.filteredSearchParams).toEqual({
            ...defaultFilter,
            athlete_name: 'Stone',
          });
        });
      });
      it('correctly updates the filter for positions', async () => {
        await act(async () => {
          renderHookResult.current.onUpdateFilter({
            positions: [1, 2, 3],
          });
        });

        await Promise.resolve();
        await act(async () => {
          expect(renderHookResult.current.filteredSearchParams).toEqual({
            ...defaultFilter,
            positions: [1, 2, 3],
          });
        });
      });
      it('correctly updates the filter for squads', async () => {
        await act(async () => {
          renderHookResult.current.onUpdateFilter({
            squads: [1, 2, 3],
          });
        });

        await Promise.resolve();
        await act(async () => {
          expect(renderHookResult.current.filteredSearchParams).toEqual({
            ...defaultFilter,
            squads: [1, 2, 3],
          });
        });
      });
      it('correctly updates the filter for availabilities', async () => {
        await act(async () => {
          renderHookResult.current.onUpdateFilter({
            availabilities: [1, 2, 3],
          });
        });

        await Promise.resolve();
        await act(async () => {
          expect(renderHookResult.current.filteredSearchParams).toEqual({
            ...defaultFilter,
            availabilities: [1, 2, 3],
          });
        });
      });
      it('correctly updates the filter for issues', async () => {
        await act(async () => {
          renderHookResult.current.onUpdateFilter({
            issues: [1, 2, 3],
          });
        });

        await Promise.resolve();
        await act(async () => {
          expect(renderHookResult.current.filteredSearchParams).toEqual({
            ...defaultFilter,
            issues: [1, 2, 3],
          });
        });
      });
    });
  });
});
