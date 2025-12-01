import getTryoutAthletes from '../getTryoutAthletes';

describe('getTryoutAthletes', () => {
  let getTryoutAthleteDataRequest;

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    );

    getTryoutAthleteDataRequest = jest.spyOn(window, 'fetch');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    await getTryoutAthletes();

    expect(getTryoutAthleteDataRequest).toHaveBeenCalledTimes(1);
    expect(getTryoutAthleteDataRequest).toHaveBeenCalledWith(
      '/medical/rosters/tryout_athletes',
      {
        method: 'POST',
        body: '{"filters":{}}',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-KITMAN-CSRF-TOKEN': 'omnomnom',
        },
      }
    );
  });

  it('calls the correct endpoint with filters applied', async () => {
    await getTryoutAthletes({ athlete_name: 'cooooookie' });

    expect(getTryoutAthleteDataRequest).toHaveBeenCalledTimes(1);
    expect(getTryoutAthleteDataRequest).toHaveBeenCalledWith(
      '/medical/rosters/tryout_athletes',
      {
        method: 'POST',
        body: '{"filters":{"athlete_name":"cooooookie"}}',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-KITMAN-CSRF-TOKEN': 'omnomnom',
        },
      }
    );
  });
});
