import { render, screen, waitFor } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import { Provider } from 'react-redux';
import { renderWithUserEventSetup } from '@kitman/common/src/utils/test_utils';
import i18n from '@kitman/common/src/utils/i18n';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import * as InjuryUploadModalActions from '../../actions';
import InjuryUploadModal from '../InjuryUploadModal';

jest.mock('../../actions', () => ({
  closeInjuryUploadModal: jest.fn(),
  updateInjuryUploadFile: jest.fn(),
  saveUploadInjury: jest.fn(),
}));

jest.mock('@kitman/common/src/hooks/useEventTracking', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('InjuryUploadModal', () => {
  const initialState = {
    injuryUploadModal: {
      isModalOpen: false,
      file: null,
      errors: {},
    },
    appStatus: {
      status: null,
      message: null,
    },
  };

  let mockTrackEvent;

  beforeAll(() => {
    setI18n(i18n);
  });

  beforeEach(() => {
    mockTrackEvent = jest.fn();
    useEventTracking.mockReturnValue({ trackEvent: mockTrackEvent });
  });

  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: jest.fn(),
    getState: () => ({ ...state }),
  });

  it('renders the component when modal is closed', () => {
    const store = storeFake(initialState);
    render(
      <Provider store={store}>
        <InjuryUploadModal />
      </Provider>
    );
    expect(screen.queryByText('Import Injuries')).not.toBeInTheDocument();
  });

  it('renders the component when modal is open', () => {
    const openState = {
      ...initialState,
      injuryUploadModal: {
        ...initialState.injuryUploadModal,
        isModalOpen: true,
      },
    };
    const store = storeFake(openState);
    render(
      <Provider store={store}>
        <InjuryUploadModal />
      </Provider>
    );
    expect(screen.getByText('Import Injuries')).toBeInTheDocument();
  });

  it('calls updateFile when a file is selected', async () => {
    const openState = {
      ...initialState,
      injuryUploadModal: {
        ...initialState.injuryUploadModal,
        isModalOpen: true,
      },
    };
    const store = storeFake(openState);
    const { user } = renderWithUserEventSetup(
      <Provider store={store}>
        <InjuryUploadModal />
      </Provider>
    );

    const file = new File(['dummy content'], 'test.csv', { type: 'text/csv' });
    const input = screen
      .getByTestId('InputFile')
      .querySelector('input[type="file"]');
    if (!input) {
      throw new Error('File input not found');
    }
    await user.upload(input, file);

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        InjuryUploadModalActions.updateInjuryUploadFile(file)
      );
    });
  });

  it('calls saveUploadInjury and trackEvent when upload button is clicked', async () => {
    const file = new File(['dummy content'], 'test.csv', { type: 'text/csv' });
    const openState = {
      ...initialState,
      injuryUploadModal: {
        ...initialState.injuryUploadModal,
        isModalOpen: true,
        file,
      },
    };
    const store = storeFake(openState);
    const { user } = renderWithUserEventSetup(
      <Provider store={store}>
        <InjuryUploadModal />
      </Provider>
    );

    const uploadButton = screen.getByText('Upload');
    await user.click(uploadButton);

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        InjuryUploadModalActions.saveUploadInjury(file, mockTrackEvent)
      );
    });
  });

  it('calls closeModal when close button is clicked', async () => {
    const openState = {
      ...initialState,
      injuryUploadModal: {
        ...initialState.injuryUploadModal,
        isModalOpen: true,
      },
    };
    const store = storeFake(openState);
    const { user } = renderWithUserEventSetup(
      <Provider store={store}>
        <InjuryUploadModal />
      </Provider>
    );

    const closeButton = document.querySelector(
      '.reactModal__closeBtn.icon-close'
    );
    if (!closeButton) {
      throw new Error('Close button not found');
    }
    await user.click(closeButton);

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        InjuryUploadModalActions.closeInjuryUploadModal()
      );
    });
  });
});
