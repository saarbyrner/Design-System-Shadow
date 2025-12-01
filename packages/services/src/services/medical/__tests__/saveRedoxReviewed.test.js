import $ from 'jquery';
import saveRedoxReviewed from '../saveRedoxReviewed';

describe('saveRedoxReviewed', () => {
  let api;

  beforeEach(() => {
    const deferred = $.Deferred();

    api = jest.spyOn($, 'ajax').mockImplementation(() => deferred.resolve({}));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    await saveRedoxReviewed(123, 321, true);

    expect(api).toHaveBeenCalledWith({
      method: 'POST',
      url: '/medical/diagnostics/321/redox-results/reviewed',
      contentType: 'application/json',
      data: JSON.stringify({
        result_group_id: 123,
        reviewed: true,
      }),
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
        Accept: 'application/json',
      },
    });
  });
});
