import $ from 'jquery';
import getNotificationsIFrame from '../getNotificationsIFrame';

describe('getNotificationsIFrame', () => {
  let getNotificationsIFrameRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    const data = { url: 'https://drfirst.com/athlete/21' };

    getNotificationsIFrameRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const returnedData = await getNotificationsIFrame('report');

    expect(returnedData).toEqual({
      url: 'https://drfirst.com/athlete/21',
    });

    expect(getNotificationsIFrameRequest).toHaveBeenCalledTimes(1);
    expect(getNotificationsIFrameRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/medical/drfirst/limp_url?startup_screen=report',
    });
  });
});
