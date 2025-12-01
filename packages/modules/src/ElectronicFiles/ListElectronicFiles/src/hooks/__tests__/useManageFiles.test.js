import { renderHook, act } from '@testing-library/react-hooks';
import ReduxProvider from '@kitman/modules/src/ElectronicFiles/shared/redux/provider';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { mockAttachedFiles } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import useManageFiles from '@kitman/modules/src/ElectronicFiles/ListElectronicFiles/src/hooks/useManageFiles';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const wrapper = ReduxProvider;
const filePondRef = jest.fn();
const selectedFilesRef = jest.fn();
const t = i18nextTranslateStub();

let renderHookResult;
const actAndRenderHook = async () => {
  await act(async () => {
    renderHookResult = renderHook(
      () => useManageFiles({ filePondRef, selectedFilesRef, t }),
      {
        wrapper,
      }
    ).result;
  });
};

describe('useManageFiles', () => {
  it('returns initial data', async () => {
    await actAndRenderHook();

    expect(renderHookResult.current).toHaveProperty('filesToUpload');
    expect(renderHookResult.current).toHaveProperty('filesReadyToUpload');
    expect(renderHookResult.current).toHaveProperty('uploadedFiles');
    expect(renderHookResult.current).toHaveProperty('errorFileIds');
    expect(renderHookResult.current).toHaveProperty('setUploadedFiles');
    expect(renderHookResult.current).toHaveProperty('setErrorFileIds');
    expect(renderHookResult.current).toHaveProperty('handleAddFile');
    expect(renderHookResult.current).toHaveProperty(
      'handleAttachSelectedFiles'
    );
    expect(renderHookResult.current).toHaveProperty('handleRemoveUploadedFile');
    expect(renderHookResult.current).toHaveProperty('handleRemoveAttachedFile');
  });

  it('handleAddFile', async () => {
    await actAndRenderHook();

    await act(async () => {
      renderHookResult.current.handleAddFile(mockAttachedFiles[0]);
    });

    expect(renderHookResult.current.filesToUpload).toEqual([
      mockAttachedFiles[0],
    ]);
  });

  it('handleAttachSelectedFiles', async () => {
    await actAndRenderHook();

    await act(async () => {
      renderHookResult.current.handleAttachSelectedFiles();
    });

    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      payload: undefined,
      type: 'sendDrawerSlice/attachSelectedFiles',
    });
    expect(mockDispatch).toHaveBeenNthCalledWith(2, {
      payload: {
        files: [],
        selectedFiles: [],
      },
      type: 'sendDrawerSlice/updateValidation',
    });
  });

  it('handleRemoveUploadedFile', async () => {
    await actAndRenderHook();

    await act(async () => {
      renderHookResult.current.handleRemoveUploadedFile();
    });

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: { files: [] },
      type: 'sendDrawerSlice/updateValidation',
    });
  });
});
