import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';

import { setupStore } from '@kitman/modules/src/AppRoot/store';
import {
  useGenerateResultsEventParams,
  useGenerateResultsEventReturnValue,
} from '@kitman/common/src/utils/TrackingData/src/mocks/leagueBenchmarkReporting';

import useGenerateResultsEvent from '../useGenerateResultsEvent';

describe('useGenerateResultsEvent', () => {
  const renderAndWaitForNextUpdate = async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useGenerateResultsEvent(useGenerateResultsEventParams),
      {
        wrapper: ({ children }) => (
          <Provider store={setupStore()}>{children}</Provider>
        ),
      }
    );
    await waitForNextUpdate();
    return result.current;
  };

  it('returns correct data', async () => {
    expect(await renderAndWaitForNextUpdate()).toStrictEqual(
      useGenerateResultsEventReturnValue
    );
    expect(await renderAndWaitForNextUpdate()).toMatchSnapshot();
  });
});
