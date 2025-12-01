// @flow
import { axios } from '@kitman/common/src/utils/services';

export type VenueType = {
  id: number,
  name: string,
};
export type VenueTypes = Array<VenueType>;

const getVenueTypes = async (
  nflSessionVenues?: boolean
): Promise<VenueTypes> => {
  try {
    const { data } = await axios.get('/venue_types', {
      headers: {
        'content-type': 'application/json',
        Accept: 'application/json',
      },
      params: {
        ...(nflSessionVenues && {
          nfl_session_venues: nflSessionVenues,
        }),
      },
    });

    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export default getVenueTypes;
