import { renderHook, act } from '@testing-library/react-hooks';
import ReduxProvider from '@kitman/modules/src/ElectronicFiles/shared/redux/provider';
import { data as inboundFile } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/fetchInboundElectronicFile.mock';
import useFetchData from '@kitman/modules/src/ElectronicFiles/ViewElectronicFile/src/hooks/useFetchData';

const wrapper = ReduxProvider;

describe('useFetchData', () => {
  describe('[initial data]', () => {
    let renderHookResult;

    it('returns initial data', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useFetchData({ id: 1 }), {
          wrapper,
        }).result;
      });

      expect(renderHookResult.current).toHaveProperty('isFileFetching');
      expect(renderHookResult.current).toHaveProperty('isFileLoading');
      expect(renderHookResult.current).toHaveProperty('isFileSuccess');
      expect(renderHookResult.current).toHaveProperty('isFileError');
      expect(renderHookResult.current).toHaveProperty('file');
    });
  });

  describe('[computed data]', () => {
    let renderHookResult;

    afterEach(() => {
      jest.clearAllTimers();
    });

    it('fetches the file', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useFetchData({ id: 1 }), {
          wrapper,
        }).result;
      });

      await act(async () => {
        expect(renderHookResult.current.file.data).toEqual(inboundFile.data);
      });
    });
  });
});
