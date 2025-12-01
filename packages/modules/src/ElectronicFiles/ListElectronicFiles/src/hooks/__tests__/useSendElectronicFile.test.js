import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { useSendElectronicFileMutation } from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import { SEND_TO_KEY } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sendDrawerSlice';
import { data as mockContact } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/createContact.mock';
import { mockState } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import useSendElectronicFile from '@kitman/modules/src/ElectronicFiles/ListElectronicFiles/src/hooks/useSendElectronicFile';

jest.mock(
  '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles'
);

const mockSendElectronicFileMutation = jest.fn().mockImplementation(() => ({
  unwrap: () => Promise.resolve({ attachments: [] }),
}));

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
    mockSendElectronicFileMutation: jest.fn(),
  },
  sendDrawerSlice: {
    ...mockState.sendDrawerSlice,
    data: {
      sendTo: SEND_TO_KEY.savedContact,
      message: 'test message',
      subject: 'test subject',
      savedContact: mockContact,
      includeCoverPage: true,
      attachedFiles: [{ id: 1 }, { id: 2 }],
    },
  },
});

const wrapper = ({ children }) => (
  <Provider store={defaultStore}>{children}</Provider>
);

let renderHookResult;
const actAndRenderHook = async () => {
  await act(async () => {
    renderHookResult = renderHook(
      () => useSendElectronicFile({ t: i18nextTranslateStub() }),
      {
        wrapper,
      }
    ).result;
  });
};

describe('useSendElectronicFile', () => {
  beforeEach(() => {
    useSendElectronicFileMutation.mockReturnValue([
      mockSendElectronicFileMutation,
      {
        isLoading: false,
      },
    ]);
  });

  it('returns initial data', async () => {
    await actAndRenderHook();

    expect(renderHookResult.current).toHaveProperty('isLoading');
    expect(renderHookResult.current).toHaveProperty('send');
  });

  it('send', async () => {
    await actAndRenderHook();

    renderHookResult.current.send([3, 4]);

    expect(mockSendElectronicFileMutation).toHaveBeenCalledTimes(1);
    expect(mockSendElectronicFileMutation).toHaveBeenCalledWith({
      attachment_ids: [3, 4],
      contacts_attributes: [mockContact],
      include_cover_page: true,
      medical_document_ids: [1, 2],
      message: 'test message',
      subject: 'test subject',
    });
  });
});
