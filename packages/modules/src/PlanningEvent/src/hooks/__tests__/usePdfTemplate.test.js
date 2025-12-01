import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { getMatchDayTemplateData } from '@kitman/services';
import {
  getGameEvent,
  getMatchDayView,
} from '@kitman/modules/src/PlanningEvent/src/redux/selectors/planningEventSelectors';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import { dmrData } from '@kitman/services/src/services/planning/getMatchDayTemplateData/mock';
import usePdfTemplate from '../usePdfTemplate';

jest.mock('@kitman/services');
jest.mock('@kitman/modules/src/Toasts/toastsSlice');
jest.mock(
  '@kitman/modules/src/PlanningEvent/src/redux/selectors/planningEventSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/PlanningEvent/src/redux/selectors/planningEventSelectors'
    ),
    getGameEvent: jest.fn(),
    getMatchDayView: jest.fn(),
  })
);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const mockSelectors = () => {
  getGameEvent.mockReturnValue(() => ({ id: 1 }));
  getMatchDayView.mockReturnValue(() => 'dmr');
};

describe('usePdfTemplate', () => {
  let store;

  beforeEach(() => {
    store = storeFake({
      planningEvent: {
        gameEvent: { id: 1 },
        matchDayView: 'dmn',
      },
    });
    getMatchDayTemplateData.mockResolvedValue(dmrData);
    mockSelectors();
  });

  const renderUsePdfTemplate = () =>
    renderHook(() => usePdfTemplate(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

  it('should return initial state with correct default values', async () => {
    const { result } = renderUsePdfTemplate();

    expect(result.current).toEqual({
      getTemplateData: expect.any(Function),
      matchDayView: 'dmr',
      templateData: null,
      isTemplateDataLoading: false,
    });
  });

  it('should call getTemplateData successfully', async () => {
    jest.useFakeTimers();
    const { result } = renderUsePdfTemplate();

    await act(async () => {
      await result.current.getTemplateData();
    });

    expect(result.current.isTemplateDataLoading).toBe(true);
    jest.advanceTimersByTime(2000); // fast-forward the timer
    expect(result.current).toEqual({
      getTemplateData: expect.any(Function),
      matchDayView: 'dmr',
      templateData: dmrData,
      isTemplateDataLoading: false,
    });
  });

  it('should handle getTemplateData error case', async () => {
    getMatchDayTemplateData.mockRejectedValue(new Error('API Error'));
    const { result } = renderUsePdfTemplate();

    await act(async () => {
      await result.current.getTemplateData();
    });

    expect(result.current).toEqual({
      getTemplateData: expect.any(Function),
      matchDayView: 'dmr',
      templateData: null,
      isTemplateDataLoading: false,
    });
    expect(add).toHaveBeenCalledWith({
      status: toastStatusEnumLike.Error,
      title: 'Failed to generate template',
    });
  });
});
