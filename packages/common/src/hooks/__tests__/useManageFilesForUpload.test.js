import { renderHook, act } from '@testing-library/react-hooks';
import { mockFilePondFiles } from '@kitman/common/src/hooks/mocks/mocksForUploads.mock';
import useManageFilesForUpload from '@kitman/common/src/hooks/useManageFilesForUpload';

const filePondRef = jest.fn();
const filesDockRef = jest.fn();

let renderHookResult;
const actAndRenderHook = async () => {
  await act(async () => {
    renderHookResult = renderHook(() =>
      useManageFilesForUpload({ filePondRef, filesDockRef })
    ).result;
  });
};

describe('useManageFilesForUpload', () => {
  it('returns initial data', async () => {
    await actAndRenderHook();

    expect(renderHookResult.current).toHaveProperty('filesToUpload');
    expect(renderHookResult.current).toHaveProperty('updateFileStatus');
    expect(renderHookResult.current).toHaveProperty(
      'clearAndResetManagedFiles'
    );
    expect(renderHookResult.current).toHaveProperty(
      'getFilesToUploadDescriptors'
    );
    expect(renderHookResult.current).toHaveProperty('handleAddFile');
    expect(renderHookResult.current).toHaveProperty('handleRemoveFile');
  });

  it('handleAddFile', async () => {
    await actAndRenderHook();

    await act(async () => {
      renderHookResult.current.handleAddFile({ ...mockFilePondFiles[0] });
    });

    expect(renderHookResult.current.filesToUpload).toEqual([
      {
        file: mockFilePondFiles[0],
        progressPercentage: 0,
        status: 'pending',
      },
    ]);
  });

  it('handleRemoveFile', async () => {
    await actAndRenderHook();

    await act(async () => {
      renderHookResult.current.handleAddFile({ ...mockFilePondFiles[1] });
    });

    expect(renderHookResult.current.filesToUpload).toEqual([
      {
        file: mockFilePondFiles[1],
        progressPercentage: 0,
        status: 'pending',
      },
    ]);

    await act(async () => {
      renderHookResult.current.handleRemoveFile(mockFilePondFiles[1].id);
    });

    expect(renderHookResult.current.filesToUpload).toEqual([]);
  });

  it('clearAndResetManagedFiles', async () => {
    await actAndRenderHook();

    await act(async () => {
      renderHookResult.current.handleAddFile({ ...mockFilePondFiles[0] });
    });

    expect(renderHookResult.current.filesToUpload).toEqual([
      {
        file: mockFilePondFiles[0],
        progressPercentage: 0,
        status: 'pending',
      },
    ]);

    await act(async () => {
      renderHookResult.current.handleAddFile({ ...mockFilePondFiles[1] });
    });

    expect(renderHookResult.current.filesToUpload).toEqual([
      {
        file: mockFilePondFiles[0],
        progressPercentage: 0,
        status: 'pending',
      },
      {
        file: mockFilePondFiles[1],
        progressPercentage: 0,
        status: 'pending',
      },
    ]);

    await act(async () => {
      renderHookResult.current.clearAndResetManagedFiles();
    });

    expect(renderHookResult.current.filesToUpload).toEqual([]);
  });

  it('updateFileStatus', async () => {
    await actAndRenderHook();

    await act(async () => {
      renderHookResult.current.handleAddFile({ ...mockFilePondFiles[1] });
      renderHookResult.current.handleAddFile({ ...mockFilePondFiles[2] });
      renderHookResult.current.updateFileStatus(
        mockFilePondFiles[2].id,
        'uploaded',
        100
      );
      renderHookResult.current.updateFileStatus(
        mockFilePondFiles[1].id,
        'errored'
      );
    });

    expect(renderHookResult.current.filesToUpload).toEqual([
      {
        file: mockFilePondFiles[1],
        progressPercentage: 0,
        status: 'errored',
      },
      {
        file: mockFilePondFiles[2],
        progressPercentage: 100,
        status: 'uploaded',
      },
    ]);
  });

  it('getFilesToUploadDescriptors', async () => {
    await actAndRenderHook();

    await act(async () => {
      renderHookResult.current.handleAddFile({ ...mockFilePondFiles[0] });
      renderHookResult.current.handleAddFile({ ...mockFilePondFiles[1] });
    });

    const transformed = renderHookResult.current.getFilesToUploadDescriptors();
    expect(transformed).toEqual([
      {
        filesize: 5000,
        filetype: 'application/pdf',
        name: 'Custom Title',
        original_filename: 'foobar.pdf',
      },
      {
        filesize: 2000,
        filetype: 'image/png',
        name: undefined,
        original_filename: 'foo.png',
      },
    ]);
  });
});
