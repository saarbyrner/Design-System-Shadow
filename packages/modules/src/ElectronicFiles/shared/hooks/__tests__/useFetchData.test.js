import { renderHook, act } from '@testing-library/react-hooks';
import ReduxProvider from '@kitman/modules/src/ElectronicFiles/shared/redux/provider';
import { data as inboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/searchInboundElectronicFileList.mock';
import { defaultFilters } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/gridSlice';
import useFetchData from '@kitman/modules/src/ElectronicFiles/shared/hooks/useFetchData';

const wrapper = ReduxProvider;
let renderHookResult;
const actAndRenderHook = async () => {
  await act(async () => {
    renderHookResult = renderHook(
      () => useFetchData({ filters: defaultFilters }),
      {
        wrapper,
      }
    ).result;
  });
};

describe('useFetchData', () => {
  describe('[initial data]', () => {
    it('returns initial data', async () => {
      await actAndRenderHook();

      expect(renderHookResult.current).toHaveProperty('isFileListFetching');
      expect(renderHookResult.current).toHaveProperty('isFileListLoading');
      expect(renderHookResult.current).toHaveProperty('isFileListSuccess');
      expect(renderHookResult.current).toHaveProperty('isFileListError');
      expect(renderHookResult.current).toHaveProperty('fileList');
    });
  });

  describe('[computed data]', () => {
    it('fetches the fileList', async () => {
      await actAndRenderHook();

      expect(renderHookResult.current.fileList.data.length).toEqual(
        inboundData.data.length
      );
    });
  });
});
