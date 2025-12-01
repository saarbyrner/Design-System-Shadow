import { axios } from '@kitman/common/src/utils/services';
import createdMatchDayPdf from '..';
import mock from '../mock';

describe('createMatchDayPdf', () => {
  it('calls the correct endpoint', async () => {
    const axiosPost = jest.spyOn(axios, 'post');
    const data = await createdMatchDayPdf({ eventId: '5', kind: 'dmn' });

    expect(axiosPost).toHaveBeenCalledTimes(1);
    expect(axiosPost).toHaveBeenCalledWith(
      '/planning_hub/events/5/generate_pdf',
      {
        kind: 'dmn',
      }
    );
    expect(data).toEqual(mock);
  });
});
