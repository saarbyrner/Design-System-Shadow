import $ from 'jquery';
import { data } from '../../../mocks/handlers/medical/getInjuryReport';
import getInjuryReport from '../getInjuryReport';

describe('getInjuryReport', () => {
  let getInjuryReportRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getInjuryReportRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getInjuryReport({ issueTypes: ['Injury'] });

    expect(returnedData).toEqual(data);

    expect(getInjuryReportRequest).toHaveBeenCalledTimes(1);
    expect(getInjuryReportRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/medical/rosters/injury_report',
      contentType: 'application/json',
      data: JSON.stringify({
        issue_types: ['Injury'],
        population: [],
      }),
    });
  });

  it('calls the correct endpoint and returns the correct value for population', async () => {
    const returnedData = await getInjuryReport({
      issueTypes: ['Injury'],
      population: [
        {
          all_squads: false,
          applies_to_squad: false,
          athletes: [],
          context_squads: [1],
          position_groups: [],
          positions: [],
          squads: [1],
        },
      ],
    });

    expect(returnedData).toEqual(data);

    expect(getInjuryReportRequest).toHaveBeenCalledTimes(1);
    expect(getInjuryReportRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/medical/rosters/injury_report',
      contentType: 'application/json',
      data: JSON.stringify({
        issue_types: ['Injury'],
        population: [
          {
            all_squads: false,
            applies_to_squad: false,
            athletes: [],
            context_squads: [1],
            position_groups: [],
            positions: [],
            squads: [1],
          },
        ],
      }),
    });
  });
});
