import { axios } from '@kitman/common/src/utils/services';
import searchReviewList from '../searchReviewList';
import { getDefaultAthleteReviewsFilters } from '../../utils';

describe('searchReviewList', () => {
  it('calls the correct endpoint', async () => {
    jest
      .spyOn(axios, 'post')
      .mockResolvedValue({ data: { events: [], next_id: null } });
    const defaultFilter = getDefaultAthleteReviewsFilters();
    const nextId = null;
    await searchReviewList(1, defaultFilter, nextId);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      '/athletes/1/athlete_reviews/search',
      { ...defaultFilter, next_id: nextId }
    );
  });
});
