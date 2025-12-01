// @flow

// There is an issue on the BE.
// By our own standards, the reponse should contain a data and meta property
// for all search endpoints.
// At the moment, this particular api does not, but it will do in the future.
// Until it does, and to ensure correct operation with the grid HOC, I wrap it in
// the correct object here.
// If and when the correct object structure is returned, it will be fine.

// Purposely NOT typing this as it's a temporary measure
const wrapInPaginatedResponse = ({ data }: { data: Object }) => {
  if (!data?.data && !data?.meta) {
    return {
      data,
      meta: {
        current_page: 1,
        next_page: null,
        prev_page: null,
        total_count: data.length,
        total_pages: 1,
      },
    };
  }
  return data;
};

export default wrapInPaginatedResponse;
