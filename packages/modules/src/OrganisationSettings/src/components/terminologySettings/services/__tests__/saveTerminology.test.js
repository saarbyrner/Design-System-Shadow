import $ from 'jquery';
import saveTerminology from '../saveTerminology';

describe('saveTerminology', () => {
  let saveTerminologyRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    saveTerminologyRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve({}));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    await saveTerminology({
      key: 'development_goal',
      value: 'Custom name',
    });

    expect(saveTerminologyRequest).toHaveBeenCalledTimes(1);
    expect(saveTerminologyRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/ui/terminologies/development_goal/save',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        value: 'Custom name',
      }),
    });
  });
});
