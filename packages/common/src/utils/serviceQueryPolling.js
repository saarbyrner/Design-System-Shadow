// @flow

const DEFAULT_DELAY = 5000;

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * A method to retrigger the API request when the
 * backend returns 202 (Accepted, but still processing)
 * or 504 (Request timed out) status codes
 *
 * @param {*} fn method initiating the API request
 * @param {*} args payload for the request
 * @param {*} ms configures delay between the retries
 * @returns backend response
 */
export const validateResponseWithRetry = async (
  fn: Function,
  args: Object,
  ms: number = DEFAULT_DELAY
) => {
  const retryWithUpdatedParams = async (currentArgs) => {
    const finalArgs = currentArgs?.refresh_cache
      ? { ...currentArgs, refresh_cache: false }
      : currentArgs;
    await delay(ms);
    return validateResponseWithRetry(fn, finalArgs, ms);
  };

  try {
    const result = await fn(args);
    const { data } = result;

    if (data?.status === 202) {
      return retryWithUpdatedParams(args);
    }

    if (result?.error) {
      throw result.error;
    }

    return data;
  } catch (error) {
    if (error.status === 504) {
      return retryWithUpdatedParams(args);
    }

    return { error };
  }
};

export default validateResponseWithRetry;
