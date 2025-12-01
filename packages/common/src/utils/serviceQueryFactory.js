// @flow

/*
 * Wrapper for our requests to the server when using RTK Query
 *
 * Exemple:
 * createApi({
 *   reducerPath: 'myApi',
 *   endpoints: builder => ({
 *     getMyData: builder.query({
 *       queryFn: serviceQueryFactory(getMyDataFn),
 *     }),
 *   }),
 */

export default (service: (Function) => Promise<any>) =>
  async (...params: any) => {
    try {
      const data = await service(...params);

      return { data };
    } catch (e) {
      return {
        error: {
          status:
            e?.status ||
            e?.response?.status ||
            e?.cause?.response?.status ||
            e?.cause?.response?.data?.status_code ||
            -1,
          error:
            e?.statusText ||
            e?.cause?.response?.data?.message ||
            e?.cause?.response?.data?.errors ||
            'Unknown',
        },
      };
    }
  };
