import { axios } from '@kitman/common/src/utils/services';
import { dmrData, dmnData } from '../mock';

import getMatchDayTemplateData from '..';

jest.mock('@kitman/common/src/utils/services', () => ({
  axios: {
    get: jest.fn(),
  },
}));

describe('getMatchDayTemplateData', () => {
  describe('the kind is dmr', () => {
    beforeEach(() => {
      axios.get.mockResolvedValueOnce({ data: dmrData });
    });
    it('calls the correct endpoint with the event id', async () => {
      const data = await getMatchDayTemplateData({ eventId: 5, kind: 'dmr' });
      expect(axios.get).toHaveBeenCalledWith(
        '/planning_hub/events/5/template_data',
        { params: { kind: 'dmr' } }
      );
      expect(data).toEqual(dmrData);
    });
  });

  describe('the kind is dmn', () => {
    beforeEach(() => {
      axios.get.mockResolvedValueOnce({ data: dmnData });
    });
    it('calls the correct endpoint with the event id', async () => {
      const data = await getMatchDayTemplateData({ eventId: 5, kind: 'dmn' });
      expect(axios.get).toHaveBeenCalledWith(
        '/planning_hub/events/5/template_data',
        { params: { kind: 'dmn' } }
      );
      expect(data).toEqual(dmnData);
    });
  });
});
