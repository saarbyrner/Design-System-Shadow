import { renderHook, act } from '@testing-library/react-hooks';
import { data as inboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/searchInboundElectronicFileList.mock';
import ReduxProvider from '@kitman/modules/src/ElectronicFiles/shared/redux/provider';
import useGrid, {
  getEmptyTableText,
} from '@kitman/modules/src/ElectronicFiles/shared/hooks/useGrid';

const wrapper = ReduxProvider;
let renderHookResult;
const actAndRenderHook = async () => {
  await act(async () => {
    renderHookResult = renderHook(() => useGrid(), {
      wrapper,
    }).result;
  });
};

describe('useGrid', () => {
  describe('[initial data]', () => {
    it('returns initial data', async () => {
      await actAndRenderHook();

      expect(renderHookResult.current).toHaveProperty('isFileListError');
      expect(renderHookResult.current).toHaveProperty('isFileListFetching');
      expect(renderHookResult.current).toHaveProperty('grid');
      expect(renderHookResult.current.grid).toHaveProperty('rows');
      expect(renderHookResult.current.grid).toHaveProperty('columns');
      expect(renderHookResult.current.grid).toHaveProperty('emptyTableText');
      expect(renderHookResult.current.grid).toHaveProperty('id');
      expect(renderHookResult.current.grid.emptyTableText).toEqual(
        'No eFiles found'
      );
      expect(renderHookResult.current.grid.id).toEqual('electronicFilesGrid');
    });
  });

  describe('[computed data]', () => {
    it('fetches the electronic files', async () => {
      await actAndRenderHook();

      expect(renderHookResult.current.grid.rows.length).toEqual(
        inboundData.data.length
      );
    });

    it('has the correct grid.rows', async () => {
      await actAndRenderHook();

      expect(renderHookResult.current.grid.rows.length).toEqual(
        inboundData.data.length
      );
      const rows = renderHookResult.current.grid.rows;

      rows.forEach((row, index) => {
        expect(row.id).toEqual(inboundData.data[index].id);
      });
    });
  });
});

describe('getEmptyTableText', () => {
  it('show the correct text when the there is no data', () => {
    expect(getEmptyTableText({ query: '' })).toEqual('No eFiles found');
  });
});
