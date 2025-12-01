import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import {
  useCreatePresignedAttachmentsMutation,
  useUploadFileToS3Mutation,
  useConfirmFileUploadMutation,
} from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import useProcessFiles from '@kitman/modules/src/ElectronicFiles/ListElectronicFiles/src/hooks/useProcessFiles';

jest.mock(
  '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles'
);

const mockCreatePresignedAttachments = jest.fn().mockImplementation(() => ({
  unwrap: () => Promise.resolve({ attachments: [] }),
}));

const mockFileReadyToUpload = {
  filename: 'Foobar.txt',
  fileType: 'text/plain',
  fileSize: 1234,
};
const mockUploadFileToS3Mutation = jest.fn();
const mockConfirmFileUploadMutation = jest.fn();

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  electronicFilesApi: {
    useCreatePresignedAttachmentsMutation: jest.fn(),
    useUploadFileToS3Mutation: jest.fn(),
    useConfirmFileUploadMutation: jest.fn(),
  },
});

const wrapper = ({ children }) => (
  <Provider store={defaultStore}>{children}</Provider>
);

const setUploadedFiles = jest.fn();
const setErrorFileIds = jest.fn();

let renderHookResult;
const actAndRenderHook = async ({ filesReadyToUpload }) => {
  await act(async () => {
    renderHookResult = renderHook(
      () =>
        useProcessFiles({
          filesReadyToUpload,
          setUploadedFiles,
          setErrorFileIds,
        }),
      {
        wrapper,
      }
    ).result;
  });
};

describe('useProcessFiles', () => {
  beforeEach(() => {
    useCreatePresignedAttachmentsMutation.mockReturnValue([
      mockCreatePresignedAttachments,
      {
        isLoading: false,
      },
    ]);
    useUploadFileToS3Mutation.mockReturnValue([
      mockUploadFileToS3Mutation,
      {
        isLoading: false,
      },
    ]);
    useConfirmFileUploadMutation.mockReturnValue([
      mockConfirmFileUploadMutation,
      {
        isLoading: false,
      },
    ]);
  });

  it('returns initial data', async () => {
    await actAndRenderHook({ filesReadyToUpload: [] });

    expect(renderHookResult.current).toHaveProperty('isLoading');
    expect(renderHookResult.current).toHaveProperty('processFiles');
  });

  it('processFiles', async () => {
    await actAndRenderHook({ filesReadyToUpload: [mockFileReadyToUpload] });

    renderHookResult.current.processFiles();

    expect(mockCreatePresignedAttachments).toHaveBeenCalledTimes(1);
    expect(mockCreatePresignedAttachments).toHaveBeenCalledWith({
      attachments: [
        {
          filesize: mockFileReadyToUpload.fileSize,
          filetype: mockFileReadyToUpload.fileType,
          original_filename: mockFileReadyToUpload.filename,
        },
      ],
    });
  });
});
