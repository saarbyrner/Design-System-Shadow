import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';

import formStateSlice from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import {
  humanInputApi,
  useAutosavePatchFormAnswersSetMutation,
  useAutosaveBulkCreateFormAnswersSetMutation,
} from '@kitman/services/src/services/humanInput/humanInput';

import { useAutosave } from '@kitman/modules/src/HumanInput/hooks/useAutosave';

const mockCreateDraft = jest.fn();
const mockPatchDraft = jest.fn();

jest.mock('@kitman/services/src/services/humanInput/humanInput', () => ({
  ...jest.requireActual('@kitman/services/src/services/humanInput/humanInput'),
  useAutosaveBulkCreateFormAnswersSetMutation: jest.fn(),
  useAutosavePatchFormAnswersSetMutation: jest.fn(),
}));

const TestWrapper = ({ children, preloadedState = {} }) => {
  const store = configureStore({
    reducer: {
      formStateSlice: formStateSlice.reducer,
      [humanInputApi.reducerPath]: humanInputApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(humanInputApi.middleware),
    preloadedState,
  });

  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={['/some-form?formId=123']}>
        <Routes>
          <Route path="/some-form" element={children} />
          <Route
            path="/forms/form_answers_sets/:id"
            element={<div>Navigated</div>}
          />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

const AUTOSAVE_DELAY = 20000;

const autosaveEnabledState = {
  form_template_version: {
    config: { settings: { autosave_as_draft: true } },
  },
};

const autosaveDisabledState = {
  form_template_version: {
    config: { settings: { autosave_as_draft: false } },
  },
};

describe('useAutosave', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    window.setFlag('cp-eforms-autosave-as-draft', true);
    mockCreateDraft.mockReset();
    mockPatchDraft.mockReset();
    useAutosaveBulkCreateFormAnswersSetMutation.mockReturnValue([
      mockCreateDraft,
      { isLoading: false },
    ]);
    useAutosavePatchFormAnswersSetMutation.mockReturnValue([
      mockPatchDraft,
      { isLoading: false },
    ]);
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();
  });

  const defaultProps = {
    formTemplateId: '123',
    userId: 456,
    organisationId: 789,
    hasUnsavedChanges: true,
  };

  it('should not save if hasUnsavedChanges is false', () => {
    renderHook(
      () => useAutosave({ ...defaultProps, hasUnsavedChanges: false }),
      { wrapper: TestWrapper }
    );
    act(() => {
      jest.advanceTimersByTime(AUTOSAVE_DELAY);
    });

    expect(mockCreateDraft).not.toHaveBeenCalled();
  });

  describe('Autosave disabled scenarios', () => {
    it('should not save if feature flag is false', () => {
      window.setFlag('cp-eforms-autosave-as-draft', false);
      renderHook(() => useAutosave(defaultProps), {
        wrapper: ({ children }) => (
          <TestWrapper
            preloadedState={{
              formStateSlice: {
                form: { q1: 'answer' },
                structure: { id: null, ...autosaveEnabledState },
              },
            }}
          >
            {children}
          </TestWrapper>
        ),
      });
      act(() => {
        jest.advanceTimersByTime(AUTOSAVE_DELAY);
      });

      expect(mockCreateDraft).not.toHaveBeenCalled();
    });

    it('should not save if form setting is false', () => {
      renderHook(() => useAutosave(defaultProps), {
        wrapper: ({ children }) => (
          <TestWrapper
            preloadedState={{
              formStateSlice: {
                form: { q1: 'answer' },
                structure: { id: null, ...autosaveDisabledState },
              },
            }}
          >
            {children}
          </TestWrapper>
        ),
      });
      act(() => {
        jest.advanceTimersByTime(AUTOSAVE_DELAY);
      });

      expect(mockCreateDraft).not.toHaveBeenCalled();
    });

    it('should not update if feature flag is false', () => {
      window.setFlag('cp-eforms-autosave-as-draft', false);
      renderHook(() => useAutosave(defaultProps), {
        wrapper: ({ children }) => (
          <TestWrapper
            preloadedState={{
              formStateSlice: {
                form: { q1: 'answer' },
                structure: { id: 'existing-123', ...autosaveEnabledState },
              },
            }}
          >
            {children}
          </TestWrapper>
        ),
      });
      act(() => {
        jest.advanceTimersByTime(AUTOSAVE_DELAY);
      });

      expect(mockPatchDraft).not.toHaveBeenCalled();
    });

    it('should not update if form setting is false', () => {
      renderHook(() => useAutosave(defaultProps), {
        wrapper: ({ children }) => (
          <TestWrapper
            preloadedState={{
              formStateSlice: {
                form: { q1: 'answer' },
                structure: { id: 'existing-123', ...autosaveDisabledState },
              },
            }}
          >
            {children}
          </TestWrapper>
        ),
      });
      act(() => {
        jest.advanceTimersByTime(AUTOSAVE_DELAY);
      });

      expect(mockPatchDraft).not.toHaveBeenCalled();
    });
  });

  it('should trigger createDraft when in create mode after delay', async () => {
    mockCreateDraft.mockResolvedValue({
      unwrap: () => Promise.resolve({ id: 'new-999' }),
    });
    renderHook(() => useAutosave(defaultProps), {
      wrapper: ({ children }) => (
        <TestWrapper
          preloadedState={{
            formStateSlice: {
              form: { q1: 'answer' },
              structure: { id: null, ...autosaveEnabledState },
            },
          }}
        >
          {children}
        </TestWrapper>
      ),
    });
    await act(async () => {
      jest.advanceTimersByTime(AUTOSAVE_DELAY);
    });

    expect(mockCreateDraft).toHaveBeenCalled();
  });

  it('should trigger updateDraft when in edit mode after delay', async () => {
    mockPatchDraft.mockResolvedValue({ unwrap: () => Promise.resolve({}) });
    renderHook(() => useAutosave(defaultProps), {
      wrapper: ({ children }) => (
        <TestWrapper
          preloadedState={{
            formStateSlice: {
              form: { q1: 'new answer' },
              originalForm: { q1: 'old answer' },
              structure: { id: 'existing-123', ...autosaveEnabledState },
            },
          }}
        >
          {children}
        </TestWrapper>
      ),
    });
    await act(async () => {
      jest.advanceTimersByTime(AUTOSAVE_DELAY);
    });

    expect(mockPatchDraft).toHaveBeenCalled();
  });

  it('should set an error and save to localStorage on API failure', async () => {
    const apiError = new Error('API is down');
    mockCreateDraft.mockResolvedValue({
      unwrap: () => Promise.reject(apiError),
    });
    const { result } = renderHook(() => useAutosave(defaultProps), {
      wrapper: ({ children }) => (
        <TestWrapper
          preloadedState={{
            formStateSlice: {
              form: { q1: 'answer' },
              structure: { id: null, ...autosaveEnabledState },
            },
          }}
        >
          {children}
        </TestWrapper>
      ),
    });
    await act(async () => {
      jest.advanceTimersByTime(AUTOSAVE_DELAY);
    });

    expect(result.current.autosaveError).toBe(
      'Failed to save. Progress saved locally.'
    );
    expect(localStorage.setItem).toHaveBeenCalled();
  });
});
