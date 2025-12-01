import $ from 'jquery';
import { data } from '../../../mocks/handlers/medical/getRehabReport';
import getRehabReport from '../getRehabReport';

describe('getRehabReport', () => {
  let getInjuryReportRequest;

  beforeEach(() => {
    getInjuryReportRequest = jest.spyOn($, 'ajax');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getRehabReport({
      squad_id: 46765,
      start_date: '2022-10-26T22:59:59Z',
      end_date: '2022-10-30T23:00:00Z',
    });

    expect(returnedData).toEqual(data);

    expect(getInjuryReportRequest).toHaveBeenCalledTimes(1);
    expect(getInjuryReportRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/ui/medical/rehab/sessions/multi_athlete_report',
      data: JSON.stringify({
        squad_id: 46765,
        start_date: '2022-10-26T22:59:59Z',
        end_date: '2022-10-30T23:00:00Z',
      }),
      contentType: 'application/json',
    });
  });

  it('calls the correct endpoint and returns the correct value with population', async () => {
    const returnedData = await getRehabReport({
      population: [
        {
          all_squads: false,
          applies_to_squad: false,
          athletes: [1, 2, 3],
          context_squads: [1],
          position_groups: [],
          positions: [],
          squads: [],
        },
      ],
      start_date: '2022-10-26T22:59:59Z',
      end_date: '2022-10-30T23:00:00Z',
    });

    expect(returnedData).toEqual(data);

    expect(getInjuryReportRequest).toHaveBeenCalledTimes(1);
    expect(getInjuryReportRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/ui/medical/rehab/sessions/multi_athlete_report',
      data: JSON.stringify({
        population: [
          {
            all_squads: false,
            applies_to_squad: false,
            athletes: [1, 2, 3],
            context_squads: [1],
            position_groups: [],
            positions: [],
            squads: [],
          },
        ],
        start_date: '2022-10-26T22:59:59Z',
        end_date: '2022-10-30T23:00:00Z',
      }),
      contentType: 'application/json',
    });
  });
});
