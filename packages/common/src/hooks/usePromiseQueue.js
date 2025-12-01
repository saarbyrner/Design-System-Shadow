// @flow
import _uniqueId from 'lodash/uniqueId';
import { useRef } from 'react';

/**
 * Hook which can queue and limit the amount of promises which run concurrenlty
 * The function returned accepts one argument which is a function that should return a promise
 * The promise supplied will execute when it can based on the number of promises in progress at the time
 * and the limit you define
 *
 * e.g.
 *
 * const addToQueue = usePromiseQueue(3);
 *
 *
 * addToQueue(() => axoios.get(`/my-url/1`));
 * addToQueue(() => axoios.get(`/my-url/2`));
 * addToQueue(() => axoios.get(`/my-url/3`));
 * addToQueue(() => axoios.get(`/my-url/4`)); // this won't fetch until 1, 2, or 3 resolve
 *
 * @param {number} limit maximum number of promises being executed at any one time
 * @returns Function
 */
const usePromiseQueue = (limit: number) => {
  // Defining refs to keep track of whats in progress vs whats left to execute
  // These are refs as they don't need to interact with component state
  const inProgress = useRef(new Set()); // using set so that it can be easy to add/remove keys
  const fetchQueue = useRef([]); // using array so we can pop values off the top

  const addToQueue = (promiseFn: () => Promise<any>) => {
    if (inProgress.current.size >= limit) {
      // pushing into the queue if there are more than the limit in progress
      fetchQueue.current.push(promiseFn);
    } else {
      // creating a reference for the promises in progress
      const id = _uniqueId();
      inProgress.current.add(id);

      // once done with the promise is completed we will tidy up
      promiseFn().finally(() => {
        // remove the reference from whats in progress
        inProgress.current.delete(id);

        // if there are more in the queue then get the next promise and
        // recursively call this function with the next in the queue
        if (fetchQueue.current.length > 0) {
          const next = fetchQueue.current.pop();
          addToQueue(next);
        }
      });
    }
  };

  return addToQueue;
};

export default usePromiseQueue;
