import $ from 'jquery';
import getOpenIssuesForAthlete from '../getOpenIssuesForAthlete';

const mockedOpenIssuesForAthlete = {
  has_more: false,
  issues: [
    {
      id: 12,
      issue_id: 10,
      name: '30 Oct 2021 - Ankle Apophysitis/ avulsion fracture to calcaneus ( Severs Dx) [Left]',
      status: 'Causing unavailability (time-loss)',
      causing_unavailability: true,
    },
  ],
};

describe('getOpenIssuesForAthlete', () => {
  let getOpenIssuesForAthleteRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getOpenIssuesForAthleteRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedOpenIssuesForAthlete));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getOpenIssuesForAthlete(1);

    expect(returnedData).toEqual(mockedOpenIssuesForAthlete);

    expect(getOpenIssuesForAthleteRequest).toHaveBeenCalledTimes(1);
    expect(getOpenIssuesForAthleteRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/athletes/1/issues/open_issues',
    });
  });
});
