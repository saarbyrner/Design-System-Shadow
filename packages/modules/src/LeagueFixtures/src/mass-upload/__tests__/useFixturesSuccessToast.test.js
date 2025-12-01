import useToasts from '@kitman/components/src/Toast/KitmanDesignSystem/hooks/useToasts';

import { render } from '@testing-library/react';
import i18n from '@kitman/common/src/utils/i18n';
import useFixturesSuccessToast from '../useFixturesSuccessToast';

jest.mock(
  '@kitman/components/src/Toast/KitmanDesignSystem/hooks/useToasts',
  () => ({
    __esModule: true,
    default: jest.fn(),
  })
);
jest.mock('@kitman/common/src/utils/i18n', () => ({
  __esModule: true,
  default: {
    t: jest.fn((key) => key),
  },
}));

const mockToastDispatch = jest.fn();
const mockHistoryReplaceState = jest.fn();

const TestComponent = () => {
  const { toastDialog } = useFixturesSuccessToast();
  return <div>{toastDialog}</div>;
};

describe('useFixturesSuccessToast', () => {
  const originalLocation = window.location;
  const originalHistory = window.history;

  const renderComponent = () => render(<TestComponent />);

  beforeAll(() => {
    delete window.location;
    window.location = { ...originalLocation, search: '', pathname: '/' };

    delete window.history;
    window.history = {
      ...originalHistory,
      replaceState: mockHistoryReplaceState,
    };
  });

  afterAll(() => {
    window.location = originalLocation;
    window.history = originalHistory;
  });

  beforeEach(() => {
    mockToastDispatch.mockClear();
    mockHistoryReplaceState.mockClear();
    i18n.t.mockClear();
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

  it('should dispatch a toast and remove the param when action=league-game-success-toast is present', () => {
    window.location.search = '?action=league-game-success-toast';

    renderComponent();

    expect(mockToastDispatch).toHaveBeenCalledTimes(1);
    expect(mockToastDispatch).toHaveBeenCalledWith({
      type: 'CREATE_TOAST',
      toast: {
        id: 'league-game-success-toast',
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
    expect(mockHistoryReplaceState).toHaveBeenCalledWith({}, '', '/');
  });
});
