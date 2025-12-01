import { renderHook } from '@testing-library/react-hooks';

import { browserHistory } from '@kitman/common/src/variables';

import useBrowserTabTitle from '../useBrowserTabTitle';

const { defaultTitle } = browserHistory;

describe('useBrowserTabTitle', () => {
  const set = jest.fn();
  const get = jest.fn();

  beforeEach(() => {
    Object.defineProperty(document, 'title', {
      configurable: true,
      set,
      get,
    });
  });

  const tests = [
    [
      'updates `document.title` with a string as the argument',
      { setCallCount: 1, setCallArgument: 'title' },
      'title',
    ],
    [
      'updates `document.title` with an array as the argument',
      {
        setCallCount: 1,
        setCallArgument: '1 | 2 | 3',
      },
      ['1', '2', '3'],
    ],
    [
      'updates `document.title` with an array without empty strings as the argument',
      {
        setCallCount: 1,
        setCallArgument: '1 | 3',
      },
      ['1', '', '3'],
    ],
    [
      'updates `document.title` with the default title if the argument isn’t a string-only array ',
      {
        setCallCount: 1,
        setCallArgument: defaultTitle,
      },
      [1, '2', 3],
    ],
    [
      'updates `document.title` with the default title if the argument is an empty string',
      {
        setCallCount: 1,
        setCallArgument: defaultTitle,
      },
      '',
    ],
    [
      'updates `document.title` with the default title if the argument isn’t a string nor an array',
      {
        setCallCount: 1,
        setCallArgument: defaultTitle,
      },
      undefined,
    ],
    [
      'updates `document.title` with the default title on unmount',
      {
        setCallCount: 2,
        setCallArgument: defaultTitle,
      },
      undefined,
    ],
  ];

  it.each(tests)('%s', (description, expected, argument) => {
    const { unmount } = renderHook(() => useBrowserTabTitle(argument));

    if (expected.setCallCount > 1) unmount();

    expect(set).toHaveBeenCalledTimes(expected.setCallCount);
    expect(set).toHaveBeenCalledWith(expected.setCallArgument);
  });
});
