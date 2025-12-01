import $ from 'jquery';
import { data } from '@kitman/services/src/mocks/handlers/medical/getCodingSystemIdentifiers';
import getCodingSystemIdentifiers from '../getCodingSystemIdentifiers';

describe('getCodingSystemIdentifiers', () => {
  let getCodingSystemIdentifiersRequest;

  beforeEach(() => {
    const deferred = $.Deferred();

    getCodingSystemIdentifiersRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getCodingSystemIdentifiers();

    expect(returnedData).toEqual(data);

    expect(getCodingSystemIdentifiersRequest).toHaveBeenCalledTimes(1);
    expect(getCodingSystemIdentifiersRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/medical/coding_systems',
    });
  });
});
