import { axios } from '@kitman/common/src/utils/services';
import getEmailRecipients from '..';
import mockData from '../mock';

describe('getEmailRecipients', () => {
  beforeEach(() => {
    jest.spyOn(axios, 'get');
  });

  it('calls the correct endpoint with the event id', async () => {
    const data = await getEmailRecipients({ eventId: 5 });

    expect(axios.get).toHaveBeenCalledWith(
      '/planning_hub/events/5/recipients',
      { params: {} }
    );
    expect(data).toEqual(mockData);
  });

  describe('url params', () => {
    it('passes include_dmr into the url param', async () => {
      await getEmailRecipients({ eventId: 5, includeDmr: true });
      expect(axios.get).toHaveBeenCalledWith(
        '/planning_hub/events/5/recipients',
        { params: { include_dmr: true } }
      );
    });

    it('passes include_dmn into the url param', async () => {
      await getEmailRecipients({ eventId: 5, includeDmn: true });
      expect(axios.get).toHaveBeenCalledWith(
        '/planning_hub/events/5/recipients',
        { params: { include_dmn: true } }
      );
    });

    it('passes include_dmn and include_dmr into the url param', async () => {
      await getEmailRecipients({
        eventId: 5,
        includeDmn: true,
        includeDmr: true,
      });
      expect(axios.get).toHaveBeenCalledWith(
        '/planning_hub/events/5/recipients',
        { params: { include_dmn: true, include_dmr: true } }
      );
    });
  });
});
