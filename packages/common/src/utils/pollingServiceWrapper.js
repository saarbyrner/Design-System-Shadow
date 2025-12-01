// @flow

/**
 * Wraps a service function to standardize its response format for polling operations.
 *
 * This higher-order function takes a service function and returns a wrapped version
 * that normalizes both successful responses and error responses into a consistent
 * format expected by polling mechanisms.
 *
 * @param {Function} service - The service function to wrap. Should return a Promise
 *                            that resolves with an object containing `data` and `status` properties.
 *
 * @returns {Function} A wrapped service function that:
 *                     - On success: Returns `{ data: {...response.data, status: response.status} }`
 *                     - On error: Returns `{ error: { status: number, error: string|Array } }`
 */
export default (service: (Function) => Promise<any>) =>
  async (...params: any) => {
    try {
      const response = await service(...params);

      return { data: { ...response.data, status: response.status } };
    } catch (e) {
      return {
        error: {
          status:
            e?.status ||
            e?.response?.status ||
            e?.response?.data?.status_code ||
            -1,
          error:
            e?.statusText ||
            e?.response?.data?.message ||
            e?.response?.data?.errors ||
            e?.response?.data?.error ||
            'Unknown',
        },
      };
    }
  };
