import { AthleteDataContext } from '@kitman/common/src/contexts/AthleteDataContext/AthleteDataContext';
import { data } from '@kitman/services/src/mocks/handlers/getAthleteData';
import { renderHook } from '@testing-library/react-hooks';
import useSquadAthletesSelectOptions from '../useSquadAthletesSelectOptions';

describe('useSquadAthletesSelectOptions', () => {
  const contextWrapper =
    (athleteData = data) =>
    ({ children }) =>
      (
        <AthleteDataContext.Provider value={athleteData}>
          {children}
        </AthleteDataContext.Provider>
      );

  const squadAthletes = {
    squads: [
      {
        name: 'Squad A',
        athletes: [
          {
            fullname: 'John Doe',
            id: 1,
          },
          {
            fullname: 'Jane Doe',
            id: 2,
          },
        ],
      },
      {
        name: 'Squad B',
        athletes: [
          {
            fullname: 'Bob Smith',
            id: 3,
          },
          {
            fullname: 'Alice Smith',
            id: 4,
          },
        ],
      },
    ],
  };

  it('returns an empty array if squadAthletes is not provided or empty', async () => {
    const { result } = renderHook(
      () =>
        useSquadAthletesSelectOptions({
          isAthleteSelectable: true,
          athleteId: 1,
        }),
      {
        wrapper: contextWrapper({
          ...data,
          org_last_transfer_record: null,
        }),
      }
    );

    expect(result.current).toEqual([]);
  });
  it('returns all squad athletes when no athleteData is returned', async () => {
    const { result } = renderHook(
      () => useSquadAthletesSelectOptions({ squadAthletes }),
      {
        wrapper: contextWrapper({}),
      }
    );

    expect(result.current).toEqual(
      squadAthletes.squads.map((squad) => ({
        label: squad.name,
        options: squad.athletes.map((athlete) => ({
          label: athlete.fullname,
          value: athlete.id,
        })),
      }))
    );
  });

  it('returns the correct selected athlete option when isAthleteSelectable is false', async () => {
    const { result } = renderHook(
      () =>
        useSquadAthletesSelectOptions({
          isAthleteSelectable: false,
          athleteId: 1,
          squadAthletes,
        }),
      {
        wrapper: contextWrapper(),
      }
    );

    expect(result.current).toEqual([
      {
        label: 'John Doe',
        value: 1,
      },
    ]);
  });

  it('returns with previous organisation', async () => {
    const { result } = renderHook(
      () =>
        useSquadAthletesSelectOptions({
          isAthleteSelectable: true,
          athleteId: 1,
          withPreviousOrganisation: true,
          squadAthletes: {
            squads: [
              {
                id: 5,
                name: 'Custom Squad',
                athletes: [
                  {
                    fullname: 'John Doe',
                    id: 1,
                    previous_organisation: {
                      has_open_illnesses: true,
                      has_open_injuries: true,
                    },
                  },
                ],
              },
            ],
          },
        }),
      {
        wrapper: contextWrapper({
          ...data,
          org_last_transfer_record: null,
        }),
      }
    );

    expect(result.current).toEqual([
      {
        label: 'Custom Squad',
        options: [
          {
            label: 'John Doe',
            value: 1,
            previous_organisation: {
              has_open_illnesses: true,
              has_open_injuries: true,
            },
            squad_id: 5,
          },
        ],
      },
    ]);
  });

  it('returns the correct squad options when isAthleteSelectable is true and withPreviousOrganisation false are provided', async () => {
    const { result } = renderHook(
      () =>
        useSquadAthletesSelectOptions({
          isAthleteSelectable: true,
          athleteId: 1,
          squadAthletes,
        }),
      {
        wrapper: contextWrapper({
          ...data,
          org_last_transfer_record: null,
        }),
      }
    );

    expect(result.current).toEqual([
      {
        label: 'Squad A',
        options: [
          {
            label: 'John Doe',
            value: 1,
          },
          {
            label: 'Jane Doe',
            value: 2,
          },
        ],
      },
      {
        label: 'Squad B',
        options: [
          {
            label: 'Bob Smith',
            value: 3,
          },
          {
            label: 'Alice Smith',
            value: 4,
          },
        ],
      },
    ]);
  });
});
