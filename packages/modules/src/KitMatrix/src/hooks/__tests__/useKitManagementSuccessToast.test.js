import useToasts from '@kitman/components/src/Toast/KitmanDesignSystem/hooks/useToasts';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { render } from '@testing-library/react';
import useKitManagementSuccessToast from '../useKitManagementSuccessToast';

jest.mock(
  '@kitman/components/src/Toast/KitmanDesignSystem/hooks/useToasts',
  () => ({
    __esModule: true,
    default: jest.fn(),
  })
);

const mockToastDispatch = jest.fn();
const mockHistoryReplaceState = jest.fn();

const TestComponent = () => {
  const { toastDialog } = useKitManagementSuccessToast();
  return <div>{toastDialog}</div>;
};

describe('useKitManagementSuccessToast', () => {
  const t = i18nextTranslateStub();
  const originalLocation = window.location;
  const originalHistory = window.history;

  const renderComponent = () => render(<TestComponent t={t} />);

  beforeAll(() => {
    delete window.location;
    delete window.history;
    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        search: '',
        pathname: '/settings/kit-matrix',
      },
    });

    Object.defineProperty(window, 'history', {
      value: {
        ...originalHistory,
        replaceState: mockHistoryReplaceState,
      },
    });
  });

  beforeEach(() => {
    mockToastDispatch.mockClear();
    mockHistoryReplaceState.mockClear();
    useToasts.mockReturnValue({
      toastDispatch: mockToastDispatch,
      toasts: [],
    });
  });

  it('should not dispatch a toast when the action param is not present', () => {
    window.location.search = '';

    renderComponent();

    expect(mockToastDispatch).not.toHaveBeenCalled();
    expect(mockHistoryReplaceState).not.toHaveBeenCalled();
  });

  it('should not dispatch a toast for an incorrect action param value', () => {
    window.location.search = '?action=some-other-action';

    renderComponent();

    expect(mockToastDispatch).not.toHaveBeenCalled();
    expect(mockHistoryReplaceState).not.toHaveBeenCalled();
  });

  it('should dispatch a toast and remove the param when action=kit-management-success-toast is present', () => {
    window.location.search = '?action=kit-management-success-toast';

    renderComponent();

    expect(mockToastDispatch).toHaveBeenCalledTimes(1);
    expect(mockToastDispatch).toHaveBeenCalledWith({
      type: 'CREATE_TOAST',
      toast: {
        id: 'kit-management-success-toast',
        status: 'INFO',
        title: 'Import in progress',
        links: [
          {
            id: 1,
            text: 'Go to imports',
            link: '/settings/imports',
          },
        ],
      },
    });

    expect(mockHistoryReplaceState).toHaveBeenCalledTimes(1);
    expect(mockHistoryReplaceState).toHaveBeenCalledWith(
      {},
      '',
      '/settings/kit-matrix'
    );
  });

  it('should dispatch a toast and preserve other query params when action=kit-management-success-toast is present with other params', () => {
    window.location.search = '?action=kit-management-success-toast&other=value';

    renderComponent();

    expect(mockToastDispatch).toHaveBeenCalledTimes(1);
    expect(mockToastDispatch).toHaveBeenCalledWith({
      type: 'CREATE_TOAST',
      toast: {
        id: 'kit-management-success-toast',
        status: 'INFO',
        title: 'Import in progress',
        links: [
          {
            id: 1,
            text: 'Go to imports',
            link: '/settings/imports',
          },
        ],
      },
    });

    expect(mockHistoryReplaceState).toHaveBeenCalledTimes(1);
    expect(mockHistoryReplaceState).toHaveBeenCalledWith(
      {},
      '',
      '/settings/kit-matrix?other=value'
    );
  });
});
