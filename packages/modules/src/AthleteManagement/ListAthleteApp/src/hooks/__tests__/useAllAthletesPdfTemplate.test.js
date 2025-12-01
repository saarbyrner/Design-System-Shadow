import { renderHook } from '@testing-library/react-hooks';
import TestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import useAllAthletesPdfTemplate from '../useAllAthletesPdfTemplate';

jest.mock('@kitman/common/src/redux/global/selectors', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/selectors'),
  getActiveSquad: jest
    .fn()
    .mockReturnValue(() => ({ id: 1, name: 'Test Squad' })),
}));

const wrapper = ({ children }) => {
  const store = storeFake({});
  return <Provider store={store}>{children}</Provider>;
};

describe('useAllAtheltesPdfTemplate', () => {
  const { act } = TestRenderer;
  const originalPrint = window.print;
  Object.defineProperty(window, 'print', {
    value: jest.fn(),
    writable: true,
    configurable: true,
  });

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    window.print = originalPrint;
  });
  it('exports the correct properties', () => {
    const { result } = renderHook(() => useAllAthletesPdfTemplate(), {
      wrapper,
    });

    expect(result.current).toEqual({
      getTemplateData: expect.any(Function),
      templateData: expect.any(Object),
      isTemplateDataLoading: expect.any(Boolean),
    });
  });

  it('calls [window.print] and [getSquadAthletes] endpoint when getTemplateData is called', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useAllAthletesPdfTemplate(),
      {
        wrapper,
      }
    );

    act(() => {
      result.current.getTemplateData();
    });
    expect(result.current.isTemplateDataLoading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.templateData).toEqual({
      organisation: { id: 1, name: 'Test Org', logo_full_path: null },
      squad: { id: 1, name: 'Test Squad' },
      athletes: [
        { id: 1, firstname: 'John', lastname: 'Doe', email: 'john@test.com' },
      ],
    });
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(window.print).toHaveBeenCalledTimes(1);
    expect(result.current.isTemplateDataLoading).toBe(false);
  });
});
