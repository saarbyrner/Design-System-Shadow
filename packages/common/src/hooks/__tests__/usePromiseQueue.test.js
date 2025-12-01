import { renderHook } from '@testing-library/react-hooks';
import usePromiseQueue from '../usePromiseQueue';

jest.useFakeTimers();

describe('usePromiseQueue', () => {
  const callsCallbackInTimeoutPromise = (timeout, callback, shouldReject) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (shouldReject) {
            reject(new Error('Mocked Error'));
            return;
          }

          resolve(callback());
        } catch (e) {
          reject(e);
        }
      }, timeout);
    });

  it('calls a promise directly when called once', () => {
    const { result } = renderHook(() => usePromiseQueue(3));
    const addToQueue = result.current;

    // Setting our mock callback up so we can test if its been executed
    const callback = jest.fn();

    // Defining a test case in an object so it can be spyed on, this way we can track when its called
    const testCase = {
      calledDirectly: () => callsCallbackInTimeoutPromise(2000, callback),
    };
    const calledDirectlyTestCase = jest.spyOn(testCase, 'calledDirectly');

    // calling
    addToQueue(() => testCase.calledDirectly());

    // it should be called as this is the first time its loaded
    expect(calledDirectlyTestCase).toHaveBeenCalled();

    // callback should not have been called because the promise delays it by 2s
    expect(callback).not.toHaveBeenCalled();

    // advancing by 1s
    jest.advanceTimersByTime(1000);

    // call back should not be called here either
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2000);

    // 2s has ellapsed, it should be called now
    expect(callback).toHaveBeenCalled();
  });

  it('calls a number of promises based on a supplied limit', async () => {
    // setting up a queue of 2
    const { result } = renderHook(() => usePromiseQueue(2));
    const addToQueue = result.current;

    // Setting our mock callbacks up so we can test if its been executed, i.e. the promise is resolved
    const firstCallback = jest.fn();
    const secondCallback = jest.fn();
    const thirdCallback = jest.fn();

    // Defining a test cases in an object so it can be spyed on, this way we can track when its called
    const testCases = {
      calledFirst: () => callsCallbackInTimeoutPromise(1000, firstCallback),
      calledSecond: () => callsCallbackInTimeoutPromise(1000, secondCallback),
      calledThird: () => callsCallbackInTimeoutPromise(1000, thirdCallback),
    };
    const [calledFirstSpy, calledSecondSpy, calledThirdSpy] = Object.keys(
      testCases
    ).map((key) => jest.spyOn(testCases, key));

    // calling
    addToQueue(() => testCases.calledFirst());
    addToQueue(() => testCases.calledSecond());
    addToQueue(() => testCases.calledThird());

    // first two should be called at the start, but not the third as the limit is 2
    expect(calledFirstSpy).toHaveBeenCalled();
    expect(calledSecondSpy).toHaveBeenCalled();
    expect(calledThirdSpy).not.toHaveBeenCalled();

    // none of thier callbacks should be called at this stage
    expect(firstCallback).not.toHaveBeenCalled();
    expect(secondCallback).not.toHaveBeenCalled();
    expect(thirdCallback).not.toHaveBeenCalled();

    // advancing by 1s
    jest.advanceTimersByTime(1000);

    // at this stage the first two promises should be resolved
    expect(firstCallback).toHaveBeenCalled();
    expect(secondCallback).toHaveBeenCalled();
    expect(thirdCallback).not.toHaveBeenCalled();

    // advancing by 1.5s and flushing out any promises stuck in the jest abyss`
    await Promise.resolve();
    jest.advanceTimersByTime(1000);

    // and the third test case should be called
    expect(calledThirdSpy).toHaveBeenCalled();

    // // by now the third should be called
    expect(thirdCallback).toHaveBeenCalled();
  });

  it('continues to call promises even if an error is thrown', async () => {
    // setting up a queue of 2
    const { result } = renderHook(() => usePromiseQueue(2));
    const addToQueue = result.current;

    // Setting our mock callbacks up so we can test if its been executed, i.e. the promise is resolved
    const firstCallback = jest.fn();
    const secondCallback = jest.fn();
    const thirdCallback = jest.fn();

    const errorHandler = jest.fn();

    // Defining a test cases in an object so it can be spyed on, this way we can track when its called
    const testCases = {
      calledFirst: () =>
        callsCallbackInTimeoutPromise(1000, firstCallback).catch(() => {
          errorHandler(`First Mock Error`);
        }),
      calledSecond: () =>
        callsCallbackInTimeoutPromise(1000, secondCallback, true).catch(() => {
          errorHandler(`Second Mock Error`);
        }),
      calledThird: () =>
        callsCallbackInTimeoutPromise(1000, thirdCallback).catch(() => {
          errorHandler(`Third Mock Error`);
        }),
    };
    const [calledFirstSpy, calledSecondSpy, calledThirdSpy] = Object.keys(
      testCases
    ).map((key) => jest.spyOn(testCases, key));

    // calling
    addToQueue(() => testCases.calledFirst());
    addToQueue(() => testCases.calledSecond());
    addToQueue(() => testCases.calledThird());

    // first two should be called at the start, but not the third as the limit is 2
    expect(calledFirstSpy).toHaveBeenCalled();
    expect(calledSecondSpy).toHaveBeenCalled();
    expect(calledThirdSpy).not.toHaveBeenCalled();

    // none of thier callbacks should be called at this stage
    expect(firstCallback).not.toHaveBeenCalled();
    expect(secondCallback).not.toHaveBeenCalled();
    expect(thirdCallback).not.toHaveBeenCalled();

    // advancing by 1s
    jest.advanceTimersByTime(1000);

    // at this stage the first two promises should be resolved
    expect(firstCallback).toHaveBeenCalled();

    // this one throws an error so shouldn't be called
    expect(secondCallback).not.toHaveBeenCalled();

    // flushing jest promise queue and testing iff the error handler was called
    await Promise.resolve();
    expect(errorHandler).toHaveBeenLastCalledWith('Second Mock Error');

    expect(thirdCallback).not.toHaveBeenCalled();

    // advancing by 1.5s and flushing out any promises stuck in the jest abyss
    await Promise.resolve();
    jest.advanceTimersByTime(1000);

    // and the third test case should be called
    expect(calledThirdSpy).toHaveBeenCalled();

    // by now the third should be called
    expect(thirdCallback).toHaveBeenCalled();
  });
});
